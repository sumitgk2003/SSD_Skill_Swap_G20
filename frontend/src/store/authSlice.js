import { createSlice } from "@reduxjs/toolkit";

const initialState={
  user:null,
  skills:[],
  interests:[],
  bio: "",
  availability: [],
  timezone: '',
  preferredFormats: []
}

const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
    setUser:(state,action)=>{
      state.user = action.payload;
      console.log("[Redux authSlice] setUser:", action.payload);
    },
    setSkills:(state,action)=>{
      state.skills = action.payload;
      console.log("[Redux authSlice] setSkills:", action.payload);
    },
    setInterests:(state,action)=>{
      state.interests = action.payload;
      console.log("[Redux authSlice] setInterests:", action.payload);
    },
    setBio:(state,action)=>{
      state.bio = action.payload;
      console.log("[Redux authSlice] setBio:", action.payload);
    }
    ,setAvailability:(state,action)=>{
      console.log("[Redux authSlice] setAvailability called with:", action.payload);
      state.availability = action.payload;
      console.log("[Redux authSlice] availability state updated to:", state.availability);
    }
    ,setTimezone:(state, action) => {
      console.log("[Redux authSlice] setTimezone called with:", action.payload);
      state.timezone = action.payload;
      console.log("[Redux authSlice] timezone state updated to:", state.timezone);
    }
    ,setPreferredFormats:(state, action) => {
      console.log("[Redux authSlice] setPreferredFormats called with:", action.payload);
      state.preferredFormats = action.payload;
      console.log("[Redux authSlice] preferredFormats state updated to:", state.preferredFormats);
    }
    ,resetAuth: (state, action) => {
      return initialState;
    }
  }
})
export const {setUser,setSkills,setInterests,setBio,setAvailability,setTimezone,setPreferredFormats,resetAuth}=authSlice.actions;
export default authSlice.reducer;