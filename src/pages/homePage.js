import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetDogsQuery, useGetCatsQuery } from "../api/animalsApi";
import { toggleFavorite } from "../app/favoritesSlice";

const ITEMS_PER_PAGE = 8;

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);

  const categoryCards = [
    {
      id: "dogs",
      name: "Dogs",
      image:
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "cats",
      name: "Cats",
      image:
        "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const {
    data: dogAnimals = [],
    isLoading: dogsLoading,
    isFetching: dogsFetching,
    isError: dogsError,
    error: dogsErrorData,
  } = useGetDogsQuery(undefined, {
    skip: selectedCategory !== "dogs",
  });

  const {
    data: catAnimals = [],
    isLoading: catsLoading,
    isFetching: catsFetching,
    isError: catsError,
    error: catsErrorData,
  } = useGetCatsQuery(undefined, {
    skip: selectedCategory !== "cats",
  });

  function handleCategoryClick(categoryId) {
    setSelectedCategory(categoryId);
    setSearchTerm("");
    setCurrentPage(1);
  }

  const selectedTitle =
    selectedCategory === "dogs"
      ? "Dogs"
      : selectedCategory === "cats"
      ? "Cats"
      : "";

  const activeAnimals = useMemo(() => {
    if (selectedCategory === "dogs") return dogAnimals;
    if (selectedCategory === "cats") return catAnimals;
    return [];
  }, [selectedCategory, dogAnimals, catAnimals]);

  const filteredAnimals = useMemo(() => {
    return activeAnimals.filter((animal) =>
      animal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeAnimals, searchTerm]);

  const totalPages = Math.ceil(filteredAnimals.length / ITEMS_PER_PAGE);

  const paginatedAnimals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAnimals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAnimals, currentPage]);

  const loading =
    (selectedCategory === "dogs" && (dogsLoading || dogsFetching)) ||
    (selectedCategory === "cats" && (catsLoading || catsFetching));

  const error =
    selectedCategory === "dogs"
      ? dogsError
        ? dogsErrorData?.data || "Failed to load dogs."
        : ""
      : selectedCategory === "cats"
      ? catsError
        ? catsErrorData?.data || "Failed to load cats."
        : ""
      : "";

  function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    setCurrentPage(pageNumber);
    window.scrollTo({
      top: document.getElementById("animals-section")?.offsetTop - 30 || 0,
      behavior: "smooth",
    });
  }

  function isFavorite(animalId) {
    return favoriteItems.some((item) => item.id === animalId);
  }

  function handleToggleFavorite(animal, e) {
    e.stopPropagation();

    dispatch(
      toggleFavorite({
        ...animal,
        category: selectedCategory,
      })
    );
  }

  return (
    <>
      <section id="hero" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Explore The World Of Pets</h1>
            <p>
              Browse simple animal categories and click each one to view a
              gallery of API-based animals with search and pagination.
            </p>
            <button
              className="main-btn"
              onClick={() =>
                document
                  .getElementById("categories-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Now
            </button>
          </div>

          <div className="hero-image-wrap">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1600&q=80"
              alt="Hero animal"
            />
          </div>
        </div>
      </section>

      <section id="categories-section" className="categories-section">
        <h2>Animal Categories</h2>
        <p>Click one category card to show the animals below.</p>

        <div className="category-grid">
          {categoryCards.map((card) => (
            <div
              key={card.id}
              className={`category-card ${
                selectedCategory === card.id ? "active-category-card" : ""
              }`}
              onClick={() => handleCategoryClick(card.id)}
            >
              <img src={card.image} alt={card.name} className="category-image" />
              <div className="category-overlay">
                <h3>{card.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="animals-section" className="animals-section">
        <h2>{selectedTitle ? `${selectedTitle} Gallery` : "Animals Gallery"}</h2>
        <p>
          {selectedTitle
            ? `Showing all available ${selectedTitle.toLowerCase()} with pagination.`
            : "Select a category first."}
        </p>

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
                <p><strong>Type:</strong> {selectedAnimal.type?.toUpperCase() || "N/A"}</p>
                <p><strong>Temperament:</strong> {selectedAnimal.temperament || "N/A"}</p>
                <p><strong>Origin:</strong> {selectedAnimal.origin || "N/A"}</p>
                <p><strong>Life Span:</strong> {selectedAnimal.lifeSpan || "N/A"}</p>
                <p><strong>Description:</strong> {selectedAnimal.description || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {selectedCategory && (
          <div className="search-wrap">
            <input
              type="text"
              placeholder={`Search ${selectedTitle.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
        )}

        {loading && <p className="status-text">Loading animals...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && paginatedAnimals.length > 0 && (
          <>
            <div className="animals-grid">
              {paginatedAnimals.map((animal) => (
                <div
                  key={animal.id}
                  className="animal-card"
                  onClick={() => setSelectedAnimal(animal)}
                >
                  <div className="animal-image-wrap">
                    <button
                      className="favorite-btn"
                      onClick={(e) => handleToggleFavorite(animal, e)}
                    >
                      {isFavorite(animal.id) ? "❤" : "♡"}
                    </button>

                    <img
                      src={animal.image}
                      alt={animal.name}
                      className="animal-image"
                    />

                    <div className="hover-overlay">
                      View Details
                    </div>
                  </div>

                  <div className="animal-card-body">
                    <h3>{animal.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(
                    Math.max(currentPage - 3, 0),
                    Math.min(Math.max(currentPage - 3, 0) + 5, totalPages)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      className={`page-btn ${
                        currentPage === page ? "active-page-btn" : ""
                      }`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                <button
                  className="page-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {!loading && !error && selectedCategory && filteredAnimals.length === 0 && (
          <p className="status-text">No matching animals found.</p>
        )}
      </section>
    </>
  );
}

export default HomePage;