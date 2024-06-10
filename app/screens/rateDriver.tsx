import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, set } from "firebase/database";
import React from "react";
import TabLayout from "@/components/TabLayout";
import { useStoreDriver, useStoreUser } from "@/hooks/useStore";
import { useRouter } from "expo-router";
import { getDownloadURL, getStorage, ref as storageRef } from "firebase/storage";

export default function RateDriver() {
    const { driver } = useStoreDriver();
    const { user } = useStoreUser();
    const [feedback, setFeedBack] = React.useState('');
    const [driverProfile, setdriverProfile] = React.useState('');
    const [rating, setRating] = React.useState(0);
    const db = getDatabase();
    const router = useRouter()
    const storage = getStorage();

    function formatDate(date: Date): string {
        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        const dayOfWeek = date.getUTCDay();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');

        return `${dayOfWeek}${month}${year}${hours}${minutes}`;
    }

    const handleSubmit = () => {
        try {
            set(ref(db, `ratings/${driver.sideCartNumber}/${formatDate(new Date())}`), {
                rating: rating,
                dateCreated: new Date().toISOString(),
                feedback: feedback,
                user: `${user?.firstName} ${user?.lastName}`,
                driver: `${driver?.firstName} ${driver?.lastName}`,
                toda: `${driver?.toda}`,
                profile: driverProfile,
            });
            alert("Successfully submited.")
            router.push("/(tabs)/rate")
        } catch (error) {
            console.log(error)
        }
    };

    const getImage = () => getDownloadURL(storageRef(storage, `images/${driver.email}`))
        .then((url) => {
            setdriverProfile(url)
        })
        .catch((error) => {
            alert('No Uploaded image');
        });

    React.useEffect(() => {
        getImage()
    }, [])

    const handleStarPress = (value: number) => {
        setRating(value);
    };

    return (
        <TabLayout route="(tabs)/rate" title="Rate">
            <View className="flex flex-col">
                <View className="rounded-lg pt-2 pb-6 flex flex-col items-center gap-2 mx-6 my-2 bg-gray-400">
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
                    <Text
                        className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Name: {driver.firstName} {driver.lastName}
                    </Text>
                    <Text
                        className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Age: {driver.age}
                    </Text>
                    <Text
                        className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Gender: {driver.gender}
                    </Text>
                    <Text
                        className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Address: {driver.address}
                    </Text>
                    <Text
                        className="rounded-lg p-2 w-3/4 bg-gray-100">
                        Toda: {driver.toda}
                    </Text>
                </View>
                <View className="flex flex-col items-center">
                    <Text>Rate Driver</Text>
                    <View className="flex flex-row gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <Pressable key={value} onPress={() => handleStarPress(value)}>
                                <Ionicons
                                    size={20}
                                    name="star"
                                    color={value <= rating ? "#F2722B" : "#C0C0C0"}
                                />
                            </Pressable>
                        ))}
                    </View>
                </View>
                <Text className="ml-4">Leave a feedback</Text>
                <TextInput
                    className="border-2 border-gray-400 rounded-md mx-4 bg-gray-200"
                    placeholderTextColor="grey"
                    multiline={true}
                    numberOfLines={8}
                    value={feedback}
                    onChangeText={(e) => setFeedBack(e)}
                />
                <View className="items-center mt-4">
                    <Pressable className="bg-orange-700 rounded-lg w-1/2 py-2" onPress={handleSubmit}>
                        <Text className="text-center text-gray-100 text-lg">Submit</Text>
                    </Pressable>
                </View>
            </View>
        </TabLayout>
    );
}
