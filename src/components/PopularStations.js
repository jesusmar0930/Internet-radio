import React, { useState, useEffect } from 'react';

const API_BASE = 'https://de1.api.radio-browser.info/json';

function PopularStations({ onStationSelect }) {
  const [popularStations, setPopularStations] = useState([]);

  useEffect(() => {
    const fetchPopularStations = async () => {
      try {
        const response = await fetch(`${API_BASE}/stations?order=clickcount&reverse=true&limit=10&language=english`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const stations = await response.json();
        // Take only the first 3 stations that have a favicon
        const filteredStations = stations.filter(station => station.favicon).slice(0, 3);
        setPopularStations(filteredStations);
      } catch (error) {
        console.error('Error fetching popular stations:', error);
      }
    };

    fetchPopularStations();
    // Fetch popular stations every 5 minutes
    const intervalId = setInterval(fetchPopularStations, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="popular-stations">
      <h2>Top 3 Popular English Stations</h2>
      <ul>
        {popularStations.map(station => (
          <li key={station.id} onClick={() => onStationSelect(station)}>
            <img src={station.favicon} alt={station.name} className="station-favicon" />
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

export default PopularStations;