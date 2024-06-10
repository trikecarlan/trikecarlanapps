
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

interface MenuLayoutProps {
    children: React.ReactNode;
    title?: string;
    route?: any;
}

export default function TabLayout({ children, title, route }: MenuLayoutProps) {

    const router = useRouter()

    const handleBack = () => {
        router.push(route)
    }

    return (
        <KeyboardAvoidingView
            className='bg-gray-100 flex-1'
            behavior={Platform.OS === "ios" ? "padding" : "position"}
        >
            <View className='h-max m-1 ralative border-b-4 border-gray-300 '>
                <Pressable onPress={handleBack}>
                    <Ionicons size={40} name="arrow-back-outline" color={"#F2722B"} />
                </Pressable>
                <View className='w-full absolute right-0 top-0 h-max m-1 items-center'>
                    <Text className='text-2xl'>{title}</Text>
                </View>
            </View>
            <ScrollView>
                <GestureHandlerRootView>
                    <View>
                        {children}
                    </View>
                </GestureHandlerRootView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


