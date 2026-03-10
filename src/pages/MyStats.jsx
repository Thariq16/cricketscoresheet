import React, { useContext } from "react";
import PlayerStatsModal from "../components/Player/PlayerStats/PlayerStatsModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyStats = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  return (
    <PlayerStatsModal show={true} closeModal={() => navigate(-1)} userInfo={userInfo} />
  );
};

export default MyStats;