import { Image, StyleSheet, Platform, Text, TouchableOpacity, KeyboardAvoidingView, SafeAreaView, View, TextInput, Pressable } from 'react-native';
import React from 'react';
import { getAuth, signInWithEmailAndPassword, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { app } from '@/firebaseConfig';
import { Link, useRouter } from 'expo-router';
import { child, get, getDatabase, ref } from 'firebase/database';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateNewPassword() {
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [newPassword, setSetNewPassword] = React.useState('');

    const handleChnage = () => {

    }

    return (
        <SafeAreaView className="flex-1 h-screen">
            <SafeAreaView className="h-44 bg-orange-400 mt-10 items-center justify-center">
                <Image
                    className='rounded-full h-28 w-28 border-2 border-gray-100'
                    source={require('@/assets/images/react-logo.png')}
                />
            </SafeAreaView>
            <View className="flex flex-col item-center h-full bg-slate-50 items-center gap-4">
                <Text className="text-4xl font-semibold">Create New Password</Text>
                <View className='flex flex-row items-center'>
                    <Text className="text-center mx-6">
                        Your new password must be different from previously used password
                    </Text>
                </View>
                <View className="grid justify-center items-center w-full mx-6 gap-4">
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-3/4 border-2 border-gray-400"
                        onChangeText={setSetNewPassword}
                        value={newPassword}
                        placeholder="New Password"
                    />
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-3/4 border-2 border-gray-400"
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                    />
                </View>
                <Pressable className="rounded-lg bg-orange-500 py-3 w-3/4 mt-4"
                    onPress={handleChnage}>
                    <Text className='text-center text-xl text-gray-50'>Change</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
