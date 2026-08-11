import React, { useState, useEffect } from 'react';
import '../App.css';

function MovieForm({ movies, setMovies, movieLimit }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [personalRating, setPersonalRating] = useState('');
  
  const API_KEY = 'b2474078'; // Replace with your OMDb key

  // 1. Fetch autocomplete suggestions as the user types (with debouncing)
  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${API_KEY}`
        );
        const data = await res.json();
        if (data.Response === 'True') {
          setSuggestions(data.Search.slice(0, 5)); // Keep top 5 results
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }, 300); // Waits 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [query, API_KEY]);

  // 2. Fetch full details when a suggestion is selected
  async function handleSelectSuggestion(imdbID) {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`
      );
      const data = await res.json();
      
      setSelectedMovie(data);
      setQuery(data.Title); // Fill input with full title
      setSuggestions([]);   // Hide dropdown
    } catch (err) {
      console.error('Fetch details error:', err);
    }
  }

  // 3. Add the selected movie to state
  function handleSubmit(e) {
    e.preventDefault();

    if (!selectedMovie) {
      alert('Please select a movie from the search suggestions.');
      return;
    }

    if (movies.length >= movieLimit) {
      alert(`You can only add up to ${movieLimit} movies.`);
      return;
    }

    // Use the React state variable directly instead of e.target.rating.value
    let givenRating = -1;
    if (personalRating !== '') {
      givenRating = parseFloat(personalRating);
    }

    const newMovie = {
      title: selectedMovie.Title,
      url: `https://www.imdb.com/title/${selectedMovie.imdbID}/`,
      genre: selectedMovie.Genre.split(', ')[0],
      rating: selectedMovie.imdbRating !== 'N/A' ? selectedMovie.imdbRating : -1,
      personalRating: givenRating,
      thumbnail: selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : '',
      watched: false,
    };

    setMovies([...movies, newMovie]);

    // Reset form inputs
    setQuery('');
    setPersonalRating('');
    setSelectedMovie(null);
    alert(`${newMovie.title} added to watchlist!`);
  }


  function manageRatingInput(event) {
    const value = event.target.value;

    // 1. Allow empty string so the user can delete/clear the field
    if (value === "") {
      setPersonalRating("");
      return;
    }

    const num = parseFloat(value);

    // 2. Validate bounds (0 to 10) and step increment
    const isValidRange = num >= 0 && num <= 10;
    const isValidStep = num % 1 === 0;

    if (isValidRange && isValidStep) {
      setPersonalRating(num);
    }
  }

  return (
    <div className="movie-form-container">
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <h2><u>Search & Add Movie</u></h2>

        <div className="autocomplete-wrapper" style={{ position: 'relative' }}>
          <label>
            Movie Title:
            <input
              type="text"
              placeholder="Start typing (e.g. Inception)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedMovie(null); // Reset selection if typing resumes
              }}
              autoComplete="off"
            />
          </label>

          {/* Autocomplete Dropdown List */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item) => (
                <li
                  key={item.imdbID}
                  onClick={() => handleSelectSuggestion(item.imdbID)}
                >
                  <img
                    src={item.Poster !== 'N/A' ? item.Poster : ''}
                    alt=""
                  />
                  <span>{item.Title} ({item.Year})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label>
          Personal Rating (Optional):
          <input
            value={personalRating}
            type="number"
            min="0"
            max="10"
            step="1"
            onChange={manageRatingInput}
          />
        </label>

        <button type="submit" disabled={!selectedMovie}>
          Add to Watchlist
        </button>
      </form>
    </div>
  );
}

export default MovieForm;