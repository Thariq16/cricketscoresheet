import React, { useState } from "react";
import { Avatar, Grid, Box, IconButton } from "@mui/material";
import { CustomCardButton } from "../CustomMUI/CustomSmallButton";
import MinusIcon from "../../assets/images/svg/MinusIcon.svg";
import PlayerStatsModal from "./PlayerStats/PlayerStatsModal";

const PlayerCard = ({ player, buttonName, onClick, isRemove }) => {
  const [showPlayerStats, setShowPlayerStats] = useState(false);

  

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid size="auto" onClick={() => setShowPlayerStats(true)}>
          <Avatar
            src={player?.profilePhoto || player?.firstName}
            alt={player?.firstName}
            sx={{ width: 60, height: 60 }}
          />
        </Grid>
        <Grid size="grow" onClick={() => setShowPlayerStats(true)}>
          <div style={{ color: "#000", fontFamily: "DM Sans", fontWeight: 400, fontSize: "15px" }}>
            {player?.firstName + " " + player?.lastName}
          </div>
          <div style={{ color: "var(--color1)", fontFamily: "DM Sans", fontWeight: 400, fontSize: "13px" }}>
            {player?.battingStyle ? "Bat: " + player?.battingStyle : " "}
          </div>
          <div style={{ color: "var(--color1)", fontFamily: "DM Sans", fontWeight: 400, fontSize: "13px" }}>
            {player?.bowlingArm ? " Ball: " + player?.bowlingArm : " "}
          </div>
        </Grid>
        <Grid size="auto">
          {isRemove ? (
            <IconButton onClick={() => onClick(player)}>
              <img src={MinusIcon} alt="remove" />
            </IconButton>
          ) : onClick ? (
            <CustomCardButton
              onClick={() => onClick(player)}
              disabled={false}
              name={buttonName}
            />
          ) : (
            <CustomCardButton
              onClick={() => setShowPlayerStats(true)}
              disabled={false}
              name='View'
            />
          )}
        </Grid>
      </Grid>
      <PlayerStatsModal show={showPlayerStats} closeModal={() => setShowPlayerStats(false)} userInfo={player} />
    </>
  );
};

export default PlayerCard;