import React, { useEffect, useState, useContext } from "react";
import { Grid, LinearProgress } from "@mui/material";
import { sendHttpRequest } from "../../../common/Common";
import { toast } from "react-toastify";
import MatchCard from "../../../components/Match/MatchCard";
import { PrimaryButton } from "../../../components/CustomMUI/CustomButtons";
import NoResults from "../../../components/NoResults";
import { AuthContext } from "../../../context/AuthContext";

function Fixtures({ fixtureArray, tournament_id, tournament_status }) {
  const { userInfo } = useContext(AuthContext);
  const userId = userInfo?._id;

  const [isLoading, setIsLoading] = useState(false);
  const [fixtures, setFixtures] = useState([]);
  const [currentTournamentStatus, setCurrentTournamentStatus] = useState(tournament_status);

  // Validate ObjectId
  const isValidObjectId = (id) => {
    if (typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      console.warn("Invalid fixtureId:", id);
      return false;
    }
    return true;
  };

  // Extract ObjectId from match object or string
  const getFixtureId = (fixture) => {
    if (isValidObjectId(fixture)) {
      return fixture;
    }
    if (fixture && typeof fixture === "object" && fixture._id && isValidObjectId(fixture._id)) {
      console.warn("Extracted _id from match object:", fixture._id);
      return fixture._id;
    }
    return null;
  };

  useEffect(() => {
    if (tournament_status !== "NOT-STARTED") {
      getTournamentData();
    }
  }, [fixtureArray, tournament_status, tournament_id]);

  async function getTournamentData() {
    try {
      setIsLoading(true);
      // Fetch tournament data
      const tournamentResponse = await sendHttpRequest("GET", `/tournament/${tournament_id}`, null);
      const tournament = tournamentResponse.data.data;

      // Log tournament data for debugging
      console.log("Tournament data:", {
        id: tournament_id,
        status: tournament.status,
        fixtures: tournament.fixtures,
        knockoutFixtures: tournament.knockoutFixtures,
      });

      // Update tournament status
      setCurrentTournamentStatus(tournament.status);

      // Combine group-stage and knockout fixtures, extract valid ObjectIds
      const allFixtures = [
        ...(tournament.fixtures || []).map(getFixtureId),
        ...(tournament.knockoutFixtures || []).map(getFixtureId),
      ].filter(Boolean);

      if (allFixtures.length === 0) {
        console.warn("No valid fixtures or knockoutFixtures found for tournament:", tournament_id);
        setFixtures([]);
        return;
      }

      // Fetch match details for valid fixture IDs
      const promises = allFixtures.map(async (fixtureId) => {
        try {
          const response = await sendHttpRequest("GET", `/match/id/${fixtureId}`, null);
          return response.data.data;
        } catch (error) {
          console.error(`Error fetching match ${fixtureId}:`, error.response?.data?.message || error.message);
          return null;
        }
      });
      const fixtureDataArray = await Promise.all(promises);
      const validFixtures = fixtureDataArray.filter(Boolean);
      console.log("Fetched fixtures:", validFixtures);
      setFixtures(validFixtures);
    } catch (error) {
      console.error("Error fetching tournament data:", {
        message: error.response?.data?.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Failed to load fixtures");
    } finally {
      setIsLoading(false);
    }
  }

 async function advanceToKnockouts() {
  if (!userId) {
    toast.error("User ID not found. Please log in again.");
    return;
  }
  if (!tournament_id) {
    toast.error("Tournament ID is missing.");
    return;
  }
  if (currentTournamentStatus !== "STARTED") {
    toast.error("Cannot advance: Tournament is not in STARTED status.");
    return;
  }

  setIsLoading(true);
  try {
    const data = { tournamentId: tournament_id, userId };
    console.log("Advancing to knockouts with body:", data);

    // Send JSON body instead of query parameters
    const response = await sendHttpRequest(
      "POST",
      "/tournament/advanceGroups",
      null,                 // params = null, no query string
      JSON.stringify(data),  // data = JSON string
      "application/json"     // content type
    );

    console.log("Advance response:", response.data);
    toast.success(response.data.message);

    // Update tournament status
    setCurrentTournamentStatus(response.data.tournamentStatus || "KNOCKOUTS");

    // Fetch knockout fixtures if any
    if (response.data.knockoutFixtures?.length) {
      const fixtureDataArray = await Promise.all(
        response.data.knockoutFixtures
          .map(getFixtureId)
          .filter(Boolean)
          .map(async (fixtureId) => {
            try {
              const matchData = await sendHttpRequest("GET", `/match/id/${fixtureId}`, null);
              return matchData.data.data;
            } catch (error) {
              console.error(
                `Error fetching knockout match ${fixtureId}:`,
                error.response?.data?.message || error.message
              );
              return null;
            }
          })
      );

      setFixtures((prev) => {
        const existingIds = new Set(prev.map((match) => match._id));
        const newFixtures = fixtureDataArray.filter((match) => match && !existingIds.has(match._id));
        console.log("New knockout fixtures:", newFixtures);
        return [...prev, ...newFixtures];
      });
    }

    // Refresh tournament data to stay consistent
    await getTournamentData();
  } catch (error) {
    console.error("Advance error:", {
      message: error.response?.data?.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });
    toast.error(error.response?.data?.message || "Failed to advance to knockouts");
  } finally {
    setIsLoading(false);
  }
}
  if (isLoading) return <LinearProgress />;

  if (currentTournamentStatus === "NOT-STARTED") return <NoResults text="fixtures" />;

  return (
    <div>
      <Grid container spacing={2}>
        {fixtures.map((match, index) => (
          <Grid item xs={12} key={match._id || index}>
            <MatchCard match={match} isTournament={true} />
          </Grid>
        ))}
      </Grid>
      <PrimaryButton
        onClick={advanceToKnockouts}
        style={{ marginTop: "1rem" }}
        disabled={currentTournamentStatus !== "STARTED"}
      >
        Advance to Knockouts
      </PrimaryButton>
    </div>
  );
}

export default Fixtures;