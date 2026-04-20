import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { authApi } from "./services/auth";
import authSlice from "./slices/auth/authSlice"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { userApi } from "./services/user";
import userSlice from "./slices/user/userSlice";
import { hcApi } from "./services/hc";
import { companyApi } from "./services/company";
import { commonApi } from "./services/common";
import { happCoachApi } from "./services/happcoach";
import { cltApi } from "./services/clt";
import { profileApi } from "./services/profile";
import { settingsApi } from "./services/settings";
import { faqApi } from "./services/faq";
import { messagingApi } from "./services/messages";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth',]
};
const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [hcApi.reducerPath]: hcApi.reducer,
  [companyApi.reducerPath]: companyApi.reducer,
  [commonApi.reducerPath]: commonApi.reducer,
  [happCoachApi.reducerPath]: happCoachApi.reducer,
  [cltApi.reducerPath]: cltApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [faqApi.reducerPath]: faqApi.reducer,
  [messagingApi.reducerPath]: messagingApi.reducer,
  auth: authSlice,
  user: userSlice
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const createStore = (options) =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware, userApi.middleware, hcApi.middleware,
        companyApi.middleware, commonApi.middleware, happCoachApi.middleware, cltApi.middleware,
        profileApi.middleware, settingsApi.middleware, faqApi.middleware, messagingApi.middleware
      ),
    ...options
  });

export const store = createStore();
export const persistor = persistStore(store);

export const useAppDispatch = () => useDispatch();
export const useTypedSelector = () => useSelector();

