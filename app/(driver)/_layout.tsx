import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F2722B",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'RANKINGS',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={'bar-chart'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'NOTIFICATION',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={"notifications"}
              className={`${focused ? 'text-orange-700' : 'text-gray-400'}`}
              color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
