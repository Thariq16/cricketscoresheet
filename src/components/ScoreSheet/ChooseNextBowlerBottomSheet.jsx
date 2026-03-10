import React, { useState } from "react";
import RedBall from "../../assets/images/score/Red_Ball.svg";
import { txt } from "../../common/context";
import { PrimaryButton, SmallBlueButton } from "../CustomMUI/CustomButtons";
import PlayerCard from "../Player/PlayerCard";
import { Grid } from "@mui/material";
import BottomDrawer from "../BottomDrawer";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ChooseNextBowlerBottomSheet = ({ currentBowler, setSelectedBower, allBowlers, isOpen, setIsOpen }) => {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(-1);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPlayerIndex(-1);
  }

  return (
    <>
      <SmallBlueButton
        onClick={() => setIsOpen(true)} endIcon={<ChevronRightIcon />}
        style={{ display: currentBowler ? 'none' : 'flex' }}
        disabled={!!currentBowler}
      >
        Choose next bowler
      </SmallBlueButton>
      <BottomDrawer
        isOpen={isOpen} onDismiss={() => handleClose()}
        providedIcon={RedBall} title={txt.next_bowler} description={txt.pick_the_next_bowler}
      >
        <Grid container spacing={2} className="my-15" >
          {allBowlers.filter(bowler => bowler !== currentBowler).map((player, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
              <PlayerCard
                player={player.player}
                buttonName={selectedPlayerIndex === index ? "Selected" : "Select"}
                onClick={() => setSelectedPlayerIndex(index)}
              />
            </Grid>
          ))}
        </Grid>
        <PrimaryButton
          disabled={selectedPlayerIndex === -1}
          onClick={() => { handleClose(); setSelectedBower(allBowlers[selectedPlayerIndex]) }}
        >
          {txt.continue}
        </PrimaryButton>
      </BottomDrawer>
    </>
  );
};

export default ChooseNextBowlerBottomSheet;