import React, { useEffect, useState } from "react";
import Bat from "../../assets/images/svg/match.svg";
import { txt } from "../../common/context";
import { PrimaryButton, SmallBlueButton } from "../CustomMUI/CustomButtons";
import { Grid, Tab, Tabs } from "@mui/material";
import PlayerCard from "../Player/PlayerCard";
import BottomDrawer from "../BottomDrawer";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const ChooseNextBatter = ({ currentBatsman, nextBatsman, setSelectedBatter, allBatsmen }) => {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(-1);
  const [selectedTab, setSelectedTab] = useState('currentBatsman');
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPlayerIndex(-1);
    setSelectedTab('currentBatsman');
  }

  useEffect(() => {
    if (currentBatsman) {
      setSelectedTab('nextBatsman');
    } else if (nextBatsman) {
      setSelectedTab('currentBatsman');
    } else {
      setSelectedTab('currentBatsman');
    }
  }, [currentBatsman, nextBatsman]);

  return (
    <>
      <SmallBlueButton
        onClick={() => setIsOpen(true)} endIcon={<ChevronRightIcon />}
        style={{ display: currentBatsman && nextBatsman ? 'none' : 'flex' }}
        disabled={!!(currentBatsman && nextBatsman)}
      >
        Choose next batter
      </SmallBlueButton>
      <BottomDrawer
        isOpen={isOpen} onDismiss={() => handleClose()}
        providedIcon={Bat} title={txt.next_batter} description={txt.pick_the_next_batter}
      >
        <Tabs
          value={selectedTab} onChange={(e, newTab) => setSelectedTab(newTab)}
          textColor="primary" indicatorColor="primary" centered
        >
          <Tab label={'STRIKER'} value={'currentBatsman'} disabled={!!currentBatsman} />
          <Tab label={'NON-STRIKER'} value={'nextBatsman'} disabled={!!nextBatsman} />
        </Tabs>
        <Grid container spacing={2} className="my-15" style={{ maxHeight: '400px', overflow: 'scroll' }} >
          {allBatsmen.filter(batsman => batsman !== currentBatsman && batsman !== nextBatsman).map((player, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
              <PlayerCard
                player={player?.player}
                buttonName={selectedPlayerIndex === index ? "Selected" : "Select"}
                onClick={() => setSelectedPlayerIndex(index)}
              />
            </Grid>
          ))}
        </Grid>
        <PrimaryButton
          disabled={selectedPlayerIndex === -1}
          onClick={() => {
            handleClose();
            setSelectedBatter(
              selectedTab,
              allBatsmen.filter(batsman => batsman !== currentBatsman && batsman !== nextBatsman)[selectedPlayerIndex],
            )
          }}
        >
          {txt.continue}
        </PrimaryButton>
      </BottomDrawer>
    </>
  );
};

export default ChooseNextBatter;