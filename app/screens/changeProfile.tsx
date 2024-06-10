import React, { useState } from 'react';
import { Button, Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as dbRef } from 'firebase/database';
import TabLayout from '@/components/TabLayout';
import { useStoreUser } from '@/hooks/useStore';
import { getDatabase, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default function ChangeProfile() {
    const [selectedImage, setSelectedImage] = React.useState(""); // State to store selected image
    const [currentImage, setCurrentImage] = React.useState("");
    const [uploading, setUploading] = React.useState<number>(0);
    const { user, updateUser } = useStoreUser()
    const [uid, setUid] = React.useState<string>()

    const pickImage = async () => {
        // Request storage permission (optional, depending on platform)
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to choose an image.');
            return;
        }

        // Launch image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Allow editing (optional)
            aspect: [4, 3], // Optional aspect ratio
            quality: 1, // Optional image quality (0-1)
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Update selected image state
            console.log(result.assets[0].uri)
        }
    };

    const storage = getStorage();
    const db = getDatabase();

    const uploadImage = async () => {
        if (!selectedImage) {
            alert('Please select an image to upload.');
            return;
        }
        const imageUri: any = selectedImage; // Use selected image URI for upload

        // Create a reference to the file location in Firebase Storage
        const fileExt = imageUri.split('.').pop(); // Extract filename from URI
        const storageRef = ref(storage, `images/${user.email}`);

        // Create an upload task with proper MIME type based on content type or extension
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const mimeType = blob.type; // Get MIME type from response (recommended)

        const uploadTask = uploadBytesResumable(storageRef, blob, { contentType: mimeType });

        // Handle upload progress (optional)
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploading(progress);
                // Update UI with progress if desired
            },
            (error) => {
                // Handle errors
                console.error(error);
                alert('Upload failed.');
            },
            () => {
                setUploading(0)
                getImage(uid)
                alert('Image uploaded successfully!');
            }
        );
    };

    const getUid = () => onAuthStateChanged(auth, (user) => {
        if (user) {
            setUid(user.uid)
            getImage(user.uid)
        }
    });

    const getImage = (userUid: any) => getDownloadURL(ref(storage, `images/${user.email}`))
        .then((url) => {
            updateUser({ profile: url })
            try {
                set(dbRef(db, `users/${userUid}/profile`), {
                    url
                });
            } catch (err) {
                console.log("change profile failed", err)
            }
            setCurrentImage(url)
        })
        .catch((error) => {
            alert('No Uploaded image');
        });

    React.useEffect(() => {
        getUid()
    }, [])


    return (
        <TabLayout route={"/tabs"} title='Change Profile'>
            <View className='items-center relative m-10'>
                {selectedImage ?
                    <Image
                        className='rounded-full border-2 border-gray-100'
                        source={{ uri: selectedImage }}
                        style={{ width: 200, height: 200 }}
                    />
                    :
                    currentImage ?
                        <Image
                            className='rounded-full border-2 border-gray-100'
                            source={{ uri: currentImage }}
                            style={{ width: 200, height: 200 }}
                        />
                        :
                        <Image
                            className='rounded-full border-2 border-gray-100'
                            source={require('@/assets/profiles/blankProfile.png')}
                            style={{ width: 200, height: 200 }}
                        />
                }
                {uploading > 0 &&
                    <View className={`absolute top-20 left-0 h-10 rounded-full overflow-hidden bg-gray-400 w-[100%]`}>
                        <View className={`w-[${uploading.toString().split('.').shift()}%] h-full justify-center bg-green-500`}>
                            <Text className='text-center'>{uploading.toString().split('.').shift()}%</Text>
                        </View>
                    </View>}
            </View>
            <View className='items-center w-full gap-2'>
                <Pressable className='bg-orange-600 rounded-lg h-max py-2 w-3/4' onPress={pickImage}>
                    <Text className='text-center text-gray-100 text-lg'>
                        Choose Image
                    </Text>
                </Pressable>
                <Pressable className='bg-orange-600 rounded-lg h-max py-2 w-3/4' onPress={uploadImage}>
                    <Text className='text-center text-gray-100 text-lg'>
                        Upload Profile
                    </Text>
                </Pressable>
            </View>
        </TabLayout>
    );
}
