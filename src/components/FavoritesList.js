import React from 'react';

function FavoritesList({ favorites, playFavorite }) {
  return (
    <div className="favorites-list">
      <h2>Favorites ({favorites.length}/10)</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ul>
          {favorites.map(station => (
            <li key={station.id}>
              <span>{station.name}</span>
              <button onClick={() => playFavorite(station)}>Play</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FavoritesList;