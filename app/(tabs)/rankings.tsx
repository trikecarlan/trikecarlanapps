import MenuLayout from "@/components/MenuLayout";
import { app } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

interface Feedback {
    feedback: string;
    rating: number;
    user: string;
}

interface Ratings {
    [key: string]: Feedback;
}

export default function Rankings() {
    const database = getDatabase(app);
    const [ratings, setRatings] = useState<Ratings | null>(null);

    const userRef = ref(database, 'ratings/');
    useEffect(() => {
        const fetchRatings = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            setRatings(data);
        });

        return () => {
            fetchRatings();
        };
    }, []);

    const calculateRatings = (data: any) => {
        const results: any = {};

        for (const objectId in data) {
            const feedbacks = data[objectId];
            let totalRating = 0;
            const users = new Set();
            let driver = '';
            let toda = '';
            let profile = '';

            for (const feedbackId in feedbacks) {
                const feedbackData = feedbacks[feedbackId];
                totalRating += feedbackData.rating;
                users.add(feedbackData.user);
                driver = feedbackData.driver;
                toda = feedbackData.toda;
                profile = feedbackData.profile;
            }

            const numUsers = users.size;
            const normalizedRating = numUsers > 0 ? (numUsers * 5) / totalRating : 0;

            results[objectId] = {
                totalRating: totalRating,
                profile: profile,
                numUsers: numUsers,
                normalizedRating: normalizedRating * 100,
                driver: driver,
                toda: toda
            };
        }

        return (results);
    };



    return (
        <MenuLayout title={"Rankings"}>
            <Text className="text-start text-orange-600 text-xl m-4">TOP SUGGESTED DRIVERS</Text>
            <View className="items-center gap-4">
                <View className="flex flex-col gap-2 w-full px-6">
                    {Object.values(calculateRatings(ratings) || {}).map((data: any, index: number) => (
                        <View key={index} className="flex flex-row justify-between items-center">
                            <View className="flex flex-row items-center gap-3">
                                <Text>{index + 1}</Text>
                                {data?.profile ?
                                    <Image
                                        className='rounded-full h-12 w-12 border-2 border-gray-100'
                                        source={{ uri: data?.profile }}
                                    />
                                    :
                                    <Image
                                        className='rounded-full h-12 w-12 border-2 border-gray-100'
                                        source={require('@/assets/profiles/blankProfile.png')}
                                    />
                                }
                            </View>
                            <View>
                                <Text className="text-gray-700">
                                    Name: {data.driver}
                                </Text>
                                <Text className="text-gray-700">
                                    TODA: {data.toda}
                                </Text>

                            </View>

                            <Text className="text-orange-600">
                                {data.totalRating}
                            </Text>
                            <View className="bg-orange-600 p-1">
                                <Ionicons size={25} name="star" color={"#ffffff"} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </MenuLayout>
    );
}
