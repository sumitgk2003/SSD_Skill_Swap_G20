import { createSlice } from "@reduxjs/toolkit";

const initialState={
  user:null,
  skills:[],
  interests:[],
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
    }
  }
})
export const {setUser,setSkills,setInterests}=authSlice.actions;
export default authSlice.reducer;