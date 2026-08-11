import React, { useState } from 'react';

function MovieCard({ 
  id, 
  title, 
  url, 
  genre, 
  watched, 
  rating, 
  personalRating, 
  thumbnail, 
  toggleWatched, 
  deleteMovie, 
  updateRating 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newRating, setNewRating] = useState(personalRating === -1 ? '' : personalRating);

  const handleSaveRating = () => {
    // 1. Allow empty input to reset the rating
    if (newRating.trim() === '') {
      updateRating(title, -1);
      setIsEditing(false);
      return;
    }

    const parsedRating = parseFloat(newRating);

    // 2. Validate: Must be a number between 0 and 10
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
      alert("Please enter a valid rating between 0 and 10.");
      return;
    }

    // 3. Save valid rating (rounded to whole number or decimal as needed)
    updateRating(title, parsedRating);
    setIsEditing(false);
  };

  return (
    <div className="movie-card">
      <img src={thumbnail} alt={title} width="100" />

      <div className="movie-details">
        <h2>{id}. {title}</h2>
        URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        <p>Genre: {genre}</p>
        <p>OMDb Rating: {rating === -1 ? "Not Rated" : rating}</p>
        <p>Personal Rating: {personalRating === -1 ? "Not Rated" : personalRating}</p>
        <p>{watched ? "Watched" : "Not Watched"}</p>

        {/* Rating Edit Section */}
        {isEditing ? (
          <div style={{ margin: "5px 0" }}>
            <label>
              New Rating (0-10):
              <input
                type="number"
                min="0"
                max="10"
                step="1"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
              />
            </label>
            <button onClick={handleSaveRating}>Save</button>
            <button onClick={() => {
              setNewRating(personalRating === -1 ? '' : personalRating); // Reset on cancel
              setIsEditing(false);
            }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)}>Update Rating</button>
        )}

        <button onClick={() => toggleWatched(title)}>
          Mark as {watched ? "Not Watched" : "Watched"}
        </button>

        <button onClick={() => {
          const confirmDelete = window.confirm(`Are you sure you want to delete "${title}"?`);
          if (confirmDelete) deleteMovie(title);
        }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default MovieCard;