import React, { useEffect, useState } from "react";
import { LinearProgress, Tab, Tabs } from "@mui/material";
import { sendHttpRequest } from "../../../common/Common";
import { toast } from "react-toastify";
import { TabContext, TabPanel } from "@mui/lab";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";
import Players from "./Players";
import Matches from "./Matches";

function Team() {
  const { teamId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [teamDetails, setTeamDetails] = useState(null);
  const [tabValue, setTabValue] = useState('players');

  useEffect(() => {
    getMatchDetails(teamId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  function getMatchDetails(teamId) {
    setIsLoading(true);
    sendHttpRequest("GET", "/team/" + teamId).then(res => {
      setTeamDetails(res.data.data);
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  if (isLoading || !teamDetails) {
    return <LinearProgress />
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <Header title='Team Details' />
      <TabContext value={tabValue}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} textColor="primary" indicatorColor="primary">
          <Tab label="Players" value="players" {...a11yProps(0)} />
          <Tab label="Matches" value="matches" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value="players" style={{ padding: '1rem' }}>
          <Players teamDetails={teamDetails} />
        </TabPanel>
        <TabPanel value="matches" style={{ padding: '1rem' }}>
          <Matches teamId={teamDetails._id} />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Team;