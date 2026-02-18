import { createSlice } from "@reduxjs/toolkit";

const webinarSlice = createSlice({
    name: "webinar",
    initialState: {
        allWebinars: [],
    },
    reducers: {
        setAllWebinars: (state, action) => {
            state.allWebinars = action.payload;
        },
        addWebinar: (state, action) => {
            state.allWebinars.push(action.payload);
        }
    }
});
export const { setAllWebinars, addWebinar } = webinarSlice.actions;
export default webinarSlice.reducer;
