import React from 'react';

function StationList({ stations, onSelectStation }) {
  return (
    <div className="station-list">
      <h2>Stations</h2>
      <ul>
        {stations.map(station => (
          <li key={station.id} onClick={() => onSelectStation(station)}>
            {station.favicon && <img src={station.favicon} alt={station.name} className="station-favicon" />}
            <div className="station-info">
              <h3>{station.name}</h3>
              <p>{station.country}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StationList;