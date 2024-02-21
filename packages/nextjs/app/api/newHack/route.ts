import { NextResponse } from "next/server";
import { createChatEngine } from "../chat/engine";
import { storeEvaluationByProject } from "../metrics/evaluation";
import { storePrompt } from "../metrics/prompt";
import { storeUsageByEmbeddingId } from "../metrics/usage";
// Assumed environment imports
import {
  ChatMessage,
  Document,
  MongoDBAtlasVectorSearch,
  VectorStoreIndex,
  storageContextFromDefaults,
} from "llamaindex";
import { OpenAI, serviceContextFromDefaults } from "llamaindex";
import { Db, MongoClient } from "mongodb";
// Assuming we've defined or imported types for the Cultural Events Application
import type { AIEvaluation, CulturalEvent } from "~~/types/dbSchema";

const url = "mongodb+srv://At0x:r8MzJR2r4A1xlMOA@cluster1.upfglfg.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);
await client.connect();

async function llamaindex(payload: string, id: string) {
  const vectorStore = new MongoDBAtlasVectorSearch({
    mongodbClient: client,
    dbName: "aiUniverse",
    collectionName: "culturalEventIndex",
    indexName: "cultural_event_index",
  });

  const storageContext = await storageContextFromDefaults({ vectorStore });

  const essay = payload;

  const document = new Document({ text: essay, id_: id });

  const result = await VectorStoreIndex.fromDocuments([document], { storageContext });
  const embeddingResults = await result.getNodeEmbeddingResults([document]);

  const db = client.db("aiUniverse");
  const eventIndex = db.collection("culturalEventIndex");

  const embedding = await eventIndex.findOne({ "metadata.doc_id": id });

  return { embeddingId: embedding?.id as string, result: embeddingResults };
}

async function runLlamaAndStore(
  db: Db,
  culturalEvent: any,
  enhancedProposal: AIEvaluation,
  usedEmbeddingIds: string[],
  promptMessages: any,
  promptResponse: any,
  evaluation: AIEvaluation,
) {
  const eventId = culturalEvent.eventId || culturalEvent.id;
  const { embeddingId } = await llamaindex(JSON.stringify(enhancedProposal + culturalEvent), eventId);

  const promptResult = await storePrompt(
    db,
    culturalEvent,
    promptMessages,
    embeddingId,
    usedEmbeddingIds,
    promptResponse,
  );
  const usageResult = await storeUsageByEmbeddingId(db, eventId, embeddingId, usedEmbeddingIds);
  const evaluationResult = await storeEvaluationByProject(db, eventId, usedEmbeddingIds, embeddingId, evaluation);

  return {
    promptResult,
    usageResult,
    evaluationResult,
  };
}

async function generateEventProposal(culturalEvent: CulturalEvent) {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `You are an AI consultant specializing in cultural event recommendations. Given information about an event, evaluate its various aspects and provide scores for each domain. Use the evaluationRemarks to appraise the event and compare it to others. Reply in JSON format using the AIEvaluation type.`,
    },
    {
      role: "assistant",
      content: `
        type AIEvaluation = {
          relevanciaCultural: number;
          novedad: number;
          diversion: number;
          costo: number;
          evaluationRemarks: string;
        }
      `,
    },
    {
      role: "user",
      content: `Review the cultural event details, assign scores, and provide evaluation remarks.
        eventId: ${culturalEvent.title};
        eventName: ${culturalEvent.title};
        eventDescription: ${culturalEvent.description};
        eventDate: ${culturalEvent.date};
        eventLocation: ${culturalEvent.location};
      `,
    },
  ];

  const llm = new OpenAI({
    model: (process.env.MODEL as any) ?? "gpt-4-0125-preview",
    maxTokens: 512,
    additionalChatOptions: { response_format: { type: "json_object" } },
  });

  const serviceContext = serviceContextFromDefaults({
    llm,
    chunkSize: 512,
    chunkOverlap: 20,
  });

  const chatEngine = await createChatEngine(serviceContext);
  if (!chatEngine) {
    throw new Error("datasource is required in the request body");
  }

  const response = await chatEngine.chat({
    message: "Evaluate the cultural event and provide scores and remarks.",
    chatHistory: messages,
  });

  const usedEmbeddingIds = response.sourceNodes?.map(node => node.id_) || [];
  const parsedResponse = JSON.parse(response.response);
  const evaluation: AIEvaluation = {
    relevanciaCultural: parsedResponse.relevanciaCultural,
    novedad: parsedResponse.novedad,
    diversion: parsedResponse.diversion,
    costo: parsedResponse.costo,
    evaluationRemarks: parsedResponse.evaluationRemarks,
  };

  const rawOutput: AIEvaluation = JSON.parse(response.response);
  return { enhancedProposal: rawOutput, messages, response: parsedResponse, usedEmbeddingIds, evaluation };
}

export async function POST(request: Request) {
  try {
    const culturalEvent = await request.json();
    const { enhancedProposal, usedEmbeddingIds, messages, response, evaluation } = await generateEventProposal(
      culturalEvent,
    );

    const db = client.db("aiUniverse");
    const eventCodex = db.collection("culturalEventUniverse");

    runLlamaAndStore(db, culturalEvent, enhancedProposal, usedEmbeddingIds, messages, response, evaluation);

    await eventCodex.updateOne(
      {
        eventId: culturalEvent.eventId,
        eventLocation: culturalEvent.eventLocation,
        // Add more filters as necessary to uniquely identify the event
      },
      {
        $addToSet: {
          eval: enhancedProposal,
          progressUpdates: culturalEvent.progressUpdates[culturalEvent.progressUpdates.length - 1],
        },
      },
      { upsert: true },
    );

    return NextResponse.json(culturalEvent, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "An error occurred processing the request" }, { status: 500 });
  }
}
