import React, { useEffect, useState } from 'react'
import { txt } from "../../common/context";
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { PrimaryButton } from '../CustomMUI/CustomButtons';
import { toast } from 'react-toastify';
import BottomDrawer from '../BottomDrawer';

const OptionsBottonSheet = ({ isOpen, onDismiss, title, providedIcon, options, value, setValue, errorMsg }) => {
	const [selectedOption, setSelectedOption] = useState(value);

	useEffect(() => {
		setSelectedOption(value)
	}, [value, isOpen])

	const iconSx = {
		borderRadius: '50%',
		width: 40,
		height: 40,
		boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
		backgroundColor: '#f5f8fa',
		backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
	};

	const checkedIconSx = {
		...iconSx,
		backgroundColor: 'var(--primary-color)',
		backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
		'&:before': {
			display: 'block',
			width: 40,
			height: 40,
			backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
			content: '""',
		},
	};

	const handleSubmit = () => {
		if (!selectedOption) {
			toast.error(errorMsg)
			return
		}
		setValue(selectedOption)
		onDismiss()
	}

	return (
		<BottomDrawer
			isOpen={isOpen} onDismiss={onDismiss} title={title} providedIcon={providedIcon}
			description={`Select the desired ${title}`}
		>
			<RadioGroup
				name={title}
				value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}
			>
				{options.map((option, index) => (
					<FormControlLabel
						key={index} value={option}
						label={<span style={{ fontSize: "20px", fontWeight: '600' }}>{option}</span>}
						control={
							<Radio
								disableRipple
								color="default"
								checkedIcon={<span style={checkedIconSx} />}
								icon={<span style={iconSx} />}
							/>
						}
					/>
				))}
			</RadioGroup>
			<PrimaryButton className="mt-15" onClick={() => handleSubmit()}>{txt.confirm}</PrimaryButton>
		</BottomDrawer>
	)
}

export default OptionsBottonSheet