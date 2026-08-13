
import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}


export const translateUseCase = async (  openai: OpenAI, { prompt, lang }: Options ) => {

    const response = await openai.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        temperature: 0.2,
        //max_tokens: 500,
    
        messages: [
            {
                role: "system",
                content:`Traduce el siguiente texto al idioma ${lang}:${ prompt}`
            },            
        ],
    });

    const content = response.choices[0].message.content;
    return {message: content}


};
