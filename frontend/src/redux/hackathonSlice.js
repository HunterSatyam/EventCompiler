import { createSlice } from "@reduxjs/toolkit";

const hackathonSlice = createSlice({
    name: "hackathon",
    initialState: {
        allHackathons: [],
    },
    reducers: {
        setAllHackathons: (state, action) => {
            state.allHackathons = action.payload;
        },
        addHackathon: (state, action) => {
            state.allHackathons.push(action.payload);
        }
    }
});
export const { setAllHackathons, addHackathon } = hackathonSlice.actions;
export default hackathonSlice.reducer;
