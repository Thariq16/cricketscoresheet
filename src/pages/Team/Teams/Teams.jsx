import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabContext, TabPanel } from "@mui/lab";
import { SpeedDial, SpeedDialIcon, Tab, Tabs } from "@mui/material";
import MyTeams from "./MyTeams";
import OtherTeams from "./OtherTeams";

function Teams() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState('my');

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <TabContext value={tabValue}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered textColor="primary" indicatorColor="primary" >
          <Tab label="My teams" value="my" {...a11yProps(0)} />
          <Tab label="Other teams" value="other" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value="my" style={{ padding: '1rem' }}><MyTeams /></TabPanel>
        <TabPanel value="other" style={{ padding: '1rem' }}><OtherTeams /></TabPanel>
      </TabContext>
      <SpeedDial
        open={false}
        ariaLabel="New team"
        onClick={() => navigate('/team/create')}
        style={{ position: 'absolute', bottom: 60, right: 10 }}
        icon={<SpeedDialIcon />}
      />
    </div>
  );
}

export default Teams;
