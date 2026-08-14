
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
    model: 'openai/gpt-oss-120b',
    temperature: 0.3,
    max_tokens: 1000,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'orthography_response',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            userScore: {
              type: 'number',
              description: 'Porcentaje de acierto del usuario entre 0 y 100',
            },
            errors: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista de errores corregidos en formato: error -> solución',
            },
            message: {
              type: 'string',
              description: 'Mensaje de retroalimentación usando emojis y texto',
            },
          },
          required: ['userScore', 'errors', 'message'],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: 'system',
        content: `Te serán proveídos textos en español con posibles errores ortográficos y gramaticales.
Las palabras usadas deben existir en el diccionario de la Real Academia Española.
Tu tarea es corregirlos, dar un porcentaje de acierto del usuario y un mensaje.
Si no hay errores, el porcentaje debe ser 100 y el array de errores debe estar vacío.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.choices[0].message.content;

  return JSON.parse(content || '{}');
};



//     const response = await openai.chat.completions.create({
//         model: 'openai/gpt-oss-20b',
//         temperature: 0.3,
//         max_tokens: 400,
//         response_format: {
//             type: 'json_object'
//         },
//         messages: [
//             {
//                 role: "system",
//                 content: `Te serán proveídos textos en español con posibles errores ortográficos y gramaticales,
//                 las palabras usadas deben existir en el diccionario de la real academia española
//                 Debes de responder en formato JSON,
//                 tu tarea es corregirlos y retornar información soluciones,
//                 también debes de dar un porcentaje de acierto por el usuario,

//                 Si no hay errores, debes de retornar un mensaje de felicitaciones.
//                 Ejemplo de salida:
//                 {
//                 userScore: number,
//                 errors: string[], // ['error -> solución']
//                 message: string // Usa emojis y texto para insultar al usuario
//                }
//                 `
//             },
//             {
//                 role: 'user',
//                 content: prompt,
//             },
//         ],
//     });


//     const content = response.choices[0].message.content;

//     // ✅ SOLUCIÓN 1: Limpiar el contenido eliminando ```json y ```
//     function cleanJsonResponse(content: string): string {
//         if (!content) return '';

//         // Eliminar ```json al inicio y ``` al final
//         let cleaned = content
//             .replace(/^```json\s*/i, '')  // Eliminar ```json al inicio
//             .replace(/```$/, '')          // Eliminar ``` al final
//             .trim();                       // Eliminar espacios en blanco

//         return cleaned;
//     }

//     // Limpiar la respuesta
//     const cleanedContent = cleanJsonResponse(content || '');

//     // Parsear el JSON limpio
//     const jsonResp = JSON.parse(cleanedContent);
    
//     return jsonResp;

// };


