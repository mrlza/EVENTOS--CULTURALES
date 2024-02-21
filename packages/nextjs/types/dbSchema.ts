// Tipo para representar un evento cultural
export type CulturalEvent = {
    title: string;
    description: string;
    venue: string;
    date: string;
    attendees: IndividualProfile[];
    evaluations: EventEvaluation[];
    updates: EventUpdate[];
};

// Tipo para representar un perfil individual
export type IndividualProfile = {
    name: string;
    email: string;
    occupation: string;
    interests: string[];
};

// Tipo para representar una entrada de código
export type CodeEntry = {
    code: string;
    comment: string;
    language: string;
};

// Tipo para representar una evaluación del evento
export type EventEvaluation = {
    relevanceScore: number;
    enjoymentScore: number;
    engagementScore: number;
    overallRating: number;
    evaluationRemarks: string;
    codeSnippets: CodeEntry[];
};

// Tipo para representar una actualización del evento
export type EventUpdate = {
    progress: string;
    achievements: string;
    challenges: string;
    futurePlans: string;
    actionItems: string[];
    codeSnippets: CodeEntry[];
};
