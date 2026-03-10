import React, { useState, useEffect } from "react";
import { Box, Container, Grid, LinearProgress, Typography } from "@mui/material";
import { sendHttpRequest } from "../common/Common";
import IntroModal from "../components/CustomMUI/IntroModal";
import { txt } from "../common/context";
import PlayerIcon from "../assets/images/svg/player.svg";
import TeamIcon from "../assets/images/svg/team.svg";
import MatchIcon from "../assets/images/svg/match.svg";
import TournamentIcon from "../assets/images/svg/tournament.svg";
import Slider from "react-slick/lib/slider";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NoResults from "../components/NoResults";
import MatchCard from "../components/Match/MatchCard";
import { toast } from "react-toastify";

const HomeScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loadMatches, setLoadMatches] = useState(true);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [banner] = useState([
    {
      id: "1",
      url: "https://www.shutterstock.com/image-vector/illustration-batsman-playing-cricket-championship-600nw-2146224395.jpg",
    },
    {
      id: "2",
      url: "https://t3.ftcdn.net/jpg/04/28/40/40/360_F_428404007_dlbIe8jNte0Td6fzJ5NIVoLGcAP0drQ6.jpg",
    },
    {
      id: "3",
      url: "https://t4.ftcdn.net/jpg/04/28/40/41/360_F_428404189_pohNxH3T6vdzxqa3DbxJaaT7dzJam42S.jpg",
    },
  ]);

  useEffect(() => {
    setShowIntroModal(localStorage.getItem("newRegister") === "true");
    if (localStorage.getItem("showIntroScreen") === "true" && (localStorage.getItem("newRegister") === "false" || !localStorage.getItem("newRegister"))) {
      toast.success(txt.welcome + userInfo.firstName + ' ' + userInfo.lastName);
      localStorage.setItem("showIntroScreen", "false");
    }
    getUpcomingOngoingMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const getUpcomingOngoingMatches = () => {
  sendHttpRequest("GET", `/match/user/${userInfo._id}?isUpcomingOngoing=true`).then(async (res) => {
    setMatches(res.data.matches || []); 
    setLoadMatches(false);
  }).catch((error) => {
    console.error(error.response);
    toast.error(error.response.data.message);
    setLoadMatches(false); 
  });
};

  const handleIntroModalClose = () => {
    localStorage.setItem("showIntroScreen", "false");
    localStorage.setItem('newRegister', 'false');
    setShowIntroModal(false);
  };

  return (
    <div className="d-flex flex-column" style={{ height: "100%" }}>
      {showIntroModal && <IntroModal onClose={handleIntroModalClose} />}
      <Container>
        <Slider>
          {banner.map((slide, index) => (
            <div key={index}>
              <img src={slide.url} alt='slider-img' style={{ width: "100%", maxHeight: "200px", objectFit: "contain", borderRadius: "10px" }} />
            </div>
          ))}
        </Slider>
        <Typography variant="h6" align="left" gutterBottom>{txt.create_new}</Typography>
        <Grid container spacing={2}>
          <Grid size={3} className="text-center cursor-pointer" onClick={() => navigate("/createPlayer")}>
            <img src={PlayerIcon} alt="create player" width={50} />
            <Typography variant="caption" component='p'>{txt.player}</Typography>
          </Grid>
          <Grid size={3} className="text-center cursor-pointer" onClick={() => navigate('/team/create')}>
            <img src={TeamIcon} alt="create team" width={50} />
            <Typography variant="caption" component='p'>{txt.team}</Typography>
          </Grid>
          <Grid size={3} className="text-center cursor-pointer" onClick={() => navigate('/match/create')}>
            <img src={MatchIcon} alt="create match" width={50} />
            <Typography variant="caption" component='p'>{txt.match}</Typography>
          </Grid>
          <Grid size={3} className="text-center cursor-pointer" onClick={() => navigate('/tournament/create')}>
            <img src={TournamentIcon} alt="create tournament" width={50} />
            <Typography variant="caption" component='p'>{txt.tournament}</Typography>
          </Grid>
        </Grid>
      </Container>
      <Box mt={2} width="100%" sx={{ flexGrow: 1 }}>
        <Container>
          <Typography variant="h6" align="left" gutterBottom>{txt.upcoming_matches}</Typography>
          {loadMatches ? (
            <LinearProgress />
          ) : matches.length === 0 ? (
            <NoResults text="matches" />
          ) : (
            <Grid container spacing={2}>
              {matches.map((match, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <MatchCard match={match} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </div>
  );
};

export default HomeScreen;