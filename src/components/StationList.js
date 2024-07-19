import React from 'react';

function StationList({ stations, onSelectStation }) {
  return (
    <div className="station-list-container">
      <h2>Stations</h2>
      <div className="station-list">
        {stations.map(station => (
          <div key={station.id} className="station-item" onClick={() => onSelectStation(station)}>
            {station.favicon && <img src={station.favicon} alt={station.name} className="station-favicon" />}
            <div className="station-info">
              <h3>{station.name}</h3>
              <p>{station.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StationList;