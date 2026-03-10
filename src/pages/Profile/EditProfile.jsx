import React, { useContext, useEffect, useState } from 'react'
import { txt } from '../../common/context'
import Header from '../../components/Header'
import CameraImg from "../../assets/images/svg/camera.svg";
import CustomTextField from '../../components/CustomMUI/CustomTextField';
import { Avatar, Box, CircularProgress, Container, Typography } from '@mui/material';
import { PrimaryButton } from '../../components/CustomMUI/CustomButtons';
import { battingStyles, bowlingStyles, Genders, playingRoles } from '../../constants/data';
import { AuthContext } from '../../context/AuthContext';
import { isContactNo, sendHttpRequest, uploadToS3 } from '../../common/Common';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CustomSelectField from '../../components/CustomSelectField/CustomSelectField';
import CustomMobileInput from '../../components/CustomPhoneInput/CustomPhoneInput';

function EditProfile() {
  const { userInfo, updateUserInfo } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [contactNoError, setContactNoError] = useState('');
  const [playingRole, setPlayingRole] = useState('');
  const [battingStyle, setBattingStyle] = useState('');
  const [bowlingStyle, setBowlingStyle] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setProfilePic(userInfo.profilePhoto);
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setLocation(userInfo.location);
      setBirthDate(userInfo.birthDate);
      setEmail(userInfo.email);
      setContactNo(userInfo.contactNo);
      setPlayingRole(userInfo.playingRole);
      setBattingStyle(userInfo.battingStyle);
      setBowlingStyle(userInfo.bowlingStyle);
      setGender(userInfo.gender);
    } else {
      clearFields();
      navigate('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const clearFields = () => {
    setProfilePic(null);
    setFirstName('');
    setLastName('');
    setLocation('');
    setBirthDate('');
    setEmail('');
    setContactNo('');
    setPlayingRole('');
    setBattingStyle('');
    setBowlingStyle('');
    setGender('');
    setContactNoError('');
  }

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    let imgUrl = await uploadToS3(file);
    setProfilePic(imgUrl);
  };

  const handleUpdateUserInfo = (e) => {
    e.preventDefault();
    setContactNoError('');

    if (countryCode === "94") {
      if (!isContactNo(contactNo)) {
        setContactNoError(txt.please_enter_valid_contact_number);
        return;
      }
    } else {
      if (!contactNo) {
        setContactNoError(txt.please_enter_valid_contact_number);
        return;
      }
    }

    if (!playingRole) {
      toast.error(txt.Please_select_playing_role);
      return
    }

    if (!battingStyle) {
      toast.error(txt.Please_select_batting_style);
      return
    }

    if (!bowlingStyle) {
      toast.error(txt.Please_select_bowling_style);
      return
    }

    const data = {
      profilePhoto: profilePic,
      email: email,
      contactNo: contactNo,
      firstName: firstName,
      lastName: lastName,
      location: location,
      birthDate: birthDate,
      playingRole: playingRole,
      battingStyle: battingStyle,
      bowlingStyle: bowlingStyle,
      gender: gender,
    };

    setIsLoading(true);
    sendHttpRequest("PUT", "/player/" + userInfo._id, null, JSON.stringify(data)).then((res) => {
      const updatedData = {
        ...userInfo,
        profilePhoto: res.data?.data?.profilePhoto,
        email: res.data?.data?.email,
        contactNo: res.data?.data?.contactNo,
        firstName: res.data?.data?.firstName,
        lastName: res.data?.data?.lastName,
        location: res.data?.data?.location,
        birthDate: res.data?.data?.birthDate,
        playingRole: res.data?.data?.playingRole,
        battingStyle: res.data?.data?.battingStyle,
        bowlingStyle: res.data?.data?.bowlingStyle,
        gender: res.data?.data?.gender,
      };

      updateUserInfo(updatedData);
      toast.success("Profile Details Updated Successfully");
      navigate('/profile');
    }).catch((error) => {
      toast.error(error.response.data.message)
      console.log(error.response);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <div>
      <Header title={txt.Edit_My_Profile} />
      <Container component='form' onSubmit={handleUpdateUserInfo}>
        <Box mb={2} className='flex-center'>
          <input
            accept="image/*" type="file"
            style={{ display: "none" }}
            id="profile-pic-input"
            onChange={handleProfilePicChange}
          />
          <label htmlFor="profile-pic-input">
            <Avatar className='cursor-pointer' src={profilePic} variant="circular" style={{ width: 100, height: 100 }} />
            <img
              src={CameraImg} alt="Camera Icon" className='cursor-pointer'
              style={{ position: 'absolute', right: 0, bottom: 0, width: 30, height: 30 }}
            />
          </label>
        </Box>
        <div className="flex-between">
          <CustomTextField
            label={txt.first_name} type="text"
            value={firstName} onChange={(e) => setFirstName(e.target.value)}
          />
          <CustomTextField
            label={txt.last_name} type="text"
            value={lastName} onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <CustomTextField
          label={txt.location} type="text"
          value={location} onChange={(e) => setLocation(e.target.value)}
        />
        <CustomTextField
          label={txt.Date_of_Birth} type="date"
          InputLabelProps={{ shrink: true }}
          value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
        />
        <CustomTextField
          label={txt.email_address} type="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <CustomMobileInput
          phone={contactNo}
          countryCode={countryCode}
          onCountryChange={setCountryCode}
          onPhoneChange={setContactNo}
          label={txt.phone_number}
        />
        {contactNoError && <Typography variant='caption' color='error'>{contactNoError}</Typography>}
        <CustomSelectField
          title={txt.Playing_Role} options={playingRoles}
          value={playingRole} setValue={(value) => setPlayingRole(value)}
        />
        <CustomSelectField
          title={txt.Batting_Style} options={battingStyles}
          value={battingStyle} setValue={(value) => setBattingStyle(value)}
        />
        <CustomSelectField
          title={txt.Bowling_Style} options={bowlingStyles}
          value={bowlingStyle} setValue={(value) => setBowlingStyle(value)}
        />
        <CustomSelectField
          title={txt.Gender} options={Genders}
          value={gender} setValue={(value) => setGender(value)}
        />
        <PrimaryButton
          type="submit" disabled={isLoading}
          endIcon={isLoading && <CircularProgress color='inherit' size={'1.5rem'} />}
        >
          {txt.Update}
        </PrimaryButton>
      </Container>
    </div>
  )
}

export default EditProfile