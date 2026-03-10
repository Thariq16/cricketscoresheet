import React, { useContext } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles/app.css";
import Register from "./pages/Auth/Registration/Register";
import Tournaments from "./pages/Tournament/Tournaments/Tournaments";
import Tournament from "./pages/Tournament/Tournament/Tournament";
import TournamentSettings from "./components/tournaments/TournamentSettings";
import GettingStartedOne from "./components/GettingStarted/GettingStartedOne";
import CreatePlayer from "./components/Player/CreatePlayer";
import MyStats from "./pages/MyStats";
import CreateTournament from "./pages/Tournament/CreateTournament/CreateTournament";
import RegisterTeamTournament from "./pages/Tournament/RegisterTeamTournament";
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import { AuthContext } from './context/AuthContext';
import Layout from './Layout';
import CreateTeam from './pages/Team/CreateTeam';
import CreateMatch from './pages/Match/CreateMatch/CreateMatch';
import HomeScreen from './pages/HomeScreen';
import Matches from './pages/Match/Matches';
import Match from './pages/Match/Match/Match';
import MatchToss from './pages/Match/Match/MatchToss';
import Players from './pages/Players/Players';
import ScoreSheet from './components/ScoreSheet/ScoreSheet';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPW/ForgotPassword';
import Teams from './pages/Team/Teams/Teams';
import Team from './pages/Team/Team/Team';

function App() {
  const { authenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <ToastContainer draggable={false} autoClose={5000} position='top-center' />
      {authenticated ? (
        <Layout>
          <Routes>
            <Route exact path="/" element={<Navigate to="/home" replace />} />
            <Route exact path="/home" element={<HomeScreen/>} />
            <Route exact path="/profile" element={<Profile/>} />
            <Route exact path="/profile/edit" element={<EditProfile/>} />
            <Route exact path="/my-stats" element={<MyStats/>} />
            <Route exact path="/player/all" element={<Players/>} />
            <Route exact path="/team/create" element={<CreateTeam/>} />
            <Route exact path="/team/all" element={<Teams/>} />
            <Route exact path="/team/info/:teamId" element={<Team/>} />
            <Route exact path="/match/create" element={<CreateMatch/>} />
            <Route exact path="/match/update/:matchId" element={<CreateMatch/>} />
            <Route exact path="/match/all" element={<Matches/>} />
            <Route exact path="/match/info/:matchId" element={<Match/>} />
            <Route exact path="/match/toss" element={<MatchToss/>} />
            <Route exact path="/match/score-sheet" element={<ScoreSheet/>} />
            <Route exact path="/tournament/create" element={<CreateTournament/>} />
            <Route exact path="/tournament/update/:tournamentId" element={<CreateTournament/>} />
            <Route exact path="/tournament/all" element={<Tournaments/>} />
            <Route exact path="/tournament/info/:tournamentId" element={<Tournament/>} />
            <Route exact path="/tournament/register/:tournamentId" element={<RegisterTeamTournament/>} />
            <Route exact path="/tournament/settings/:tournamentId" element={<TournamentSettings/>} />
            <Route path="/createPlayer" element={<CreatePlayer/>} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route exact path="/" element={<Login/>} />
          <Route exact path="/gs" element={<GettingStartedOne/>} />
          <Route exact path="/signup" element={<Register/>} />
          <Route exact path="/forgotPassword" element={<ForgotPassword/>} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App;