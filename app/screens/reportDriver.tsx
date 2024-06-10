import { Pressable, Text, TextInput, View } from "react-native";
import { app, auth } from "@/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { child, get, getDatabase, ref } from "firebase/database";
import React from "react";
import { useRouter } from "expo-router";
import { useStore } from "zustand";
import { useStoreDriver } from "@/hooks/useStore";
import { Driver } from "@/hooks/useStore";
import TabLayout from "@/components/TabLayout";

interface Data {
    [key: string]: Driver;
}


export default function ReportDriver() {
    const [sideCartNo, setSideCartNo] = React.useState('')

    const { driver, setDriver, updateDriver } = useStoreDriver();
    const router = useRouter()

    const filteredEntries = (data: Data, sideCartNumber: string): [string, Driver][] =>
        Object.entries(data).filter(([key, value]) => value.sideCartNumber === sideCartNumber);

    const filteredObject = (data: Data, sideCartNumber: string): Data =>
        Object.fromEntries(filteredEntries(data, sideCartNumber));

    const dbRef = ref(getDatabase(app));
    const handleFindDriver = async () => {
        try {
            const snapshot = await get(child(dbRef, `/users`));
            if (snapshot.exists()) {
                const data = filteredObject(snapshot.val(), sideCartNo);
                const keys = Object.keys(data);
                const firstKey = keys[0];
                setDriver(data[firstKey])
                router.push("/screens/driversInfo")
            } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            console.log("Sign-in process completed");
        }
    };

    return (
        <TabLayout route="(tabs)/report" title="Report Driver">
            <View className="justify-center h-screen">
                <View className="rounded-lg relative py-10 mx-4 flex flex-col bg-gray-300 items-center">
                    <View className="relative w-10/12 rounded-lg  bg-gray-100 ">
                        <TextInput
                            className="text-lg pl-10 py-3"
                            placeholder="Enter side cart no."
                            value={sideCartNo}
                            onChangeText={setSideCartNo}
                        />
                        <View className="absolute left-2 top-3">
                            <Ionicons size={25} name="search" />
                        </View>
                    </View>
                    <Pressable onPress={handleFindDriver} className="w-10/12 rounded-lg mt-8 items-center bg-orange-600 px-4 py-3">
                        <Text className="text-lg text-center text-gray-100">Enter</Text>
                    </Pressable>
                    <Text className="text-center w-10/12 mt-8">You can enter the driver side cart number code to view their basic information and give them feedback.</Text>
                </View>
            </View>
        </TabLayout>
    );
}

