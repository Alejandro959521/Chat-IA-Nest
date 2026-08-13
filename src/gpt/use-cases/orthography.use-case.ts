
import OpenAI from "openai";

interface Options {
    prompt: string
}


export const orthographyCheckUseCase = async (
    openai: OpenAI,
    options: Options,
) => {

    const { prompt } = options;

    const response = await openai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        max_tokens: 400,
        response_format: {
            type: 'json_object'
        },
        messages: [
            {
                role: "system",
                content: `Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
                las palabras usadas deben existir en el diccionario de la real academia española
                Debes de responder en formato JSON,
                tu tarea es corregirlos y retornar información soluciones,
                también debes de dar un porcentaje de acierto por el usuario,

                Si no hay errores, debes de retornar un mensaje de felicitaciones.
                Ejemplo de salida:
                {
                userScore: number,
                errors: string[], // ['error -> solución']
                message: string // Usa emojis y texto para insultar al usuario
               }
                `
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });


    const content = response.choices[0].message.content;

    // ✅ SOLUCIÓN 1: Limpiar el contenido eliminando ```json y ```
    function cleanJsonResponse(content: string): string {
        if (!content) return '';

        // Eliminar ```json al inicio y ``` al final
        let cleaned = content
            .replace(/^```json\s*/i, '')  // Eliminar ```json al inicio
            .replace(/```$/, '')          // Eliminar ``` al final
            .trim();                       // Eliminar espacios en blanco

        return cleaned;
    }

    // Limpiar la respuesta
    const cleanedContent = cleanJsonResponse(content || '');

    // Parsear el JSON limpio
    const jsonResp = JSON.parse(cleanedContent);
    
    return jsonResp;

};


// import OpenAI from "openai";

// interface Options {
//     prompt: string
// }


// export const orthographyCheckUseCase = async (openai: OpenAI, options: Options) => {

//     const { prompt } = options;

//     const client = new OpenAI();

//     const response = await client.responses.create({
//         model: "gemini-3.5-flash",
//         input: "Explain how AI works in a few words",
//     });

//     console.log(response.output_text);

//     return response.output_text


// }