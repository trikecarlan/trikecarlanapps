import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import ReportIncidentModalForm from '@/components/ReportIncidentModalForm';
import * as ImagePicker from 'expo-image-picker';

export interface IReportData {
    setopenReportModal: React.Dispatch<React.SetStateAction<boolean>>;
    openReportModal?: boolean;
    dateCreated: Date;
    address: string;
    signature: ImagePicker.ImagePickerAsset | null;
    images: ImagePicker.ImagePickerAsset[];
    phoneNumber: string;
    dateOfIncident: string;
    sideCartNumber: string;
    reportType: string;
    type: string;
}

const SubmitReportIncident = ({
    setopenReportModal,
    openReportModal,
    dateCreated,
    address,
    signature,
    images,
    phoneNumber,
    dateOfIncident,
    sideCartNumber,
    reportType,
    type,
}: IReportData) => {
    console.log("Received images in SubmitReportIncident:", images);
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .runOnJS(true)
        .onUpdate((event) => {
            translateY.value = event.translationY;
        }).onEnd(() => {
            if (translateY.value > 100) {
                setopenReportModal(false);
            } else {
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: '#F4F4F4',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderLeftWidth: 2,
                borderRightWidth: 2,
                borderTopWidth: 8,
                borderColor: 'gray',
            }, animatedStyle]}>
                <View className='p-4'>
                    <ReportIncidentModalForm
                        setopenReportModal={setopenReportModal}
                        openReportModal={openReportModal}
                        dateCreated={dateCreated}
                        address={address}
                        signature={signature}
                        images={images}
                        phoneNumber={phoneNumber}
                        dateOfIncident={dateOfIncident}
                        sideCartNumber={sideCartNumber}
                        reportType={reportType}
                        type={type} />
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

export default SubmitReportIncident;
