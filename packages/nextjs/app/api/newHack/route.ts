import { NextResponse } from "next/server";
import OpenAI from "openai";
// Assuming we've defined or imported types for the Hackathon Application
import type { HackathonEntry } from "~~/types/dbSchema";

// Assumed environment setup and MongoDB client connection are correct

// Revised function suited for hackathon application data
async function generateHackathonProposal(hackathonApp: HackathonEntry) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
  });

  const messages: any[] = [
    {
      role: "system",
      content: `You are an AI consultant specializing in hackathon project conceptualization. Given a project name, problem statement, solution description, and technology stack, generate an enhanced project proposal. Focus on elaborating the solution, suggesting improvements, and identifying potential challenges. Reply in JSON format.`,
    },
    {
      role: "assistant",
      content: `
                type HackathonEntry = {
                    projectName: string;
                    problemStatement: string;
                    solutionDescription: string;
                    technologyStack: string[];
                }
            `,
    },
    {
      role: "user",
      content: `Enhance the following hackathon project application:
Project Name: ${hackathonApp.projectName}
Problem Statement: ${hackathonApp.problemStatement}
Solution Description: ${hackathonApp.solutionDescription}
Technology Stack: ${hackathonApp.technologyStack.join(", ")}
            `,
    },
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview", // Ensure you're using the correct and available model
    messages: messages,
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const rawOutput = stream.choices[0].message.content;
  return rawOutput?.trim();
}

// Example usage for POST handler or another part of your application
export async function POST(request: Request) {
  const hackathonApp = await request.json(); // Assuming the request body is properly formatted
  console.log(hackathonApp);
  const enhancedProposal = await generateHackathonProposal(hackathonApp);
  console.log(enhancedProposal, "Enhanced Proposal");

  // Proceed with storing the enhanced proposal in MongoDB or returning it in the response
  // Implementation depends on application requirements.
  //
  return NextResponse.json(enhancedProposal);
}
