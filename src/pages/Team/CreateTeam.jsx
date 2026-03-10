import React, { useState, useContext } from "react";
import { PrimaryButton } from "../../components/CustomMUI/CustomButtons";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { txt } from "../../common/context";
import CustomTextField from "../../components/CustomMUI/CustomTextField";
import Header from "../../components/Header";
import TeamIcon from "../../assets/images/svg/team.svg";
import { CustomAddPlayerButton } from "../../components/CustomMUI/CustomSmallButton";
import SelectPlayersModal from "../../components/Player/SelectPlayersModal";
import PlayerCard from "../../components/Player/PlayerCard";
import { sendHttpRequest } from "../../common/Common";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import RemovePlayerBottomSheet from "../../components/Player/RemovePlayerBottomSheet";

const CreateTeam = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [teamLocation, setTeamLocation] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamNameError, setTeamNameError] = useState("");
  const [teamLocationError, setTeamLocationError] = useState("");
  const [showSelectPlayersModal, setShowSelectPlayersModal] = useState(false);
  const [showRemovePlayerDrawer, setShowRemovePlayerDrawer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const removePlayer = (selectedPlayer) => {
    const data = teamMembers.filter((item) => item._id !== selectedPlayer._id);
    setTeamMembers(data);
    setShowRemovePlayerDrawer(false);
  };

  const handleCreateTeam = () => {
    setTeamNameError("");
    setTeamLocationError("");
    setIsLoading(true);

    if (!teamName) {
      setTeamNameError('Team name cannot be empty');
      setIsLoading(false);
      return;
    }

    if (!teamLocation) {
      setTeamLocationError(txt.location_required);
      setIsLoading(false);
      return;
    }

    if (teamMembers.length < 5) {
      toast.error("Add at least 6 players before creating a team");
      setIsLoading(false);
      return;
    }

    if (teamMembers.length > 17) {
      toast.error("Team can have only 16 players");
      setIsLoading(false);
      return;
    }

    let data = {
      name: "Pool - " + teamName,
      players: teamMembers.map((item) => item._id),
      createdBy: userInfo._id,
      owner: userInfo._id,
      isTemp: false,
    };

    sendHttpRequest("POST", "/pool", null, JSON.stringify(data)).then((res) => {
      if (res.data.data) {
        let data1 = {
          teamName: teamName,
          teamMembers: teamMembers.map((item) => item._id),
          createdBy: userInfo._id,
          poolId: res.data.data._id,
          teamLocation: teamLocation,
          isTemp: false,
          owner: userInfo._id,
        };
        sendHttpRequest("POST", "/team", null, JSON.stringify(data1)).then((res) => {
          toast.success(res.data.message);
          navigate(-1);
        }).catch((error) => {
          console.log(error?.response);
          toast.error(error?.response?.data?.message);
        });
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Box className="flex-center" style={{ height: '100%' }}>
      <Header title={txt.create_team} />
      <Container>
        <img src={TeamIcon} className="round-pic" alt='icon' />
        <h1 className="text-left">{txt.create_team}</h1>
        <p className="text-left text-color">{txt.start_by_entering_the_details_of_your_team}</p>
        <CustomTextField
          label={txt.team_name}
          value={teamName} onChange={(e) => setTeamName(e.target.value)}
          error={!!teamNameError}
          helperText={teamNameError}
        />
        <CustomTextField
          label={txt.location}
          value={teamLocation} onChange={(e) => setTeamLocation(e.target.value)}
          error={!!teamLocationError}
          helperText={teamLocationError}
        />
        <h2>{txt.add_players}</h2>
        <p>{txt.players_of_your_team_will_be_listed_here}</p>
        <Grid container spacing={2} className="mt-15">
          {teamMembers.map((item, index) => {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
                <PlayerCard
                  player={item} isRemove={true}
                  onClick={(value) => { setShowRemovePlayerDrawer(true); setSelectedPlayer(value) }}
                />
              </Grid>
            );
          })}
        </Grid>
        <center className='mt-15'>
          {/* //TODO: Add a general naming like YellowButton */}
          <CustomAddPlayerButton
            name={
              teamMembers.length > 0 ?
                teamMembers.length < 6 ?
                  `Add ${6 - teamMembers.length} More Players` :
                  txt.add_more_players :
                txt.select_players
            }
            onClick={() => setShowSelectPlayersModal(true)}
            disabled={teamMembers.length > 16}
          />
        </center>
        <PrimaryButton
          onClick={handleCreateTeam} className='mt-15'
          disabled={(teamMembers.length > 5 && teamMembers.length < 17) ? false : true}
          endIcon={isLoading && <CircularProgress size='1.5rem' color="inherit" />}
        >
          {txt.create_team}
        </PrimaryButton>
      </Container>
      <RemovePlayerBottomSheet
        isOpen={showRemovePlayerDrawer}
        onDismiss={() => { setShowRemovePlayerDrawer(false); setSelectedPlayer(null) }}
        player={selectedPlayer}
        removePlayer={() => removePlayer(selectedPlayer)}
      />
      <SelectPlayersModal
        show={showSelectPlayersModal}
        closeModal={() => setShowSelectPlayersModal(false)}
        initialAddedPlayerList={teamMembers}
        updateAddedPlayerList={setTeamMembers}
      />
    </Box>
  );
};

export default CreateTeam;