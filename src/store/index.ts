import { configureStore } from "@reduxjs/toolkit";
import nfinityReducer from "./reducers/nfinitySlice";
import accountReducer from "./reducers/accountSlice";
import appReducer from "./reducers/appSlice";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
  reducer: {
    nfinity: nfinityReducer,
    account: accountReducer,
    app: appReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
