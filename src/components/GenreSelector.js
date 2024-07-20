import React from 'react';

const genres = [
  'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 
  'Hip Hop', 'Country', 'R&B', 'Blues', 'Folk'
];

function GenreSelector({ setGenre }) {
  return (
    <div className="genre-selector">
      <h2>Select Genre</h2>
      <div className="genre-buttons">
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g.toLowerCase())}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );  
}

export default GenreSelector;