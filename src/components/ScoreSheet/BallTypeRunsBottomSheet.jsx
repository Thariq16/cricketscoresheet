import React from 'react'
import BottomDrawer from '../BottomDrawer'
import { BYE, LEG_BYE, NO_BALL, WIDE_BALL } from './ScoreSheet'
import { Box } from '@mui/material'
import { SmallBlueButton } from '../CustomMUI/CustomButtons'
import RedBall from "../../assets/images/score/Red_Ball.svg";

const BallTypeRunsBottomSheet = ({ isOpen, onDismiss, ballType, handleBall }) => {
	const handleClick = (score) => {
		handleBall(score)
		onDismiss()
	}

	return (
		<BottomDrawer isOpen={isOpen} onDismiss={onDismiss} title={ballType} description={`${ballType} + runs`} providedIcon={RedBall}>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }} mb={2}>
				{ballType === WIDE_BALL ? (
					[...Array(7)]?.map((_, score) =>
						<SmallBlueButton key={score} onClick={() => handleClick(score)} >
							{`WB + ${score}`}
						</SmallBlueButton>
					)
				) : ballType === NO_BALL ? (
					[...Array(7)]?.map((_, score) =>
						<SmallBlueButton key={score} onClick={() => handleClick(score)} >
							{`NB + ${score}`}
						</SmallBlueButton>
					)
				) : ballType === BYE ? (
					[1, 2, 3, 4, 5].map((score, index) =>
						<SmallBlueButton key={index} onClick={() => handleClick(score)} >
							{`B + ${score}`}
						</SmallBlueButton>
					)
				) : ballType === LEG_BYE && (
					[1, 2, 3, 4, 5].map((score, index) =>
						<SmallBlueButton key={index} onClick={() => handleClick(score)} >
							{`LB + ${score}`}
						</SmallBlueButton>
					)
				)}
			</Box>
		</BottomDrawer>
	)
}

export default BallTypeRunsBottomSheet