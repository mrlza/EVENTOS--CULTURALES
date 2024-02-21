import { toast } from "react-hot-toast";
import {
    AIEvaluation,
    CodeEntry,
    CulturalEvent,
    EventEvaluation,
    EventUpdate,
    IndividualProfile,
} from "~~/types/dbSchema";

export class CulturalEventEntry {
    address: string;
    eventId: string;
    culturalEvent: CulturalEvent;
    updates: EventUpdate[];
    evaluations: EventEvaluation[];

    constructor(
        address: string,
        eventId: string,
        culturalEvent: Partial<CulturalEvent>,
        updates?: EventUpdate[],
        evaluations?: EventEvaluation[]
    ) {
        this.address = address;
        this.eventId = eventId;
        this.culturalEvent = {
            title: culturalEvent.title ?? "",
            location: culturalEvent.location ?? "",
            description: culturalEvent.description ?? "",
            venue: culturalEvent.venue ?? "",
            date: culturalEvent.date ?? "",
            attendees: culturalEvent.attendees ?? [],
            evaluations: culturalEvent.evaluations ?? [],
            updates: culturalEvent.updates ?? [],
        };
        this.updates = updates ?? [];
        this.evaluations = evaluations ?? [];
    }

    // Function to add an update to the event
    addUpdate(update: EventUpdate): void {
        this.updates.push(update);
    }

    // Function to add an evaluation to the event
    addEvaluation(evaluation: EventEvaluation): void {
        this.evaluations.push(evaluation);
    }

    // Get event information
    getEventInfo(): CulturalEventEntry {
        return {
            address: this.address,
            eventId: this.eventId,
            culturalEvent: this.culturalEvent,
            updates: this.updates,
            evaluations: this.evaluations,
        };
    }
}

export async function createCulturalEventEntry(culturalEvent: CulturalEventEntry): Promise<CulturalEventEntry> {
    // Mimic an asynchronous operation, for example, saving to a database
    const newEvent = new CulturalEventEntry(
        culturalEvent.address,
        culturalEvent.eventId,
        culturalEvent.culturalEvent,
        culturalEvent.updates,
        culturalEvent.evaluations
    );
    // Include database save operation here if needed
    toast.success(`"${newEvent.culturalEvent.title}" has been created`);
    return newEvent;
}

export async function updateCulturalEventEntry(culturalEvent: CulturalEventEntry): Promise<CulturalEventEntry> {
    // Mimic an asynchronous operation, for example, saving to a database
    const updatedEvent = new CulturalEventEntry(
        culturalEvent.address,
        culturalEvent.eventId,
        culturalEvent.culturalEvent,
        culturalEvent.updates,
        culturalEvent.evaluations
    );
    // Include database update operation here if needed
    toast.success(`"${updatedEvent.culturalEvent.title}" has been updated`);
    return updatedEvent;
}

export async function evaluateCulturalEvent(
    eventId: string,
    evaluation: EventEvaluation
): Promise<void> {
    // This function would be implemented to find an event by its ID and update its evaluations
    // Include database update operation here if needed
}

