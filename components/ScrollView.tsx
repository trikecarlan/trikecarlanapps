import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, {
    useAnimatedRef,
    useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';


export default function ScrollView({
    children
}: any) {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    return (
        <ThemedView style={styles.container}>
            <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
                <ThemedView>{children}</ThemedView>
            </Animated.ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
