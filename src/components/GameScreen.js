import React, { useState, useEffect } from 'react';
import backgroundMusic from '../assets/audio.mp3'; // Importation du fichier audio
import Scoreboard from './Scoreboard';
import HowToPlayModal from './HowToPlayModal'; // Importation du composant modal How to Play
import '../CSS/GameScreen.css'; // Assurez-vous que le chemin est correct pour les styles CSS

const GameScreen = ({ playerName, onGameEnd }) => {
  const [gamePaused, setGamePaused] = useState(false);
  const [score, setScore] = useState(0);
  const [showingScoreboard, setShowingScoreboard] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false); // État pour afficher ou non la modal How to Play

  useEffect(() => {
    const music = document.getElementById('backgroundMusic');
    if (isMusicOn) {
      music.play().catch(error => console.log("Error playing music:", error));
    } else {
      music.pause();
    }
  }, [isMusicOn]);

  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  const endGame = () => {
    onGameEnd();
    setGamePaused(false);
    setShowingScoreboard(false);
  };

  const showScoreboard = () => {
    setShowingScoreboard(true);
    setGamePaused(false);
  };

  const restartGame = () => {
    console.log("Game restarted");
    setScore(0);
    setGamePaused(false);
    setShowingScoreboard(false);
  };

  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
  };

  const handleHowToPlay = () => {
    setShowHowToPlay(true); // Affiche la modal How to Play
  };

  const closeHowToPlay = () => {
    setShowHowToPlay(false); // Ferme la modal How to Play
  };

  return (
    <div className="game-screen">
      <audio id="backgroundMusic" loop>
        <source src={backgroundMusic} type="audio/mpeg" />
      </audio>
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={closeHowToPlay}
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel pulvinar leo. Quisque ac turpis vulputate diam gravida fermentum et a magna. Etiam maximus pulvinar porttitor. Sed lectus tellus, hendrerit tristique est ut, suscipit rutrum nisi. Sed rutrum scelerisque massa, nec sollicitudin ex placerat non. Sed nec orci et nunc rhoncus vestibulum eu a sem. Etiam imperdiet felis at odio suscipit, ut viverra elit interdum. Vestibulum at neque dictum, posuere mi sed, sagittis lacus. In tristique dictum quam a vehicula. Vivamus sit amet metus non felis rhoncus placerat. Nulla nec molestie dui, eu efficitur urna. Vestibulum vitae vehicula lorem.

        Sed ultricies neque in quam sagittis tempor ut sed neque. Ut posuere felis quis augue rutrum, sit amet luctus lectus dignissim. Donec fermentum urna et urna cursus accumsan. Mauris dignissim mauris id elit euismod, in viverra nulla aliquam. In hac habitasse platea dictumst. Phasellus ac tellus sed justo gravida faucibus. Quisque sit amet tempor risus. Ut a condimentum ipsum. Etiam quis maximus nunc. Integer convallis, nunc eget imperdiet volutpat, elit neque convallis ipsum, nec dapibus ante velit eget ante. Donec leo augue, ornare vel ornare vel, blandit vitae sapien.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel pulvinar leo. Quisque ac turpis vulputate diam gravida fermentum et a magna. Etiam maximus pulvinar porttitor. Sed lectus tellus, hendrerit tristique est ut, suscipit rutrum nisi. Sed rutrum scelerisque massa, nec sollicitudin ex placerat non. Sed nec orci et nunc rhoncus vestibulum eu a sem. Etiam imperdiet felis at odio suscipit, ut viverra elit interdum. Vestibulum at neque dictum, posuere mi sed, sagittis lacus. In tristique dictum quam a vehicula. Vivamus sit amet metus non felis rhoncus placerat. Nulla nec molestie dui, eu efficitur urna. Vestibulum vitae vehicula lorem.

        Sed ultricies neque in quam sagittis tempor ut sed neque. Ut posuere felis quis augue rutrum, sit amet luctus lectus dignissim. Donec fermentum urna et urna cursus accumsan. Mauris dignissim mauris id elit euismod, in viverra nulla aliquam. In hac habitasse platea dictumst. Phasellus ac tellus sed justo gravida faucibus. Quisque sit amet tempor risus. Ut a condimentum ipsum. Etiam quis maximus nunc. Integer convallis, nunc eget imperdiet volutpat, elit neque convallis ipsum, nec dapibus ante velit eget ante. Donec leo augue, ornare vel ornare vel, blandit vitae sapien.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel pulvinar leo. Quisque ac turpis vulputate diam gravida fermentum et a magna. Etiam maximus pulvinar porttitor. Sed lectus tellus, hendrerit tristique est ut, suscipit rutrum nisi. Sed rutrum scelerisque massa, nec sollicitudin ex placerat non. Sed nec orci et nunc rhoncus vestibulum eu a sem. Etiam imperdiet felis at odio suscipit, ut viverra elit interdum. Vestibulum at neque dictum, posuere mi sed, sagittis lacus. In tristique dictum quam a vehicula. Vivamus sit amet metus non felis rhoncus placerat. Nulla nec molestie dui, eu efficitur urna. Vestibulum vitae vehicula lorem.

        Sed ultricies neque in quam sagittis tempor ut sed neque. Ut posuere felis quis augue rutrum, sit amet luctus lectus dignissim. Donec fermentum urna et urna cursus accumsan. Mauris dignissim mauris id elit euismod, in viverra nulla aliquam. In hac habitasse platea dictumst. Phasellus ac tellus sed justo gravida faucibus. Quisque sit amet tempor risus. Ut a condimentum ipsum. Etiam quis maximus nunc. Integer convallis, nunc eget imperdiet volutpat, elit neque convallis ipsum, nec dapibus ante velit eget ante. Donec leo augue, ornare vel ornare vel, blandit vitae sapien.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel pulvinar leo. Quisque ac turpis vulputate diam gravida fermentum et a magna. Etiam maximus pulvinar porttitor. Sed lectus tellus, hendrerit tristique est ut, suscipit rutrum nisi. Sed rutrum scelerisque massa, nec sollicitudin ex placerat non. Sed nec orci et nunc rhoncus vestibulum eu a sem. Etiam imperdiet felis at odio suscipit, ut viverra elit interdum. Vestibulum at neque dictum, posuere mi sed, sagittis lacus. In tristique dictum quam a vehicula. Vivamus sit amet metus non felis rhoncus placerat. Nulla nec molestie dui, eu efficitur urna. Vestibulum vitae vehicula lorem.

        Sed ultricies neque in quam sagittis tempor ut sed neque. Ut posuere felis quis augue rutrum, sit amet luctus lectus dignissim. Donec fermentum urna et urna cursus accumsan. Mauris dignissim mauris id elit euismod, in viverra nulla aliquam. In hac habitasse platea dictumst. Phasellus ac tellus sed justo gravida faucibus. Quisque sit amet tempor risus. Ut a condimentum ipsum. Etiam quis maximus nunc. Integer convallis, nunc eget imperdiet volutpat, elit neque convallis ipsum, nec dapibus ante velit eget ante. Donec leo augue, ornare vel ornare vel, blandit vitae sapien." 
      />
      {gamePaused && !showingScoreboard ? (
        <div className="pause-menu">
          <button onClick={() => setGamePaused(false)}>Resume Game</button>
          <button onClick={endGame}>End Race</button>
          <button onClick={handleHowToPlay}>How to Play</button>
          <button onClick={showScoreboard}>Scoreboard</button>
          <button onClick={toggleMusic}>{isMusicOn ? 'Music On' : 'Music Off'}</button>
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : showingScoreboard ? (
        <Scoreboard score={score} onBack={() => setShowingScoreboard(false)} />
      ) : (
        <div>
          <div className="dashboard">
            <div className="score-board">Score: {score}</div>
            <div className="fuel-gauge">Fuel: 100%</div>
          </div>
          <div className="track">
            <div className="player-car"></div>
            <button onClick={togglePause}>Pause</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
