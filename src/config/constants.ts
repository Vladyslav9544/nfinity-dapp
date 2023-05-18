import { StoreStatus } from "../types/types";

export const StoreStatusStrings = {
  [StoreStatus.Closed]: "CLOSED",
  [StoreStatus.Created]: "CREATED",
  [StoreStatus.Open]: "OPEN",
  [StoreStatus.Suspended]: "SUSPENDED",
};

export const NotifyMessages = {
  DefaultError: "Something went wrong, please try again later.",
  DefaultSuccess: "Success!",
  DefaultWrongInput: "Wrong Input.",
};
