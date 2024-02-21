"use client"
// Importación de módulos y dependencias
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { useAccount } from 'wagmi';
import { CulturalEvent, CodeEntry } from "~~/types/dbSchema";
import { createCulturalEventEntry } from "~~/app/eventos"

// Definición de tipos para el estado

const Home: NextPage = () => {
    const { address } = useAccount();
    const [currentEvent, setCurrentEvent] = useState<CulturalEvent>({
        title: "",
        location: "",
        description: "",
        venue: "",
        date: "",
        attendees: [],
        evaluations: [],
        updates: [],
    }); // Evento actual

    // Manejador para cambios en la entrada de texto
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Manejador para cambios en la descripción del evento
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setCurrentEvent(prevState => ({
            ...prevState,
            description: value
        }));
    };

    // Función para enviar el evento creado
    const handleSubmitEvent = async () => {
        try {
            // Crear el evento utilizando la función de utilidad
            const createdEvent = await createCulturalEventEntry(currentEvent);
            // Mostrar mensaje de éxito
            toast.success(`Evento "${createdEvent.culturalEvent.title}" creado con éxito`);
        } catch (error) {
            // Manejar errores
            console.error("Error al crear el evento:", error);
            toast.error("Ocurrió un error al crear el evento");
        }
    };

    // Renderización simplificada del componente
    return (
        <div>
            {/* Formulario para crear un nuevo evento */}
            <input
                type="text"
                placeholder="Nombre del Evento"
                name="title"
                value={currentEvent.title}
                onChange={handleInputChange}
            />
            <textarea
                placeholder="Descripción del Evento"
                name="description"
                value={currentEvent.description}
                onChange={handleDescriptionChange}
            ></textarea>
            <input
                type="date"
                name="date"
                value={currentEvent.date}
                onChange={handleInputChange}
            />
            <input
                type="text"
                placeholder="Ubicación del Evento"
                name="location"
                value={currentEvent.location}
                onChange={handleInputChange}
            />
            <button onClick={handleSubmitEvent}>Crear Evento</button>
        </div>
    );
};

export default Home;
