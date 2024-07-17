import React from 'react';

function GenreFilter({ setGenre }) {
  const genres = [
    'All Genres', 'pop', 'rock', 'classical', 'jazz', 'electronic', 
    'country', 'hiphop', 'blues', 'folk', 'alternative', 'news', 'talk'
  ];

  return (
    <select onChange={(e) => setGenre(e.target.value === 'All Genres' ? '' : e.target.value)}>
      {genres.map(genre => (
        <option key={genre} value={genre}>
          {genre.charAt(0).toUpperCase() + genre.slice(1)}
        </option>
      ))}
    </select>
  );
}

export default GenreFilter;