import React, { useState, useEffect, useCallback } from 'react';
import StationPlayer from './components/StationPlayer';
import FavoritesList from './components/FavoritesList';
import GenreSelector from './components/GenreSelector';
import StationList from './components/StationList';
import PopularStations from './components/PopularStations';
import SearchBar from './components/SearchBar'; 

import './App.css';

const API_BASE = 'https://de1.api.radio-browser.info/json';

function App() {
  const [station, setStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStationId, setCurrentStationId] = useState(null);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [genre, setGenre] = useState('');
  const [stationList, setStationList] = useState([]);
  const [searchResults, setSearchResults] = useState([]); 

  const filterPlayableStations = useCallback((stations) => {
    return stations.filter(station => 
      station.url_resolved && 
      station.url_resolved.startsWith('http') &&
      station.codec
    );
  }, []);

  const fetchStations = useCallback(async (selectedGenre) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&language=english`;
      if (selectedGenre) {
        url += `&tag=${encodeURIComponent(selectedGenre)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const stations = await response.json();
      const playableStations = filterPlayableStations(stations);
      setStationList(playableStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
      setError('Failed to fetch stations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filterPlayableStations]);

 

  const selectStation = useCallback((selectedStation) => {
    setStation(selectedStation);
    setCurrentStationId(selectedStation.id);
    setIsPlaying(true);
  }, []);

  const addToFavorites = useCallback(() => {
    if (station) {
      setFavorites(prevFavorites => {
        if (prevFavorites.some(fav => fav.id === station.id)) {
          return prevFavorites;
        }
        if (prevFavorites.length >= 10) {
          alert('You can only have up to 10 favorite stations.');
          return prevFavorites;
        }
        return [...prevFavorites, station];
      });
    }
  }, [station]);

  const removeFromFavorites = useCallback(() => {
    if (station) {
      setFavorites(prevFavorites => 
        prevFavorites.filter(fav => fav.id !== station.id)
      );
    }
  }, [station]);

  const moveToNextStation = useCallback(() => {
    if (stationList.length > 0) {
      const nextIndex = (currentStationIndex + 1) % stationList.length;
      setCurrentStationIndex(nextIndex);
      selectStation(stationList[nextIndex]);
    }
  }, [currentStationIndex, stationList, selectStation]);
  
  const moveToPreviousStation = useCallback(() => {
    if (stationList.length > 0) {
      const previousIndex = (currentStationIndex - 1 + stationList.length) % stationList.length;
      setCurrentStationIndex(previousIndex);
      selectStation(stationList[previousIndex]);
    }
  }, [currentStationIndex, stationList, selectStation]);

  const playFavorite = (favoriteStation) => {
    setStation(favoriteStation);
    setIsPlaying(true);
  };

  const isFavorite = useCallback(() => {
    return station ? favorites.some(fav => fav.id === station.id) : false;
  }, [station, favorites]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = useCallback(async (searchTerm) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/stations/search?limit=30&order=clickcount&reverse=true&language=english&name=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const stations = await response.json();
      const playableStations = filterPlayableStations(stations);
      setSearchResults(playableStations);
      setStationList(playableStations);
    } catch (error) {
      console.error('Error searching stations:', error);
      setError('Failed to search stations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filterPlayableStations]);

  // Modify the useEffect for fetchStations to clear search results when changing genres
  useEffect(() => {
    if (genre) {
      fetchStations(genre);
      setSearchResults([]); // Clear search results when changing genres
    }
  }, [genre, fetchStations]);

  return (
    <div className="App">
      <header>
        <h1>Radio on the Internet</h1>
      </header>
      <main>
        <div className="content">
          <div className="left-panel">
            <SearchBar onSearch={handleSearch} /> {/* Add the SearchBar component */}
            <GenreSelector setGenre={setGenre} />
            {isLoading && <p className="loading">Loading stations...</p>}
            {error && <p className="error">{error}</p>}
            {stationList.length > 0 && (
              <StationList stations={stationList} onSelectStation={selectStation} />
            )}
            {station && (
              <StationPlayer 
                key={currentStationId}
                station={station} 
                isPlaying={isPlaying} 
                setIsPlaying={setIsPlaying} 
                addToFavorites={addToFavorites}
                removeFromFavorites={removeFromFavorites}
                onNextStation={moveToNextStation}
                onPreviousStation={moveToPreviousStation}
                isFavorite={isFavorite()}
              />
            )}
          </div>
          <div className="right-panel">
            <PopularStations onStationSelect={selectStation} />
            <FavoritesList favorites={favorites} playFavorite={playFavorite} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;