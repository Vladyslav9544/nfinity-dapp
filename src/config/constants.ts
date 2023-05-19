import { EventStatus, PurchaseStatus, StoreStatus } from "../types/types";

export const StoreStatusLabels = {
  [StoreStatus.Closed]: "CLOSED",
  [StoreStatus.Created]: "CREATED",
  [StoreStatus.Open]: "OPEN",
  [StoreStatus.Suspended]: "SUSPENDED",
};

export const EventStatusLabels = {
  [EventStatus.Cancelled]: "Canceled",
  [EventStatus.Completed]: "Completed",
  [EventStatus.Created]: "Created",
  [EventStatus.SalesFinished]: "SalesFinished",
  [EventStatus.SalesStarted]: "SalesStarted",
  [EventStatus.SalesSuspended]: "SalesSuspended",
  [EventStatus.Settled]: "Settled",
};

export const PurchaseStatusLabels = {
  [PurchaseStatus.Cancelled]: "Cancelled",
  [PurchaseStatus.CheckedIn]: "CheckedIn",
  [PurchaseStatus.Completed]: "Completed",
  [PurchaseStatus.Refunded]: "Refunded",
};

export const NotifyMessages = {
  DefaultError: "Something went wrong, please try again later.",
  DefaultSuccess: "Success!",
  DefaultWrongInput: "Wrong Input.",
};
