import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabContext, TabPanel } from "@mui/lab";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import { Tab, Tabs } from "@mui/material";
import MyTournaments from "./MyTournaments";
import OtherTournaments from "./OtherTournaments";

function Tournaments() {
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
          <Tab label="My tournaments" value="my" {...a11yProps(0)} />
          <Tab label="Other tournaments" value="other" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value="my" style={{ padding: '1rem' }}><MyTournaments /></TabPanel>
        <TabPanel value="other" style={{ padding: '1rem' }}><OtherTournaments /></TabPanel>
      </TabContext>
      <SpeedDial
        open={false}
        ariaLabel="New tournament"
        onClick={() => navigate('/tournament/create')}
        style={{ position: 'absolute', bottom: 60, right: 10 }}
        icon={<SpeedDialIcon />}
      />
    </div>
  );
}

export default Tournaments;
