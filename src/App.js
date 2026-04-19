import { useState } from "react";
import "./App.css";
import HomePage from "./pages/homePage";
import AnimalDetails from "./pages/AnimalDetails";
import FunFactsPage from "./pages/FunFactsPage";
import GamesPage from "./pages/GamesPage";
import FavoritesPage from "./pages/FavoritesPage";
import { useSelector } from "react-redux";

function App() {
  const [activePage, setActivePage] = useState("home");
  const favoriteCount = useSelector((state) => state.favorites.items.length);

  function scrollToSection(id) {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand" onClick={() => setActivePage("home")}>
          🐾
        </div>

        <ul className="nav-links">
          <li
            onClick={() => {
              setActivePage("home");
              setTimeout(() => scrollToSection("hero"), 100);
            }}
          >
            Home
          </li>

          <li
            onClick={() => {
              setActivePage("home");
              setTimeout(() => scrollToSection("categories-section"), 100);
            }}
          >
            Categories
          </li>

          <li
            onClick={() => {
              setActivePage("home");
              setTimeout(() => scrollToSection("animals-section"), 100);
            }}
          >
            Animals
          </li>

          <li
            onClick={() => {
              setActivePage("home");
              setTimeout(() => scrollToSection("animals-section"), 100);
            }}
          >
            Gallery
          </li>

          <li onClick={() => setActivePage("facts")}>Fun Facts</li>

          <li onClick={() => setActivePage("games")}>Games</li>

          <li onClick={() => setActivePage("favorites")}>
            Favorites {favoriteCount > 0 ? `(${favoriteCount})` : ""}
          </li>

          <li onClick={() => setActivePage("details")}>Breed Info</li>
        </ul>
      </nav>

      {activePage === "home" && <HomePage />}
      {activePage === "facts" && <FunFactsPage />}
      {activePage === "games" && <GamesPage />}
      {activePage === "favorites" && <FavoritesPage />}
      {activePage === "details" && <AnimalDetails />}
    </div>
  );
}

export default App;