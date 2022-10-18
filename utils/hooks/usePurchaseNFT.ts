import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import {
  addPendingTransaction,
  removePendingTransaction,
} from "../../features/TransactionsSlice";
import { updateDBAfterTokenSalePurchase } from "../../features/ProductsSlice";

const NFTSaleJson = require("../abis/NFTSale.json");

const usePurchaseNFT = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);

  const purchaseNFT = async (
    tokenId: number,
    description: string,
    name: string
  ) => {
    if (!window) return;

    const nextTransaction = { tokenSale: { tokenId, description, name } };

    dispatch(addPendingTransaction(nextTransaction));
    const { ethereum } = window as any;

    const provider = new ethers.providers.Web3Provider(ethereum, "any");

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const walletAddress = accounts[0]; // first account in MetaMask
    const signer = provider.getSigner(walletAddress);

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS || "",
      NFTSaleJson.abi,
      signer
    );

    const transaction = await contract.purchaseNFT(tokenId, { value: 5 });
    const receipt = await transaction.wait();

    // TODO: Error handling

    const { transactionHash, from, to } = receipt;

    dispatch(
      updateDBAfterTokenSalePurchase({
        tokenId,
        txDetails: { transactionHash, from, to },
      })
    );

    await setTimeout(() => {
      dispatch(removePendingTransaction(nextTransaction));
    }, 10000);

    // dispatch(removePendingTransaction({tokenId}));
  };

  return { error, purchaseNFT };
};

export default usePurchaseNFT;
