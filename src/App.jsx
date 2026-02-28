import { useState } from 'react';
import Onboarding from './components/Onboarding';
import GameLoop from './components/GameLoop';
import Debrief from './components/Debrief';
import Leaderboard from './components/Leaderboard';

function App() {
  const [gameState, setGameState] = useState('ONBOARDING'); // ONBOARDING, PLAYING, DEBRIEF, LEADERBOARD
  const [userData, setUserData] = useState({ callSign: '', homeBase: '' });
  const [gameResults, setGameResults] = useState(null); // Will hold score, accuracy, streak, etc.

  const handleStartGame = (user) => {
    setUserData(user);
    setGameState('PLAYING');
  };

  const handleGameOver = (results) => {
    setGameResults(results);
    setGameState('DEBRIEF');
  };

  const handleViewLeaderboard = () => {
    setGameState('LEADERBOARD');
  };

  const handlePlayAgain = () => {
    setGameState('PLAYING');
  };

  return (
    <div className="app-container">
      {gameState === 'ONBOARDING' && <Onboarding onStart={handleStartGame} />}
      {gameState === 'PLAYING' && <GameLoop userData={userData} onGameOver={handleGameOver} />}
      {gameState === 'DEBRIEF' && (
        <Debrief
          results={gameResults}
          userData={userData}
          onViewLeaderboard={handleViewLeaderboard}
          onPlayAgain={handlePlayAgain}
        />
      )}
      {gameState === 'LEADERBOARD' && <Leaderboard onPlayAgain={handlePlayAgain} />}
    </div>
  );
}

export default App;
