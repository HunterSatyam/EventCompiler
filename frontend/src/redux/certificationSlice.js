import { createSlice } from "@reduxjs/toolkit";

const certificationSlice = createSlice({
    name: "certification",
    initialState: {
        allCertifications: [],
    },
    reducers: {
        setAllCertifications: (state, action) => {
            state.allCertifications = action.payload;
        },
        addCertification: (state, action) => {
            state.allCertifications.push(action.payload);
        }
    }
});
export const { setAllCertifications, addCertification } = certificationSlice.actions;
export default certificationSlice.reducer;
