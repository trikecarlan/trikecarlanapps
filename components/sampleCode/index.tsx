import { Image, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import React from 'react';
import { Link } from 'expo-router';

export default function HomeScreen() {
    const database = getDatabase(app);
    const [updatedInfo, setUpdatedInfo] = React.useState()
    // create data
    function signUp() {
        const auth = getAuth(app);
        createUserWithEmailAndPassword(
            auth,
            "test1@gmail.com",
            "SuperSecretPassword!"
        )
            .then((userCredential) => {
                const uid = userCredential.user.uid;
                set(ref(database, 'users/' + uid), {
                    username: "test1@gmail.com",
                    email: "test1@gmail.com"
                })
                    .then((res) => console.log(res))
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    }
    // get updated value every data changes
    const userRef = ref(database, 'users/' + "6lGxTJWC8kRW5OSuph1R6W9Y8Wl2/" + "email");
    const updatedValue = () => onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUpdatedInfo(data)
        console.log(data)
    });

    // Read data once
    const dbRef = ref(getDatabase(app));
    const getOnce = () => get(child(dbRef, `users/${"6lGxTJWC8kRW5OSuph1R6W9Y8Wl2"}`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

    // write data
    function writeUserData() {
        const db = getDatabase();
        set(ref(db, 'users/' + "6lGxTJWC8kRW5OSuph1R6W9Y8Wl2"), {
            username: "test2@gmail.com",
            email: "test2.@example.com"
        });
    }

    const auth = getAuth(app);
    const handleSignOut = () => signOut(auth).then(() => {
        console.log("success logout")
    }).catch((error) => {
        console.log(error)
    });


    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, "test@gmail.com", "SuperSecretPassword!");
            console.log('Signed in user:', userCredential.user);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            console.log("false");
        }
    };

    // check if loged in
    const seeIfLogedIn = () => onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user.uid)
        } else {
            console.log(" User is signed out")
        }
    });

    // Alert.alert(
    //     "Title",
    //     "Message",
    //     [
    //       {
    //         text: "Cancel",
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel"
    //       },
    //       { text: "OK", onPress: () => console.log("OK Pressed") }
    //     ],
    //     { cancelable: false }
    //   );

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <TouchableOpacity style={styles.button_container} onPress={signUp}>
                    <Text style={styles.button_text}>SignUp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_container} onPress={updatedValue}>
                    <Text style={styles.button_text}>See Infos</Text>
                </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
                <TouchableOpacity style={styles.button_container} onPress={getOnce}>
                    <Text style={styles.button_text}>get once</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_container} onPress={writeUserData}>
                    <Text style={styles.button_text}>set user</Text>
                </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
                <TouchableOpacity style={styles.button_container} onPress={handleSignIn}>
                    <Text style={styles.button_text}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button_container} onPress={handleSignOut}>
                    <Text style={styles.button_text}>Log out</Text>
                </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.titleContainer}>
                <TouchableOpacity style={styles.button_container} onPress={seeIfLogedIn}>
                    <Text style={styles.button_text}>check Loged in</Text>
                </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText>
                    {updatedInfo}
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <Link href={"/"} className="flex-row w-3/5 justify-end">
                    <Text className="text-orange-500">Home</Text>
                </Link>
            </ThemedView>
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
    container: {
        flex: 1,
        justifyContent: "center",
        marginTop: 48,
    },
    text: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 24,
    },
    button_text: {
        textAlign: "center",
        fontSize: 24,
        color: "#1976d2"
    },
    button_container: {
        borderRadius: 15,
        flexDirection: "row",
        margin: 16,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#e6e6e6"
    },
});
