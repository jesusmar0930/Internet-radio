import React from 'react';

function SongInfo({ info }) {
  if (!info) return null;

  return (
    <div className="song-info">
      <h3>Song Information</h3>
      <p><strong>Title:</strong> {info.name}</p>
      <p><strong>Artist:</strong> {info.artist.name}</p>
      {info.album && <p><strong>Album:</strong> {info.album.title}</p>}
      {info.wiki && <p><strong>Summary:</strong> {info.wiki.summary}</p>}
    </div>
  );
}

export default SongInfo;