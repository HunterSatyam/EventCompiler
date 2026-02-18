import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchedQuery: "",
        filters: {
            title: "",
            type: "",
            location: "",
            industry: "",
            date: "",
            income: ""
        },
        allAppliedJobs: [],
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        addJob: (state, action) => {
            state.allJobs.push(action.payload);
        }
    }
});
export const { setAllJobs, setAllAdminJobs, setSingleJob, setSearchedQuery, setFilters, setAllAppliedJobs, addJob } = jobSlice.actions;
export default jobSlice.reducer;


