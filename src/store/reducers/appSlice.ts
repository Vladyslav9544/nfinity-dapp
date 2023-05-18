import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { StoreStatus } from "../../types/types";
import { getAccountRole, getStoreInfo } from "../../utils/contracts/nfinity";

export interface AppState {
  txPending: boolean;
}

const initialState: AppState = {
  txPending: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTxPending: (state, action: PayloadAction<boolean>) => {
      state.txPending = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTxPending } = appSlice.actions;

export default appSlice.reducer;
