import { Image, Text, SafeAreaView, View, TextInput, Pressable, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/firebaseConfig';
import { Link, useRouter } from 'expo-router';
import { getDatabase, ref, set } from 'firebase/database';
import ScrollView from '@/components/ScrollView';
import DefaultLayout from '@/components/DefaultLayout';


export default function SignUpPassenger() {
    const [password, setPassword] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [fName, setFName] = React.useState('');
    const [lName, setLname] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [birthday, setbirthDay] = React.useState('');
    const [gender, setgender] = React.useState('');

    const database = getDatabase(app);
    const router = useRouter()

    async function signUp() {
        try {
            const auth = getAuth(app);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await set(ref(database, 'users/' + uid), {
                email: email,
                firstName: fName,
                lastName: lName,
                phoneNumber: phoneNumber,
                birthDay: birthday,
                gender: gender,
                address: address,
                role: 'user',
                uid: uid
            });
            const testUserCredential = await signInWithEmailAndPassword(auth, email, password);
            if (testUserCredential) {
                router.push("/(tabs)");
            }
        } catch (error) {
            alert('Email is already in use. Please use a different email.');
        }
    }


    return (
        <DefaultLayout>
            <ScrollView>
                <View>
                    <SafeAreaView className="h-40 bg-orange-400 mt-10 items-center justify-center">
                        <Image
                            className='rounded-full h-28 w-28 border-2 border-gray-100'
                            source={require('@/assets/images/react-logo.png')}
                        />
                    </SafeAreaView>
                    <View className="flex flex-col h-max bg-gray-50 items-center gap-4">
                        <Text className="text-4xl font-semibold">Sign Up</Text>
                        <View className="flex flex-col items-center bg-gray-50 mb-10 w-full gap-2">
                            <TextInput
                                className="rounded-lg text-xl py-1 pl-2 w-3/4 border-2 border-gray-400"
                                onChangeText={setEmail}
                                value={email}
                                placeholder="Email"
                                keyboardType='email-address'
                            />
                            <View className='flex flex-row px-4 gap-1'>
                                <TextInput
                                    className="rounded-lg text-xl w-5/12 py-1 pl-2 border-2 border-gray-400"
                                    onChangeText={setFName}
                                    value={fName}
                                    placeholder="First Name"
                                />
                                <TextInput
                                    className="rounded-lg text-xl w-5/12 py-1 pl-2 border-2 border-gray-400"
                                    onChangeText={setLname}
                                    value={lName}
                                    placeholder="Last Name"
                                />
                            </View>
                            <TextInput
                                className="rounded-lg text-xl py-1 pl-2 w-3/4 border-2 border-gray-400"
                                onChangeText={setPhoneNumber}
                                value={phoneNumber}
                                placeholder="Phone Number"
                                keyboardType='phone-pad'
                            />
                            <TextInput
                                className="rounded-lg text-xl py-1 pl-2 w-3/4 border-2 border-gray-400"
                                onChangeText={setgender}
                                value={gender}
                                placeholder="Gender"
                            />
                            <TextInput
                                className="rounded-lg text-xl py-1 pl-2 w-3/4 border-2 border-gray-400"
                                onChangeText={setbirthDay}
                                value={birthday}
                                placeholder="Birthday"
                                dataDetectorTypes='calendarEvent'
                            />
                            <TextInput
                                className="rounded-lg text-xl py-1 pl-2 w-3/4 border-2 border-gray-400"
                                onChangeText={setAddress}
                                value={address}
                                placeholder="Address"
                            />
                            <TextInput
                                className="rounded-lg text-xl py-1 pl-2 w-3/4 border-2 border-gray-400"
                                onChangeText={setPassword}
                                value={password}
                                placeholder="Password"
                                secureTextEntry={true}
                            />
                            <Pressable className="rounded-lg bg-orange-500 py-3 w-3/4 mt-4"
                                onPress={signUp}>
                                <Text className='text-center text-xl text-gray-50'>Sign Up</Text>
                            </Pressable>
                            <View className="flex flex-row gap-2 w-3/5 justify-end">
                                <Text className="">Already have an account?</Text>
                                <Link href={"/signInDriver"} className="text-orange-500">Log in</Link>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </DefaultLayout>
    );
}
