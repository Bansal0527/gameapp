import React, { useState, useEffect } from 'react';
import { saveScore, getHighScore } from '../services/api';

const Game = ({ user }) => {
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    getHighScore(user._id).then(setHighScore).catch(console.error);
  }, [user]);

  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [showConfetti]);

  const handleGuess = () => {
    const userGuess = parseInt(guess);
    if (isNaN(userGuess)) {
      setMessage('Please enter a valid number.');
      return;
    }

    if (userGuess === targetNumber) {
      const newScore = score + 1;
      setScore(newScore);
      setMessage(`Congratulations! You guessed the number ${targetNumber}!`);
      setGameOver(true);
      saveScore(user.id, newScore).catch(console.error);
      if (newScore > highScore) {
        setHighScore(newScore);
        setShowConfetti(true);
      }
    } else if (userGuess < targetNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
    setGuess('');
  };

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('');
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="w-full max-w-md px-4 py-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Number Guessing Game
        </h1>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
          <p className="text-lg font-semibold">Welcome, {user.username}!</p>
          <p className="text-sm">Guess a number between 1 and 100:</p>
          <div className="flex space-x-2">
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="flex-grow p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your guess"
              disabled={gameOver}
            />
            <button
              onClick={handleGuess}
              disabled={gameOver}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Guess
            </button>
          </div>
          <p className={`text-center ${message.includes('Congratulations') ? 'text-green-400' : 'text-yellow-400'}`}>
            {message}
          </p>
          <div className="flex justify-between text-sm">
            <p>Current Score: <span className="font-bold text-blue-400">{score}</span></p>
            <p>High Score: <span className="font-bold text-purple-400">{highScore}</span></p>
          </div>
        </div>
      </div>
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p>{message}</p>
            {score > highScore && (
              <p className="text-lg font-semibold text-green-400 mt-2">New high score!</p>
            )}
            <button
              onClick={startNewGame}
              className="mt-6 px-6 py-2 rounded-md bg-blue-600 text-white font-semibold transition duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {/* Add confetti animation here */}
        </div>
      )}
    </div>
  );
};

export default Game;