import { Image, StyleSheet, Platform, Text, TouchableOpacity, KeyboardAvoidingView, SafeAreaView, View, TextInput, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { signInWithEmailAndPassword, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { app, auth } from '@/firebaseConfig';
import { Link, useRouter } from 'expo-router';
import { child, get, getDatabase, ref } from 'firebase/database';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { User, useStoreUser } from '@/hooks/useStore';

interface Data {
    [key: string]: User;
}

export default function signInDriver() {
    const [password, setPassword] = React.useState('');
    const [sideCartNum, setSideCartNumber] = React.useState('');
    const { user, setUser } = useStoreUser()

    // const auth = getAuth(app);

    const router = useRouter()


    const filteredEntries = (data: Data, sideCartNumber: string): [string, User][] =>
        Object.entries(data).filter(([key, value]) => value.sideCartNumber === sideCartNumber);

    const filteredObject = (data: Data, sideCartNumber: string): Data =>
        Object.fromEntries(filteredEntries(data, sideCartNumber));

    const dbRef = ref(getDatabase(app));
    const handleSignIn = async () => {
        try {
            const snapshot = await get(child(dbRef, `/users`));
            if (snapshot.exists()) {
                const data = filteredObject(snapshot.val(), sideCartNum);
                const keys = Object.keys(data);
                const firstKey = keys[0];
                const email = data[firstKey].email;
                if (data && email) {
                    await signInWithEmailAndPassword(auth, email, password);
                    setUser(data[firstKey])
                    router.push("/(driver)");
                } else {
                    console.log("No matching user found");
                }

            } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Error logging you in. Please check side cart number or password.")
        } finally {
            console.log("Sign-in process completed");
        }
    };


    return (
        <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === "ios" ? "padding" : "position"}
        >
            <ScrollView>
                <SafeAreaView className="h-44 bg-orange-400 mt-10 items-center justify-center">
                    <Image
                        className='rounded-full h-28 w-28 border-2 border-gray-100'
                        source={require('@/assets/images/react-logo.png')}
                    />
                </SafeAreaView>
                <View className="flex flex-col item-center h-screen bg-slate-50 items-center gap-4">
                    <Text className="text-4xl font-semibold">Log in</Text>
                    <View className="grid justify-center items-center w-full mx-6 gap-4">
                        <TextInput
                            className="rounded-lg text-xl py-2 pl-2 w-3/4 border-2 border-gray-400"
                            onChangeText={setSideCartNumber}
                            value={sideCartNum}
                            placeholder="Sidecart No."
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
                        <Link href={"/forgotDriverPassword"}>
                            <Text className="text-orange-500">forgot password?</Text>
                        </Link>
                    </View>
                    <Pressable className="rounded-lg bg-orange-500 py-3 w-3/4 mt-4"
                        onPress={handleSignIn}>
                        <Text className='text-center text-xl text-gray-50'>Login</Text>
                    </Pressable>
                    {/* <View className="flex flex-row gap-2 w-3/5 justify-end">
                        <Text className="">Don't have an account?</Text>
                        <Link href={"/signUpDriver"} className="text-orange-500">Create</Link>
                    </View> */}
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}
