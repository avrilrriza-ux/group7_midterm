import "./App.css";
import { useSelector } from "react-redux";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

import HomePage from "./pages/homePage";
import AnimalDetails from "./pages/AnimalDetails";
import FunFactsPage from "./pages/FunFactsPage";
import GamesPage from "./pages/GamesPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  const favoriteCount = useSelector((state) => state.favorites.items.length);
  const navigate = useNavigate();
  const location = useLocation();

  function goToHomeSection(id) {
    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <ul className="nav-links">
          <li onClick={() => goToHomeSection("hero")}>Home</li>
          <li onClick={() => goToHomeSection("categories-section")}>Categories</li>
          <li onClick={() => goToHomeSection("animals-section")}>Animals</li>
          <li onClick={() => goToHomeSection("animals-section")}>Gallery</li>

          <li>
            <Link to="/facts">Fun Facts</Link>
          </li>

          <li>
            <Link to="/games">Games</Link>
          </li>

          <li>
            <Link to="/favorites">Favorites ({favoriteCount})</Link>
          </li>

          <li>
            <Link to="/details">Breed Info</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/facts" element={<FunFactsPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/details" element={<AnimalDetails />} />
      </Routes>
    </div>
  );
}

export default App;