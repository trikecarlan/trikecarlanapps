import React from 'react';
import { View, Text, Pressable, TextInput, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import ReportModalForm from './ReportModalForm';

export interface IClose {
    setopenReportModal: (value: React.SetStateAction<boolean>) => void
    openReportModal?: boolean;
}

const ReportModal = ({ setopenReportModal, openReportModal }: IClose) => {
    const translateY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .runOnJS(true)
        .onUpdate((event) => {
            translateY.value = event.translationY;

        }).onEnd((e) => {
            if (translateY.value > 200) {
                setopenReportModal(false)
            } else {
                translateY.value = withSpring(0);
            }
        })


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[{
                position: 'absolute',
                bottom: -130,
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
                    <ReportModalForm openReportModal={openReportModal} setopenReportModal={setopenReportModal} />
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

export default ReportModal;
