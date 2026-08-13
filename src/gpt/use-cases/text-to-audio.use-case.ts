
import OpenAI from "openai";
import * as path from "path";
import * as fs from "fs";

interface Options {
    prompt: string;
    voice?: string;
}


export const textToAudioUseCase = async (  openai: OpenAI, { prompt, voice }: Options ) => {

    const voices = {
       "autumn": "autumn" 
    }

    const selectedVoice = voices['autumn'];

    const folderPath = path.resolve(__dirname, '../../../generated/audios/')
    const speechFile = path.resolve(`${ folderPath }/${ new Date().getTime() }.mp3`);


    fs.mkdirSync( folderPath, { recursive: true });

    const mp3 = await openai.audio.speech.create({
        model:'canopylabs/orpheus-v1-english',
        voice: selectedVoice,
        input: prompt,
        response_format: "wav",
    })

   const buffer = Buffer.from( await mp3.arrayBuffer());
   fs.writeFileSync(speechFile, buffer)

    return speechFile



    // const response = await openai.chat.completions.create({
    //     model: 'openai/gpt-oss-120b',
    //     temperature: 0.2,
    //     //max_tokens: 500,
    
    //     messages: [
    //         {
    //             role: "system",
    //             content:`Traduce el siguiente texto al idioma ${lang}:${ prompt}`
    //         },            
    //     ],
    // });

    // const content = response.choices[0].message.content;
    // return {message: content}


};
