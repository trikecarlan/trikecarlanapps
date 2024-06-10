import { Image, StyleSheet, Platform, Text, TouchableOpacity, KeyboardAvoidingView, SafeAreaView, View, TextInput, Pressable } from 'react-native';
import React from 'react';
import { getAuth, signInWithEmailAndPassword, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { app } from '@/firebaseConfig';
import { Link, useRouter } from 'expo-router';
import { child, get, getDatabase, ref } from 'firebase/database';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export default function signInDriver() {
    const [sideCartNum, setSideCartNumber] = React.useState('');

    const router = useRouter()

    const handleSignIn = async () => {
        router.push("/createNewPassword")
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
                <Text className="text-4xl font-semibold">Verify Your Email</Text>
                <View className='flex flex-row items-center'>
                    <Text className="text-center mx-6">
                        Please enter the 4 digit code sent to
                        your email address
                    </Text>
                </View>

                <View className="flex flex-row items-center gap-4">
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-1/6 border-2 border-gray-400"
                        onChangeText={setSideCartNumber}
                        value={sideCartNum}
                        placeholder="0"
                    />
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-1/6 border-2 border-gray-400"
                        onChangeText={setSideCartNumber}
                        value={sideCartNum}
                        placeholder="0"
                    />
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-1/6 border-2 border-gray-400"
                        onChangeText={setSideCartNumber}
                        value={sideCartNum}
                        placeholder="0"
                    />
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-1/6 border-2 border-gray-400"
                        onChangeText={setSideCartNumber}
                        value={sideCartNum}
                        placeholder="0"
                    />
                </View>
                <View className='flex flex-row items-center'>
                    <Text className="text-center mx-6">
                        Resend Code
                    </Text>
                </View>
                <Pressable className="rounded-lg bg-orange-500 py-3 w-3/4 mt-4"
                    onPress={handleSignIn}>
                    <Text className='text-center text-xl text-gray-50'>Verify</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
