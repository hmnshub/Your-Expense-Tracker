# SpendLens - Personal Finance Tracker

## 1. App Overview
SpendLens is a production-grade React Native application for tracking expenses, searching transactions, and monitoring spending behavior. Designed with high scalability, clean architecture, and offline persistence.

## 2. Architecture Decisions
- **Framework:** React Native CLI (no Expo) to showcase full native control.
- **Language:** TypeScript for robust type-checking and scalable codebase.
- **State Management:** Redux Toolkit for centralized state configuration and async thunks (`transactionsSlice`).
- **Persistence:** `@react-native-async-storage/async-storage` ensures offline usability.
- **Navigation:** `@react-navigation/native` with Bottom Tabs for quick transitions between screens.
- **Folder Structure:** Feature-driven architecture under `src/`, logically decoupling domains like dashboard, transactions, and analytics.

## 3. Setup Instructions
1. Check dependencies:
   ```bash
   npm i
   ```
2. Link iOS dependencies if on macOS:
   ```bash
   cd ios && pod install && cd ..
   ```
3. Run on Android:
   ```bash
   npm run android
   ```
4. Run on iOS:
   ```bash
   npm run ios
   ```

## 4. State Management Decisions
- Opted for Redux Toolkit because the app scales up over time with complex filtering and heavy lists (e.g., search transactions).
- Normalized data and usage of `createAsyncThunk` properly handles API interactions.
- Added custom typed hooks (`useAppDispatch`, `useAppSelector`) in `src/app/store/hooks/index.ts`.

## 5. Performance Optimizations
- **FlatList Optimization:** Memoized rendering and implemented pagination concepts for rendering infinite lists smoothly.
- **Debounced Search:** Avoid unnecessary rerenders of transaction lists by restricting filter triggers.
- **Offline First Lifecycle:** Using AsyncStorage directly in thunks maintains an immediate app boot time.

## 6. Future Improvements
- Add rigorous snapshot testing using Jest.
- Implement more robust charting libraries (when UI libraries are permitted).
- Improve error boundaries to fail gracefully instead of hard crashes.
- Synchronize data securely using an encrypted SQLite database.

## 7. Tradeoffs
- Rebuilding a UI framework entirely from scratch (React Native components only) reduces overall package size but increases development surface area.
- Chosen Redux logic over simpler `useContext` for architectural rigidity, acknowledging slightly increased boilerplate.

## 8. Release

- The signed Android APK is available at `android/app/build/outputs/apk/release/app-release.apk`.
- To upload to Google Play, generate an AAB with `./gradlew bundleRelease` and upload the produced `.aab` in the Play Console.

## 9. License

MIT — feel free to use this project as a learning sample.
