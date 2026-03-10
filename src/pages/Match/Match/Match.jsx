import React, { useEffect, useState } from "react";
import { LinearProgress, Tab, Tabs } from "@mui/material";
import { sendHttpRequest } from "../../../common/Common";
import { toast } from "react-toastify";
import { TabContext, TabPanel } from "@mui/lab";
import Header from "../../../components/Header";
import { useParams } from "react-router-dom";
import Details from "./Details";
import Teams from "./Teams";
import ScoreCard from "./ScoreCard";

function Match() {
  const { matchId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [tabValue, setTabValue] = useState('details');

  useEffect(() => {
    getMatchDetails(matchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  function getMatchDetails(matchId) {
    setIsLoading(true);
    sendHttpRequest("GET", "/match/id/" + matchId).then(res => {
      setMatchDetails(res.data.data);
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  if (isLoading || !matchDetails) {
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
      <Header title='Match Details' />
      <TabContext value={tabValue}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} textColor="primary" indicatorColor="primary">
          <Tab label="Details" value="details" {...a11yProps(0)} />
          {matchDetails.status !== 'NOT-STARTED' && (
            <Tab label="Scorecard" value="scorecard" {...a11yProps(1)} />
          )}
          <Tab label="Teams" value="teams" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value="details">
          <Details matchDetails={matchDetails} />
        </TabPanel>
        <TabPanel value="scorecard">
          <ScoreCard matchDetails={matchDetails} />
        </TabPanel>
        <TabPanel value="teams">
          <Teams matchDetails={matchDetails} />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Match;