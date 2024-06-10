import React from 'react';
import MenuLayout from '@/components/MenuLayout';
import { Image, View } from 'react-native';
import Svg, { RadialGradient, Defs, Stop, Circle } from 'react-native-svg';

export default function Map() {
    return (
        <MenuLayout>
            <View className='relative'>
                <View className='absolute top-52 left-20 w-12 h-12 rounded-full z-50'>
                    <Svg width="100%" height="100%" viewBox="0 0 100 100">
                        <Defs>
                            <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                <Stop offset="0%" stopColor="#FF0000" />
                                <Stop offset="50%" stopColor="#FFFF00" />
                                <Stop offset="75%" stopColor="#90EE90" />
                                <Stop offset="100%" stopColor="#51AFF7" />
                            </RadialGradient>
                        </Defs>
                        <Circle cx="50" cy="50" r="50" fill="url(#grad)" />
                    </Svg>
                </View>
                <View className='items-center w-full'>
                    <Image
                        className='z-10 w-11/12 h-96'
                        source={require('@/assets/map.png')}
                    />
                </View>
            </View>
        </MenuLayout>
    );
}
