import React, { useEffect, useState } from 'react'
import { txt } from "../../common/context";
import { PrimaryButton, SecondaryButton } from '../CustomMUI/CustomButtons';
import { toast } from 'react-toastify';
import BottomDrawer from '../BottomDrawer';
import CustomTextField from '../CustomMUI/CustomTextField';
import { Add, Remove } from '@mui/icons-material';
import { Box } from '@mui/material';


const NumberBottonSheet = ({ isOpen, onDismiss, title, providedIcon, value, setValue, maxValue }) => {
	const [number, setNumber] = useState(value);

	useEffect(() => {
		setNumber(value)
	}, [value, isOpen])

	const handleSubmit = () => {
		if (!number) {
			toast.error(`Please enter ${title}`)
			return
		}
		setValue(number)
		onDismiss()
	}

	const handleIncrement = () => {
		if (number >= (maxValue || 10)) return
		setNumber((previousValue) => previousValue + 1)
	}

	const handleDecrement = () => {
		if (number <= 1) return
		setNumber((previousValue) => previousValue - 1)
	}

	return (
		<BottomDrawer
			isOpen={isOpen} onDismiss={onDismiss} title={title} providedIcon={providedIcon}
			description={`Select the desired ${title}`}
		>
			<Box display='flex' sx={{ gap: '1rem' }}>
				<SecondaryButton onClick={() => handleDecrement()}><Remove /></SecondaryButton>
				<CustomTextField
					style={{ margin: 0 }} type="number"
					value={number} onChange={(e) => setNumber(e.target.value)}
					InputProps={{ inputProps: { min: 1, max: maxValue } }}
				/>
				<SecondaryButton onClick={() => handleIncrement()}><Add /></SecondaryButton>
			</Box>
			<PrimaryButton className="mt-15" onClick={() => handleSubmit()}>{txt.confirm}</PrimaryButton>
		</BottomDrawer>
	)
}

export default NumberBottonSheet