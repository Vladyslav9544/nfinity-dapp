export enum StoreStatus {
  Created = 0, // 0
  Open = 1, // 1
  Suspended = 2, // 2
  Closed = 3, // 3
}

export enum EventStatus {
  Created = 0, // 0
  SalesStarted = 1, // 1
  SalesSuspended = 2, // 2
  SalesFinished = 3, // 3
  Completed = 4, // 4
  Settled = 5, // 5
  Cancelled = 6, // 6
}

export enum PurchaseStatus {
  Completed = 0, // 0
  Cancelled = 1, // 1
  Refunded = 2, // 2
  CheckedIn = 3, // 3
}

export interface EventDetailInterface {
  status: EventStatus;
  externalId: string;
  organizer: string;
  name: string;
  storeIncentive: number;
  ticketPrice: string;
  ticketsOnSale: number;
  ticketsSold: number;
  ticketsLeft: number;
  ticketsCancelled: number;
  ticketsRefunded: number;
  ticketsCheckedIn: number;
  balance: number;
  refundableBalance: number;
}
