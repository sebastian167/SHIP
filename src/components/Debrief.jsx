import { useEffect, useState } from 'react';
import { Award, Target, Zap, Clock, Trophy, BarChart2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Debrief.css';

export default function Debrief({ results, userData, onViewLeaderboard, onPlayAgain }) {
    const [isSaving, setIsSaving] = useState(true);

    // Calculate AvGeek Rank
    const getRank = (score) => {
        if (score >= 4000) return 'The Fleet Whisperer';
        if (score >= 3000) return 'Human FlightRadar24';
        if (score >= 2000) return 'Fleet Encyclopedia';
        if (score >= 1000) return 'Tail Number Tracker';
        if (score >= 500) return 'Binocular Beginner';
        return 'Rookie';
    };

    const rank = getRank(results.score);

    useEffect(() => {
        const saveScore = async () => {
            try {
                await supabase.from('leaderboard').insert([
                    {
                        call_sign: userData.callSign,
                        home_base: userData.homeBase,
                        score: results.score,
                        accuracy: parseFloat(results.accuracy),
                        longest_streak: results.longestStreak
                    }
                ]);

                // Also update the station board
                const { data } = await supabase.from('station_leaderboard').select('*').eq('home_base', userData.homeBase).single();
                if (data) {
                    await supabase.from('station_leaderboard').update({ total_score: data.total_score + results.score }).eq('home_base', userData.homeBase);
                } else {
                    await supabase.from('station_leaderboard').insert([{ home_base: userData.homeBase, total_score: results.score }]);
                }

            } catch (err) {
                console.error("Error saving score:", err);
            } finally {
                setIsSaving(false);
            }
        };

        saveScore();
    }, [userData, results]);

    return (
        <div className="debrief-container animate-in">
            <div className="glass-panel main-card">
                <h1 className="title text-accent">POST-FLIGHT DEBRIEF</h1>

                <div className="rank-container">
                    <Award size={48} className="text-primary pulse-element" style={{ borderRadius: '50%' }} />
                    <h2 className="rank-title">{rank}</h2>
                    <p className="callsign">Capt. {userData.callSign}</p>
                </div>

                <div className="metrics-grid">
                    <div className="metric-box glass-panel">
                        <Trophy className="text-accent mb-1" size={24} />
                        <div className="metric-value font-black">{results.score}</div>
                        <div className="metric-label">FINAL SCORE</div>
                    </div>
                    <div className="metric-box glass-panel">
                        <Target className="text-success mb-1" size={24} />
                        <div className="metric-value font-black">{results.accuracy}%</div>
                        <div className="metric-label">ACCURACY</div>
                    </div>
                    <div className="metric-box glass-panel">
                        <Zap className="text-accent mb-1" size={24} />
                        <div className="metric-value font-black">{results.longestStreak}</div>
                        <div className="metric-label">MAX STREAK</div>
                    </div>
                    <div className="metric-box glass-panel">
                        <Clock className="text-primary-glow mb-1" size={24} />
                        <div className="metric-value font-black">{results.averageTime}s</div>
                        <div className="metric-label">AVG RESPONSE</div>
                    </div>
                </div>

                <div className="base-pride">
                    <p>You contributed <strong className="text-accent text-lg">+{results.score} pts</strong> to base <strong>{userData.homeBase}</strong></p>
                </div>

                <div className="action-buttons">
                    <button className="btn" onClick={onPlayAgain} disabled={isSaving}>
                        FLY AGAIN
                    </button>
                    <button className="btn btn-accent" onClick={onViewLeaderboard} disabled={isSaving}>
                        <BarChart2 size={20} /> LEADERBOARDS
                    </button>
                </div>
            </div>
        </div>
    );
}
