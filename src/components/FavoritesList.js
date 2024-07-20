// FavoritesList.js
import React from 'react';

function FavoritesList({ favorites, playFavorite, removeFromFavorites }) {
  return (
    <div className="favorites-list">
      <h2>Favorites ({favorites.length}/10)</h2>
      {favorites.length === 0 ? (
        <p className="no-favorites">No favorites yet. Add some stations!</p>
      ) : (
        <ul>
          {favorites.map(station => (
            <li key={station.stationuuid} className="favorite-item">
              <img src={station.favicon || '/default-station-logo.png'} alt={station.name} className="station-favicon" />
              <div className="station-info">
                <h3>{station.name}</h3>
                <p>{station.country}</p>
              </div>
              <div className="favorite-buttons">
                <button onClick={() => playFavorite(station)} className="play-button">Play</button>
                <button onClick={() => removeFromFavorites(station)} className="remove-button">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesList;