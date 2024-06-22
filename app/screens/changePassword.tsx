import TabLayout from '@/components/TabLayout';
import { app } from '@/firebaseConfig';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert } from 'react-native';

export default function App() {
    const [currentEmail, setCurrentEmail] = useState('');

    const handleChangeEmail = async () => {
        try {
            const auth = await getAuth(app);
            await sendPasswordResetEmail(auth, currentEmail);
            alert("Sent successfully! PLease check your email inbox or in your spam messages.");
        } catch (error) {
            console.log(error);
            alert("Failed to send.");
        }
    };


    return (
        <TabLayout route="(tabs)" title='Update Email'>
            <View className="flex-1 justify-center p-4">
                <Text className="text-lg mb-2">Email:</Text>
                <TextInput
                    className="h-10 border border-gray-400 mb-3 p-2"
                    value={currentEmail}
                    onChangeText={setCurrentEmail}
                    placeholder="Enter your email"
                />
                <Text className="text-lg mb-2">Password:</Text>
                <Button title="Send Link" onPress={handleChangeEmail} />
            </View>
        </TabLayout>
    );
}
