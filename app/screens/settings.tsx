import MenuLayout from "@/components/MenuLayout";
import TabLayout from "@/components/TabLayout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";


export default function Settings() {
    const route = useRouter()
    const handleNavigate = (link: string) => {
        route.push(link)
    }
    return (
        <TabLayout route="(tabs)" title="Settings">
            <View className="flex flex-col h-screen items-center pt-36 gap-6">
                <Pressable onPress={() => handleNavigate("/screens/changeProfile")} className="bg-orange-600 w-4/6 rounded-xl py-4 flex flex-row items-center justify-between px-4">
                    <Text className="text-2xl text-center text-white mr-2">Profile</Text>
                    <Ionicons size={40} color={"white"} name="person-sharp" />
                </Pressable>
                <Pressable onPress={() => handleNavigate("/screens/updateEmail")} className="bg-orange-600 w-4/6 rounded-xl py-4 flex flex-row items-center justify-between px-4">
                    <Text className="text-2xl text-center text-white mr-2">Update Email</Text>
                    <View className="border-4 rounded-lg items-end border-gray-100">
                        <Ionicons size={30} color={"white"} name="alert-sharp" />
                    </View>
                </Pressable>
                <Pressable onPress={() => handleNavigate("/screens/changePassword")} className="bg-orange-600 w-4/6 rounded-xl py-4 flex flex-row items-center justify-between px-4">
                    <Text className="text-2xl text-center text-white mr-2">Change Password</Text>
                    <Ionicons size={40} color={"white"} name="reader-sharp" />
                </Pressable>
            </View>
        </TabLayout>
    );
}

