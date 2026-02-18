import { createSlice } from "@reduxjs/toolkit";

const competitionSlice = createSlice({
    name: "competition",
    initialState: {
        allCompetitions: [],
    },
    reducers: {
        setAllCompetitions: (state, action) => {
            state.allCompetitions = action.payload;
        },
        addCompetition: (state, action) => {
            state.allCompetitions.push(action.payload);
        }
    }
});
export const { setAllCompetitions, addCompetition } = competitionSlice.actions;
export default competitionSlice.reducer;
