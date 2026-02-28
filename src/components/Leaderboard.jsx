import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trophy, AlertTriangle, Home, PlaneTakeoff } from 'lucide-react';
import './Leaderboard.css';

export default function Leaderboard({ onPlayAgain }) {
    const [activeTab, setActiveTab] = useState('global'); // 'global', 'stations', 'tricky'
    const [globalData, setGlobalData] = useState([]);
    const [stationsData, setStationsData] = useState([]);
    const [trickyData, setTrickyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboards = async () => {
            setLoading(true);
            try {
                // Fetch Global Top 20
                const { data: global } = await supabase
                    .from('leaderboard')
                    .select('*')
                    .order('score', { ascending: false })
                    .limit(20);

                if (global) setGlobalData(global);

                // Fetch Top Stations
                const { data: stations } = await supabase
                    .from('station_leaderboard')
                    .select('*')
                    .order('total_score', { ascending: false })
                    .limit(20);

                if (stations) setStationsData(stations);

                // Fetch Tricky Ten
                const { data: tricky } = await supabase
                    .from('tricky_ten')
                    .select('*')
                    .order('misses', { ascending: false })
                    .limit(10);

                if (tricky) setTrickyData(tricky);

            } catch (err) {
                console.error("Error fetching leaderboards", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboards();
    }, []);

    return (
        <div className="leaderboard-container animate-in">
            <div className="glass-panel main-card">
                <h1 className="title text-accent">LEADERBOARDS</h1>

                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
                        onClick={() => setActiveTab('global')}
                    >
                        <Trophy size={18} /> TOP PILOTS
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'stations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stations')}
                    >
                        <Home size={18} /> TOP BASES
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'tricky' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tricky')}
                    >
                        <AlertTriangle size={18} /> TRICKY 10
                    </button>
                </div>

                <div className="board-content">
                    {loading ? (
                        <div className="loading-state">
                            <PlaneTakeoff className="pulse-element" size={48} />
                            <p>Fetching ATC Data...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'global' && (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>RANK</th>
                                            <th>CALL SIGN</th>
                                            <th>BASE</th>
                                            <th className="text-right">SCORE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {globalData.length > 0 ? globalData.map((row, idx) => (
                                            <tr key={idx} className={idx < 3 ? 'top-tier' : ''}>
                                                <td className="font-bold">{idx + 1}</td>
                                                <td className="font-bold">{row.call_sign}</td>
                                                <td>{row.home_base}</td>
                                                <td className="text-right font-black text-accent">{row.score}</td>
                                            </tr>
                                        )) : <tr><td colSpan="4" className="text-center py-2">No data yet. Be the first!</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'stations' && (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>RANK</th>
                                            <th>BASE</th>
                                            <th className="text-right">TOTAL SCORE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stationsData.length > 0 ? stationsData.map((row, idx) => (
                                            <tr key={idx} className={idx === 0 ? 'top-tier' : ''}>
                                                <td className="font-bold">{idx + 1}</td>
                                                <td className="font-bold text-primary-glow">{row.home_base}</td>
                                                <td className="text-right font-black text-accent">{row.total_score}</td>
                                            </tr>
                                        )) : <tr><td colSpan="3" className="text-center py-2">No data yet. Report to base!</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'tricky' && (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>RANK</th>
                                            <th>TARGET SHIP</th>
                                            <th className="text-right">TOTAL MISSES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trickyData.length > 0 ? trickyData.map((row, idx) => (
                                            <tr key={idx} className={idx < 3 ? 'danger-tier' : ''}>
                                                <td className="font-bold">{idx + 1}</td>
                                                <td className="font-black" style={{ letterSpacing: '2px' }}>{row.ship_number}</td>
                                                <td className="text-right font-bold text-danger">{row.misses}</td>
                                            </tr>
                                        )) : <tr><td colSpan="3" className="text-center py-2">No misses yet. Pilots are sharp today!</td></tr>}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>

                <button className="btn mt-2" onClick={onPlayAgain} style={{ width: '100%' }}>
                    RETURN TO DUTY
                </button>
            </div>
        </div>
    );
}
