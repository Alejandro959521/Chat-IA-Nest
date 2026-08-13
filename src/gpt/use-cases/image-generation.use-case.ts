import axios from 'axios';
import FormData from 'form-data';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers/download-image-as-png';
import fs from "fs";
import * as path from 'path'

interface Options {
    prompt: string;
    originalImage?: string;
    maskImage?: string;

}

export const imageGenerationUseCase = async (options: Options) => {
    const { prompt, originalImage, maskImage } = options;

    if (!originalImage || !maskImage) {

        try {
            
            const response = await axios.post(
                `https://api.cloudflare.com/client/v4/accounts/6b80d5f5ed352040d6750cb56d610246/ai/run/@cf/black-forest-labs/flux-1-schnell`,
                {
                    prompt: prompt,
                    width: 1024,
                    height: 1024,
                    num_steps: 4,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer'
                }
            );



            const json = JSON.parse(Buffer.from(response.data).toString("utf8"));
            const base64Image = json.result.image;


            const params = new URLSearchParams();

            params.append("key", `${process.env.IMGBB_API_KEY}`);
            params.append("image", base64Image);


            const imgbbResponse = await axios.post(
                "https://api.imgbb.com/1/upload",
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )

            const publicUrl = imgbbResponse.data.data.url;
            const fileName = await downloadImageAsPng(publicUrl)
            const url = `${process.env.SERVER_URL}gpt/image-generation/${fileName}`

            return {

                url: url,
                oepnAiUrl: publicUrl,
                revised_prompt: prompt,

            };

        } catch (error) {
            console.error('error', (error as any).response?.data || (error as any).message);
            throw new Error(`Error al generar la imagen: ${(error as any).message}`);
        }

    }

    const pngImagePath = await downloadImageAsPng( originalImage, true );
    const maskPath = await downloadBase64ImageAsPng( maskImage, true )


 const form = new FormData();

    form.append("prompt", prompt);
    form.append("image", fs.createReadStream(pngImagePath));
    form.append("mask", fs.createReadStream(maskPath));

    form.append("width", "1024");
    form.append("height", "1024");
    form.append("steps", "28");

    const response = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/6b80d5f5ed352040d6750cb56d610246/ai/run/@cf/black-forest-labs/flux-fill-dev`,
        form,
        {
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                ...form.getHeaders(),
            },
        }
    );

    
            const json = JSON.parse(Buffer.from(response.data).toString("utf8"));
            const base64Image = json.result.image;


            const params = new URLSearchParams();

            params.append("key", `${process.env.IMGBB_API_KEY}`);
            params.append("image", base64Image);


            const imgbbResponse = await axios.post(
                "https://api.imgbb.com/1/upload",
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )

            const publicUrl = imgbbResponse.data.data.url;
            const  fileName = await downloadImageAsPng(publicUrl);
            const url = `${process.env.SERVER_URL}gpt/image-generation/${fileName}`
            //const fileName = path.basename(localImagePath);

return {

                url: url,
                openAIUrl: imgbbResponse.data.data.url,
                revised_prompt: prompt,

            };

};







// import OpenAI from 'openai';



// interface Options {
//     prompt: string;
//     originalImage?: string;
//     maskImage?: string;
// }

// export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => {
//     const { prompt, originalImage, maskImage } = options;
//     const payload: any = {
//         model: 'openrouter/free', // ✅ Modelo gratuito de imagen
//         messages: [
//             {
//                 role: 'user',
//                 content: prompt
//             }
//         ],
//         modalities: ['image'], // Genera imagen
//         image_config: {
//             aspect_ratio: '1:1',
//             quality: '0.5K'
//         }
//     };

//     const response = await openai.chat.completions.create(payload);

//     console.log(response);

//     // Extraer la imagen de forma segura (evita chequeos de tipos estrictos del SDK)
//     const anyResp: any = response;
//     const imageBase64 = anyResp?.choices?.[0]?.message?.images?.[0]?.image_url?.url
//         || anyResp?.choices?.[0]?.message?.content;
//     if (!imageBase64) {
//         throw new Error('No se generó ninguna imagen');
//     }
//     return {
//         url: imageBase64,
//         localPath: '',
//         revised_prompt: anyResp?.choices?.[0]?.message?.content || prompt
//     };
// };