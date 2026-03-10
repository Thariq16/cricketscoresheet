import { Fab, Typography } from '@mui/material'
import { Edit } from '@mui/icons-material'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

function PersonalDetails() {
  const navigate = useNavigate()
  const { userInfo } = useContext(AuthContext)

  return (
    <div className='d-flex flex-column'>
      <div className="flex-between w-100">
        <div>
          <Typography variant='subtitle2' color="textSecondary">Name</Typography>
          <Typography variant='body1'>{userInfo.firstName} {userInfo.lastName}</Typography>
        </div>
        <Fab className='primary-btn' size='small' onClick={() => navigate('/profile/edit')}><Edit /></Fab>
      </div>
      <div className='w-100'>
        <Typography variant='subtitle2' color="textSecondary">Email</Typography>
        <Typography variant='body1'>{userInfo.email}</Typography>
      </div>
      <div className='w-100'>
        <Typography variant='subtitle2' color="textSecondary">Contact Number</Typography>
        <Typography variant='body1'>+{userInfo.contactNo}</Typography>
      </div>
      <div className='w-100'>
        <Typography variant='subtitle2' color="textSecondary">Gender</Typography>
        <Typography variant='body1'>{userInfo.gender}</Typography>
      </div>
      <div className='w-100'>
        <Typography variant='subtitle2' color="textSecondary">Date of birth</Typography>
        <Typography variant='body1'>{userInfo.birthDate}</Typography>
      </div>
      <div className='w-100'>
        <Typography variant='subtitle2' color="textSecondary">Player Role</Typography>
        <Typography variant='body1'>{userInfo.gender}</Typography>
      </div>
      <div className='w-100'>
        <Typography variant='subtitle2' color="textSecondary">Batting Style</Typography>
        <Typography variant='body1'>{userInfo.battingStyle}</Typography>
      </div>
      <div className='w-100'>
        <Typography variant='subtitle2' color="textSecondary">Bowling Style</Typography>
        <Typography variant='body1'>{userInfo.bowlingStyle}</Typography>
      </div>
    </div>
  )
}

export default PersonalDetails