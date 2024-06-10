import { Image, StyleSheet, Platform, Text, TouchableOpacity, KeyboardAvoidingView, SafeAreaView, View, TextInput, Pressable } from 'react-native';
import React from 'react';
import { getAuth, signInWithEmailAndPassword, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { app } from '@/firebaseConfig';
import { Link, useRouter } from 'expo-router';
import { child, get, getDatabase, ref } from 'firebase/database';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

interface User {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sideCartNumber: string;
    address: string;
}

interface Data {
    [key: string]: User;
}

export default function forgotUserPassword() {
    const [sideCartNum, setSideCartNumber] = React.useState('');

    const router = useRouter()

    const dbRef = ref(getDatabase(app));
    const handleSendCode = () => {
        router.push("/verifyEmail")
    };


    return (
        <SafeAreaView className="flex-1 h-screen">
            <SafeAreaView className="h-44 bg-orange-400 mt-10 items-center justify-center">
                <Image
                    className='rounded-full h-28 w-28 border-2 border-gray-100'
                    source={require('@/assets/images/react-logo.png')}
                />
            </SafeAreaView>
            <View className="flex flex-col item-center h-full bg-slate-50 items-center gap-4">
                <Text className="text-4xl font-semibold">Forgot Password</Text>
                <View className='flex flex-row items-center'>
                    <Text className="text-center mx-6">
                        Please enter your email adress to recieve a verification code
                    </Text>
                </View>

                <View className="grid justify-center items-center w-full mx-6 gap-4">
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-3/4 border-2 border-gray-400"
                        onChangeText={setSideCartNumber}
                        value={sideCartNum}
                        placeholder="Email"
                    />
                </View>
                <Pressable className="rounded-lg bg-orange-500 py-3 w-3/4 mt-4"
                    onPress={handleSendCode}>
                    <Text className='text-center text-xl text-gray-50'>Send</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
