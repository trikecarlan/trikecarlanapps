import TabLayout from '@/components/TabLayout';
import React, { useCallback, useState } from 'react';
import { Alert, BackHandler, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useStoreDriver, useStoreUser } from '@/hooks/useStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { usePickImages, usePickSignature } from '@/hooks/usePickImages';
import useFormatDate from '@/hooks/useFormatDate';
import useMessage from '@/hooks/useMessage';
import SubmitReportIncident from '@/components/SubmitReportIncident';

const ReportIncident = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [dateOfIncident, setDateOfIncident] = useState('');
    const [placeOfIncident, setPlaceOfIncident] = useState('');
    const [incidentSummary, setIncidentSummary] = useState('');
    const { selectedImages, pickImages } = usePickImages();
    const { selectedSignature, pickSignature } = usePickSignature();
    const [openReportModal, setOpenReportModal] = useState<boolean>(false);
    const { user } = useStoreUser();
    const { formatDate } = useFormatDate();
    const dateNow = new Date();
    const dateString = formatDate(dateNow);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                router.push('/(tabs)/report');
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

    const handleReport = () => {
        let errorMessages = [];
        if (selectedImages.length <= 0) {
            errorMessages.push("Upload images of the incident");
        }
        if (!selectedSignature) {
            errorMessages.push("Image of your signature");
        }
        if (!dateOfIncident) {
            errorMessages.push("Date of the Incident");
        }
        if (!placeOfIncident) {
            errorMessages.push("Place of the Incident");
        }
        if (!incidentSummary) {
            errorMessages.push("Summary of Incident");
        }
        if (errorMessages.length > 0) {
            useMessage(errorMessages, "Please fill up the following fields:");
        } else {
            console.log("Opening Report Modal with images:", selectedImages);
            setOpenReportModal(true);
        }
    };

    return (
        <TabLayout route="(tabs)/report" title='Report Incident'>
            <View className={`flex flex-col ${openReportModal ? "h-screen" : "h-max"}`}>
                <View className='flex flex-col items-center justify-center rounded-2xl gap-2 mx-4 pt-10 pb-6 my-6 bg-gray-300'>
                    <Text className="text-xl font-bold text-orange-500">REPORT INCIDENT</Text>
                    <View className="flex flex-row flex-wrap">
                        {selectedImages.map((image, index) => (
                            <Image key={index} source={{ uri: image.uri }}
                                className={`${selectedImages.length < 2 ? "h-14 w-14" :
                                    selectedImages.length > 2 ? "h-14 w-14" : "h-14 w-14"} m-2`} />
                        ))}
                    </View>
                    <Pressable onPress={pickImages} className="flex flex-row bg-orange-500 py-2 w-3/4 px-4 justify-stretch items-center rounded-lg">
                        <Ionicons size={20} color={'white'} name="cloud-upload" />
                        <Text className="text-white text-xl w-full text-center">Upload Images</Text>
                    </Pressable>
                    <View className='flex flex-col gap-2 w-full right-1 items-center'>
                        <TextInput onChangeText={setDateOfIncident} className="border border-gray-500 bg-gray-50 rounded-md w-3/4 py-1 px-4" placeholder="Date of Incident" />
                        <TextInput onChangeText={setPlaceOfIncident} className="border border-gray-500 bg-gray-50 rounded-md w-3/4 py-1 px-4" placeholder="Place of Incident" />
                        <TextInput onChangeText={setIncidentSummary} className="border border-gray-500 bg-gray-50 rounded-md w-3/4 py-1 px-4" placeholder="Incident Summary" />
                    </View>
                    {selectedSignature &&
                        <View>
                            <Text>Signature:</Text>
                            <Image source={{ uri: selectedSignature.uri }} style={{ width: 200, height: 50, marginBottom: 10 }} />
                        </View>
                    }
                    <Pressable onPress={pickSignature} className="flex flex-row bg-orange-500 py-2 w-3/4 px-4 justify-stretch items-center rounded-lg mb-4">
                        <Ionicons size={20} color={'white'} name="cloud-upload" />
                        <Text className="text-white text-xl w-full text-center">Upload Signature</Text>
                    </Pressable>
                </View>
                <View className="items-center mb-10">
                    <Pressable onPress={handleReport} className="bg-orange-500 py-2 px-8 my-6 rounded-lg">
                        <Text className="text-white text-center text-lg">Report</Text>
                    </Pressable>
                </View>
                {openReportModal && (
                    <View>
                        <SubmitReportIncident
                            setopenReportModal={setOpenReportModal}
                            openReportModal={openReportModal}
                            dateCreated={new Date()}
                            address={user.address}
                            signature={selectedSignature}
                            images={selectedImages}
                            phoneNumber={user.phoneNumber}
                            dateOfIncident={dateOfIncident}
                            sideCartNumber={dateString}
                            reportType={incidentSummary}
                            type="Report Incident"
                        />
                    </View>
                )}
            </View>
        </TabLayout>
    );
};

export default ReportIncident;
