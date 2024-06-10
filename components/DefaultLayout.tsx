
import React from 'react';
import { KeyboardAvoidingView, Platform, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';


interface DefaultLayoutProps {
    children: React.ReactNode;
}


export default function DefaultLayout({ children }: DefaultLayoutProps) {

    return (
        <KeyboardAvoidingView
            className='flex flex-col h-screen bg-white'
            behavior={Platform.OS === "ios" ? "padding" : "position"}
        >
            <ScrollView>
                <View>
                    {children}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


