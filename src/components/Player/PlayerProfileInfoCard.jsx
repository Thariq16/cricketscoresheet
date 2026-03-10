import { Avatar, Box, Typography } from '@mui/material';
import React from 'react'
import { SmallBlueButton } from '../CustomMUI/CustomButtons';

function PlayerProfileInfoCard({ userInfo, onClick, showCricketInfo }) {
	return (
		<div style={{ maxWidth: '100vw' }}>
			<Box onClick={() => onClick && onClick()} className={onClick ? "d-flex cursor-pointer" : "d-flex"} gridGap={10}>
				<Avatar src={userInfo.profilePhoto} variant="circular" style={{ width: 60, height: 60 }}>
					{(!userInfo.profilePhoto && userInfo.firstName) ? userInfo.firstName.charAt(0).toUpperCase() : 'F'}
				</Avatar>
				<div style={{ width: '100%' }}>
					<Typography variant="body1">{userInfo.firstName} {userInfo.lastName}</Typography>
					<SmallBlueButton disabled>Free User</SmallBlueButton>
					{showCricketInfo && (
						<Typography variant="body1">
							{userInfo.location} | {userInfo.playingRole} | {userInfo.battingStyle} | {userInfo.bowlingStyle}
						</Typography>
					)}
				</div>
			</Box>
		</div>
	)
}

export default PlayerProfileInfoCard