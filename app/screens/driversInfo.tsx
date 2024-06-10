import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDownloadURL, getStorage, ref as storageRef } from 'firebase/storage';
import TabLayout from '@/components/TabLayout';
import { useStoreDriver } from '@/hooks/useStore';
import ReportModal from '@/components/ReportModal';

export default function DriversInfo() {
    const { driver } = useStoreDriver();
    const [driverProfile, setdriverProfile] = React.useState('');
    const [openReportModal, setopenReportModal] = React.useState<boolean>(false);
    const storage = getStorage();

    const getImage = () => getDownloadURL(storageRef(storage, `images/${driver.email}`))
        .then((url) => {
            setdriverProfile(url);
        })
        .catch((error) => {
            alert('No Uploaded image');
        });

    React.useEffect(() => {
        getImage();
    }, []);


    return (
        <TabLayout route="(tabs)/rate" title="Driver's Info">
            <View className="flex flex-col h-screen">
                <View className="rounded-lg pt-16 pb-6 flex flex-col items-center gap-2 mx-6 my-6 bg-gray-400">
                    {driverProfile ?
                        <Image
                            className='rounded-full h-28 w-28 border-2 border-gray-100'
                            source={{ uri: driverProfile }}
                        />
                        :
                        <Image
                            className='rounded-full h-28 w-28 border-2 border-gray-100'
                            source={require('@/assets/profiles/blankProfile.png')}
                        />
                    }
                    <Text>{driver.sideCartNumber}</Text>
                    <Text className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Name: {driver.firstName} {driver.lastName}
                    </Text>
                    <Text className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Age: {driver.age}
                    </Text>
                    <Text className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Gender: {driver.gender}
                    </Text>
                    <Text className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Address: {driver.address}
                    </Text>
                    <Text className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Toda: {driver.toda}
                    </Text>
                </View>
                <View className="items-center mt-4">
                    <Pressable className="bg-orange-600 flex flex-row items-center justify-center rounded-lg w-1/3 py-2" onPress={() => setopenReportModal(true)}>
                        <Ionicons name="warning" size={20} color="white" />
                        <Text className="text-center text-gray-100 text-lg">Report</Text>
                    </Pressable>
                </View>
                {openReportModal && (
                    <View className='h-screen]'>
                        <ReportModal setopenReportModal={() => setopenReportModal(!openReportModal)} openReportModal={openReportModal} />
                    </View>
                )}
            </View>
        </TabLayout>
    );
}
