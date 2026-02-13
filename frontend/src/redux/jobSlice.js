import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        singleJob: null,
        searchedQuery: "",
        allAppliedJobs: [],
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        addJob: (state, action) => {
            state.allJobs.push(action.payload);
        }
    }
});
export const { setAllJobs, setSingleJob, setSearchedQuery, setAllAppliedJobs, addJob } = jobSlice.actions;
export default jobSlice.reducer;
