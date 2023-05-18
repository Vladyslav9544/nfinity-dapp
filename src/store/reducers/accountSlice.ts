import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { StoreStatus } from "../../types/types";
import { getAccountRole, getStoreInfo } from "../../utils/contracts/nfinity";
import { getReadonlyProvider } from "../../utils/ethers";
import { formatEther } from "ethers/lib/utils.js";

export interface AccountState {
  accountIsOwner: boolean;
  accountIsOrganizer: boolean;
  accountIsCustomer: boolean;
  balance: number;
  loading: boolean;
}

export const loadAccountInformation = createAsyncThunk(
  "account/loadAccountInformation",
  async (address: string, { rejectWithValue, dispatch }) => {
    try {
      dispatch(loadAccountBalance(address));
      const roles = await getAccountRole(address);
      return roles;
    } catch (error) {
      return rejectWithValue("");
    }
  }
);

export const loadAccountBalance = createAsyncThunk(
  "account/loadAccountBalance",
  async (address: string, { rejectWithValue }) => {
    try {
      const provider = getReadonlyProvider();
      const balance = await provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      return rejectWithValue("");
    }
  }
);

const initialState: AccountState = {
  accountIsOwner: false,
  accountIsOrganizer: false,
  accountIsCustomer: false,
  balance: 0,
  loading: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountStateToInitial: (state) => {
      state.accountIsOwner = false;
      state.accountIsOrganizer = false;
      state.accountIsCustomer = false;
      state.balance = 0;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAccountInformation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadAccountInformation.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(loadAccountInformation.fulfilled, (state, action) => {
      state.accountIsCustomer = action.payload.accountIsCustomer;
      state.accountIsOrganizer = action.payload.accountIsOrganizer;
      state.accountIsOwner = action.payload.accountIsOwner;
      state.loading = false;
    });

    builder.addCase(loadAccountBalance.fulfilled, (state, action) => {
      state.balance = parseFloat(action.payload);
    });
  },
});

// Action creators are generated for each case reducer function
export const { setAccountStateToInitial } = accountSlice.actions;

export default accountSlice.reducer;
