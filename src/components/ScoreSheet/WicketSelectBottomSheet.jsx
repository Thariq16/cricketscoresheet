import React, { useState } from "react";
import RedBall from "../../assets/images/score/Red_Ball.svg";
import { txt } from "../../common/context";
import { FormControlLabel, Radio, RadioGroup, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import BottomDrawer from "../BottomDrawer";

const CustomWicketSelectBottomSheet = ({ isOpen, onDismiss, wicketTypes, handleWicket, fieldingTeamPlayers }) => {
  const [selectedWicketType, setSelectedWicketType] = useState("");
  const [selectedFielder, setSelectedFielder] = useState("");

  const wicketTypesNeedingFielder = ["Caught", "Stumped", "Run out striker", "Run out non striker"];
  const needsFielder = wicketTypesNeedingFielder.includes(selectedWicketType);

  // Debug logging
  console.log("fieldingTeamPlayers:", fieldingTeamPlayers);
  console.log("needsFielder:", needsFielder);
  console.log("selectedWicketType:", selectedWicketType);

  const handleClose = () => {
    onDismiss();
    setSelectedWicketType("");
    setSelectedFielder("");
  }

  // Helper function to get player ID
  const getPlayerId = (player) => {
    return player._id || player.id || player.playerId;
  };

  // Helper function to get player name
  const getPlayerName = (player) => {
    if (player.name) return player.name;
    if (player.firstName && player.lastName) return `${player.firstName} ${player.lastName}`;
    if (player.firstName) return player.firstName;
    return "Unknown Player";
  };

  return (
    <BottomDrawer
      isOpen={isOpen} 
      onDismiss={() => handleClose()}
      providedIcon={RedBall} 
      title={txt.wicket} 
      description={txt.select_the_dismissal_type}
    >
      <RadioGroup
        name={txt.wicket}
        value={selectedWicketType} 
        onChange={(e) => {
          setSelectedWicketType(e.target.value);
          setSelectedFielder("");
        }}
      >
        {wicketTypes?.map((option, index) => (
          <FormControlLabel
            key={index} 
            value={option}
            label={<span style={{ fontSize: "20px", fontWeight: '600' }}>{option}</span>}
            control={
              <Radio
                disableRipple
                color="default"
                sx={{
                  '& .MuiSvgIcon-root': {
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
                    backgroundColor: '#f5f8fa',
                  },
                  '&.Mui-checked .MuiSvgIcon-root': {
                    backgroundColor: '#137cbd',
                    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
                  },
                }}
              />
            }
          />
        ))}
      </RadioGroup>
      
      {needsFielder && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="fielder-select-label">Select Fielder</InputLabel>
          <Select
            labelId="fielder-select-label"
            value={selectedFielder}
            label="Select Fielder"
            onChange={e => setSelectedFielder(e.target.value)}
          >
            {fieldingTeamPlayers?.length > 0 ? (
              fieldingTeamPlayers.map((player, index) => {
                const playerId = getPlayerId(player);
                const playerName = getPlayerName(player);
                
                return (
                  <MenuItem key={playerId || index} value={playerId || index}>
                    {playerName}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem disabled value="">
                No fielders available
              </MenuItem>
            )}
          </Select>
        </FormControl>
      )}
      
      <PrimaryButton
        onClick={() => {
          handleWicket(selectedWicketType, needsFielder ? selectedFielder : undefined);
          handleClose();
        }}
        disabled={!selectedWicketType || (needsFielder && !selectedFielder)}
      >
        {txt.continue}
      </PrimaryButton>
    </BottomDrawer>
  );
};

export default CustomWicketSelectBottomSheet;