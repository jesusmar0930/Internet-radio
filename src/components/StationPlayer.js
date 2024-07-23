// StationPlayer.js
import React, { useState, useRef, useEffect, useCallback } from 'react';

function StationPlayer({ 
  station, 
  isPlaying, 
  setIsPlaying, 
  addToFavorites, 
  removeFromFavorites, 
  isFavorite, 
  onNextStation, 
  onPreviousStation,
  volume,
  setVolume
}) {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const playAudio = useCallback(async () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    try {
      if (isPlaying) {
        setIsLoading(true);
        await audioElement.play();
      } else {
        audioElement.pause();
      }
    } catch (e) {
      console.error("Error playing audio:", e);
      if (e.name !== 'AbortError') {
        setError("Unable to play this station. Please try another.");
        setIsPlaying(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.src = station.url_resolved;
      setIsLoading(true);
      setError(null);

      const timeoutId = setTimeout(playAudio, 100);

      return () => {
        clearTimeout(timeoutId);
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [station, playAudio]);

  useEffect(() => {
    playAudio();
  }, [isPlaying, playAudio]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleAddToFavorites = () => {
    console.log('Add to favorites clicked for station:', station);
    addToFavorites(station);
  };

  const handleRemoveFromFavorites = () => {
    console.log('Remove from favorites clicked for station:', station);
    removeFromFavorites(station);
  };

  return (
    <div className="station-player">
      <h2>{station.name}</h2>
      <div className="station-info">
        <p><strong>Genre:</strong> {station.tags}</p>
        <p><strong>Country:</strong> {station.country}</p>
        <p><strong>Language:</strong> {station.language}</p>
        <p><strong>Bitrate:</strong> {station.bitrate} kbps</p>
      </div>
      <div className="audio-player">
        <audio ref={audioRef} />
        <div className="player-controls">
          <button className="control-button" onClick={onPreviousStation} disabled={isLoading}>
            ⏮
          </button>
          <button className="play-button" onClick={togglePlay} disabled={isLoading}>
            {isLoading ? '...' : isPlaying ? '❚❚' : '▶'}
          </button>
          <button className="control-button" onClick={onNextStation} disabled={isLoading}>
            ⏭
          </button>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
        <span className="volume-label">{Math.round(volume * 100)}%</span>
      </div>
      <p className="play-status">{isPlaying ? 'Now Playing' : 'Paused'}</p>
      <div className="favorite-buttons">
        <button onClick={handleAddToFavorites} disabled={isFavorite}>
          Add to Favorites
        </button>
        <button onClick={handleRemoveFromFavorites} disabled={!isFavorite}>
          Remove from Favorites
        </button>
      </div>
    </div>
  );
}

export default StationPlayer;