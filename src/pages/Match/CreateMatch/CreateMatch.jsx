import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendHttpRequest } from "../../../common/Common";
import MatchIcon from "../../../assets/images/svg/match.svg";
import Header from "../../../components/Header";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { CircularProgress, Container } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { txt } from '../../../common/context'
import { useNavigate, useLocation, useParams } from "react-router-dom";

function CreateMatch() {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const location = useLocation();
  const isUpdate = location.pathname.startsWith('/match/update');
  const { matchId } = useParams();
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    matchDate: "",
    matchTime: "",
    teamA: { name: '' },
    teamB: { name: '' },
    ground: "",
    matchType: "",
    overs: 0,
    ballType: "",
    pitchType: "",
  });

  useEffect(() => {
    if (isUpdate) {
      fetchMatchDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate, matchId]);

  const fetchMatchDetails = () => {
    setIsMatchLoading(true);
    sendHttpRequest("GET", "/match/id/" + matchId).then(res => {
      setFormData(res.data.data);
    }).catch((error) => {
      toast.error(error.response.data.message);
      console.log(error.response);
    }).finally(() => {
      setIsMatchLoading(false);
    });
  }

  const handleFormDataChange = (key, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  function createMatch() {
    const data = {
      ...formData,
      teamA: formData.teamA._id,
      teamB: formData.teamB._id,
      createdBy: userInfo._id,
    }

    setIsLoading(true);
    sendHttpRequest("POST", "/match/", null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message);
      navigate("/match/all")
    }).catch((error) => {
      console.log(error?.response);
      toast.error(error?.response?.data?.message)
    }).finally(() => {
      setIsLoading(false);
    });
  }

  function updateMatch() {
    const data = {
      ...formData,
      teamA: formData.teamA._id,
      teamB: formData.teamB._id,
      createdBy: userInfo._id,
    }

    setIsLoading(true);
    sendHttpRequest("PUT", `/match/${matchId}?isUpdate=true`, null, JSON.stringify(data)).then((res) => {
      toast.success(res.data.message);
      navigate("/match/info/" + matchId)
    }).catch((error) => {
      console.log(error?.response);
      toast.error(error?.response?.data?.message)
    }).finally(() => {
      setIsLoading(false);
    });
  }

  if (isMatchLoading) {
    return (
      <div className="flex-center" style={{ height: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="flex-center" style={{ height: '100%' }}>
      <Header isModal={step !== 1} closeModal={() => setStep((previousStep) => previousStep - 1)} />
      <Container>
        <img src={MatchIcon} className="round-pic" alt='icon' />
        <h1>{isUpdate ? txt.update_a_match : txt.create_a_match}</h1>
        <p>{txt.start_by_entering_the_details_of_your_match}</p>
        {step === 1 ? (
          <StepOne
            formData={formData} setFormData={handleFormDataChange}
            handleSubmit={() => setStep(2)}
          />
        ) : (
          <StepTwo
            formData={formData} setFormData={handleFormDataChange}
            handleSubmit={() => isUpdate ? updateMatch() : createMatch()} isLoading={isLoading}
          />
        )}
      </Container>
    </div>
  );
}

export default CreateMatch;