import React from 'react';

const EarningsChart = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">Earnings Overview</h4>
      </div>
      <div className="card-body">
        <div className="chart-placeholder">
          {/* Replace this with Recharts or Chart.js integration */}
          <div style={{ height: '200px', background: '#f2f2f2', textAlign: 'center', lineHeight: '200px' }}>
            Earnings Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;
