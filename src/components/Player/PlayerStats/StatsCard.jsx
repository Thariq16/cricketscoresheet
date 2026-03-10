import { Box, Typography } from '@mui/material'
import React from 'react'

function StatsCard({ number, title, backgroundColor }) {
	return (
		<Box
			p={1} display={'flex'} flexDirection='column' justifyContent='center' alignItems='center'
			style={{ background: backgroundColor === 'blue' ? '#9AC7DF40' : '#CAFFBF59', borderRadius: '15px' }}
		>
			<Typography variant='h5' gutterBottom>{number}</Typography>
			<Typography variant='body2'>{title}</Typography>
		</Box>
	)
}

export default StatsCard