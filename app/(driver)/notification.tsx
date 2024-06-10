import React from 'react';
import { StyleSheet, Image, Platform, View, Text, Pressable } from 'react-native';
import { getDatabase, onValue, ref } from "firebase/database";
import { getDownloadURL, getStorage, ref as refStorage } from "firebase/storage";

import MenuLayout from '@/components/MenuLayout';
import { app } from '@/firebaseConfig';
import { useStoreUser } from '@/hooks/useStore';
import { Ionicons } from '@expo/vector-icons';

interface RatingDataItem {
  dateCreated: string;
  driver: string;
  feedback: string;
  profile: string;
  rating: number;
  toda: string;
  user: string;
}

interface ReportDataItem {
  address: string;
  dateCreated: string;
  dateOfIncident: string;
  images: string[];
  phoneNumber: string;
  reportType: string;
  sideCartNumber: string;
  signature: string;
  type: string;
}

interface ReportData {
  [key: string]: {
    [key: string]: ReportDataItem;
  };
}

const maskUserName = (userName: string) => {
  if (!userName) return '';
  return userName.split(' ').map(word => {
    if (word.length <= 2) return word;
    const firstChar = word.charAt(0);
    const lastChar = word.charAt(word.length - 1);
    const maskedMiddle = '*'.repeat(word.length - 2);
    return `${firstChar}${maskedMiddle}${lastChar}`;
  }).join(' ');
};

export default function notification() {
  const database = getDatabase(app);
  const { user } = useStoreUser();
  const [ratings, setRatings] = React.useState<RatingDataItem[]>([]);
  const [reports, setReports] = React.useState<ReportDataItem[]>([]);
  const [ratingData, setRatingData] = React.useState<RatingDataItem | null>(null);
  const [reportData, setReportData] = React.useState<ReportDataItem | null>(null);
  const [tab, setTab] = React.useState("FEEDBACK");
  const ratingsRef = ref(database, `ratings/${user.sideCartNumber}`);
  const reportsRef = ref(database, `reports/${user.sideCartNumber}`);

  React.useEffect(() => {
    const fetchRatings = onValue(ratingsRef, (snapshot) => {
      const data = snapshot.val();
      setRatings(data ? Object.values(data) : []);
    });
    const fetchReport = onValue(reportsRef, (snapshot) => {
      const data = snapshot.val() as ReportData;
      if (data) {
        const reportsArray = Object.values(data).flatMap(reportGroup => Object.values(reportGroup)) as ReportDataItem[];
        setReports(reportsArray);
      }
    });

    return () => {
      fetchRatings();
      fetchReport();
    };
  }, []);

  return (
    <MenuLayout>
      <View className='relative items-center h-screen'>
        <View className='flex flex-row items-center justify-center h-16 w-full'>
          <Pressable onPress={() => setTab("FEEDBACK")} className=' flex flex-row justify-center text-xl w-1/2'>
            <Text className={`text-lg ${tab === "FEEDBACK" ? "border-b-4 text-orange-500 border-orange-500 px-2" : ""}`}>FEEDBACK</Text>
          </Pressable>
          <Pressable onPress={() => setTab("REPORT")} className='flex flex-row justify-center text-xl w-1/2'>
            <Text className={`text-lg ${tab === "REPORT" ? "border-b-4 text-orange-500 border-orange-500 px-2" : ""}`}>REPORT</Text>
          </Pressable>
        </View>
        {reportData &&
          <View className='absolute z-10 top-[20%] w-full items-center'>
            <View className='w-full z-10 items-end'>
              <Pressable onPress={() => setReportData(null)} className='top-4 rounded-full bg-orange-600 -left-1'>
                <Ionicons size={30} color={"white"} name='close' />
              </Pressable>
            </View>
            <View className='bg-gray-300 p-6 w-11/12 rounded-xl'>
              <View className='flex flex-col gap-2'>
                <Text className='text-xl'>Report of Alleged Incident</Text>
                <Text>{reportData.dateOfIncident}</Text>
                <Text>Greetings, {user?.firstName} {user?.lastName}. A passenger has complained to you about an incident involving {reportData.reportType}. This is a warning from the Nagcarlan Committee of Transportation Department, and the next punishment you might face is that you could be fined and summoned prior to the Municipality.</Text>
              </View>
            </View>
          </View>
        }
        {ratingData &&
          <View className='absolute z-10 top-[20%] w-full items-center'>
            <View className='w-full z-10 items-end'>
              <Pressable onPress={() => setRatingData(null)} className='top-4 rounded-full bg-orange-600 -left-1'>
                <Ionicons size={30} color={"white"} name='close' />
              </Pressable>
            </View>
            <View className='bg-gray-300 p-6 w-11/12 rounded-xl'>
              <View className='flex flex-row justify-between'>
                <Text>{maskUserName(ratingData.user)}</Text>
                <View className="flex flex-row gap-1">
                  {[1, 2, 3, 4, 5].map((value, index) => (
                    <View key={index}>
                      <Ionicons
                        size={20}
                        name="star"
                        color={value <= ratingData.rating ? "#FFD233" : "#C0C0C0"}
                      />
                    </View>
                  ))}
                </View>
              </View>
              <View className='flex flex-col gap-1 mt-4'>
                <Text className='pl-1'>Feedback</Text>
                <Text className={`bg-gray-50 rounded-xl p-4 ${ratingData.feedback.length < 200 ? "h-32" : "h-max pb-10"}`}>{ratingData.feedback}</Text>
              </View>
            </View>
          </View>
        }
        <View>
          {tab === "FEEDBACK" && (
            <View className='w-full items-center'>
              {ratings.map((item: RatingDataItem, index) => (
                <View className='flex flex-row items-center py-4 border-b-2 border-gray-300 justify-between w-10/12' key={index}>
                  <View className='flex flex-col gap-1'>
                    <Text>Name: {maskUserName(item.user)}</Text>
                    <View className='flex flex-row'>
                      {[1, 2, 3, 4, 5].map((value, index) => (
                        <View key={index}>
                          <Ionicons
                            size={20}
                            name="star"
                            color={value <= item.rating ? "#FFD233" : "#C0C0C0"}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                  <Pressable className='bg-orange-500 px-2 rounded-lg py-1' onPress={() => setRatingData(item)}>
                    <Text className='text-white'>View Feedback</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {tab === "REPORT" && (
            <View className='flex flex-col'>
              {reports.map((report: ReportDataItem, index) => (
                <View className='flex border-b-2 border-gray-300 py-4 flex-row justify-between items-center gap-4' key={index}>
                  <Text>Report of Alleged Incident</Text>
                  <Pressable className='bg-orange-500 px-2 rounded-lg py-1' onPress={() => setReportData(report)}>
                    <Text className='text-white'>View Feedback</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </MenuLayout>
  );
}
