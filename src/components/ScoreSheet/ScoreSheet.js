import React, { useEffect, useState } from "react";
import Style from "./ScoreSheetModal.module.css";
import CoinIcon from "../../assets/images/svg/toass.svg";
import Ball from "../../assets/images/score/Ball.svg";
import Stumps from "../../assets/images/score/Stumps.svg";
import Undo from "../../assets/images/score/Undo.svg";
import WicketSelectBottomSheet from "./WicketSelectBottomSheet";
import { sendHttpRequest } from "../../common/Common";
import { toast } from "react-toastify";
import { Backdrop, Box, CircularProgress, Container, Divider, Fab, Grid, LinearProgress, Typography } from "@mui/material";
import BallTypeRunsBottomSheet from "./BallTypeRunsBottomSheet";
import ChooseNextBatterBottomSheet from "./ChooseNextBatterBottomSheet";
import ChooseNextBowlerBottomSheet from "./ChooseNextBowlerBottomSheet";
import { PrimaryButton, SmallBlueButton } from "../CustomMUI/CustomButtons";
import EndInningOrMatchAlert from "./EndInningOrMatchAlert";
import Header from "../Header";
import { useNavigate, useLocation } from "react-router-dom";

export const BYE = 'Bye';
export const LEG_BYE = 'Leg-bye';
export const NO_BALL = 'No ball';
export const RUN_OUT = 'Run out';
export const WIDE_BALL = 'Wide ball';
export const BOWLED = 'Bowled';
export const CATCH = 'Caught';
export const STUMPED = 'Stumped';
export const LBW = 'LBW';
export const HIT_WICKET = 'Hit wicket';
export const RETIRED = 'Retired';
export const TIME_OUT = 'Timed out';
export const RUN_OUT_STRIKER = 'Run out striker';
export const RUN_OUT_NON_STRIKER = 'Run out non striker';

export default function ScoreSheet() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMatch = location.state.selectedMatch;
  const [showWicketBottomSheet, setShowWicketBottomSheet] = useState(false);
  const [showBowlerBottomSheet, setShowBowlerBottomSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState({
    open: false,
    forType: "",
    alert: "",
    buttonType: ""
  });

  const [selectedBallType, setSelectedBallType] = useState(null);

  const [state, setState] = useState({
    isBallUpdated: true,
    currentInning: "inning1",
    errorAlert: false,
    isFormFeedbackComplete: true,
    isPicked: { striker: true, nonStriker: true, bowler: true },
    informEndInning: false,
    informEndMessage: "",
    showEndMatch: false,
    isMatchOver: false,
    showMenu: false,

    teamAName: '',
    teamBName: '',
    teamARuns: 0,
    teamBRuns: 0,
    maxOvers: 50,
    overs: 0,
    teamAwickets: 0,
    teamBwickets: 0,
    teamABalls: [],
    teamBBalls: [],
    status: "",
    matchId: null,
    teamA: {},
    teamB: {},

    longstTeamName: "",
    longstTeamWidth: "",
    ballSize: "",
    ballsContainerFontSize: "",

    ballersData: [],
    batsmansData: [],

    currentBallTypeStatus: {
      [BYE]: false,
      [NO_BALL]: false,
      [RUN_OUT]: {
        status: false,
        [RUN_OUT_STRIKER]: false,
        [RUN_OUT_NON_STRIKER]: false
      },
      [WIDE_BALL]: false
    },
    overRuns: [null, null, null, null, null, null],

    seriesId: null,
    inning1: {},
    inning2: {},

    allBatsmen: [],
    allBowlers: [],
    allBowlersStates: {},
    allBatsmenStates: {},
    allBallCount: 0,
    overBallCount: 0,
    overBallCountWExtras: 0,
    isNextBatsmanInPitch: false,
    isBatting: false,
    isBowling: false,
    currentBatsman: {},
    nextBatsman: {},
    currentBowler: null,
    lastBowler: null,
    batsmanLeftOnPitch: null,

    activeBallType: "",
    currentBall: {
      batsman: null,
      nonStriker: null,
      bowler: null,
      inningId: null,
      matchId: null,
      seriesId: null,
      runs: 0,
      extras: 0,
      wicket: 0,
      wicketType: "",
      runOutType: "",
      ballType: "",
      ballCount: 0,
      ballCountWExtra: 0,
      overRuns: 0,
      overBallCount: 0,
      overBallCountWExtras: 0,
    }
  });

  useEffect(() => {
    getMatchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMatch?._id])

  const getMatchDetails = async () => {
    try {
      const matchId = selectedMatch?._id;
      const response = await sendHttpRequest('GET', `/match/${matchId}`);
      const data = response.data;

      if (data.status === 1 && data.data) {
        const {
          currentInning, teamARuns, teamBRuns, overs, teamAwickets,
          teamBwickets, teamABalls, teamBBalls, status,
          matchId, teamA, teamB, inning1,
          inning2, batsmanLeftOnPitch, isBowling, isNextBatsmanInPitch, isBatting, overBallCount, overBallCountWExtras,
          currentBatsman, nextBatsman, currentBowler
        } = data.data;

        const seriesId = data.data.series;
        const overRuns = data.data.overRuns;

        const teamAName = data.data[currentInning].battingTeam.name;
        const teamBName = data.data[currentInning].bowlingTeam.name;

        const longestName = Math.max(teamAName.length, teamBName.length);
        const longestWidth = longestName + 9;
        const longestWidthInCh = longestWidth + 'ch';

        const inningBalls = data.data[currentInning].balls;

        const currentBall = {
          ...state.currentBall,
          matchId: data.data._id,
          seriesId: data.data.series,
          ballCount: data.data[currentInning].ballCount,
          ballCountWExtra: data.data[currentInning].ballCountWExtra || data.data[currentInning].ballCount,
        };

        let lastBowler = data?.data?.lastBowler

        const allBatsmenStates = data.data[currentInning].allBatsmen.reduce((acc, batsman) => {
          acc[batsman.playerId] = batsman.status;
          return acc;
        }, {});

        const allBowlersStates = data.data[currentInning].allBowlers.reduce((acc, bowler) => {
          acc[bowler.playerId] = bowler;
          return acc;
        }, {});

        let isMatchOver;

        if (currentInning === "inning2") {
          if ((inning1?.runs - inning2?.runs + 1) < 1) {
            isMatchOver = true;
          }
        }

        setState(prevState => ({
          ...prevState,
          currentInning, currentBall, longstTeamName: longestName, longstTeamWidth: longestWidthInCh,
          teamARuns, teamBRuns, overs, teamAwickets,
          teamBwickets, teamABalls, teamBBalls, status,
          matchId, teamA, teamB, seriesId, inning1, inning2, overRuns, overBallCount, overBallCountWExtras,
          isBowling, isBatting, isNextBatsmanInPitch, currentBowler, lastBowler, nextBatsman, currentBatsman,
          teamBName, teamAName, batsmanLeftOnPitch,
          allBowlersStates,
          allBatsmenStates,
          allBowlers: data.data[currentInning].allBowlers,
          allBatsmen: data.data[currentInning].allBatsmen,
          showEndMatch: currentInning === 'inning2',
          isMatchOver,
          inningBalls
        }));

        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch match details:', error);
    }
  }

  const updateMatch = async (matchState) => {
    setIsLoading(true);
    let params = matchState;
    try {
      const data = await sendHttpRequest('PUT', `/match/${selectedMatch._id}`, null, JSON.stringify(params));

      if (data?.data?.status === 1) {
        setIsLoading(false);
        return data.data.data;
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to update match:', error);
    }
  };

  const addBall = async (currentBall) => {
    try {
      const data = await sendHttpRequest('POST', `/ball/`, null, JSON.stringify(currentBall));
      if (data.status === 1) {
        return data.data;
      }
    } catch (error) {
      console.error('Failed to add ball:', error);
    } finally {
      setIsLoading(true);
    }
  };

  const endInnings = async () => {
    // Reset state for inning 2
    const {
      nextBatsman, currentInning, isBatting, isBowling, errorAlert, isFormFeedbackComplete,
      isPicked, informEndInning, showEndMatch, overRuns, currentBallTypeStatus,
      allBallCount, overBallCount, overBallCountWExtras, isNextBatsmanInPitch,
      currentBatsman, lastBowler, activeBallType, currentBowler, currentBall
    } = resetStateToInning2();

    // Update state
    setState(prevState => ({
      showEndMatch: true,
      nextBatsman,
      currentInning,
      isBatting,
      isBowling,
      errorAlert,
      isFormFeedbackComplete,
      isPicked,
      informEndInning,
      overRuns,
      currentBallTypeStatus,
      allBallCount,
      overBallCount,
      overBallCountWExtras,
      isNextBatsmanInPitch,
      currentBatsman,
      lastBowler,
      activeBallType,
      currentBall,
      ...prevState
    }));

    // Prepare match data for API call
    const matchData = {
      // nextBatsman: nextBatsman._id,
      nextBatsman,
      currentInning,
      isNextBatsmanInPitch,
      isBowling,
      isBatting,
      overRuns,
      overBallCount,
      overBallCountWExtras,
      // currentBatsman: currentBatsman._id,
      currentBatsman,
      lastBowler,
      currentBowler
    };

    // Update match and fetch details
    await updateMatch(matchData);
    getMatchDetails();
  };

  const endMatch = async () => {
    const matchData = {
      status: "COMPLETE",
      winningTeam: state?.inning1?.runs > state?.inning2?.runs ? state?.inning1?.battingTeam?._id : state?.inning2?.battingTeam?._id,
    };

    try {
      await updateMatch(matchData);
      navigate(`/match/info/${selectedMatch._id}`);
    } catch (error) {
      console.error("Error ending match:", error.response);
    }
  };

  function getFieldingTeamPlayers(state) {
    console.log("=== Debugging getFieldingTeamPlayers ===");
    console.log("Full state:", state);
    console.log("state.currentInning:", state.currentInning);
    
    const inning = state[state.currentInning] || {};
    console.log("Current inning object:", inning);
    
    const bowlingTeam = inning.bowlingTeam;
    console.log("bowlingTeam:", bowlingTeam);
    console.log("bowlingTeam type:", typeof bowlingTeam);
    
    // Approach 1: Get the bowling team name from the inning and find the full team data
    const bowlingTeamName = bowlingTeam?.name;
    console.log("bowlingTeamName:", bowlingTeamName);
    
    // Find the corresponding team from teamA or teamB based on the bowling team name
    let fieldingTeam = null;
    if (state.teamA?.name === bowlingTeamName) {
      fieldingTeam = state.teamA;
    } else if (state.teamB?.name === bowlingTeamName) {
      fieldingTeam = state.teamB;
    }
    
    console.log("fieldingTeam:", fieldingTeam);
    
    // Try to get players from the full team data
    if (fieldingTeam) {
      console.log("fieldingTeam.playerList:", fieldingTeam.playerList);
      console.log("fieldingTeam.players:", fieldingTeam.players);
      
      if (Array.isArray(fieldingTeam.playerList)) {
        console.log("Returning fieldingTeam.playerList:", fieldingTeam.playerList);
        return fieldingTeam.playerList;
      }
      if (Array.isArray(fieldingTeam.players)) {
        console.log("Returning fieldingTeam.players:", fieldingTeam.players);
        return fieldingTeam.players;
      }
    }
    
    // Approach 2: Try to get players directly from bowlingTeam object
    if (bowlingTeam && Array.isArray(bowlingTeam.players)) {
      console.log("Returning bowlingTeam.players:", bowlingTeam.players);
      return bowlingTeam.players;
    }
    if (bowlingTeam && Array.isArray(bowlingTeam.playerList)) {
      console.log("Returning bowlingTeam.playerList:", bowlingTeam.playerList);
      return bowlingTeam.playerList;
    }
    
    // Approach 3: Use allBowlers data as fallback (contains fielding team players)
    if (state.allBowlers && Array.isArray(state.allBowlers)) {
      console.log("Using allBowlers as fallback:", state.allBowlers);
      return state.allBowlers.map(bowler => bowler.player);
    }
    
    // Approach 4: If we have the team names but not the full data, try to construct from available data
    if (bowlingTeamName) {
      console.log("Trying to construct fielding team from available data");
      // This could be extended to fetch team data if needed
    }
    
    console.log("Returning empty array - no fielding team players found");
    return [];
  }

  const handleBall = async (input) => {
    const {
      batsmanLeftOnPitch, overs, currentInning,
      isPicked, currentBatsman, nextBatsman, currentBowler, inning2
    } = state;

    let type, fielderId;
    if (typeof input === 'object' && input !== null) {
      type = input.type;
      fielderId = input.fielderId;
    } else {
      type = input;
    }

    const inning = state[currentInning];

    if (inning?.wickets === (inning?.allBatsmen.length - 1)) {
      if (state?.currentInning === "inning1") {
        endInnings();
      } else {
        endMatch();
      }

      toast.error("No more batsman left");
      return setState(prevState => ({
        ...prevState,
        informEndInning: true,
        informEndMessage: "No more batsman left"
      }));
    }

    if (state?.isMatchOver) {
      toast.success(`End of Match: ${inning2?.battingTeam?.name} won the match`, 500);
      endMatch();
      return setState(prevState => ({
        ...prevState,
        informEndInning: true,
        informEndMessage: `End of Match: ${inning2?.battingTeam?.name} won the match`
      }));
    }


    if (inning?.ballCount === 6 * overs) {

      if (state?.currentInning === "inning1") {
        endInnings();
      } else {
        endMatch();
      }
      setShowAlertModal({ open: true, forType: "alert", alert: "First inning ended", buttonType: "okay" });
      return setState(prevState => ({
        ...prevState,
        informEndInning: true,
        informEndMessage: "No more overs left"
      }));
    }


    if (!currentBatsman || !nextBatsman) {
      toast.info("Please select batter");
      return;
    }

    if (!currentBowler) {
      toast.info("Please select bowler");
      return;
    }

    if (!currentBowler || !currentBatsman?.playerId || !nextBatsman?.playerId) {
      let updatedIsPicked = { ...isPicked };
      let updatedErrorAlert = true;
      let updatedIsFormFeedbackComplete = false;

      if (!currentBowler) updatedIsPicked.bowler = false;
      if (!currentBatsman?.playerId) updatedIsPicked.striker = false;
      if (!nextBatsman?.playerId) updatedIsPicked.nonStriker = false;

      return setState(prevState => ({
        ...prevState,
        errorAlert: updatedErrorAlert,
        isFormFeedbackComplete: updatedIsFormFeedbackComplete,
        isPicked: updatedIsPicked
      }));
    }

    if (!state.isBatting) {
      await setState(prevState => ({ ...prevState, isBatting: true }));
    }
    if (!state.isNextBatsmanInPitch) {
      await setState(prevState => ({ ...prevState, isNextBatsmanInPitch: true }));
    }
    if (!state.isBowling) {
      await setState(prevState => ({ ...prevState, isBowling: true }));
    }

    if (batsmanLeftOnPitch) {
      await setState(prevState => ({ ...prevState, batsmanLeftOnPitch: null }));
    }

    switch (type) {
      case NO_BALL:
      case WIDE_BALL:
      case BYE:
      case LEG_BYE:
        await handleBallTypesWRuns(type);
        break;
      case BOWLED:
      case LBW:
      case CATCH:
      case STUMPED:
      case HIT_WICKET:
      case RETIRED:
      case TIME_OUT:
      case RUN_OUT_STRIKER:
      case RUN_OUT_NON_STRIKER:
        await handleBallTypeWickets(type, fielderId);
        break;
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        await handleBallTypesRuns(type);
        break;
      default:
        break;
    }

    let allBallCount = state.allBallCount + 1;
    let activeBallType = type === RUN_OUT_NON_STRIKER || type === RUN_OUT_STRIKER ? RUN_OUT : type;

    setState(prevState => ({
      ...prevState,
      allBallCount,
      activeBallType
    }));
  };

  const handleBallTypesWRuns = async (type) => {
  setState(prevState => {
    const currentBallTypeStatus = resetCurrentBallTypeStatus();
    let inning = { ...prevState[prevState.currentInning] };

    switch (type) {
      case NO_BALL:
        currentBallTypeStatus[NO_BALL] = !prevState?.currentBallTypeStatus[NO_BALL];
        return {
          ...prevState,
          [prevState.currentInning]: inning,
          currentBallTypeStatus
        };

      case WIDE_BALL:
        currentBallTypeStatus[WIDE_BALL] = !prevState?.currentBallTypeStatus[WIDE_BALL];
        return {
          ...prevState,
          [prevState.currentInning]: inning,
          currentBallTypeStatus
        };

      case BYE:
      case LEG_BYE:
        currentBallTypeStatus[type] = !prevState?.currentBallTypeStatus[type];
        return {
          ...prevState,
          currentBallTypeStatus
        };

      default:
        return prevState;
    }
  });
};

  const handleBallTypeWickets = async (type, fielderId) => {
    const prevState = state;
    // Always create a new copy of the inning object
    const inning = { ...prevState[prevState.currentInning] };

    let {
      tossWon,
      teamARuns,
      teamBRuns,
      teamAwickets,
      teamBwickets,
      teamABalls,
      teamBBalls,
      lastBowler,
      overRuns,
      overBallCount,
      overBallCountWExtras,
      allBatsmenStates,
      currentBatsman,
      currentBall,
      currentBallTypeStatus,
      isBatting,
      isBowling,
      batsmanLeftOnPitch,
      currentBowler,
      nextBatsman,
      isNextBatsmanInPitch
    } = prevState;

    currentBall = resetCurrentBall(currentBall);
    currentBall.batsman = currentBatsman?.playerId;
    currentBall.nonStriker = nextBatsman?.playerId;
    currentBall.bowler = currentBowler?.playerId;
    currentBall.ballType = 'NORMAL-BALL';

    const ballTypes = [];

    if (overBallCountWExtras === 0) {
      overRuns = [null, null, null, null, null, null];
    }

    // Handle run-out cases first
    if (type === RUN_OUT_STRIKER || type === RUN_OUT_NON_STRIKER) {
      ballTypes.push('R');
      currentBall.wicketType = 'RUN-OUT';
      currentBall.wicket = 1;

      if (type === RUN_OUT_STRIKER) {
        currentBall.runOutType = 'STRIKER';
        allBatsmenStates[currentBatsman.playerId] = {
          ...allBatsmenStates[currentBatsman.playerId],
          out: true,
          inPitch: false
        };
        batsmanLeftOnPitch = nextBatsman.playerId;
        currentBatsman = null;
      } else if (type === RUN_OUT_NON_STRIKER) {
        currentBall.runOutType = 'NON-STRIKER';
        allBatsmenStates[nextBatsman.playerId] = {
          ...allBatsmenStates[nextBatsman.playerId],
          out: true,
          inPitch: false
        };
        batsmanLeftOnPitch = currentBatsman.playerId;
        nextBatsman = null;
      }

      isNextBatsmanInPitch = false;
      isBatting = false;
    }
    // Handle other wicket types
    else {
      ballTypes.push(type.substring(0, 1));
      currentBall.wicketType = type;
      currentBall.wicket = 1;

      // Add fielder information for catch wickets
      if (type === CATCH && fielderId) {
        currentBall.fielder = fielderId;
      }

      allBatsmenStates[currentBatsman?.playerId] = {
        ...allBatsmenStates[currentBatsman?.playerId],
        out: true,
        inPitch: false
      };

      if (type !== CATCH) {
        batsmanLeftOnPitch = null;
      } else {
        batsmanLeftOnPitch = nextBatsman?.playerId;
      }

      if (overBallCountWExtras === 5) { // Last ball of the over
        [currentBatsman, nextBatsman] = swapBatsmen(currentBatsman, nextBatsman);
        overBallCountWExtras = 0;
        overBallCount = 0;
        isBowling = false;
        lastBowler = currentBowler?.playerId;
        currentBowler = null;
        isNextBatsmanInPitch = false;
      } else {
        currentBatsman = null;
        isBatting = false;
      }
    }

    overRuns[overBallCountWExtras] = ballTypes.join("");
    currentBall.runs += 0;
    currentBall.ballCount += 1;
    overBallCountWExtras += 1;
    overBallCount += 1;

    currentBall.ballCountWExtra += 1;
    inning.wickets += currentBall.wicket;
    inning.ballCount = currentBall.ballCount;
    inning.ballCountWExtra = currentBall.ballCountWExtra;

    currentBallTypeStatus.WIDE_BALL = false;

    const newMatchState = {
      teamARuns,
      teamBRuns,
      teamAwickets,
      teamBwickets,
      teamABalls,
      teamBBalls,
      tossWon,
      currentBatsman: currentBatsman?.playerId ?? null,
      nextBatsman: nextBatsman?.playerId ?? null,
      currentBowler: currentBowler?.playerId ?? null,
      lastBowler,
      batsmanLeftOnPitch,
      overBallCount,
      overBallCountWExtras,
      overRuns,
      isBatting,
      isBowling,
      isNextBatsmanInPitch,
      currentBallTypeStatus
    };

    currentBall.overRuns = overRuns;
    currentBall.overBallCount = overBallCount;
    currentBall.overBallCountWExtras = overBallCountWExtras;
    currentBall.overs = state.overs; // Add overs field

    try {
      await addBall(currentBall);

      const { currentBatsman: updatedCurrentBatsman,
        nextBatsman: updatedNextBatsman,
        currentBowler: updatedCurrentBowler, inning1, inning2 } = await updateMatch(newMatchState);

      setState(prevState => ({
        ...prevState,
        lastBowler,
        isNextBatsmanInPitch,
        currentBatsman: updatedCurrentBatsman,
        nextBatsman: updatedNextBatsman,
        currentBowler: updatedCurrentBowler,
        isBowling,
        isBatting,
        currentBall,
        overBallCountWExtras,
        overBallCount,
        overRuns,
        allBatsmenStates,
        [prevState.currentInning]: inning,
        currentBallTypeStatus,
        batsmanLeftOnPitch,
        inning1,
        inning2
      }));

      // Handle inning/match end conditions
      if ((state?.currentInning === "inning1") &&
        ((inning1?.ballCount === (6 * state?.overs)) ||
          (inning1?.wickets === (inning1?.allBatsmen.length - 1)))) {
        setShowAlertModal({ open: true, forType: "alert", alert: "First inning ended", buttonType: "okay" });
        endInnings();
      } else if ((state?.currentInning === "inning2") &&
        ((inning2?.ballCount === (6 * state?.overs)) ||
          (inning2?.runs > inning1?.runs) ||
          (inning2?.wickets === (inning2?.allBatsmen.length - 1)))) {
        if (inning2?.runs > inning1?.runs) {
          setShowAlertModal({ open: true, forType: "alert", alert: `Match is end team ${inning2?.battingTeam?.name} win`, buttonType: "okay" });
        } else if (inning1?.runs > inning2?.runs) {
          setShowAlertModal({ open: true, forType: "alert", alert: `Match is end team ${inning1?.battingTeam?.name} win`, buttonType: "okay" });
        }
        endMatch();
      }

    } catch (error) {
      console.error('Error updating match state:', error);
    }
  };

  const handleBallTypesRuns = async (type) => {
    let ballTypes = "";
    // Always create a new copy of the inning object
    let inning = { ...state[state.currentInning] };

    let {
      batsmanLeftOnPitch, lastBowler, allBatsmenStates, isBowling, currentBallTypeStatus, currentBowler,
      currentBatsman, nextBatsman, overBallCount, currentBall, overRuns, isBatting, isNextBatsmanInPitch,
      overBallCountWExtras, teamAwickets, teamBwickets, teamBRuns, teamARuns, teamBBalls, teamABalls, tossWon
    } = state;

    currentBall = resetCurrentBall(currentBall);

    currentBall.batsman = currentBatsman.playerId;
    currentBall.nonStriker = nextBatsman.playerId;
    currentBall.bowler = currentBowler.playerId;
    currentBall.ballType = 'NORMAL-BALL';
    currentBall.runOutType = 'NONE';
    currentBall.wicketType = 'NONE';

    if (overBallCountWExtras === 0) {
      overRuns = [null, null, null, null, null, null];
    }

    // Check if this is a wide ball or no ball
    let isWideOrNoBall = false;

    if (currentBallTypeStatus[BYE]) {
      ballTypes = 'B+\n';
      currentBall.runs += type;
      currentBall.extras += type;
    } else if (currentBallTypeStatus[LEG_BYE]) {
      ballTypes = 'LB+\n';
      currentBall.runs += type;
      currentBall.extras += type;
    } else if (currentBallTypeStatus[NO_BALL]) {
      ballTypes = 'NB+\n';
      currentBall.ballType = 'NO-BALL';
      currentBall.runs += (6 + type);
      currentBall.extras += (6 + type);
      isWideOrNoBall = true;
    } else if (currentBallTypeStatus[WIDE_BALL]) {
      ballTypes = 'WB+\n';
      currentBall.ballType = 'WIDE-BALL';
      currentBall.runs += (6 + type);
      currentBall.extras += (6 + type);
      isWideOrNoBall = true;
    } else {
      currentBall.runs += type;
    }

    if (currentBallTypeStatus[RUN_OUT].status) {
      ballTypes = 'R';
      currentBall.wicketType = 'RUN-OUT';
      currentBall.wicket = 1;
      isNextBatsmanInPitch = false;
      isBatting = false;
      if (currentBallTypeStatus[RUN_OUT][RUN_OUT_STRIKER]) {
        currentBall.runOutType = 'STRIKER';
        allBatsmenStates[currentBatsman.playerId].out = true;
        allBatsmenStates[currentBatsman.playerId].inPitch = false;
        batsmanLeftOnPitch = nextBatsman.playerId;
        currentBatsman.playerId = null;
      } else if (currentBallTypeStatus[RUN_OUT][RUN_OUT_NON_STRIKER]) {
        currentBall.runOutType = 'NON-STRIKER';
        allBatsmenStates[nextBatsman.playerId].out = true;
        allBatsmenStates[nextBatsman.playerId].inPitch = false;
        batsmanLeftOnPitch = currentBatsman.playerId;
        nextBatsman.playerId = null;
      }
    }

    overRuns[overBallCountWExtras] = ballTypes + type;
    
    // Check if this would be the last ball of the inning (before incrementing)
    const totalBallsInInning = 6 * state?.overs;
    const currentInningBallCount = state[state.currentInning]?.ballCount || 0;
    const isLastBallOfInning = (currentInningBallCount + 1) === totalBallsInInning;
    
    // Special case: if this is the last ball and it's a wide/no ball, don't count it
    // Otherwise, count all deliveries normally
    let shouldCountBall = true;
    if (isLastBallOfInning && isWideOrNoBall) {
      shouldCountBall = false;
    }
    currentBall.shouldCountBall = shouldCountBall;
    
    // Ball counting logic
    overBallCountWExtras += 1;
    
    // For over counting: normally increment for all deliveries, but not for last ball wide/no ball
    if (shouldCountBall) {
      overBallCount += 1;
    }
    
    // Only increment currentBall.ballCount if shouldCountBall is true
    if (shouldCountBall) {
      currentBall.ballCount += 1;
    }
    currentBall.ballCountWExtra += 1;

    inning.runs = (inning.runs || 0) + (currentBall.runs || 0);
    inning.extras = (inning.extras || 0) + (currentBall.extras || 0);
    
    // Inning ball counts: increment for all deliveries except last ball wide/no ball
    if (shouldCountBall) {
      inning.ballCount = (inning.ballCount || 0) + 1;
    }
    inning.ballCountWExtra = (inning.ballCountWExtra || 0) + 1;

    // Over completion logic - only when 6 legal balls are bowled
    if (overBallCount === 6) {
      [currentBatsman, nextBatsman] = swapBatsmen(currentBatsman, nextBatsman);
      overBallCountWExtras = 0;
      overBallCount = 0;
      isBowling = false;
      lastBowler = currentBowler.playerId;
      currentBowler = null;
    }

    // Batsmen swap on odd runs (only for legal deliveries or extras that allow runs)
    if (type % 2 !== 0) {
      [currentBatsman, nextBatsman] = swapBatsmen(currentBatsman, nextBatsman);
    }

    currentBallTypeStatus = resetCurrentBallTypeStatus();

    let newMatchState = {
      teamARuns, teamBRuns, teamAwickets, teamBwickets, teamABalls, teamBBalls, tossWon,
      currentBatsman: currentBatsman?.playerId ?? null,
      nextBatsman: nextBatsman?.playerId ?? null,
      currentBowler: currentBowler?.playerId ?? null,
      lastBowler,
      batsmanLeftOnPitch,
      overBallCount,
      overBallCountWExtras,
      overRuns,
      isBatting,
      isBowling,
      isNextBatsmanInPitch,
      currentBallTypeStatus
    };

    // Match ending logic for second innings
    if (state.currentInning === "inning2") {
      if ((state.inning1.runs - inning.runs + 1) < 1) {
        await setState(prevState => ({ ...prevState, isMatchOver: true }));
      }
    }

    await setState(prevState => ({ ...prevState, isBallUpdated: false }));

    currentBall.overRuns = overRuns;
    currentBall.overBallCount = overBallCount;
    currentBall.overBallCountWExtras = overBallCountWExtras;

    await addBall(currentBall);
    let { currentBatsman: updatedCurrentBatsman,
      nextBatsman: updatedNextBatsman,
      currentBowler: updatedCurrentBowler, inning1, inning2 } = await updateMatch(newMatchState);

    setSelectedBallType(null);
    setState(prevState => ({
      ...prevState,
      batsmanLeftOnPitch,
      lastBowler,
      allBatsmenStates,
      isNextBatsmanInPitch,
      isBatting,
      currentBallTypeStatus,
      [state.currentInning]: inning, // <-- update inning in state
      currentBatsman: updatedCurrentBatsman,
      nextBatsman: updatedNextBatsman,
      overBallCountWExtras,
      overBallCount,
      currentBall,
      overRuns,
      isBowling,
      currentBowler: updatedCurrentBowler,
      inning1, inning2
    }), () => setState(prevState => ({ ...prevState, isBallUpdated: true })));

    // Modified inning ending logic - check legal balls only
    if ((inning?.ballCount === (6 * state?.overs)) && (state?.currentInning === "inning1")) {
      setShowAlertModal({ open: true, forType: "alert", alert: "First inning ended", buttonType: "okay" });
      endInnings();
    } else if (
      ((inning?.ballCount === (6 * state?.overs)) && (state?.currentInning === "inning2")) ||
      (inning2?.runs > inning1?.runs)
    ) {
      if (inning2?.runs > inning1?.runs) {
        setShowAlertModal({ open: true, forType: "alert", alert: `Match is ended and team ${inning2?.battingTeam?.name} won`, buttonType: "okay" });
      } else {
        setShowAlertModal({ open: true, forType: "alert", alert: `Match is ended and team ${inning1?.battingTeam?.name} won`, buttonType: "okay" });
      }
      endMatch();
    }
};

  const resetCurrentBall = (currentBall) => {
    const inningId = state[state.currentInning]._id;

    return {
      ...currentBall,
      inningId: inningId,
      bowler: null,
      batsman: null,
      nonStriker: null,
      ballType: "",
      wicket: 0,
      runs: 0,
      extras: 0,
    };
  };

  const inning = state[state.currentInning];

  const swapBatsmen = (batsman1, batsman2) => {
    // Swapping the batsmen
    return [batsman2, batsman1];
  };

  const resetCurrentBallTypeStatus = () => {
    return {
      [NO_BALL]: false,
      [BYE]: false,
      [WIDE_BALL]: false,
      [RUN_OUT]: {
        status: false,
        [RUN_OUT_NON_STRIKER]: false,
        [RUN_OUT_STRIKER]: false
      }
    };
  };

  const resetStateToInning2 = () => {
    return {
      currentInning: "inning2",
      isBatting: false,
      isBowling: false,
      errorAlert: false,
      isFormFeedbackComplete: true,
      isPicked: {
        striker: true, nonStriker: true,
        bowler: true
      },
      informEndInning: false,
      showEndMatch: true,
      overRuns: [null, null, null, null, null, null],
      currentBallTypeStatus: {
        [BYE]: false, [NO_BALL]: false, [RUN_OUT]: { status: false, [RUN_OUT_STRIKER]: false, [RUN_OUT_NON_STRIKER]: false },
        [WIDE_BALL]: false
      },
      allBowlersStates: {},
      allBatsmenStates: {},
      allBallCount: 0,
      overBallCount: 0,
      overBallCountWExtras: 0,
      isNextBatsmanInPitch: false,
      currentBatsman: null,
      nextBatsman: null,
      currentBowler: null,
      lastBowler: null,
      activeBallType: "",
      currentBall: {
        batsman: null,
        nonStriker: null,
        bowler: null,
        inningId: null,
        matchId: null,
        seriesId: null,
        runs: 0,
        extras: 0,
        wicket: 0,
        wicketType: "",
        runOutType: "",
        ballType: "",
        ballCount: 0,
        ballCountWExtra: 0,
      }
    };
  };

  const getRunStyle = (run) => {

    if (typeof run === 'string') {
      if (run.startsWith('NB+')) return Style.noball;
      if (run.startsWith('WB+')) return Style.wideball;

      switch (run) {
        case '0':
          return Style.run0
        case '1':
          return Style.run1
        case '2':
          return Style.run2
        case '3':
          return Style.run3
        case '4':
          return Style.run4
        case '6':
          return Style.run6
        default:
          return ''
      }
    }

    // if (run === 'W') return Style.wicket;
    // if (run.startsWith('NB')) return Style.noball;
    // const runValue = parseInt(run.split(' ')[1], 10);
    // if (runValue >= 0 && runValue <= 6) return `${Style.run}${runValue}`;
    // return Style.default; // Provide a default style if needed
  };

  const minusToZero = (num) => {
    if (num < 0)
      return 0
    return num
  }

  const handleUndo = async () => {
    const lastBallId = state[state?.currentInning]?.balls.at(-1);
    const InningId = state[state?.currentInning]?._id;

    if (lastBallId === undefined && InningId === undefined) {
      toast.error("No ball to undo");
      return;
    }

    try {
      setIsLoading(true);
      await sendHttpRequest("POST", `/ball/undo`, null, JSON.stringify({ lastBallId, InningId }))
      getMatchDetails();
    } catch (error) {
      console.error('Failed to undo match:', error.response);
      toast.error("Failed to undo match");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (state.currentBowler === null && state.overBallCount === 0) {
      setShowBowlerBottomSheet(true);
    }
  }, [state.currentBowler, state.overBallCount]);

  if (!state) {
    return (
      <Backdrop open={true} style={{ zIndex: 1000 }}>
        <CircularProgress />
      </Backdrop>
    );
  }

  return (
    <div>
      <Header title='Score Sheet' />
      <Box p={1} mb={2} sx={{ background: '#1940550D' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={4}>
            <Typography variant="body2" align="center">{state?.teamAName}</Typography>
            <Typography variant="body2" align="center">
              {state[state?.currentInning]?.runs || 0}&nbsp;/&nbsp;{state[state?.currentInning]?.wickets || 0}
            </Typography>
            <Typography variant="body2" align="center" gutterBottom>
              {(Math.floor(state[state?.currentInning]?.ballCount / 6)) || 0}.{(state[state?.currentInning]?.ballCount % 6) || 0} overs
            </Typography>
            <Divider />
            {state?.currentInning === "inning1" ? (
              <>
                <Typography variant="body2" align="center" gutterBottom>EXP SCORE</Typography>
                <Typography variant="body2" align="center" gutterBottom>{Math.round((state[state?.currentInning]?.runs / state[state?.currentInning]?.ballCount) * (state?.overs * 6)) || 0}</Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" align="center" gutterBottom>TARGET</Typography>
                <Typography variant="body2" align="center" gutterBottom>{1 + state?.inning1?.runs}</Typography>
              </>
            )}
          </Grid>
          <Grid size={8}>
            <Box className='flex-between flex-column' sx={{ width: '100%', height: '100%' }}>
              <Box className={`${Style.batsManCard} ${Style.play}`} sx={{ width: '100%' }}>
                <div>
                  <p>{state?.currentBatsman?.player?.firstName}{" "}{state?.currentBatsman?.player?.lastName}</p>
                  <p>{`${state?.currentBatsman?.runs ?? 0} (${state?.currentBatsman?.ballsFaced ?? 0})`}</p>
                </div>
                <div>
                  <p>0X{state?.currentBatsman?.dots || 0}</p>
                  <p>1X{state?.currentBatsman?.one || 0}</p>
                  <p>2X{state?.currentBatsman?.two || 0}</p>
                  <p>3X{state?.currentBatsman?.three || 0}</p>
                  <p>4X{state?.currentBatsman?.boundaries || 0}</p>
                  <p>6X{state?.currentBatsman?.sixes || 0}</p>
                  <p>
                    {
                      (state?.currentBatsman?.ballsFaced > 0 ?
                        (state.currentBatsman.runs / state.currentBatsman.ballsFaced) * 100
                        : 0
                      ).toFixed(1)
                    }
                  </p>
                </div>
              </Box>
              <Box className={Style.batsManCard} sx={{ width: '100%' }}>
                <div>
                  <p>{state?.nextBatsman?.player?.firstName}{" "}{state?.nextBatsman?.player?.lastName}</p>
                  <p>{`${state?.nextBatsman?.runs ?? 0} (${state?.nextBatsman?.ballsFaced ?? 0})`}</p>
                </div>
                <div>
                  <p>0X{state?.nextBatsman?.dots || 0}</p>
                  <p>1X{state?.nextBatsman?.one || 0}</p>
                  <p>2X{state?.nextBatsman?.two || 0}</p>
                  <p>3X{state?.nextBatsman?.three || 0}</p>
                  <p>4X{state?.nextBatsman?.boundaries || 0}</p>
                  <p>6X{state?.nextBatsman?.sixes || 0}</p>
                  <p>
                    {
                      (state?.nextBatsman?.ballsFaced > 0 ?
                        (state.nextBatsman.runs / state.nextBatsman.ballsFaced) * 100
                        : 0
                      ).toFixed(1)
                    }
                  </p>
                </div>
              </Box>
              <Box className='flex-between' sx={{ width: '100%' }}>
                <SmallBlueButton onClick={() => { }} disabled={isLoading}>Switch</SmallBlueButton>
                <ChooseNextBatterBottomSheet
                  currentBatsman={state?.currentBatsman}
                  nextBatsman={state?.nextBatsman}
                  setSelectedBatter={(batsmanType, selectedBatsman) =>
                    setState((prev) => ({
                      ...prev,
                      [batsmanType]: selectedBatsman
                    }))
                  }
                  allBatsmen={
                    state?.[state.currentInning]?.allBatsmen?.filter((batter) => !batter.status.out && !batter.status.inPitch) || []
                  }
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Container maxWidth='xl'>
        <Box mb={2} className='flex-center'>
          {state.overRuns.map((run, index) => {
            const isLongText = state.overRuns[index]?.length >= 3;
            return (
              <div key={index} className={`${Style.ball} ${getRunStyle(run)}`}
                style={{
                  textAlign: 'center',
                  fontSize: isLongText ? '11px' : 'initial', // Set font size
                  fontWeight: isLongText ? 400 : 'normal' // Set font weight
                }}>
                {state.overRuns[index] !== null ? state.overRuns[index].split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    {lineIndex < state.overRuns[index].split('\n').length - 1 && <br />}
                  </React.Fragment>
                )) : ""}
              </div>
            )
          })}
        </Box>
        <Box mb={2} className='flex-between'>
          <Box p={1} className='w-100 flex-between' borderRadius={4} sx={{ background: '#63A2C8', color: '#fff' }}>
            <Box>
              <Typography variant="body2">
                {state?.currentBowler?.player?.firstName}{" "}{state?.currentBowler?.player?.lastName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" align="right">
                {state?.currentBowler?.runs}{"/"}{state?.currentBowler?.wickets}
              </Typography>
              <Typography variant="body2" align="right">
                ({(Math.floor(state?.currentBowler?.ballCount / 6)) || 0}.{(state?.currentBowler?.ballCount % 6) || 0} Overs)
              </Typography>
            </Box>
          </Box>
          <ChooseNextBowlerBottomSheet
              isOpen={showBowlerBottomSheet}
              setIsOpen={setShowBowlerBottomSheet}
              currentBowler={state.currentBowler}
              setSelectedBower={(selectedBowler) => {
                setState((prev) => ({
                  ...prev,
                currentBowler: selectedBowler,
                overRuns: [null, null, null, null, null, null]
              }));
              setShowBowlerBottomSheet(false);
            }}
            allBowlers={state?.[state?.currentInning]?.allBowlers?.filter(bowler => bowler.player._id !== state.lastBowler) || []}
        />
        </Box>
      </Container>

      {/* need run container */}
      <div className={Style.scrshtcnr4}>
        <div className={Style.firstBattingTeamsConatiner}>
          <div>
            <img src={CoinIcon} style={{ height: "24px" }} />
            <p>{state?.teamAName}</p>
          </div>
          <div>
            <p>
              CRR{" "}
              <span>
                {(() => {
                  const runs = state?.[state?.currentInning]?.runs ?? 0;
                  const overs = state?.overs ?? 1;
                  const averageRunsPerOver = (runs / overs).toFixed(1);
                  return averageRunsPerOver === 'NaN' ? '00.0' : averageRunsPerOver;
                })()}
              </span>
            </p>

            {
              state?.currentInning === "inning1" ?
                <p>
                  PAR{" "}<span>{state?.inning1?.runs ?? '0'}</span>
                </p>
                :
                <p>
                  DLS <span>{1 + state?.inning1?.runs}</span>
                </p>
            }
            <p>
              RRR{" "}
              <span>
                {((state[state?.currentInning]?.runs / ((state?.overs * 6) - state[state?.currentInning]?.ballCount)) || 0).toFixed(1)}
              </span>
            </p>
          </div>
        </div>

        {
          state.currentInning === "inning2" &&

          (state?.isMatchOver ?
            <p>
              {state?.teamAName} won by {state?.inning2?.runs} runs
            </p>
            :
            <p>
              {state?.teamAName} needs <span>{minusToZero(state?.inning1?.runs - state?.inning2?.runs + 1) || 0} runs</span> to win in{" "}
              <span>{(state?.overs * 6 - state?.inning2?.ballCount) || 0} balls</span>
            </p>)
        }
      </div>
      {(isLoading || !state) &&
        <LinearProgress />
      }
      <Box p={2} mt={2} sx={{ borderRadius: '20px 20px 0px 0px', boxShadow: '0px -4px 6px -2px rgba(0, 0, 0, 0.2)' }}>
        <Box className="flex-center">
          {[NO_BALL, WIDE_BALL, BYE, LEG_BYE].map((ball, idx) => (
            <SmallBlueButton
              key={idx} disabled={isLoading}
              onClick={() => { handleBall(ball); setSelectedBallType(ball) }}
            >
              {ball}
            </SmallBlueButton>
          ))}
        </Box>
        <Grid container spacing={1} className="my-15">
          {[0, 1, 2, 3, 4, 6].map((score, index) => (
            <Grid size={4} key={index}>
              <PrimaryButton
                style={{ fontSize: '2rem', fontWeight: 'bold' }}
                disabled={isLoading} onClick={() => handleBall(score)}
              >
                {score}
              </PrimaryButton>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={1} className="my-15">
          <Grid size={4} className="d-flex flex-column">
            <Fab
              style={{ background: '#EFF8FF', boxShadow: 'none', fontSize: '2rem' }}
              disabled={isLoading} onClick={() => handleBall(5)}
            >
              5
            </Fab>
            <Typography variant="caption">Other runs</Typography>
          </Grid>
          <Grid size={4} className="d-flex flex-column">
            <Fab
              style={{ background: '#EFF8FF', boxShadow: 'none' }}
              disabled={isLoading} onClick={() => handleUndo()}
            >
              <img src={Undo} alt="Undo" />
            </Fab>
            <Typography variant="caption">Undo</Typography>
          </Grid>
          <Grid size={4} className="d-flex flex-column">
            <Fab
              style={{ background: '#EFF8FF', boxShadow: 'none' }}
              disabled={isLoading} onClick={() => setShowWicketBottomSheet(true)}
            >
              <img src={Stumps} alt="Wicket" />
            </Fab>
            <Typography variant="caption">Wicket</Typography>
          </Grid>
          <Grid size={4} className="d-flex flex-column">
            <Fab
              style={{ background: '#EFF8FF', boxShadow: 'none' }} disabled={isLoading}
              onClick={() => setShowAlertModal({
                open: true, forType: "endInning", alert: "Are you sure you want to end the inning?", buttonType: "yesNo"
              })}
            >
              <img src={Ball} alt="End Inning" />
            </Fab>
            <Typography variant="caption">End Inning</Typography>
          </Grid>
          <Grid size={4} className="d-flex flex-column">
            <Fab
              style={{ background: '#EFF8FF', boxShadow: 'none' }} disabled={isLoading}
              onClick={() => setShowAlertModal({
                open: true, forType: "endMatch", alert: "Are you sure you want to end the match?", buttonType: "yesNo"
              })}
            >
              <img src={Ball} alt="End Match" />
            </Fab>
            <Typography variant="caption">End Match</Typography>
          </Grid>
        </Grid>
      </Box>
      <EndInningOrMatchAlert
        show={showAlertModal.open}
        alert={showAlertModal.alert}
        buttonType={showAlertModal.buttonType}
        forType={showAlertModal.forType}
        endInnings={() => endInnings()}
        endMatch={() => endMatch()}
        closeModal={() => setShowAlertModal({ open: false, forType: "", alert: "", buttonType: "" })}
      />
      <BallTypeRunsBottomSheet
        isOpen={selectedBallType}
        onDismiss={() => { setSelectedBallType(null) }}
        ballType={selectedBallType}
        handleBall={(score) => handleBall(score)}
      />
      <WicketSelectBottomSheet
        isOpen={showWicketBottomSheet}
        onDismiss={() => setShowWicketBottomSheet(false)}
        wicketTypes={[BOWLED, LBW, CATCH, STUMPED, HIT_WICKET, RUN_OUT_NON_STRIKER, RUN_OUT_STRIKER, RETIRED, TIME_OUT]}
        handleWicket={(wicket, fielderId) => handleBall({ type: wicket, fielderId })}
        fieldingTeamPlayers={getFieldingTeamPlayers(state)}
      />
    </div>
  );
}