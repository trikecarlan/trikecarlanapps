import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage';

interface Image {
    uri: string;
}


const useUploadFiles = (sideCartNumber: any, dateString: string) => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const storage = getStorage();

    const uploadImages = async (selectedImages: Image[]): Promise<string[]> => {
        if (selectedImages.length === 0) {
            alert('Please select images to upload.');
            return [];
        }

        const uploadedImages: string[] = [];

        const promises = selectedImages.map(async (image) => {
            const storageRef = ref(storage, `reports/${sideCartNumber}/images/${dateString}`);
            const response = await fetch(image.uri);
            const blob = await response.blob();
            const mimeType = blob.type;

            const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: mimeType });

            return new Promise<string>((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress(progress);
                    },
                    (error) => {
                        console.error(error);
                        alert('Upload failed.');
                        reject(error);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            uploadedImages.push(downloadURL);
                            resolve(downloadURL);
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });
        });

        await Promise.all(promises);
        return uploadedImages;
    };

    const uploadSignature = async (selectedSignature: any): Promise<string> => {
        if (!selectedSignature) {
            alert('Please select a signature to upload.');
            return '';
        }
        const imageUri = selectedSignature.uri;

        const storageRef = ref(storage, `reports/${sideCartNumber}/signature/${dateString}`);
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const mimeType = blob.type;

        const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: mimeType });

        return new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error(error);
                    alert('Upload failed.');
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        alert('Signature uploaded successfully!');
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    };

    return { uploadImages, uploadSignature, uploadProgress };
};

export default useUploadFiles;
