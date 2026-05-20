import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { fetchTransactions, removeTransaction } from './transactionsSlice';
import { useDebounce } from '../../hooks/useDebounce';

const TransactionsScreen = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(state => state.transactions);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const onRefresh = () => {
    dispatch(fetchTransactions());
  };

  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return items;
    return items.filter(tx => 
      tx.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      tx.category.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [items, debouncedSearch]);

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.searchBar} 
        placeholder="Search transactions..." 
        value={search}
        onChangeText={setSearch}
      />
      {status === 'loading' && items.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={status === 'loading'} onRefresh={onRefresh} />
          }
          initialNumToRender={15}
          maxToRenderPerBatch={20}
          windowSize={10}
          ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
          renderItem={({ item }) => (
            <View style={styles.txItem}>
              <View style={styles.txInfo}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <View style={styles.txActions}>
                <Text style={styles.amount}>${Number(item.amount).toFixed(2)}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => dispatch(removeTransaction(item.id))}
                >
                  <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F3F4F6' },
  searchBar: { height: 48, borderColor: '#E5E7EB', borderWidth: 1, marginBottom: 16, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#fff', fontSize: 16, color: '#111827', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  txItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#fff', marginBottom: 12, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  txInfo: { flex: 1, paddingRight: 8 },
  txActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  description: { fontSize: 16, fontWeight: '700', color: '#111827' },
  category: { fontSize: 13, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  amount: { fontWeight: '800', fontSize: 17, color: '#EF4444' },
  deleteButton: { backgroundColor: '#FEE2E2', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  deleteText: { color: '#EF4444', fontWeight: '800', fontSize: 14 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#9CA3AF', fontSize: 16, fontStyle: 'italic' }
});

export default TransactionsScreen;
