import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const usePickImages = () => {
    const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

    const pickImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to choose images.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            if (result.assets.length > 4) {
                alert('You can select up to 4 images only.');
                return;
            }
            setSelectedImages(result.assets);
        }
    };

    return { selectedImages, pickImages };
};

export const usePickSignature = () => {
    const [selectedSignature, setSelectedSignature] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const pickSignature = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to choose an image.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            setSelectedSignature(result.assets[0]);
        }
    };

    return { selectedSignature, pickSignature };
};
