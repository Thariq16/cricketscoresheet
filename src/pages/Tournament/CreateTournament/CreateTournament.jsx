import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendHttpRequest } from "../../../common/Common";
import MatchIcon from "../../../assets/images/svg/match.svg";
import Header from "../../../components/Header";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { Container } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";

function CreateTournament() {
  const { userInfo } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    ground: "",
    ballType: "",
    pitchType: "",
    tournamentType: "",
    overs: 0,
    teamCount: 0,
    registrationDeadline: "",
    currency: "LKR",
    registrationFee: 0,
    liveStreaming: "",
    numberOfGroups: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { tournamentId } = useParams();
  const isUpdate = location.pathname.startsWith('/tournament/update');

  useEffect(() => {
    if (isUpdate) {
      fetchTournamentDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate, tournamentId]);

  function fetchTournamentDetails() {
    setIsLoading(true);
    sendHttpRequest("GET", "/tournament/" + tournamentId)
      .then(res => {
        setFormData(res.data.data); // Ensure API response matches form keys
      })
      .catch(error => {
        toast.error(error.response?.data?.message || "Failed to load tournament");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleFormDataChange = (key, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  function createTournament() {
    const data = {
      ...formData,
      createdBy: userInfo._id,
      numberOfGroups: formData.numberOfGroups,

    };

    setIsLoading(true);
    sendHttpRequest("POST", "/tournament/", null, JSON.stringify(data))
      .then(res => {
        toast.success(res.data.message);
        navigate("/tournament/all");
      })
      .catch(error => {
        console.log(error?.response);
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function updateTournament() {
  const data = {
    name: formData.name,
    startDate: formData.startDate,
    endDate: formData.endDate,
    registrationDeadline: formData.registrationDeadline,
    ground: formData.ground,
    tournamentId: tournamentId,
    ballType: formData.ballType,
    pitchType: formData.pitchType,
    registrationFee: formData.registrationFee,
    currency: formData.currency,
    liveStreaming: formData.liveStreaming,
    overs: formData.overs,
    teamCount: formData.teamCount,
    tournamentType: formData.tournamentType,
    numberOfGroups: formData.numberOfGroups
  };

  setIsLoading(true);
  sendHttpRequest("PUT", "/tournament", null, JSON.stringify(data))
    .then(res => {
      toast.success(res.data.message);
      navigate("/tournament/info/" + tournamentId, {
        state: { shouldRefresh: true }
      });
    })
    .catch(error => {
      console.log(error?.response);
      toast.error(error?.response?.data?.message);
    })
    .finally(() => {
      setIsLoading(false);
    });
}

  return (
    <div className="flex-center" style={{ height: '100%' }}>
      <Header isModal={step !== 1} closeModal={() => setStep((previousStep) => previousStep - 1)} />
      <Container>
        <img src={MatchIcon} className="round-pic" alt='icon' />
        <h1>{isUpdate ? "Update Tournament" : "Create Tournament"}</h1>
        <p>Start by entering the details of your tournament</p>

        {step === 1 ? (
          <StepOne
            formData={formData} setFormData={handleFormDataChange}
            handleSubmit={() => setStep(2)}
          />
        ) : step === 2 ? (
          <StepTwo
            formData={formData} setFormData={handleFormDataChange}
            handleSubmit={() => setStep(3)}
          />
        ) : (
          <StepThree
            formData={formData} setFormData={handleFormDataChange}
            handleSubmit={() => isUpdate ? updateTournament() : createTournament()}
            isLoading={isLoading}
          />
        )}
      </Container>
    </div>
  );
}

export default CreateTournament;