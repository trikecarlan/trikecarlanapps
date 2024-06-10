import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View, ScrollView, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import React from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getDatabase, set, ref as dbRef } from 'firebase/database';
import { useStoreDriver, useStoreUser } from '@/hooks/useStore';
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { usePickImages, usePickSignature } from "@/hooks/usePickImages";
import useUploadFiles from "@/hooks/useUploadImages";
import useFormatDate from "@/hooks/useFormatDate";
import { IReportData } from "./SubmitReportIncident";
import useMessage from "@/hooks/useMessage";

export default function ReportIncidentModalForm({
    setopenReportModal,
    openReportModal,
    dateCreated,
    address,
    signature,
    images,
    phoneNumber,
    dateOfIncident,
    sideCartNumber,
    reportType,
    type,
}: IReportData) {
    const [report, setReport] = React.useState<boolean>(false);
    const [profile, setProfile] = React.useState<string>("");
    const [userUid, setUserUid] = React.useState<string>('');
    const [uploading, setUploading] = React.useState<boolean>(false);
    const storage = getStorage();
    const db = getDatabase();
    const { driver } = useStoreDriver();
    const { user } = useStoreUser();
    const router = useRouter();
    const { selectedImages } = usePickImages();
    const { selectedSignature } = usePickSignature();
    const { formatDate } = useFormatDate();
    const dateNow = new Date();
    const dateString = formatDate(dateNow);
    const { uploadImages, uploadSignature, uploadProgress } = useUploadFiles(dateString, dateString);

    React.useEffect(() => {
        getImage();
        seeIfLoggedIn();
    }, []);

    const handleSubmit = async () => {
        setUploading(true);
        try {
            const uploadedImages = await uploadImages(images);
            const uploadedSignatureImage = await uploadSignature(signature);
            await set(dbRef(db, `reports/${sideCartNumber}/${userUid}/${dateString}`), {
                dateCreated: dateNow.toISOString(),
                address: address,
                signature: uploadedSignatureImage,
                images: uploadedImages,
                phoneNumber: driver?.phoneNumber,
                dateOfIncident: dateOfIncident,
                sideCartNumber: sideCartNumber,
                reportType: reportType,
                type: "Incident",
                status: "Pending",
                reporterProfile: profile,
                reporterName: `${user.firstName} ${user.lastName}`
            });
            setUploading(false);
            alert("Successfully submitted.");
            setopenReportModal(false);
        } catch (error) {
            alert("Upload error.");
            setUploading(false);
            console.log(error);
        }
    };

    const getImage = () => getDownloadURL(ref(storage, `images/${user.email}`))
        .then((url) => {
            setProfile(url);
        })
        .catch((error) => {
            console.log(error);
        });

    const seeIfLoggedIn = () => onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserUid(user.uid);
        } else {
            router.push("/");
        }
    });

    return (
        <ScrollView showsVerticalScrollIndicator contentContainerStyle={{ alignItems: 'center' }}>
            <View className="border-b-8 mb-2 rounded-full w-14 border-b-gray-300" />
            <Text className="text-xl font-bold mb-2 text-orange-500">SUMMARY</Text>
            {profile ? (
                <Image source={{ uri: profile }} className="rounded-full h-16 w-16 mb-2" />
            ) : null}
            <View className="items-center w-full">
                <View className="flex w-5/6 flex-col items-start justify-start">
                    <View>
                        <View className="flex flex-row items-center gap-1">
                            <Text className="font-semibold text-md">ID: </Text>
                            <Text>{userUid.slice(0, 20)}</Text>
                        </View>
                        <View className="flex flex-row items-center gap-1">
                            <Text className="font-semibold text-md">Address: </Text>
                            <Text>{user.address}</Text>
                        </View>
                        <View className="flex flex-row items-center gap-1">
                            <Text className="font-semibold text-md">Phone No.:</Text>
                            <Text>{user.phoneNumber}</Text>
                        </View>
                    </View>
                    <View className="my-2">
                        <View className="flex flex-row items-center gap-1">
                            <Text className="font-semibold text-md">Date of Incident:</Text>
                            <Text>{dateOfIncident}</Text>
                        </View>
                        <View className="flex flex-row items-center gap-1">
                            <Text className="font-semibold text-md">Address: </Text>
                            <Text>{address}</Text>
                        </View>
                    </View>
                </View>
                <View className="flex flex-row">
                    {images && images.length > 0 ? images.map((image, index) => (
                        <Image key={index} source={{ uri: image.uri }}
                            className={`${images.length < 2 ? "h-24 w-full" :
                                images.length > 2 ? "h-14 w-14" : "h-24 w-24"} m-2`} />
                    )) : null}
                </View>
                <View className="flex flex-row items-start w-4/5">
                    <Text className="font-semibold text-md">Summary: </Text>
                </View>
                <View className="flex flex-row justify-center w-full">
                    <Text className={`border-2 w-4/5 rounded-lg px-2 border-gray-400 ${reportType.length > 100 ? "h-max" : "h-20"}`}>
                        {reportType}
                    </Text>
                </View>
            </View>
            <View>
                <Text>Signature:</Text>
                {signature?.uri ? (
                    <Image source={{ uri: signature.uri }} style={{ width: 250, height: 60, marginBottom: 10 }} />
                ) : null}
            </View>
            {uploading ? (
                <View className="bg-orange-500 py-2 px-4 w-1/2 my-6 rounded-lg">
                    <Text className="text-white text-center text-lg">Uploading...</Text>
                </View>
            ) : (
                <Pressable onPress={handleSubmit} className="bg-orange-500 py-2 px-4 w-1/2 my-6 rounded-lg">
                    <Text className="text-white text-center text-lg">Submit</Text>
                </Pressable>
            )}
        </ScrollView>
    );
}
