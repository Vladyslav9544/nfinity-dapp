import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getAccountEventIds,
  getAccountPurchaseIds,
  getAccountRole,
} from "../../utils/contracts/nfinity";
import { getReadonlyProvider } from "../../utils/ethers";
import { formatEther } from "ethers/lib/utils.js";
import { RootState } from "..";
import { isSameAddress } from "../../utils/helpers";

export interface AccountState {
  accountIsOwner: boolean;
  accountIsOrganizer: boolean;
  accountIsCustomer: boolean;
  balance: number;
  address: string;
  accountPurchaseIds: number[];
  accountEventIds: number[];
  loading: boolean;
}

export const loadAccountInformation = createAsyncThunk(
  "account/loadAccountInformation",
  async (address: string, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(loadAccountBalance(address));

      let roles = {
        accountIsOwner: false,
        accountIsOrganizer: false,
        accountIsCustomer: false,
      };
      let accountPurchaseIds: number[] = [];
      let accountEventIds: number[] = [];

      try {
        roles = await getAccountRole(address);
        accountPurchaseIds = await getAccountPurchaseIds(address);
        accountEventIds = await getAccountEventIds(address);
      } catch (error) {
        console.error(error);
      }

      const tAddress = (getState() as RootState).account.address;
      if (!isSameAddress(tAddress, address)) {
        return rejectWithValue("");
      }

      return { roles, accountPurchaseIds, accountEventIds, address };
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
  address: "",
  accountPurchaseIds: [],
  accountEventIds: [],
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
      state.address = "";
      state.accountEventIds = [];
      state.accountPurchaseIds = [];
      state.loading = false;
    },
    addNewEvent: (
      state,
      action: PayloadAction<{ organizer: string; eventId: number }>
    ) => {
      const { organizer, eventId } = action.payload;
      console.log(organizer, eventId);
      if (
        isSameAddress(organizer, state.address) &&
        !state.accountEventIds.includes(eventId)
      ) {
        state.accountEventIds.push(eventId);
        state.accountIsOrganizer = true;
      }
    },
    setAccountAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
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
      state.accountIsCustomer = action.payload.roles.accountIsCustomer;
      state.accountIsOrganizer = action.payload.roles.accountIsOrganizer;
      state.accountIsOwner = action.payload.roles.accountIsOwner;

      state.accountPurchaseIds = action.payload.accountPurchaseIds;
      state.accountEventIds = action.payload.accountEventIds;

      state.address = action.payload.address;
      state.loading = false;
    });

    builder.addCase(loadAccountBalance.fulfilled, (state, action) => {
      state.balance = parseFloat(action.payload);
    });
  },
});

// Action creators are generated for each case reducer function
export const { setAccountStateToInitial, setAccountAddress, addNewEvent } =
  accountSlice.actions;

export default accountSlice.reducer;
