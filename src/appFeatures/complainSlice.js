import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { complainService } from "../appwrite/complainService";

// Async thunk to create complaint
export const createComplaint = createAsyncThunk(
    "complaint/createComplaint",
    async (complaintData, thunkAPI) => {
        try {
            const res = await complainService.createComplaint(complaintData);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch user's complaints
export const fetchUserComplaints = createAsyncThunk(
    "complaint/fetchUserComplaints",
    async (userId, thunkAPI)=>{
        try {
           const res = await complainService.getUserComplaints(userId)    
                   
           return res.documents
        } catch (error) {
                              return thunkAPI.rejectWithValue(error.message);
        }
    }
)

// Async thunk to fetch all user complaints in admin page
export const fetchAllComplaints = createAsyncThunk(
  "complaint/fetchAllComplaints",
  async (_, thunkAPI)=>{
    try {
      const res = await complainService.getAllComplaints();

      return res.documents;
    } catch (error) {
            return thunkAPI.rejectWithValue(error.message || "Failed to fetch all complaints.");

    }
  }
)

// Async thunk to update a complaint
export const updateComplaint = createAsyncThunk(
  "complaint/updateComplaint",
  async ({ complaintId, updatedData }, thunkAPI) => {
    try {
      const res = await complainService.updateComplaint(complaintId, updatedData);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)


// initial state for the blog slice
const initialState = {
    complaints : [],
    adminComplaints: [],
    loading: false,
    error: null,
    status: "idle",
}

const complaintSlice = createSlice({
    name:"complaint",
    initialState,
    reducers:{},

      //  Handle async thunk states (pending, fulfilled, rejected)

extraReducers: (builder) =>{
    builder
     // createComplaint
      .addCase(createComplaint.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      // fetchUserComplaints
      .addCase(fetchUserComplaints.pending, state => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchUserComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUserComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      //  fetchAllUserComplaints for admin page
      .addCase(fetchAllComplaints.pending, (state)=>{
        state.loading = true;
        state.error= null;
        state.status = "pending";
      })
      .addCase(fetchAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.adminComplaints = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "failed";
      })

      // updateComplaint
      .addCase(updateComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {  
        state.loading = false;
        const updatedComplaint = action.payload;
        const index = state.adminComplaints.findIndex(comp => comp.$id === updatedComplaint.$id);
        if (index !== -1) {
          state.adminComplaints[index] = updatedComplaint; // Update the specific complaint
        }
        state.status = "succeeded";
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
}

})

export const { reducer: complainReducer } = complaintSlice;
export default complainReducer;