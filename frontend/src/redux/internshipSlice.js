import { createSlice } from "@reduxjs/toolkit";

const internshipSlice = createSlice({
    name: "internship",
    initialState: {
        allInternship: [],
        singleInternship: null,
    },
    reducers: {
        setAllInternship: (state, action) => {
            state.allInternship = action.payload;
        },
        setSingleInternship: (state, action) => {
            state.singleInternship = action.payload;
        },
        addInternship: (state, action) => {
            state.allInternship.push(action.payload);
        }
    }
});
export const { setAllInternship, setSingleInternship, addInternship } = internshipSlice.actions;
export default internshipSlice.reducer;
