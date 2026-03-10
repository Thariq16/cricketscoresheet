import React, { useEffect, useState } from "react";
import { CircularProgress, MenuItem, Dialog, DialogContent } from "@mui/material";
import { sendHttpRequest } from "../../common/Common";
import { toast } from "react-toastify";
import CustomTextField from "../CustomMUI/CustomTextField";
import { PrimaryButton, SecondaryButton } from "../CustomMUI/CustomButtons";

export default function EditModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [poolId, setPoolId] = useState("");
  const [poolName, setPoolName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentGround, setTournamentGround] = useState("");
  const [tournamentDate, setTournamentDate] = useState("");
  const [ballType, setBallType] = useState("");
  const [pitchType, setPitchType] = useState("");

  useEffect(() => {
    if (props.poolData) {
      setPoolName(props.poolData.name);
      setPoolId(props.poolData._id);
    } else if (props.teamData) {
      setTeamName(props.teamData.name);
      setTeamId(props.teamData._id);
    } else if (props.tournamentData) {
      setTournamentName(props.tournamentData.name);
      setTournamentGround(props.tournamentData.ground);
      setTournamentDate(props.tournamentData.date);
      setBallType(props.tournamentData.ballType);
      setPitchType(props.tournamentData.pitchType);
    }
  }, [props.poolData, props.teamData, props.tournamentData]);

  function savePoolChanges() {
    if (!poolName) {
      toast.error("Please enter pool name");
      return;
    }

    let data = { name: poolName, poolId };

    setIsLoading(true);
    sendHttpRequest("PUT", "/pool", null, JSON.stringify(data))
      .then((res) => {
        toast.success(res.data.message);
        props.reloadPoolDetails();
        props.onClose();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function saveTeamChanges() {
    if (!teamName) {
      toast.error("Please enter team name");
      return;
    }

    let data = { name: teamName, teamId };

    setIsLoading(true);
    sendHttpRequest("PUT", "/team/name", null, JSON.stringify(data))
      .then((res) => {
        toast.success(res.data.message);
        props.reloadTeamDetails();
        props.onClose();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function saveTournamentChanges() {
    if (!tournamentName) {
      toast.error("Please enter tournament name");
      return;
    }
    if (!tournamentGround) {
      toast.error("Please enter tournament ground");
      return;
    }
    if (!tournamentDate) {
      toast.error("Please enter tournament date");
      return;
    }
    if (!pitchType) {
      toast.error("Please select pitch type");
      return;
    }
    if (!ballType) {
      toast.error("Please select ball type");
      return;
    }

    let data = {
      name: tournamentName,
      ground: tournamentGround,
      date: tournamentDate,
      tournamentId: props.tournamentData._id,
      ballType,
      pitchType
    };

    setIsLoading(true);
    sendHttpRequest("PUT", "/tournament", null, JSON.stringify(data))
      .then((res) => {
        toast.success(res.data.message);
        props.reloadTournamentDetails();
        props.onClose();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const ballTypes = ["Tennis Ball", "Red Ball", "White Ball", "Pink Ball"];
  const pitchTypes = ["Indoor", "Matting", "Astra", "Turf", "Grass"];

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <h2 align="center" className="text-primary">
          {props.poolData ? "Edit Club" : props.teamData ? "Edit Team" : "Edit Tournament"}
        </h2>

        {props.poolData ? (
          <CustomTextField
            label="Club Name"
            type="text"
            value={poolName}
            onChange={(e) => setPoolName(e.target.value)}
          />
        ) : props.teamData ? (
          <CustomTextField
            label="Team Name"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        ) : props.tournamentData && (
          <div>
            <CustomTextField
              label="Tournament Name"
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
            />
            <CustomTextField
              label="Tournament Ground"
              type="text"
              value={tournamentGround}
              onChange={(e) => setTournamentGround(e.target.value)}
            />
            <CustomTextField
              label="Tournament Date"
              type="date"
              value={tournamentDate}
              onChange={(e) => setTournamentDate(e.target.value)}
            />
            <div className="flex-between">
              <CustomTextField
                select
                label="Pitch type"
                className="me-15"
                value={pitchType}
                onChange={(e) => setPitchType(e.target.value)}
              >
                {pitchTypes.map((pitch, index) => (
                  <MenuItem key={index} value={pitch}>{pitch}</MenuItem>
                ))}
              </CustomTextField>
              <CustomTextField
                select
                label="Ball type"
                className="me-15"
                value={ballType}
                onChange={(e) => setBallType(e.target.value)}
              >
                {ballTypes.map((ball, index) => (
                  <MenuItem key={index} value={ball}>{ball}</MenuItem>
                ))}
              </CustomTextField>
            </div>
          </div>
        )}

        <div className="flex-center mt-15 mb-15">
          <SecondaryButton className="me-15 cancel-btn" onClick={props.onClose}>
            Cancel
          </SecondaryButton>

          {props.poolData ? (
            <PrimaryButton onClick={savePoolChanges}>
              {isLoading ? <CircularProgress /> : "Save changes"}
            </PrimaryButton>
          ) : props.teamData ? (
            <PrimaryButton onClick={saveTeamChanges}>
              {isLoading ? <CircularProgress /> : "Save changes"}
            </PrimaryButton>
          ) : props.tournamentData && (
            <PrimaryButton onClick={saveTournamentChanges}>
              {isLoading ? <CircularProgress /> : "Save changes"}
            </PrimaryButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}