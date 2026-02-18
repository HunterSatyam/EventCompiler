import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import internshipSlice from "./internshipSlice";
import hackathonSlice from "./hackathonSlice";
import applicationSlice from "./applicationSlice";
import notificationSlice from "./notificationSlice";
import webinarSlice from "./webinarSlice";
import competitionSlice from "./competitionSlice";
import certificationSlice from "./certificationSlice";
import companySlice from "./companySlice";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth: authSlice,
    job: jobSlice,
    internship: internshipSlice,
    hackathon: hackathonSlice,
    application: applicationSlice,
    notification: notificationSlice,
    webinar: webinarSlice,
    competition: competitionSlice,
    certification: certificationSlice,
    company: companySlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;
