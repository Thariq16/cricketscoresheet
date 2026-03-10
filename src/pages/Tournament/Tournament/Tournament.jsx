import React, { useCallback, useContext, useEffect, useState } from "react";
import { LinearProgress, Tab, Tabs } from "@mui/material";
import { sendHttpRequest } from "../../../common/Common";
import { toast } from "react-toastify";
import Teams from "./Teams";
import Details from "./Details";
import Groups from "./Groups"; 
import { TabContext, TabPanel } from "@mui/lab";
import Header from "../../../components/Header";
import Fixtures from "./Fixtures";
import { useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

function Tournament() {
  const { userInfo } = useContext(AuthContext);
  const { tournamentId } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [tournamentDetails, setTournamentDetails] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [tabValue, setTabValue] = useState('details');

  const getTournamentDetails = useCallback((tournamentId) => {
    setIsLoading(true);
    sendHttpRequest("GET", "/tournament/" + tournamentId).then(res => {
      setTournamentDetails(res.data.data);
      const checkIsAdmin = (res.data.data.admins && res.data.data.admins.map(admin => admin._id).includes(userInfo._id)) || res.data.data.createdBy._id === userInfo._id;
      setIsAdmin(checkIsAdmin);
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [userInfo._id]);

  useEffect(() => {
    getTournamentDetails(tournamentId);
  }, [tournamentId, getTournamentDetails]);

  useEffect(() => {
    if (location.state?.shouldRefresh) {
      getTournamentDetails(tournamentId);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, tournamentId, getTournamentDetails]);

  if (isLoading) {
    return <LinearProgress />;
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <Header title={tournamentDetails.name} />
      <TabContext value={tabValue}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} textColor="primary" indicatorColor="primary">
          <Tab label="Details" value="details" {...a11yProps(0)} />
          <Tab label="Teams" value="teams" {...a11yProps(1)} />
          <Tab label="Groups" value="groups" {...a11yProps(2)} /> 
          <Tab label="Fixtures" value="fixtures" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value="details" style={{ padding: '1rem' }}>
          <Details tournamentDetails={tournamentDetails} refreshData={() => getTournamentDetails(tournamentId)} />
        </TabPanel>
        <TabPanel value="teams" style={{ padding: '1rem' }}>
          <Teams tournamentDetails={tournamentDetails} isAdmin={isAdmin} reloadTournament={() => getTournamentDetails(tournamentId)} />
        </TabPanel>
        <TabPanel value="groups" style={{ padding: '1rem' }}>
          <Groups tournamentDetails={tournamentDetails} isAdmin={isAdmin} refreshData={() => getTournamentDetails(tournamentId)} />
        </TabPanel>
        <TabPanel value="fixtures" style={{ padding: '1rem' }}>
          <Fixtures
            fixtureArray={tournamentDetails.fixtures}
            tournament_id={tournamentDetails._id}
            tournament_status={tournamentDetails.status}
          />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Tournament;