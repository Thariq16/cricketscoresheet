import React from "react";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import { txt } from "../../common/context";
import MinusIcon from "../../assets/images/svg/MinusIcon.svg";
import PlayerCard from "./PlayerCard";
import BottomDrawer from "../BottomDrawer";

const RemovePlayerBottomSheet = ({ isOpen, onDismiss, player, removePlayer }) => {
  return (
    <BottomDrawer
      isOpen={isOpen} onDismiss={onDismiss} title={'Remove Player'} providedIcon={MinusIcon}
      description={txt.are_you_sure_you_want_to_remove_this_player}
    >
      <PlayerCard player={player} />
      <PrimaryButton className="mt-15" onClick={() => removePlayer()}>{txt.confirm}</PrimaryButton>
    </BottomDrawer>
  );
};

export default RemovePlayerBottomSheet;