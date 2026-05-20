import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import RootNavigator from './src/app/navigation/RootNavigator';
import { loadOfflineTransactions, fetchTransactions } from './src/features/transactions/transactionsSlice';

const App = () => {
  useEffect(() => {
    // Load local storage completely uniformly across the app on startup
    store.dispatch(loadOfflineTransactions()).then((res: any) => {
      if (!res.payload || res.payload.length === 0) {
        store.dispatch(fetchTransactions());
      }
    });

    // Requirements: "Proper handling of app lifecycle (open, background, killed state)"
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        const state = store.getState();
        // The app is going to sleep! We could sync specific unsaved items to AsyncStorage here if needed,
        // but since we save actively on dispatch, it's mostly for tracking session analytics.
        console.log('App moved to background, data is safely persisted via AsyncStorage.');
      } else if (nextAppState === 'active') {
        console.log('App moved to foreground, restoring UI...');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
