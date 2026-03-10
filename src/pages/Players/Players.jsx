import React, { useEffect, useState } from "react";
import { Card, CardContent, Container, Grid, InputAdornment, LinearProgress, Typography } from "@mui/material";
import { txt } from "../../common/context";
import PlayerIcon from "../../assets/images/svg/player.svg";
import PlayerCard from "../../components/Player/PlayerCard";
import CustomTextField from "../../components/CustomMUI/CustomTextField";
import { sendHttpRequest } from "../../common/Common";
import { toast } from "react-toastify";
import { CustomAddPlayerButton } from "../../components/CustomMUI/CustomSmallButton";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
// import ShareIcon from "../../assets/images/svg/share.svg";
// import { WEB_BASE_URL } from "../../common/Common";
// import { toast } from "react-toastify";

const Players = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allPlayerList, setAllPlayerList] = useState([]);
  const [filteredPlayerList, setFilteredPlayerList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPlayers();
  }, []);

  const getPlayers = () => {
    setIsLoading(true);
    sendHttpRequest("GET", `/player`).then((res) => {
      setAllPlayerList(res.data.result);
      setFilteredPlayerList(res.data.result);
    }).catch((error) => {
      toast.error(error.response.data.message);
      console.log(error.response);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const handleSearch = (value) => {
    setFilteredPlayerList(
      allPlayerList.filter((item) =>
        item.firstName.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div>
      <Container maxWidth='xl'>
        <Typography variant="h5" gutterBottom>Players</Typography>
        <CustomTextField
          type='search' placeholder='Search' onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
        <Card elevation={0} style={{ borderRadius: 10, backgroundColor: "var(--card-2-bg)" }} className="my-15">
          <CardContent onClick={() => navigate("/createPlayer")}>
            <div className="flex-between">
              <div>
                <p>Create a new Player</p>
                <p>Enter the name and the phone number.</p>
              </div>
              <img src={PlayerIcon} width='60px' height='60px' alt="icon" />
            </div>
            <CustomAddPlayerButton
              name={txt.create_player}
              onClick={() => navigate("/createPlayer")}
            />
          </CardContent>
        </Card>
        {isLoading && <LinearProgress />}
        {/* <Card elevation={0} style={{ borderRadius: 10, backgroundColor: "var(--card-1-bg)" }}>
            <CardActionArea
              onClick={() => {
                navigator.clipboard.writeText(`${WEB_BASE_URL}/tournament/register/${tournamentDetails._id}`)
                toast.success("Link copied to clipboard");
              }}
            >
              <CardContent>
                <div className="flex-between">
                  <div>
                    <p>Invite Players</p>
                    <p>Share the link to add new players.</p>
                  </div>
                  <img src={ShareIcon} width='60px' height='60px' alt="icon" />
                </div>
              </CardContent>
            </CardActionArea>
          </Card> */}
        <Grid container spacing={2} className="mb-15">
          {filteredPlayerList.map((player, index) => {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
                <PlayerCard player={player} />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};

export default Players;