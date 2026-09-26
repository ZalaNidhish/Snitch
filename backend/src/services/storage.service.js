    import ImageKit, { toFile } from '@imagekit/nodejs';
    import { IMAGEKIT_PRIVATE_KEY } from '../config/config.js';

    const client = new ImageKit({
    privateKey: IMAGEKIT_PRIVATE_KEY
    });

    export async function uploadFiles(buffer, fileName){
        const response = await client.files.upload({
            file: await toFile(buffer),
            fileName,
            folder: "Snitch"
        });

        return response;

    }

    export async function deleteFiles(fileId) {
        try {
            await client.files.delete(fileId)
        } catch (error) {
            console.error("Bulk delete failed:", error);
        }
    }