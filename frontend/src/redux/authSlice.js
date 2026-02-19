import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setSavedEvents: (state, action) => {
            // Update savedEvents in the user object
            if (state.user) {
                state.user.savedEvents = action.payload;
            }
        }
    }
});
export const { setLoading, setUser, setSavedEvents } = authSlice.actions;
export default authSlice.reducer;
