import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TransactionsState {
  items: Transaction[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    // Requirements: "A large list of data loaded from a public API"
    const response = await fetch('https://dummyjson.com/carts');
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    const data = await response.json();
    return data.carts.flatMap((cart: any) => 
      cart.products.map((product: any) => ({
        id: Math.random().toString(),
        amount: product.price,
        category: 'Shopping', // Default mock category
        date: new Date().toISOString(),
        description: product.title,
      }))
    );
  }
);

export const saveTransactionsOffline = createAsyncThunk(
  'transactions/saveOffline',
  async (transactions: Transaction[]) => {
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  }
);

export const loadOfflineTransactions = createAsyncThunk(
  'transactions/loadOffline',
  async () => {
    const data = await AsyncStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.unshift(action.payload);
      AsyncStorage.setItem('transactions', JSON.stringify(state.items));
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      AsyncStorage.setItem('transactions', JSON.stringify(state.items)); // Update storage immediately
    },
  },
  extraReducers: (builder) => {
    builder
      // API Fetching states
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Keep existing manually added items (we'll assume anything not matching the exact mock API items is manual,
        // or to be safe, we merge and deduplicate by description).
        const existingItems = state.items;
        const newItems = action.payload;
        
        // Deduplicate: Add mock items only if they don't already exist in the list by description
        const filteredNewItems = newItems.filter((newItem: any) => 
          !existingItems.some(exItem => exItem.description === newItem.description)
        );

        state.items = [...existingItems, ...filteredNewItems];
        
        // Save the updated list to AsyncStorage so it persists on restart
        AsyncStorage.setItem('transactions', JSON.stringify(state.items));
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch';
      })
      // Offline loading states
      .addCase(loadOfflineTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadOfflineTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.length > 0) {
           state.items = action.payload;
        }
      })
      .addCase(loadOfflineTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load offline data';
      });
  },
});

export const { addTransaction, removeTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
