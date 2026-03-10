import React, { useContext, useState } from 'react'
import { Box, Container, Tab, Tabs } from '@mui/material';
import { txt } from '../../common/context';
import { PrimaryButton } from '../../components/CustomMUI/CustomButtons';
import { AuthContext } from '../../context/AuthContext';
import PlayerProfileInfoCard from '../../components/Player/PlayerProfileInfoCard';
import { TabContext, TabPanel } from '@mui/lab';
import { ChevronRight } from '@mui/icons-material';
import PersonalDetails from './PersonalDetails';
import PlayerStatsModal from '../../components/Player/PlayerStats/PlayerStatsModal';

function Profile() {
	const [selectedTab, setSelectedTab] = useState(txt.Personal_Details);
	const { userInfo } = useContext(AuthContext)
	const [showPlayerStats, setIsShowPlayerStats] = useState(false);

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		};
	}

	return (
		<div>
			<Container>
				<PlayerProfileInfoCard userInfo={userInfo} />
				<Box my={2} className='d-flex'>
					<PrimaryButton endIcon={<ChevronRight />} size="small" disabled>Go Pro</PrimaryButton>
					<PrimaryButton
						onClick={() => setIsShowPlayerStats(true)}
						endIcon={<ChevronRight />} size="small"
					>
						My Stats
					</PrimaryButton>
				</Box>
			</Container>
			<TabContext value={selectedTab}>
				<Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)} textColor="primary" indicatorColor="primary">
					<Tab label={txt.Personal_Details} value={txt.Personal_Details} {...a11yProps(0)} />
					<Tab label={txt.Preferences} value={txt.Preferences} {...a11yProps(1)} disabled />
					<Tab label={txt.Payments} value={txt.Payments} {...a11yProps(2)} disabled />
					<Tab label={txt.Connections} value={txt.Connections} {...a11yProps(3)} disabled />
				</Tabs>
				<TabPanel value={txt.Personal_Details}>
					<PersonalDetails />
				</TabPanel>
				<TabPanel value={txt.Preferences}>
				</TabPanel>
				<TabPanel value={txt.Payments}>
				</TabPanel>
				<TabPanel value={txt.Connections}>
				</TabPanel>
			</TabContext>
			<PlayerStatsModal show={showPlayerStats} closeModal={() => setIsShowPlayerStats(false)} userInfo={userInfo} />
		</div>
	)
}

export default Profile