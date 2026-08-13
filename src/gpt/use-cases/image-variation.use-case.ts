
interface Options {
    baseImage: string;
}

export const imageVariationUseCase = async ( options: Options) => {
    const { baseImage } = options;

     


    return baseImage;
};