import React from 'react';
import '../CSS/Dashboard.css';

const Dashboard = ({ score, fuel }) => {
    return (
        <div className="dashboard">
            <div className="score-board">Score: {score}</div>
            <div className="fuel-gauge">
                <div className="fuel-label">FUEL:</div>
                <div className="fuel-dots">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="fuel-dot"
                            style={{ backgroundColor: i < Math.floor(fuel / 10) ? 'blue' : 'lightgrey' }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
