import { Image, Text, View } from "react-native";
import { getDatabase, onValue, ref } from "firebase/database";
import React from "react";
import TabLayout from "@/components/TabLayout";
import { useRouter } from "expo-router";
import { app, auth } from "@/firebaseConfig";
import { useStoreUser } from "@/hooks/useStore";
import { onAuthStateChanged } from "firebase/auth";

interface ReportData {
    address: string;
    dateCreated: string;
    dateOfIncident: string;
    images: string[];
    phoneNumber: string;
    reportType: string;
    sideCartNumber: string;
    signature: string;
    status: string;
}

interface Reports {
    [key: string]: {
        [userId: string]: {
            [timestamp: string]: ReportData;
        };
    };
}

export default function MyReport() {

    const database = getDatabase(app);
    const [reports, setReports] = React.useState<Reports | null>(null);
    const [userUid, setuserUid] = React.useState("");
    const [userHasReports, setUserHasReports] = React.useState(false);
    const { user } = useStoreUser();

    React.useEffect(() => {
        seeIfLogedIn()
    }, [])

    const router = useRouter()

    const seeIfLogedIn = () => onAuthStateChanged(auth, (user) => {
        if (user) {
            setuserUid(user.uid)
        } else {
            router.push("/")
        }
    });

    const userRef = ref(database, `reports`);

    React.useEffect(() => {
        const fetchReports = onValue(userRef, (snapshot) => {
            const data = snapshot.val() as Reports;
            setReports(data);
            if (data) {
                const userReportsExist = Object.values(data).some(userReports =>
                    userUid in userReports
                );
                setUserHasReports(userReportsExist);
            } else {
                setUserHasReports(false);
            }
        });

        return () => {
            fetchReports();
        };
    }, [userUid]);

    return (
        <TabLayout route="(tabs)/report" title="My Report">
            <View className="flex flex-col pt-6 ml-4 mb-20">
                {userHasReports ? (
                    reports && Object.entries(reports).map(([key, userReports]) => (
                        Object.entries(userReports).map(([uid, reportsByDate]) => (
                            uid === userUid &&
                            Object.entries(reportsByDate).map(([timestamp, reportData]) => (
                                <View key={timestamp} className="flex flex-row pt-4 border-b-2 w-full border-b-gray-300 pb-4 gap-3 items-center">
                                    <Image
                                        className='border-2 h-20 w-20 border-gray-100'
                                        source={{ uri: reportData.images[0] }}
                                    />
                                    <View className="w-full">
                                        <Text className={`${reportData.status === "Pending" ? "bg-yellow-500 " : reportData.status === "Processing" ? "bg-indigo-600" : "bg-green-500"} w-2/5 text-center mb-2 text-white p-2`}>{reportData.status ? reportData.status : "PENDING"}</Text>
                                        <Text>{reportData.dateOfIncident}</Text>
                                        <Text>{reportData.reportType}</Text>
                                    </View>
                                </View>
                            ))
                        ))
                    ))
                ) : (
                    <View className="justify-center items-center">
                        <Text>You didn't report any incident.</Text>
                    </View>
                )}
            </View>
        </TabLayout>
    );
}
