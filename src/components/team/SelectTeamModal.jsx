import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, LinearProgress, Tab, Tabs } from "@mui/material";
import CustomTextField from "../CustomMUI/CustomTextField";
import { useNavigate } from "react-router-dom";
import { txt } from "../../common/context";
import { CustomAddPlayerButton } from "../CustomMUI/CustomSmallButton";
import { sendHttpRequest } from "../../common/Common";
import { toast } from "react-toastify";
import { KeyboardArrowLeft, SearchOutlined } from "@mui/icons-material";
import Chairs from "../../assets/images/svg/chairs.svg";
import { AuthContext } from "../../context/AuthContext";
import TeamCard from "./TeamCard";

const SelectTeamModal = ({ show, closeModal, isShowMyTeams, setSelectedTeam }) => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowMyTeams]);

  const fetchData = async () => {
    try {
      let response;

      if (isShowMyTeams) {
        response = await sendHttpRequest("GET", "/team/user/" + userInfo._id);
      } else {
        response = await sendHttpRequest("GET", "/team/other/" + userInfo._id);
      }

      setTeams(response.data);
      setFilteredTeams(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response)
    } finally {
      setIsLoading(false);
    }
  };

  const searchTeams = (searchText) => {
    setFilteredTeams(
      teams.filter((team) =>
        team.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const getFilteredTeams = () => {
    if (selectedTab === 'All') {
      return filteredTeams;
    } else if (selectedTab === 'Own') {
      return filteredTeams.filter(team => team.owner._id === userInfo._id);
    } else if (selectedTab === 'Part of') {
      return filteredTeams.filter(team => team.owner._id !== userInfo._id);
    }
  }

  return (
    <div>
      <Dialog open={show} onClose={closeModal} fullWidth fullScreen>
        <DialogTitle style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <IconButton onClick={closeModal}>
              <KeyboardArrowLeft>close</KeyboardArrowLeft>
            </IconButton>
            {txt.select_team}
          </div>
        </DialogTitle>
        <DialogContent>
          <small>{txt.select_an_existing_team_or_create_a_new_team}</small>
          <CustomTextField
            type="search"
            onChange={(e) => searchTeams(e.target.value)}
            placeholder={txt.search_team}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }}
          />
          {isShowMyTeams && (
            <Tabs
              value={selectedTab} onChange={(e, newTab) => setSelectedTab(newTab)}
              textColor="primary" indicatorColor="primary"
            >
              <Tab label="All" value="All" />
              <Tab label="Own" value="Own" />
              <Tab label="Part of" value="Part of" />
            </Tabs>
          )}
          <Card elevation={0} style={{ borderRadius: 10, backgroundColor: "var(--card-2-bg)" }} className="my-15">
            <CardContent>
              <div className="flex-between">
                <div>
                  <p>Create a new Team</p>
                  <p className="p1">Enter the name and the phone number.</p>
                </div>
                <img src={Chairs} width='60px' height='60px' alt="icon" />
              </div>
              <CustomAddPlayerButton
                name={txt.create_team}
                onClick={() => navigate("/team/create")}
              />
            </CardContent>
          </Card>
          {isLoading && <LinearProgress />}
          <Grid container spacing={2} className="mb-15">
            {getFilteredTeams().map((team, index) => {
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
                  <TeamCard
                    team={team} buttonName='Select'
                    onClick={(selectedTeamData) => setSelectedTeam(selectedTeamData)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectTeamModal;