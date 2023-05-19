import { BigNumber, Signer, ethers, providers } from "ethers";
import { Nfinity__factory } from "../../types/contracts";
import { NfinityAddress } from "../../config/config";
import { getReadonlyProvider } from "../ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import {
  EventDetailInterface,
  PurchaseDetailInterface,
} from "../../types/types";

export const getNfinityContract = (
  provider?: ethers.Signer | ethers.providers.Provider
) => {
  if (!provider) {
    provider = getReadonlyProvider();
  }
  return Nfinity__factory.connect(NfinityAddress, provider);
};

//==============================================================================
//----------------------------     Read Methods     ----------------------------
//==============================================================================

export const getStoreInfo = async () => {
  const contract = getNfinityContract();
  const res = await contract.fetchStoreInfo();

  return {
    owner: res.storeOwner,
    status: res.storeStatus.toNumber(),
    name: res.storeName,
    settledBalance: parseFloat(
      ethers.utils.formatEther(res.storeSettledBalance)
    ),
    excessBalance: parseFloat(ethers.utils.formatEther(res.storeExcessBalance)),
    refundableBalance: parseFloat(
      ethers.utils.formatEther(res.storeRefundableBalance)
    ),
    counterEvents: res.storeCounterEvents.toNumber(),
    counterPurchases: res.storeCounterPurchases.toNumber(),
  };
};

export const getAccountRole = async (address: string) => {
  const contract = getNfinityContract();

  const res = await contract.getAccountRole(address);

  return res;
};

export const getAccountPurchaseIds = async (customer: string) => {
  const contract = getNfinityContract();

  const res = await contract.getPurchaseIdsByCustomer(customer);

  return res.map((id) => id.toNumber());
};

export const getAccountEventIds = async (organizer: string) => {
  const contract = getNfinityContract();

  const res = await contract.getEventIdsByOrganizer(organizer);

  return res.map((id) => id.toNumber());
};

export const getEventDetailById = async (eventId: number) => {
  const contract = getNfinityContract();
  const eInfo = await contract.fetchEventInfo(eventId);
  const eDetail = await contract.fetchEventSalesInfo(eventId);

  const res: EventDetailInterface = {
    status: eInfo.eventStatus.toNumber(),
    externalId: eInfo.eventExternalId,
    organizer: eInfo.eventOrganizer,
    name: eInfo.eventName,
    storeIncentive: eInfo.eventStoreIncentive.toNumber() / 100,
    ticketPrice: eInfo.eventTicketPrice.toString(),
    ticketsOnSale: eInfo.eventTicketsOnSale.toNumber(),
    ticketsSold: eDetail.eventTicketsSold.toNumber(),
    ticketsLeft: eDetail.eventTicketsLeft.toNumber(),
    ticketsCancelled: eDetail.eventTicketsCancelled.toNumber(),
    ticketsRefunded: eDetail.eventTicketsRefunded.toNumber(),
    ticketsCheckedIn: eDetail.eventTicketsCheckedIn.toNumber(),
    balance: parseFloat(formatEther(eDetail.eventBalance)),
    refundableBalance: parseFloat(formatEther(eDetail.eventRefundableBalance)),
  };

  return res;
};

export const getPurchaseDetailById = async (purchaseId: number) => {
  const contract = getNfinityContract();
  const detail = await contract.fetchPurchaseInfo(purchaseId);

  const res: PurchaseDetailInterface = {
    status: detail.purchaseStatus.toNumber(),
    externalId: detail.purchaseExternalId,
    timestamp: detail.purchaseTimestamp.toNumber(),
    customer: detail.purchaseCustomer,
    customerId: detail.purchaseCustomerId,
    quantity: detail.purchaseQuantity.toNumber(),
    total: parseFloat(formatEther(detail.purchaseTotal)),
    eventId: detail.purchaseEventId.toNumber(),
  };

  return res;
};

//==============================================================================
//----------------------------    Write Methods     ----------------------------
//==============================================================================

export const openStore = async (
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);

  const tx = await contract.openStore({ from: fromAddress });
  await tx.wait();
};

export const closeStore = async (
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);

  const tx = await contract.closeStore({ from: fromAddress });
  await tx.wait();
};

export const suspendStore = async (
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);

  const tx = await contract.suspendStore({ from: fromAddress });
  await tx.wait();
};

export const createEvent = async (
  externalId: string,
  organizer: string,
  name: string,
  price: string,
  sale: number,
  incentive: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.createEvent(
    externalId,
    organizer,
    name,
    incentive * 100,
    parseEther(price),
    sale,
    { from: fromAddress }
  );
  await tx.wait();
};
export const purhcaseTickets = async (
  eventId: number,
  quantity: number,
  externalId: string,
  customerId: string,
  value: BigNumber,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.purchaseTickets(
    eventId,
    quantity,
    externalId,
    Date.now(),
    customerId,
    { from: fromAddress, value }
  );
  await tx.wait();
};

export const endTicketSale = async (
  eventId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.endTicketSales(eventId, { from: fromAddress });
  await tx.wait();
};

export const suspendTicketSale = async (
  eventId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.suspendTicketSales(eventId, { from: fromAddress });
  await tx.wait();
};

export const startTicketSale = async (
  eventId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.startTicketSales(eventId, { from: fromAddress });
  await tx.wait();
};

export const cancelEvent = async (
  eventId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.cancelEvent(eventId, { from: fromAddress });
  await tx.wait();
};

export const settleEvent = async (
  eventId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.settleEvent(eventId, { from: fromAddress });
  await tx.wait();
};

export const completeEvent = async (
  eventId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.completeEvent(eventId, { from: fromAddress });
  await tx.wait();
};

export const cancelPurchase = async (
  purchaseId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.cancelPurchase(purchaseId, { from: fromAddress });
  await tx.wait();
};

export const refundPurchase = async (
  eventId: number,
  purchaseId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.refundPurchase(eventId, purchaseId, {
    from: fromAddress,
  });
  await tx.wait();
};

export const checkInPurchase = async (
  purchaseId: number,
  fromAddress: string,
  signer: Signer | providers.Provider
) => {
  const contract = getNfinityContract(signer);
  const tx = await contract.checkIn(purchaseId, {
    from: fromAddress,
  });
  await tx.wait();
};
