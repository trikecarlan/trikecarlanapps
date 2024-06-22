import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { onAuthStateChanged } from 'firebase/auth';
import { app, auth } from '@/firebaseConfig';
import { child, get, getDatabase, ref } from 'firebase/database';
import { useStoreDriver, useStoreUser } from '@/hooks/useStore';

export default function HomeScreen() {
    const [userUid, setuserUid] = React.useState('')
    const dbRef = ref(getDatabase(app));
    const router = useRouter()
    
    const { user, setUser, updateUser } = useStoreUser();
    const { driver, setDriver, updateDriver } = useStoreDriver();

    const seeIfLogedIn = () => onAuthStateChanged(auth, (user) => {
        if (user) {
            setuserUid(user.uid)
        }
    });

    const getOnce = () => get(child(dbRef, `users/${userUid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            if (snapshot.val().role === "driver") {
                setUser(snapshot.val())
                router.push("/(driver)")
            } else if (snapshot.val().role === "user") {
                setUser(snapshot.val())
                router.push("/(tabs)")
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });


    React.useEffect(() => {
        seeIfLogedIn()
    }, [])

    React.useEffect(() => {
        getOnce()
    }, [userUid])


    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#F2722B', dark: '#F2722B' }}
            headerImage={
                <Image
                    className='rounded-full h-28 w-28 border-2 border-gray-100'
                    source={require('@/assets/images/react-logo.png')}
                />
            }>
            <View className="flex flex-col items-center bg-gray-100 h-screen gap-4">
                <Link className="text-center py-4 rounded-xl w-3/4 bg-orange-600 text-white text-2xl"
                    href="/signInPassenger">
                    <ThemedText type="button">Passenger</ThemedText>
                </Link>
                <Link className="text-center py-4 rounded-xl w-3/4 bg-orange-600 text-white text-2xl"
                    href="/signInDriver">
                    <ThemedText type="button">Driver</ThemedText>
                </Link>
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
