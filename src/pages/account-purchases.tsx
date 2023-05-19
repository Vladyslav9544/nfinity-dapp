import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import EventDetail from "../components/event-detail";
import { useAppSelector } from "../store";
import PurchaseDetail from "../components/purchase-detail";

const AccountPurchases = () => {
  const accountPurchases = useAppSelector(
    (state) => state.account.accountPurchaseIds
  );

  const [purchaseId, setpurchaseId] = useState(accountPurchases[0] || 1);

  useEffect(() => {
    setpurchaseId(accountPurchases[0]);
  }, [accountPurchases]);

  return (
    <>
      {accountPurchases.length === 0 ? (
        <div></div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">
              Purchases ({accountPurchases.length})
            </h1>
            <Pagination
              count={accountPurchases.length}
              color="primary"
              onChange={(_, p) => setpurchaseId(accountPurchases[p - 1])}
            />
          </div>

          <div className="mt-10 flex justify-center">
            <PurchaseDetail purchaseId={purchaseId} />
          </div>
        </div>
      )}
    </>
  );
};

export default AccountPurchases;
