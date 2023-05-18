import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { StoreStatus } from "../../types/types";
import { getStoreInfo } from "../../utils/contracts/nfinity";

export interface NfinityState {
  owner: string;
  status: StoreStatus;
  name: string;
  settledBalance: number;
  excessBalance: number;
  refundableBalance: number;
  counterEvents: number;
  counterPurchases: number;
  loading: boolean;
}

export const initializeStoreInformation = createAsyncThunk(
  "nfinity/initializeStoreInformation",
  async (_, { rejectWithValue }) => {
    try {
      const info = await getStoreInfo();
      return info;
    } catch (error) {
      return rejectWithValue("");
    }
  }
);

const initialState: NfinityState = {
  loading: false,
  owner: "",
  status: StoreStatus.Created,
  name: "",
  settledBalance: 0,
  excessBalance: 0,
  refundableBalance: 0,
  counterEvents: 0,
  counterPurchases: 0,
};

export const nfinitySlice = createSlice({
  name: "nfinity",
  initialState,
  reducers: {
    setStorStatus: (state, action: PayloadAction<StoreStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeStoreInformation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initializeStoreInformation.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(initializeStoreInformation.fulfilled, (state, action) => {
      state.owner = action.payload.owner;
      state.status = action.payload.status;
      state.name = action.payload.name;
      state.settledBalance = action.payload.settledBalance;
      state.excessBalance = action.payload.excessBalance;
      state.refundableBalance = action.payload.refundableBalance;
      state.counterEvents = action.payload.counterEvents;
      state.counterPurchases = action.payload.counterPurchases;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setStorStatus } = nfinitySlice.actions;

export default nfinitySlice.reducer;
