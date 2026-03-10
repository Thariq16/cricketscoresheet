import React, { useState } from 'react'
import DeleteRedIcon from "../../assets/images/svg/deleteRedIcon.svg";
import { txt } from "../../common/context";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BottomDrawer from '../../components/BottomDrawer';
import { PrimaryButton } from '../../components/CustomMUI/CustomButtons';
import { CircularProgress } from '@mui/material';
import MatchCard from '../../components/Match/MatchCard';
import axios from "axios"

const DeleteMatchBottomSheet = ({ isOpen, onDismiss, match }) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = () => {
		if (match.status !== 'NOT-STARTED') {
			toast.error('Match has already started, you cannot delete it.');
			return;
		}

		setIsLoading(true);
		axios.delete(`/match/${match._id}`).then((res) => {
			toast.success(res.data.message);
			onDismiss();
			navigate(-1);
		}).catch((error) => {
			toast.error(error.response.data.message);
			console.error(error.response);
		}).finally(() => {
			setIsLoading(false);
		});
	}

	return (
		<BottomDrawer
			isOpen={isOpen} onDismiss={onDismiss} title={'Delete Match'} providedIcon={DeleteRedIcon}
			description={txt.are_you_sure_you_want_to_delete_this_match}
		>
			<MatchCard match={match} />
			<PrimaryButton
				className="mt-15" onClick={() => handleDelete()} disabled={isLoading}
				endIcon={isLoading && <CircularProgress color='inherit' size={'1.5rem'} />}
			>
				{txt.confirm}
			</PrimaryButton>
		</BottomDrawer>
	)
}

export default DeleteMatchBottomSheet