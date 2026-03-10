import React, { useEffect } from 'react'
import PlayerProfileInfoCard from '../PlayerProfileInfoCard';
import { useState } from 'react';
import { txt } from '../../../common/context';
import { Dialog, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Tab, Tabs } from '@mui/material';
import { sendHttpRequest } from '../../../common/Common';
import StatsCard from './StatsCard';
import MatchCard from '../../Match/MatchCard';
import { toast } from 'react-toastify';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { TabContext, TabPanel } from '@mui/lab';
import Stats from './Stats';
import MyTeams from '../../../pages/Team/Teams/MyTeams';

function PlayerStatsModal({ show, userInfo, closeModal }) {
	const [isLoading, setIsLoading] = useState(false);
	const [selectedTab, setSelectedTab] = useState('Statistics');
	const [totalRuns, setTotalRuns] = useState(0);
	const [totalWickets, setTotalWickets] = useState(0);
	const [playerMatches, setPlayerMatches] = useState([]);

	useEffect(() => {
		if (!show) return;
		getAllMatches();
		getTotalRuns();
		getTotalWickets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [show, userInfo._id])

	const getTotalRuns = () => {
		setIsLoading(true);
		sendHttpRequest("GET", `/batting/totalRuns/${userInfo._id}`).then((res) => {
			setTotalRuns(res.data.totalRuns)
		}).catch((error) => {
			console.log(error.response)
			toast.error(error.response.data.message);
		}).finally(() => {
			setIsLoading(false);
		});
	}

	const getAllMatches = () => {
		console.log(userInfo._id);
		sendHttpRequest("GET", `/match/user/${userInfo._id}?isUpcomingOngoing=false`).then((res) => {
			setPlayerMatches(res.data.matches);
		}).catch((error) => {
			console.log(error.response)
			toast.error(error.response.data.message);
		}).finally(() => {
			setIsLoading(false);
		});
	}

	const getTotalWickets = () => {
		sendHttpRequest("GET", `/bowling/totalWickets/${userInfo._id}`).then((res) => {
			setTotalWickets(res.data.totalWickets);
		}).catch((error) => {
			console.log(error.response)
			toast.error(error.response.data.message);
		}).finally(() => {
			setIsLoading(false);
		});
	}

	function a11yProps(index) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		};
	}

	return (
		<Dialog open={show} onClose={closeModal} fullWidth fullScreen>
			<DialogTitle style={{ alignItems: 'center' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
					<IconButton onClick={closeModal}>
						<KeyboardArrowLeft />
					</IconButton>
					Player Stats
					{playerMatches.length > 0 && (
						<span style={{ fontSize: '0.8rem', color: 'var(--color1)' }}>
							{playerMatches.length} {txt.Matches}
						</span>
					)}
				</div>
			</DialogTitle>
			<DialogContent>
				<PlayerProfileInfoCard userInfo={userInfo} showCricketInfo />
				{isLoading ? (
					<LinearProgress />
				) : (
					<>
						<Grid container spacing={2} className='my-15'>
							<Grid size={4}>
								<StatsCard number={playerMatches.length} title={txt.Matches} />
							</Grid>
							<Grid size={4}>
								<StatsCard number={totalRuns} title={txt.Runs} />
							</Grid>
							<Grid size={4}>
								<StatsCard number={totalWickets} title={txt.Wickets} />
							</Grid>
						</Grid>
						<TabContext value={selectedTab}>
							<Tabs
								value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}
								centered textColor="primary" indicatorColor="primary"
							>
								<Tab label={txt.Matches} value={txt.Matches} {...a11yProps(0)} />
								<Tab label={txt.Statistics} value={txt.Statistics} {...a11yProps(1)} />
								<Tab label={txt.Teams} value={txt.Teams} {...a11yProps(2)} />
							</Tabs>
							<TabPanel value={txt.Matches} style={{ paddingLeft: 0, paddingRight: 0 }}>
								<Grid container spacing={2} className='mt-15'>
									{playerMatches.map((match, index) => (
										<Grid size={{ xs: 12, sm: 6, md: 4 }} lg={3} key={index}>
											<MatchCard match={match} />
										</Grid>
									))}
								</Grid>
							</TabPanel>
							<TabPanel value={txt.Statistics} style={{ paddingLeft: 0, paddingRight: 0 }}>
								<Stats userInfo={userInfo} />
							</TabPanel>
							<TabPanel value={txt.Teams} style={{ paddingLeft: 0, paddingRight: 0 }}>
								<MyTeams />
							</TabPanel>
						</TabContext>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default PlayerStatsModal