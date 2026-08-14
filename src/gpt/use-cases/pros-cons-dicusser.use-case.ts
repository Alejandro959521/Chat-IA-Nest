
import OpenAI from "openai";

interface Options {
    prompt: string;
}


export const prosConsDicusserUseCase = async (
    openai: OpenAI,
    { prompt }: Options,
) => {

    const response = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        temperature: 0.8,
        max_tokens: 500,
      
        messages: [
            {
                role: "system",
                content:`Responde con pros y contras en formato Markdown.
                Usa esta estructura:
                
                **Pros:**
                - **Título del pro**: Descripción del pro
                - **Título del pro**: Descripción del pro
                
                **Contras:**
                - **Título del contra**: Descripción del contra
                - **Título del contra**: Descripción del contra
                
                IMPORTANTE: NO uses JSON. NO des introducciones. SOLO la lista.`

            },
            {
                role: 'user',
                content: prompt,
            }             
        ],
    });


    const content = response.choices[0].message;
    return content


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
