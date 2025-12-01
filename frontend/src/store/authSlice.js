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
    },
    setSkills:(state,action)=>{
      state.skills = action.payload;
    },
    setInterests:(state,action)=>{
      state.interests = action.payload;
    },
    setBio:(state,action)=>{
      state.bio = action.payload;
    }
    ,setAvailability:(state,action)=>{
      state.availability = action.payload;
    }
    ,setTimezone:(state, action) => {
      state.timezone = action.payload;
    }
    ,setPreferredFormats:(state, action) => {
      state.preferredFormats = action.payload;
    }
    ,resetAuth: (state, action) => {
      return initialState;
    }
  }
})
export const {setUser,setSkills,setInterests,setBio,setAvailability,setTimezone,setPreferredFormats,resetAuth}=authSlice.actions;
export default authSlice.reducer;