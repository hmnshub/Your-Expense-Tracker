import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../../app/store/hooks';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { items } = useAppSelector(state => state.transactions);

  const { totalSpending, categoryTotals, recentTransactions } = useMemo(() => {
    let total = 0;
    const categories: Record<string, number> = {};
    
    items.forEach(tx => {
      total += Number(tx.amount);
      categories[tx.category] = (categories[tx.category] || 0) + Number(tx.amount);
    });

    // Top 3 spending categories
    const sortedCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      totalSpending: total,
      categoryTotals: sortedCategories,
      recentTransactions: items.slice(0, 5) // Recent 5
    };
  }, [items]);

  return (
    <ScrollView style={styles.container}>
      {/* Visual Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Total Spending</Text>
        <Text style={styles.totalAmount}>${totalSpending.toFixed(2)}</Text>
        <Text style={styles.insightText}>Keep it up! You are on track this month.</Text>
      </View>

      {/* Floating Action Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Add Expense')}
        >
          <Text style={styles.buttonText}>+ Quick Add</Text>
        </TouchableOpacity>
      </View>

      {/* Spending by Category Widget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Categories</Text>
        {categoryTotals.length > 0 ? categoryTotals.map(([cat, amount]) => (
          <View key={cat} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{cat}</Text>
            <Text style={styles.categoryAmount}>${amount.toFixed(2)}</Text>
          </View>
        )) : <Text style={styles.emptyText}>No data yet.</Text>}
      </View>

      {/* Recent Transactions Widget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.length > 0 ? recentTransactions.map(tx => (
          <View key={tx.id} style={styles.txRow}>
            <View>
              <Text style={styles.txDesc}>{tx.description}</Text>
              <Text style={styles.txCat}>{tx.category}</Text>
            </View>
            <Text style={styles.txAmount}>${Number(tx.amount).toFixed(2)}</Text>
          </View>
        )) : <Text style={styles.emptyText}>No recent transactions.</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerCard: { backgroundColor: '#111827', padding: 24, paddingVertical: 44, alignItems: 'center', borderBottomLeftRadius: 36, borderBottomRightRadius: 36, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  headerTitle: { color: '#9CA3AF', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700' },
  totalAmount: { color: '#ffffff', fontSize: 48, fontWeight: '800', marginVertical: 10, letterSpacing: -1 },
  insightText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  actionContainer: { alignItems: 'center', marginTop: -26 },
  primaryButton: { backgroundColor: '#10B981', paddingHorizontal: 36, paddingVertical: 16, borderRadius: 30, shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  section: { padding: 22, backgroundColor: '#fff', marginHorizontal: 16, marginTop: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 14, elevation: 3, marginBottom: 8 },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginBottom: 18, color: '#111827' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  categoryName: { fontSize: 16, color: '#4B5563', fontWeight: '600' },
  categoryAmount: { fontSize: 16, fontWeight: '800', color: '#111827' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  txDesc: { fontSize: 16, fontWeight: '700', color: '#111827' },
  txCat: { fontSize: 13, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },
  txAmount: { fontSize: 16, fontWeight: '800', color: '#111827' },
  emptyText: { color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', marginVertical: 10 }
});

export default DashboardScreen;
