import { Image, StyleSheet, Platform, Text, TouchableOpacity, KeyboardAvoidingView, SafeAreaView, View, TextInput, Pressable } from 'react-native';
import React from 'react';
import { UserCredential, getAuth, getReactNativePersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { app, auth } from '@/firebaseConfig';
import { Link, useRouter } from 'expo-router';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { User, useStoreUser } from '@/hooks/useStore';
import { child, get, getDatabase, ref } from 'firebase/database';

interface Data {
    [key: string]: User;
}

export default function signInPassenger() {
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const { setUser } = useStoreUser()

    const router = useRouter()

    const dbRef = ref(getDatabase(app));
    const handleSignIn = async () => {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
            const snapshot = await get(child(dbRef, `/users/${userCredential.user.uid}`));
            if (snapshot.exists()) {
                setUser(snapshot.val())
                router.push("/(tabs)")
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            console.log("false");
        }
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
                <Text className="text-4xl font-semibold">Log in</Text>
                <View className="grid justify-center items-center w-full mx-6 gap-4">
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-3/4 border-2 border-gray-400"
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        keyboardType='email-address'
                    />
                    <TextInput
                        className="rounded-lg text-xl py-2 pl-2 w-3/4 border-2 border-gray-400"
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                </View>
                <View className="flex flex-row w-3/5 justify-end">
                    <Link href={"/forgotUserPassword"}>
                        <Text className="text-orange-500">forgot password?</Text>
                    </Link>
                </View>
                <Pressable className="rounded-lg bg-orange-500 py-3 w-3/4 mt-4"
                    onPress={handleSignIn}>
                    <Text className='text-center text-xl text-gray-50'>Login</Text>
                </Pressable>
                <View className="flex flex-row gap-2 w-3/5 justify-end">
                    <Text className="">Don't have an account?</Text>
                    <Link href={"/signUpPassenger"} className="text-orange-500">Create</Link>
                </View>
            </View>
        </SafeAreaView>
    );
}
