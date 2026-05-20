import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../../features/dashboard/DashboardScreen';
import TransactionsScreen from '../../features/transactions/TransactionsScreen';
import AddExpenseScreen from '../../features/expense/AddExpenseScreen';

const Tab = createBottomTabNavigator();

const IconWrapper = ({ children, bg }: { children: React.ReactNode; bg: string }) => (
  <View style={[styles.iconWrapper, { backgroundColor: bg }]}>{children}</View>
);

const DashboardIcon = ({ focused }: { focused: boolean }) => (
  <IconWrapper bg={focused ? '#111827' : '#F3F4F6'}>
    <View style={styles.dashboardBars}>
      <View style={[styles.bar, { height: 10, backgroundColor: focused ? '#FFFFFF' : '#9CA3AF' }]} />
      <View style={[styles.bar, { height: 16, backgroundColor: focused ? '#FFFFFF' : '#9CA3AF' }]} />
      <View style={[styles.bar, { height: 22, backgroundColor: focused ? '#FFFFFF' : '#9CA3AF' }]} />
    </View>
  </IconWrapper>
);

const TransactionsIcon = ({ focused }: { focused: boolean }) => (
  <IconWrapper bg={focused ? '#111827' : '#F9FAFB'}>
    <View style={styles.listIcon}>
      <View style={[styles.listLine, { width: 18, backgroundColor: focused ? '#FFFFFF' : '#9CA3AF' }]} />
      <View style={[styles.listLine, { width: 14, backgroundColor: focused ? '#E5E7EB' : '#D1D5DB' }]} />
      <View style={[styles.listLine, { width: 10, backgroundColor: focused ? '#D1D5DB' : '#D1D5DB' }]} />
    </View>
  </IconWrapper>
);

const AddIcon = ({ focused }: { focused: boolean }) => (
  <IconWrapper bg={focused ? '#111827' : '#F3F4F6'}>
    <View style={styles.plusContainer}>
      <View style={[styles.plusBar, { backgroundColor: focused ? '#FFFFFF' : '#9CA3AF' }]} />
      <View style={[styles.plusBarVertical, { backgroundColor: focused ? '#FFFFFF' : '#9CA3AF' }]} />
    </View>
  </IconWrapper>
);

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarShowLabel: false,
        tabBarStyle: { height: 60, paddingBottom: 0, borderTopColor: '#F3F4F6', elevation: 0, shadowOpacity: 0 },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => <DashboardIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TransactionsIcon focused={focused} />,
          title: 'All Transactions',
        }}
      />
      <Tab.Screen
        name="Add Expense"
        component={AddExpenseScreen}
        options={{
          tabBarIcon: ({ focused }) => <AddIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', width: 28 },
  bar: { width: 4, marginHorizontal: 2, borderRadius: 2 },
  listIcon: { alignItems: 'center', justifyContent: 'center' },
  listLine: { height: 3, borderRadius: 2, marginVertical: 2 },
  plusContainer: { alignItems: 'center', justifyContent: 'center' },
  plusBar: { position: 'absolute', width: 18, height: 3, borderRadius: 2 },
  plusBarVertical: { position: 'absolute', height: 18, width: 3, borderRadius: 2 },
  iconWithLabel: { alignItems: 'center', justifyContent: 'center' },
  iconLabel: { fontSize: 12, marginTop: 6, fontWeight: '600' },
});

export default RootNavigator;
