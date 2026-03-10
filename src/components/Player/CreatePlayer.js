import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PrimaryButton } from "../CustomMUI/CustomButtons";
import { Avatar, CardActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { txt } from "../../common/context";
import CustomTextField from "../CustomMUI/CustomTextField";
import CameraImg from "../../assets/images/svg/camera.svg";
import Header from "../Header";
import { sendHttpRequest, uploadToS3 } from "../../common/Common";
import CustomPhoneInput from "../CustomPhoneInput/CustomPhoneInput";

const CreatePlayer = ({ isModal, closeModal }) => {
  const navigate = useNavigate();
  const [playerFirstName, setPlayerFirstName] = useState("");
  const [playerLastName, setPlayerLastName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const resetFormFields = () => {
    setPlayerFirstName("");
    setPlayerLastName("");
    setCountryCode("");
    setContactNo("");
    setProfilePic(null);
    setIsFormValid(false);
    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    let imgUrl = await uploadToS3(file);
    setProfilePic(imgUrl);

    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = async () => {
    //     setProfilePic(imgUrl);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  useEffect(() => {
    if (
      playerFirstName &&
      playerLastName &&
      countryCode &&
      contactNo &&
      contactNo.replace(countryCode, "").length === 10
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [playerFirstName, playerLastName, contactNo, countryCode]);

  const handleSubmit = () => {
    if (!playerFirstName) {
      setFirstNameError(txt.please_enter_first_name);
    } else {
      setFirstNameError("");
    }

    if (!playerLastName) {
      setLastNameError(txt.please_enter_last_name);
    } else {
      setLastNameError("");
    }

    if (!contactNo || contactNo.replace(countryCode, "").length !== 10) {
      setPhoneError(txt.please_enter_valid_phone_number);
    } else {
      setPhoneError("");
    }
    let params = {
      firstName: playerFirstName,
      lastName: playerLastName,
      contactNo: contactNo,
      profilePhoto: profilePic
    };

    if (isFormValid) {
      sendHttpRequest("POST", "/player", null, JSON.stringify(params)).then((data) => {
        toast.success(txt.player_creation_successful);
        resetFormFields();
        navigate("/playerList");
      }).catch((error) => {
        if (error?.response?.data && error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
      });
    }
  };

  return (
    <>
      <div className="pageMainContainer">
        <Header
          title={"Create Player"}
          isModal={isModal}
          closeModal={closeModal}
        />
        <div id="recaptcha-container"></div>
        <div style={{ padding: "0 20px" }}>
          <p className="text-left text-color">
            {txt.enter_players_name_and_phone_number}
          </p>
          <div className='flex-center cursor-pointer'>
            <input
              accept="image/*" type="file"
              style={{ display: "none" }}
              id="profile-pic-input"
              onChange={handleProfilePicChange}
            />
            <label htmlFor="profile-pic-input">
              <Avatar src={profilePic} variant="circular" style={{ width: 100, height: 100 }} />
              <img
                src={CameraImg} alt="Camera Icon"
                style={{ position: 'absolute', right: 0, bottom: 0, width: 30, height: 30 }}
              />
            </label>
          </div>
          <div className="flex-container">
            <div className="flex-item">
              <CustomTextField
                label={txt.first_name}
                type="text"
                value={playerFirstName}
                onChange={(e) => {
                  setPlayerFirstName(e.target.value);
                  setFirstNameError("");
                }}
              />
              {firstNameError && (
                <p className="error-message">{firstNameError}</p>
              )}
            </div>
            <div className="flex-item">
              <CustomTextField
                label={txt.last_name}
                type="text"
                value={playerLastName}
                onChange={(e) => {
                  setPlayerLastName(e.target.value);
                  setLastNameError("");
                }}
              />
              {lastNameError && (
                <p className="error-message">{lastNameError}</p>
              )}
            </div>
          </div>
          <CustomPhoneInput
            countryCode={"lk"}
            phone={contactNo}
            onCountryChange={(value) => {
              setCountryCode(value);
            }}
            onPhoneChange={(value) => {
              setContactNo(value);
            }}
            label={txt.phone_number}
          />
          {phoneError && <p className="error-message">{phoneError}</p>}
          <CardActions className="card-actions top-space">
            <PrimaryButton onClick={handleSubmit} disabled={!isFormValid}>
              {txt.continue}
            </PrimaryButton>
          </CardActions>
        </div>
      </div>
    </>
  );
};

export default CreatePlayer;
