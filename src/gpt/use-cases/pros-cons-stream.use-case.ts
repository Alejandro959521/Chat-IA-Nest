
import OpenAI from "openai";

interface Options {
    prompt: string;
}


export const prosConsDicusserStreamUseCase = async (
    openai: OpenAI,
    { prompt }: Options,
) => {

    return await openai.chat.completions.create({
        stream:true,
        model: 'llama-3.1-8b-instant',
        temperature: 0.8,
        max_tokens: 1000,
        
        messages: [
            {
                role: "system",
                content: `Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
la respuesta debe de ser en formato markdown,
los pros y contras deben de estar en una lista,`
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });


     

    
    // // ✅ SOLUCIÓN 1: Limpiar el contenido eliminando ```json y ```
    // function cleanJsonResponse(content: string): string {
    //     if (!content) return '';

    //     // Eliminar ```json al inicio y ``` al final
    //     let cleaned = content
    //         .replace(/^```json\s*/i, '')  // Eliminar ```json al inicio
    //         .replace(/```$/, '')          // Eliminar ``` al final
    //         .trim();                       // Eliminar espacios en blanco

    //     return cleaned;
    // }

    // // Limpiar la respuesta
    // const cleanedContent = cleanJsonResponse(content || '');

    // // Parsear el JSON limpio
    // const jsonResp = JSON.parse(content);

    // return jsonResp;

};
