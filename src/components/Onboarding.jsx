import { useState } from 'react';
import { PlaneTakeoff, ShieldAlert } from 'lucide-react';
import './Onboarding.css';

export default function Onboarding({ onStart }) {
    const [callSign, setCallSign] = useState('');
    const [homeBase, setHomeBase] = useState('');

    const handleStart = (e) => {
        e.preventDefault();
        if (callSign.trim() && homeBase.trim().length === 3) {
            onStart({ callSign: callSign.trim(), homeBase: homeBase.trim().toUpperCase() });
        }
    };

    return (
        <div className="onboarding-container animate-in">
            <div className="center-wrapper">
                <div className="glass-panel main-card">
                    <div className="logo-container">
                        <PlaneTakeoff size={64} className="text-primary pulse-element" />
                    </div>
                    <h1 className="title">DELTA FLEET <span className="text-accent">MASTER</span></h1>
                    <p className="subtitle">Pre-Flight Check</p>

                    <form onSubmit={handleStart} className="form-container">
                        <div className="input-group">
                            <label>Call Sign (Username)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. Maverick"
                                value={callSign}
                                onChange={(e) => setCallSign(e.target.value)}
                                maxLength={20}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Home Base</label>
                            <input
                                type="text"
                                className="input-field uppercase-input"
                                placeholder="e.g. ATL"
                                value={homeBase}
                                onChange={(e) => setHomeBase(e.target.value.replace(/[^A-Za-z]/g, '').slice(0, 3))}
                                maxLength={3}
                                required
                            />
                            {homeBase.length > 0 && homeBase.length < 3 && (
                                <small className="text-danger flex-align-center mt-1">
                                    <ShieldAlert size={14} style={{ marginRight: '4px' }} /> Must be a 3-letter code
                                </small>
                            )}
                        </div>

                        <div className="rules-box">
                            <h3 className="font-bold">Mission Objectives:</h3>
                            <ul>
                                <li>Match SHIP to the correct AC_TYP.</li>
                                <li>60 seconds. +100pts per correct hit.</li>
                                <li>Incorrect answers subtract 2s from the clock.</li>
                                <li>Streaks multiply score. 10 hits = Blue Flame!</li>
                                <li>NO PAUSING ALLOWED.</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-full"
                            disabled={!callSign.trim() || homeBase.trim().length !== 3}
                        >
                            START OPERATIONS <PlaneTakeoff size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
