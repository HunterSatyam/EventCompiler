import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        allNotifications: [],
    },
    reducers: {
        setAllNotifications: (state, action) => {
            state.allNotifications = action.payload;
        },
        addNotification: (state, action) => {
            state.allNotifications.unshift(action.payload);
        },
        markNotificationAsRead: (state, action) => {
            state.allNotifications = state.allNotifications.map(notification =>
                notification._id === action.payload ? { ...notification, isRead: true } : notification
            );
        },
        removeNotification: (state, action) => {
            state.allNotifications = state.allNotifications.filter(notification => notification._id !== action.payload);
        }
    }
});

export const { setAllNotifications, addNotification, markNotificationAsRead, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
