import React, { useState } from 'react';
import MovieForm from './Components/MovieForm';
import MovieCard from './Components/MovieCard';
import './App.css';

function App() {
  const movieLimit = 100;
  const [usernameState, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [movies, setMovies] = useState([]);

  // Fetch user's movies from MongoDB.
  const handleLogin = async () => {
    if (!usernameState.trim()) {
      alert("Please enter a username!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${usernameState}/movies`);
      const data = await response.json();
      setMovies(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to load user data:", error);
      alert("Error connecting to database server.");
    }
  };

  // Update React state + push changes to MongoDB.
  const saveMoviesToDB = async (updatedMovies) => {
    setMovies(updatedMovies);
    if (isLoggedIn) {
      try {
        await fetch(`http://localhost:5000/api/users/${usernameState}/movies`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movies: updatedMovies })
        });
      } catch (error) {
        console.error("Failed to save to database:", error);
      }
    }
  };

  // Movie Management Handlers
  const toggleWatched = (targetTitle) => {
    const updated = movies.map(movie => 
      movie.title === targetTitle ? { ...movie, watched: !movie.watched } : movie
    );
    saveMoviesToDB(updated);
  };

  const deleteMovie = (targetTitle) => {
    const updated = movies.filter(movie => movie.title !== targetTitle);
    saveMoviesToDB(updated);
  };

  const updateRating = (targetTitle, newRating) => {
    const updated = movies.map(movie => 
      movie.title === targetTitle ? { ...movie, personalRating: newRating } : movie
    );
    saveMoviesToDB(updated);
  };

  // Sorting Handler
  const handleSort = (sortOption) => {
    let sorted = [...movies];
    if (sortOption === "Title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "Genre") {
      sorted.sort((a, b) => a.genre.localeCompare(b.genre));
    } else if (sortOption === "Rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "Watched") {
      sorted.sort((a, b) => b.watched - a.watched);
    } else if (sortOption === "Not Watched") {
      sorted.sort((a, b) => a.watched - b.watched);
    }
    saveMoviesToDB(sorted);
  };

  return (
    <div>
    {/* Website Header */}
    <header>
      <div className="HomeButton">
        <a 
          href="#home" 
          style={{ color: '#ffffff', textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault();
          }}
        > 
          Home 
        </a>
      </div>
      <h1>Movie Tracker</h1>
      <div className="LogOutButton">
        <a 
          href="#logout" 
          style={{ color: '#ffffff', textDecoration: 'none' }} 
          onClick={(e) => {
            e.preventDefault();
            if (isLoggedIn) {
              setIsLoggedIn(false);
              setUsername("");
              setMovies([]);
            }
          }}
        > 
          {!isLoggedIn ? "Log In" : "Log Out"} 
        </a>
      </div>
    </header>

      {/* Login Page */}
      {!isLoggedIn ? (
        <div className="LoginPage">
          <h1><u>Movie Tracker Login</u></h1>
          Username: <input type="text" placeholder="Username" value={usernameState} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <button onClick={handleLogin} style={{ padding: "5px 10px" }}>Login</button>
        </div>
      ) : ( 

        /* Movie Watch List Page */
        <div className="App">
          <u><h1 style={{ marginBottom: '0px' }}>Movie Watch List:</h1></u>
          <div className="movie-list-header">
            <div> Movies Added: {movies.length} / {movieLimit} </div>

            {/* Sort Container */}
            <div className="sort-container">
              Sort By: 
              <select name="SortOrder" onChange={(e) => handleSort(e.target.value)}>
                <option value="Title">Title</option>
                <option value="Genre">Genre</option>
                <option value="Rating">Rating</option>
                <option value="Watched">Watched</option>
                <option value="Not Watched">Not Watched</option>
              </select>
            </div>
          </div>

          <br/>

          {movies.length !== 0 ? (
            movies.map((movie, index) => (
              <MovieCard 
                key={movie.title + index} 
                id={index + 1} 
                title={movie.title} 
                url={movie.url} 
                genre={movie.genre} 
                watched={movie.watched} 
                rating={movie.rating} 
                personalRating={movie.personalRating} 
                thumbnail={movie.thumbnail} 
                toggleWatched={toggleWatched}
                deleteMovie={deleteMovie}
                updateRating={updateRating}
              />
            ))
          ) : (
            <h2> No Movies Added Yet </h2>
          )}

          <br/>

          {/* Form to add movies to the watchlist */}
          <MovieForm movies={movies} setMovies={saveMoviesToDB} movieLimit={movieLimit} />
        </div>
      )}
    </div>
  );
}

export default App;