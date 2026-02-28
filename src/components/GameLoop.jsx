import { useState, useEffect, useCallback, useRef } from 'react';
import { Target, Zap, Clock, AlertTriangle } from 'lucide-react';
import shipsData from '../data/ships.json';
import './GameLoop.css';
import { supabase } from '../supabaseClient';

const GAME_DURATION = 60;
const OPTIONS_COUNT = 4;

export default function GameLoop({ userData, onGameOver }) {
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalAnswers, setTotalAnswers] = useState(0);

    const [currentShip, setCurrentShip] = useState(null);
    const [options, setOptions] = useState([]);

    const [shake, setShake] = useState(false);
    const [glow, setGlow] = useState(false);

    const timerRef = useRef(null);

    // Generate a new question
    const generateQuestion = useCallback(() => {
        // Pick a random ship
        const targetShip = shipsData[Math.floor(Math.random() * shipsData.length)];

        // Get unique AC_TYP options
        const allTypes = [...new Set(shipsData.map(s => s.AC_TYP))].filter(t => t !== targetShip.AC_TYP);

        // Pick 3 random incorrect types
        const incorrectOptions = [];
        for (let i = 0; i < OPTIONS_COUNT - 1; i++) {
            if (allTypes.length > 0) {
                const r = Math.floor(Math.random() * allTypes.length);
                incorrectOptions.push(allTypes[r]);
                allTypes.splice(r, 1);
            }
        }

        // Combine and shuffle
        const choices = [targetShip.AC_TYP, ...incorrectOptions].sort(() => Math.random() - 0.5);

        setCurrentShip(targetShip);
        setOptions(choices);
    }, []);

    // Initialize Game
    useEffect(() => {
        generateQuestion();
        setGlow(false);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [generateQuestion]);

    // Log missed ship to 'Tricky Ten'
    const logMissedShip = async (ship) => {
        try {
            const { data, error } = await supabase
                .from('tricky_ten')
                .select('*')
                .eq('ship_number', ship)
                .single();

            if (data) {
                await supabase.from('tricky_ten').update({ misses: data.misses + 1 }).eq('ship_number', ship);
            } else {
                await supabase.from('tricky_ten').insert([{ ship_number: ship, misses: 1 }]);
            }
        } catch (err) {
            console.error("Error logging miss", err);
        }
    };

    // Handle Answer
    const handleAnswer = (selectedType) => {
        setTotalAnswers(prev => prev + 1);

        if (selectedType === currentShip.AC_TYP) {
            // CORRECT
            setCorrectAnswers(prev => prev + 1);

            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > longestStreak) setLongestStreak(newStreak);

            // Multipliers
            let pointsToAdd = 100;
            if (newStreak >= 10) {
                pointsToAdd *= 2;
                setGlow(true);
            } else if (newStreak >= 5) {
                pointsToAdd *= 1.5;
                setGlow(false);
            } else {
                setGlow(false);
            }

            setScore(prev => prev + pointsToAdd);
            generateQuestion();

        } else {
            // INCORRECT
            setStreak(0);
            setGlow(false);

            // Penalty: -2 seconds
            setTimeLeft(prev => Math.max(0, prev - 2));

            // Visual Shake
            setShake(true);
            setTimeout(() => setShake(false), 400);

            // Log miss
            logMissedShip(currentShip.SHIP);
            generateQuestion();
        }
    };

    useEffect(() => {
        if (timeLeft === 0) {
            const finalAccuracy = totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(1) : "0.0";
            const finalAvg = correctAnswers > 0 ? (GAME_DURATION / correctAnswers).toFixed(2) : "0.00";
            onGameOver({
                score: Math.floor(score),
                longestStreak,
                accuracy: finalAccuracy,
                averageTime: finalAvg,
                totalAnswers
            });
        }
    }, [timeLeft, score, longestStreak, totalAnswers, correctAnswers, onGameOver]);

    const progressPercentage = (timeLeft / GAME_DURATION) * 100;
    // Color transitions from Blue to Red
    const barColor = progressPercentage > 50
        ? 'var(--color-primary-glow)'
        : progressPercentage > 20
            ? 'var(--color-accent)'
            : 'var(--color-danger)';

    if (!currentShip) return null;

    return (
        <div className={`game-container ${shake ? 'shake-animation' : ''}`}>
            <div className="game-header">
                <div className="stats-panel glass-panel">
                    <div className="stat">
                        <span className="stat-label">SCORE</span>
                        <span className="stat-value font-black text-accent">{Math.floor(score)}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">STREAK</span>
                        <span className={`stat-value font-black ${streak >= 5 ? 'text-success' : ''}`}>
                            {streak} <Zap size={16} fill="currentColor" opacity={streak >= 5 ? 1 : 0} />
                        </span>
                    </div>
                </div>

                <div className="timer-container glass-panel">
                    <div className="timer-text font-black">
                        <Clock size={20} /> {timeLeft}s
                    </div>
                    <div className="progress-bar-bg">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercentage}%`, backgroundColor: barColor }}
                        />
                    </div>
                </div>
            </div>

            <div className="game-board">
                <div className="ship-display glass-panel">
                    <div className="ship-label"><Target size={20} /> TARGET SHIP</div>
                    <div className={`ship-number font-black ${glow ? 'blue-flame-text' : ''}`}>
                        {currentShip.SHIP}
                    </div>
                    {glow && <div className="streak-banner">🔥 2X MULTIPLIER ACTIVE 🔥</div>}
                </div>

                <div className="options-grid">
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            className="btn option-btn"
                            onClick={() => handleAnswer(opt)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
