import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";

async function getBase64Image(src: string) {
    try {
        const response = await fetch(src);
        if (!response.ok) {
            throw new Error('Failed to fetch image');
        }

        const buffer = await response.arrayBuffer();
        const { metadata: { width, height }, base64 } = await getPlaiceholder(Buffer.from(buffer));

        return {
            img: {
                width,
                height,
                src,
            },
            base64,
            error: null,
        };
    } catch (error: any) {
        console.error(`Error fetching or processing image: ${error.message}`);
        return {
            img: {
                width: 0,
                height: 0,
                src: '',
            },
            base64: '',
            error,
        }
    }
}

export default async function DynamicImage({ src, alt, ...props }: { src: string, alt: string, [key: string]: any }) {

    const { base64, img } = await getBase64Image(src);

    return (
        <Image
            {...img}
            alt={alt}
            placeholder="blur"
            blurDataURL={base64}
            {...props}
        />
    );
}