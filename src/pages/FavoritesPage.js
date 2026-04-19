import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../app/favoritesSlice";

function FavoritesPage() {
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  return (
    <section className="animals-section">
      <h2>Favorites</h2>
      <p>Your saved pets will appear here.</p>

      {selectedAnimal && (
        <div className="modal-overlay" onClick={() => setSelectedAnimal(null)}>
          <div className="animal-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal-btn"
              onClick={() => setSelectedAnimal(null)}
            >
              ×
            </button>

            <img
              src={selectedAnimal.image}
              alt={selectedAnimal.name}
              className="modal-image"
            />

            <div className="modal-content">
              <h2>{selectedAnimal.name}</h2>
              <p>
                <strong>Type:</strong>{" "}
                {selectedAnimal.type?.toUpperCase() ||
                  selectedAnimal.category?.toUpperCase() ||
                  "N/A"}
              </p>
              <p>
                <strong>Temperament:</strong>{" "}
                {selectedAnimal.temperament || "N/A"}
              </p>
              <p>
                <strong>Origin:</strong> {selectedAnimal.origin || "N/A"}
              </p>
              <p>
                <strong>Life Span:</strong> {selectedAnimal.lifeSpan || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedAnimal.description || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      {favoriteItems.length === 0 ? (
        <p className="status-text">No favorites added yet.</p>
      ) : (
        <div className="animals-grid">
          {favoriteItems.map((animal) => (
            <div
              key={animal.id}
              className="animal-card"
              onClick={() => setSelectedAnimal(animal)}
            >
              <div className="animal-image-wrap">
                <button
                  className="favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeFavorite(animal.id));
                  }}
                >
                  ❤
                </button>

                <img
                  src={animal.image}
                  alt={animal.name}
                  className="animal-image"
                />

                <div className="hover-overlay">View Details</div>
              </div>

              <div className="animal-card-body">
                <h3>{animal.name}</h3>
                <p>{animal.category ? animal.category.toUpperCase() : "PET"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FavoritesPage;