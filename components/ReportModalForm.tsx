import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View, ScrollView, Image, Alert } from "react-native";
import React from "react";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getDatabase, set, ref as dbRef } from 'firebase/database';
import { useStoreDriver, useStoreUser } from '@/hooks/useStore';
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { IClose } from "./ReportModal";
import useFormatDate from "@/hooks/useFormatDate";
import { usePickImages, usePickSignature } from "@/hooks/usePickImages";
import useUploadFiles from "@/hooks/useUploadImages";
import useMessage from "@/hooks/useMessage";

export default function ReportModalForm({ setopenReportModal }: IClose) {
    const [address, setAddress] = React.useState("");
    const [report, setReport] = React.useState<boolean>(false);
    const [reportType, setReportType] = React.useState("");
    const [dateOfIncident, setDateOfIncident] = React.useState("");
    const [profile, setProfile] = React.useState("");
    const [userUid, setuserUid] = React.useState('')
    const [uploading, setUploading] = React.useState<boolean>(false);
    const storage = getStorage();
    const db = getDatabase();
    const { driver } = useStoreDriver();
    const { user } = useStoreUser();
    const router = useRouter();
    const { selectedImages, pickImages } = usePickImages();
    const { selectedSignature, pickSignature } = usePickSignature();
    const { formatDate } = useFormatDate();
    const dateNow = new Date();
    const dateString = formatDate(dateNow);
    const { uploadImages, uploadSignature, uploadProgress } = useUploadFiles(driver.sideCartNumber, dateString);

    const handleReport = () => {
        let errorMessages = [];
        if (selectedImages.length <= 0) {
            errorMessages.push("Upload images of the incident");
        }
        if (!selectedSignature) {
            errorMessages.push("Image of your signature");
        }
        if (!reportType) {
            errorMessages.push("Report type");
        }
        if (!address) {
            errorMessages.push("Address of the Incident");
        }
        if (!dateOfIncident) {
            errorMessages.push("Date of Incident");
        }
        if (errorMessages.length > 0) {
            useMessage(errorMessages, "Please fill up the following fields:")
            setReport(false);
        } else {
            setReport(true);
        }
    }

    const handleSubmit = async () => {
        setUploading(true)
        try {
            const uploadedImages = await uploadImages(selectedImages);
            const uploadedSignatureImage = await uploadSignature(selectedSignature);

            await set(dbRef(db, `reports/${driver.sideCartNumber}/${userUid}/${dateString}`), {
                dateCreated: dateNow.toISOString(),
                address: address,
                signature: uploadedSignatureImage,
                images: uploadedImages,
                phoneNumber: driver?.phoneNumber,
                dateOfIncident: dateOfIncident,
                sideCartNumber: driver.sideCartNumber,
                reportType: reportType,
                type: "Report Driver",
                status: "Pending",
                reporterProfile: profile,
                reporterName: `${user.firstName} ${user.lastName}`
            });
            setUploading(false)
            useMessage(["Successfully Submitted."], "Success")
            setopenReportModal(false)
        } catch (error) {
            useMessage([""], "Error while uploading")
            setUploading(false)
            console.log(error);
        }
    };

    const getImage = () => getDownloadURL(ref(storage, `images/${user.email}`))
        .then((url) => {
            setProfile(url)
        })
        .catch((error) => {
            console.log(error);
        });

    React.useEffect(() => {
        getImage()
        seeIfLogedIn()
    }, [])

    const seeIfLogedIn = () => onAuthStateChanged(auth, (user) => {
        if (user) {
            setuserUid(user.uid)
        } else {
            router.push("/")
        }
    });

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <View className="border-b-8 mb-2 rounded-full w-14 border-b-gray-300 " />
            <Text className="text-xl font-bold mb-2 text-orange-500">{report ? "SUMMARY" : "REPORT"}</Text>
            {report ?
                <Image source={{ uri: profile }} className="rounded-full h-16 w-16 mb-2" />
                :
                <View className="flex flex-row flex-wrap">
                    {selectedImages.map((image, index) => (
                        <Image key={index} source={{ uri: image.uri }}
                            className={`${selectedImages.length < 2 ? "h-44 w-full" :
                                selectedImages.length > 2 ? "h-14 w-14" : "h-32 w-32"} m-2`} />
                    ))}
                </View>
            }
            {report ?
                <View className="items-center w-full">
                    <View className="flex w-5/6 flex-col items-start justify-start">
                        <View>
                            <View className="flex flex-row items-center gap-1">
                                <Text className="font-semibold text-md">ID: </Text>
                                <Text>{userUid.slice(20)}</Text>
                            </View>
                            <View className="flex flex-row items-center gap-1">
                                <Text className="font-semibold text-md">Address: </Text>
                                <Text>{address}</Text>
                            </View>
                            <View className="flex flex-row items-center gap-1">
                                <Text className="font-semibold text-md">Phone No.:</Text>
                                <Text> {user.phoneNumber}</Text>
                            </View>
                        </View>
                        <View className="mt-2">
                            <View className="flex flex-row items-center gap-1">
                                <Text className="font-semibold text-md">Date of Incident:</Text>
                                <Text> {dateOfIncident}</Text>
                            </View>
                            <View className="flex flex-row items-center gap-1">
                                <Text className="font-semibold text-md">Driver Side Cart: </Text>
                                <Text>{driver.sideCartNumber}</Text>
                            </View>
                        </View>
                        <View className="my-2">
                            <View className="flex flex-row items-center gap-1">
                                <Text className="font-semibold text-md">Report type: </Text>
                                <Text>{reportType}</Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex flex-row flex-wrap">
                        {selectedImages.map((image, index) => (
                            <Image key={index} source={{ uri: image.uri }}
                                className={`${selectedImages.length < 2 ? "h-32 w-full" :
                                    selectedImages.length > 2 ? "h-14 w-14" : "h-32 w-32"} m-2`} />
                        ))}
                    </View>
                </View>
                :
                <View className="justify-center items-center">
                    <Pressable onPress={pickImages} className="flex flex-row bg-orange-500 py-2 w-3/4 px-4 justify-stretch items-center rounded-lg mb-4">
                        <Ionicons size={20} color={'white'} name="cloud-upload" />
                        <Text className="text-white text-xl w-full text-center">Upload Images</Text>
                    </Pressable>
                    <View className="flex flex-row flex-wrap mb-6 items-center w-full justify-center">
                        <Text>Please select the appropriate report below:</Text>
                        {reportType ? (
                            <View className="flex flex-row gap-4 mb-2 items-center justify-center">
                                <Text>Report Type:</Text>
                                <Text className="border-b-2 border-l-2 bg-slate-50 text-center border-gray-300 rounded-xl py-2 mx-1 my-2 w-36">{reportType}</Text>
                                <Pressable onPress={() => setReportType("")}>
                                    <Ionicons size={20} name="close" />
                                </Pressable>
                            </View>
                        ) : (
                            ["Over speeding", "Over Pricing", "Harassment", "Reckless Driving", "Verbal Abuse", "Physical Abuse", "Overloading", "Others..."].map((data, index) => (
                                <Pressable
                                    onPress={() => setReportType(data)}
                                    className="border-b-2 border-l-2 bg-slate-50 border-gray-300 rounded-xl py-2 mx-1 my-2 w-36"
                                    key={index}
                                >
                                    <Text className="text-center">{data}</Text>
                                </Pressable>
                            ))
                        )}
                    </View>
                    <View className="flex flex-col items-end mr-3">
                        <View className="flex flex-row items-center justify-center gap-2 mb-4">
                            <Text>Date:</Text>
                            <TextInput onChangeText={setDateOfIncident} className="border border-gray-300 rounded-md w-3/4 px-4" placeholder="MM/DD/YY" />
                        </View>
                        <View className="flex flex-row items-center justify-center gap-2 mb-4">
                            <Text>Address:</Text>
                            <TextInput onChangeText={setAddress} className="border border-gray-300 rounded-md w-3/4 px-4" placeholder="Address" />
                        </View>
                    </View>

                </View>
            }
            {selectedSignature &&
                <View>
                    <Text>Signature:</Text>
                    <Image source={{ uri: selectedSignature.uri }} style={{ width: 300, height: 100, marginBottom: 10 }} />
                </View>
            }

            {report ?
                uploading ?
                    <Text>Uploading...</Text> :
                    <Pressable onPress={handleSubmit} className="bg-orange-500 py-2 px-4 w-1/2 my-6 rounded-lg">
                        <Text className="text-white text-center text-lg">Submit</Text>
                    </Pressable>
                :
                <View className="items-center">
                    <Pressable onPress={pickSignature} className="flex flex-row bg-orange-500 py-2 w-3/4 px-4 justify-stretch items-center rounded-lg mb-4">
                        <Ionicons size={20} color={'white'} name="cloud-upload" />
                        <Text className="text-white text-xl w-full text-center">Upload Signature</Text>
                    </Pressable>
                    <Pressable onPress={handleReport} className="bg-orange-500 py-2 px-8 my-6 rounded-lg">
                        <Text className="text-white text-center text-lg">Report</Text>
                    </Pressable>
                </View>

            }
        </ScrollView>
    );
}
