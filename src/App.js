// App.js
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

  useEffect(() => {
    if (genre) {
      fetchStations(genre);
      setSearchResults([]);
    }
  }, [genre, fetchStations]);

  const selectStation = useCallback((selectedStation) => {
    setStation(selectedStation);
    setCurrentStationId(selectedStation.stationuuid);
    setIsPlaying(true);
  }, []);

  const addToFavorites = useCallback((stationToAdd) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(fav => fav.stationuuid === stationToAdd.stationuuid)) {
        return prevFavorites;
      }
      if (prevFavorites.length >= 10) {
        alert('You can only have up to 10 favorite stations.');
        return prevFavorites;
      }
      const newFavorites = [...prevFavorites, stationToAdd];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((stationToRemove) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(fav => fav.stationuuid !== stationToRemove.stationuuid);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((stationToCheck) => {
    if (!stationToCheck || !stationToCheck.stationuuid) {
      return false;
    }
    return favorites.some(fav => fav.stationuuid === stationToCheck.stationuuid);
  }, [favorites]);

  const moveToNextStation = useCallback(() => {
    if (stationList.length > 0) {
      const nextIndex = (currentStationIndex + 1) % stationList.length;
      setCurrentStationIndex(nextIndex);
      const nextStation = stationList[nextIndex];
      setStation(nextStation);
      setCurrentStationId(nextStation.stationuuid);
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  }, [currentStationIndex, stationList]);
  
  const moveToPreviousStation = useCallback(() => {
    if (stationList.length > 0) {
      const previousIndex = (currentStationIndex - 1 + stationList.length) % stationList.length;
      setCurrentStationIndex(previousIndex);
      const previousStation = stationList[previousIndex];
      setStation(previousStation);
      setCurrentStationId(previousStation.stationuuid);
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  }, [currentStationIndex, stationList]);

  const playFavorite = (favoriteStation) => {
    setStation(favoriteStation);
    setIsPlaying(true);
  };

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

  return (
    <div className="App">
      <header>
        <h1>Radio on the Internet</h1>
      </header>
      <main>
        <div className="content">
          <div className="left-panel">
            <SearchBar onSearch={handleSearch} />
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
                isFavorite={isFavorite(station)}
                onNextStation={moveToNextStation}
                onPreviousStation={moveToPreviousStation}
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