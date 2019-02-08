import React from 'react';

const Tooltip = ({ active, payload }) => {
    if (active) {
        return (
            <div className="tooltip">
                <p className="rate">Average Rate: {payload[0].value}%</p>
                <p className="amount">Amount of Loans: {payload[0].payload.amount}</p>
            </div>
        );
    }
    return null;
};

export default Tooltip