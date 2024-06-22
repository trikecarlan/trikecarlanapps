import TabLayout from '@/components/TabLayout';
import { app } from '@/firebaseConfig';
import { EmailAuthProvider, UserCredential, getAuth, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import { getDatabase, ref, set, update } from 'firebase/database';
import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert } from 'react-native';

export default function App() {
    const [currentEmail, setCurrentEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const database = getDatabase(app);

    const handleChangeEmail = async () => {
        try {
            const auth = await getAuth(app);
            const user: any = auth.currentUser;

            if (user.email === newEmail) {
                alert("The new email address cannot be the same as the current email address.");
                return;
            }
            const credential = EmailAuthProvider.credential(currentEmail, password);
            const authenticated: UserCredential = await reauthenticateWithCredential(user, credential);
            await updateEmail(user, newEmail);
            await update(ref(database, 'users/' + authenticated.user.uid), {
                email: newEmail,
            });
            alert("Email updated successfully!");
        } catch (error) {
            console.log(error);
            alert("Failed to update email. Please check your credentials and try again.");
        }
    };


    return (
        <TabLayout route="(tabs)" title='Update Email'>
            <View className="flex-1 justify-center p-4">
                <Text className="text-lg mb-2">Current Email:</Text>
                <TextInput
                    className="h-10 border border-gray-400 mb-3 p-2"
                    value={currentEmail}
                    onChangeText={setCurrentEmail}
                    placeholder="Enter your current email"
                />
                <Text className="text-lg mb-2">Password:</Text>
                <TextInput
                    className="h-10 border border-gray-400 mb-3 p-2"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                />
                <Text className="text-lg mb-2">New Email:</Text>
                <TextInput
                    className="h-10 border border-gray-400 mb-3 p-2"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    placeholder="Enter your new email"
                />
                <Button title="Change Email" onPress={handleChangeEmail} />
            </View>
        </TabLayout>
    );
}
