import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import * as path from "path";
import * as fs from "fs";
@Injectable()
export class GptService {

    // private openai = new OpenAI({
    //     apiKey: process.env.OPENAI_API_KEY,
    // })
    private openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

orthographyCheck(orthographyDto:OrthographyDto) {

    return orthographyCheckUseCase( this.openai, {
        prompt: orthographyDto.prompt
    });
}

async prosConsDicusser( { prompt }: ProsConsDiscusserDto ) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

async prosConsDicusserStream( { prompt }: ProsConsDiscusserDto ) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translateText( { prompt, lang }: TranslateDto ) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

 async textToAudio( { prompt, voice }: TextToAudioDto ) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async textToAudioGetter(fileId: string) {

    const filePath = path.resolve(__dirname, '../../generated/audios/', `${fileId}.mp3`);
    const wasFound = fs.existsSync( filePath );

    if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;

  }

  async audioToText( audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto ) {

    const { prompt } = audioToTextDto

    return await audioToTextUseCase( this.openai, { audioFile, prompt });
}

  async imageGeneration( imageGenerationDto: ImageGenerationDto ) {
    return await imageGenerationUseCase( { ...imageGenerationDto } );
}
getGeneratedImage( fileName: string ) {

    const filePath = path.resolve('./', './generated/images/', fileName);
    const exists = fs.existsSync( filePath );

    if ( !exists ) {
    throw new NotFoundException('File not found');
    }

    //console.log( `${fileName}` );

    return filePath;
}

async generateImageVariation( { baseImage }: ImageVariationDto ) {
    return imageVariationUseCase(  { baseImage } );
}


}
