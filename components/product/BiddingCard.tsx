import * as React from "react";
import { useSelector } from "react-redux";

import PokemonCard from "./common/PokemonCard";

import { RootState } from "../../store";
import { IProduct } from "../../interfaces/IProduct";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const BiddingCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, tokenId, owner } = props;

  const { bidInMarketPlace } = useWeb3Transactions();

  const { data } = useSelector((state: RootState) => state.listings);

  const handleClick = () => {
    if (tokenId !== undefined) bidInMarketPlace(tokenId, description, name);
  };

  const disabled = !!data?.some((element) => element.tokenId === tokenId);

  return (
    <PokemonCard
      disabled={disabled}
      buttonText="bid"
      handleClick={handleClick}
      {...props}
    />
  );
};

export default BiddingCard;
