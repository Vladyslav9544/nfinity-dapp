import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { isAddress } from "ethers/lib/utils.js";
import React, { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { toast } from "react-toastify";
import { NotifyMessages } from "../config/constants";
import { useAppDispatch } from "../store";
import { setTxPending } from "../store/reducers/appSlice";
import { createEvent } from "../utils/contracts/nfinity";

const defaultValues = {
  name: "Event Name",
  externalId: "External ID",
  organizer: "",
  sale: 50,
  price: "0.1",
  incentive: 10,
};

const CreateEvent = () => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [name, setName] = useState(defaultValues.name);
  const [externalId, setExternalId] = useState(defaultValues.externalId);
  const [organizer, setOrganizer] = useState("");
  const [sale, setSale] = useState(defaultValues.sale);
  const [price, setPrice] = useState(defaultValues.price);
  const [incentive, setIncentive] = useState(defaultValues.incentive);

  useEffect(() => {
    if (address && organizer === "") {
      setOrganizer(address);
    }
  }, [address]);

  const handleCreate = async () => {
    console.log(name, externalId, organizer, sale, price, incentive);

    if (
      !name.length ||
      !externalId.length ||
      !isAddress(organizer) ||
      !sale ||
      !price.length ||
      !parseFloat(price) ||
      !incentive
    ) {
      toast(NotifyMessages.DefaultWrongInput, { type: "error" });
      return;
    }

    if (!address || !signer) {
      return;
    }

    dispatch(setTxPending(true));

    try {
      await createEvent(
        externalId,
        organizer,
        name,
        price,
        sale,
        incentive,
        address,
        signer
      );
    } catch (error) {
      toast(NotifyMessages.DefaultError, { type: "error" });
    }
    dispatch(setTxPending(false));
  };

  return (
    <Paper elevation={4}>
      <div className="p-4 border-b-2 border-b-gray-200 font-bold text-lg text-gray-600">
        Create Event
      </div>
      <div className="flex flex-col gap-3 p-5">
        <TextField
          label="Event Name"
          variant="outlined"
          defaultValue={defaultValues.name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="External ID"
          variant="outlined"
          defaultValue={defaultValues.externalId}
          onChange={(e) => setExternalId(e.target.value)}
        />
        <TextField
          label="Organizer"
          variant="outlined"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
        />
        <TextField
          label="Tickets on Sale"
          variant="outlined"
          defaultValue={defaultValues.sale}
          onChange={(e) => setSale(parseInt(e.target.value))}
        />
        <TextField
          label="Ticket Price (in ETH)"
          variant="outlined"
          defaultValue={defaultValues.price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Store Incentive (%)"
          variant="outlined"
          defaultValue={defaultValues.incentive}
          onChange={(e) => setIncentive(parseInt(e.target.value))}
        />
        <Button variant="contained" color="success" onClick={handleCreate}>
          Create
        </Button>
      </div>
    </Paper>
  );
};

export default CreateEvent;
