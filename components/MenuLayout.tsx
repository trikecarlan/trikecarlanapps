
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, View, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import { useRouter } from 'expo-router';
import { useStoreUser } from '@/hooks/useStore';


interface MenuLayoutProps {
    children: React.ReactNode;
    title?: string;
}


export default function MenuLayout({ children, title }: MenuLayoutProps) {
    const [openMenu, setOpenMenu] = React.useState(false)
    const [userUid, setuserUid] = React.useState('')
    const { user, updateUser, setUser } = useStoreUser()
    const [profile, setprofile] = React.useState<string>();

    const storage = getStorage();
    const router = useRouter()

    const seeIfLogedIn = () => onAuthStateChanged(auth, (user) => {
        if (user) {
            setuserUid(user.uid)
        } else {
            router.push("/")
        }
    });

    React.useEffect(() => {
        seeIfLogedIn()
    }, [])

    const handleChangeProfile = () => {
        router.push("/screens/changeProfile")
    }

    const handleSignOut = () => signOut(auth).then(() => {
        router.push("/")
    }).catch((error) => {
        console.log(error)
    });

    const getImage = () => getDownloadURL(ref(storage, `images/${user.email}`))
        .then((url) => {
            setprofile(url)
        })
        .catch((error) => {
            console.log(error);
        });

    React.useEffect(() => {
        getImage()
    }, [])

    return (
        <KeyboardAvoidingView
            className='flex flex-col h-screen bg-white'
            behavior={Platform.OS === "ios" ? "padding" : "position"}
        >
            <ScrollView>
                <StatusBar hidden={true} />
                {!openMenu ?
                    <SafeAreaView className='h-max m-1 ralative border-b-4 border-gray-300 '>
                        <Pressable onPress={() => setOpenMenu(!openMenu)}>
                            <Ionicons size={40} name="menu-outline" color={"#F2722B"} />
                        </Pressable>
                        <View className='w-full absolute right-0 top-0 h-max m-1 items-center'>
                            <Text className='text-2xl'>{title}</Text>
                        </View>
                    </SafeAreaView>
                    :
                    <View className='flex flex-row w-full'>
                        <View className='w-3/4 h-screen bg-gray-100 border-r-2 border-gray-400'>
                            <View className="h-52 bg-[#F2722B] border-b-2 border-gray-400 py-20 gap-2 items-center justify-center">
                                <Pressable onPress={handleChangeProfile}>
                                    {profile ?
                                        <Image
                                            className='rounded-full h-28 w-28 border-2 border-gray-100'
                                            source={{ uri: profile }}
                                        />
                                        :
                                        <Image
                                            className='rounded-full h-28 w-28 border-2 border-gray-100'
                                            source={require('@/assets/profiles/blankProfile.png')}
                                        />
                                    }
                                </Pressable>
                                <Text className='text-gray-100'>{user?.firstName} {user?.lastName}</Text>
                                {user?.role === "driver" ?
                                    <Text className='text-gray-100'>Side Cart No: {user.sideCartNumber}</Text> :
                                    <Text className='text-gray-100'>ID: {userUid.slice(20)}</Text>
                                }
                            </View>
                            <View className='m-6'>
                                <Pressable className='flex my-2 items-center flex-row gap-3'>
                                    <Ionicons size={20} name="person-outline" />
                                    <Text>My Profile</Text>
                                </Pressable>
                                <Pressable className='flex my-2 items-center flex-row gap-3'>
                                    <Ionicons size={20} name="settings-outline" />
                                    <Text>Settings</Text>
                                </Pressable>
                                <Pressable onPress={handleSignOut} className='flex my-2 items-center flex-row gap-3'>
                                    <Ionicons size={20} name="log-out-outline" />
                                    <Text>Logout</Text>
                                </Pressable>
                            </View>
                        </View>
                        <Pressable className='w-full bg-transparent' onPress={() => setOpenMenu(!openMenu)}>
                        </Pressable>
                    </View>
                }
                <View>
                    {children}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


