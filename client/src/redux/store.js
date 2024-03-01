import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./User/UserSlice";
import { persistReducer, persistStore } from "redux-persist"; // Import persistReducer
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const rootReducer = combineReducers({ user: userReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer); // Fix typo: persistedReducer -> persistReducer
export const mystore = configureStore({
  reducer: persistedReducer, // Pass persistedReducer as the reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(mystore);
