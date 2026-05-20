import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { addTransaction, saveTransactionsOffline } from '../transactions/transactionsSlice';
import { useNavigation } from '@react-navigation/native';

export const CATEGORIES = ['Food', 'Shopping', 'Transport', 'Bills', 'Health', 'Entertainment', 'Other'];

const AddExpenseScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const txs = useAppSelector(state => state.transactions.items);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSave = () => {
    if (!amount || !description) {
      Alert.alert('Error', 'Please enter an amount and a description.');
      return;
    }
    
    if (isNaN(Number(amount))) {
      Alert.alert('Error', 'Amount must be a valid number.');
      return;
    }

    const newTx = {
      id: Math.random().toString(),
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString()
    };
    
    dispatch(addTransaction(newTx));
    dispatch(saveTransactionsOffline([newTx, ...txs]));
    
    // Reset form and go back to dashboard
    setAmount('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Amount ($)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          placeholder="0.00"
          value={amount} 
          onChangeText={setAmount} 
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={styles.input} 
          placeholder="What was this for?"
          value={description} 
          onChangeText={setDescription} 
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipContainer}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 16 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  label: { fontSize: 15, fontWeight: '700', color: '#374151', marginTop: 20, marginBottom: 10, letterSpacing: 0.3 },
  input: { height: 54, backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', borderWidth: 1, paddingHorizontal: 16, borderRadius: 12, fontSize: 16, color: '#111827' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  chip: { paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#F3F4F6', borderRadius: 25, marginRight: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { color: '#6B7280', fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: '#fff' },
  saveButton: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 40, shadowColor: '#10B981', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 }
});

export default AddExpenseScreen;
