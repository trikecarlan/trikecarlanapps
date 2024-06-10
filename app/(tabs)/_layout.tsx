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
          title: 'MAP',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon size={25} name={focused ? 'map' : 'map-outline'}
              className={`${focused ? 'text-orange-600' : 'text-gray-400'}`}
              color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rate"
        options={{
          title: 'RATE',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon size={18} name={focused ? 'star' : 'star-outline'}
              className={`${focused ? 'bg-orange-700 text-gray-100' : 'bg-gray-400'} p-1 rounded-full`}
              color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'REPORT',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon size={30} name={'warning'}
              className={`${focused ? 'text-orange-700' : 'text-gray-400'}`}
              color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          title: 'RANKINGS',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon size={20} name={focused ? 'bar-chart' : 'bar-chart-outline'}
              className={`${focused ? 'text-orange-700' : 'text-gray-400'}`}
              color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
