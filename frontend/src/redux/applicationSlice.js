import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applicants: [],
        recruiterApplications: []
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setAllRecruiterApplications: (state, action) => {
            state.recruiterApplications = action.payload;
        }
    }
});

export const { setAllApplicants, setAllRecruiterApplications } = applicationSlice.actions;
export default applicationSlice.reducer;
