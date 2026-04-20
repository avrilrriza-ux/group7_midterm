import { useMemo, useState } from "react";
import "../App.css";

const breedData = {
  dogs: [
    {
      name: "Doberman",
      desc: "The Doberman is a powerful and intelligent breed known for loyalty and alertness. It is often used as a guard dog because of its confidence and courage. With proper training, it can also be a loving family companion."
    },
    {
      name: "Setter English",
      desc: "The English Setter is a graceful sporting dog with a gentle and friendly nature. It is known for its beautiful feathered coat and strong hunting instincts. This breed does best with regular exercise and open space."
    },
    {
      name: "Gaddi Indian",
      desc: "The Gaddi dog is a strong working breed from India, traditionally used for herding and guarding livestock. It is brave, protective, and highly valued in mountain regions. This breed is known for endurance and loyalty."
    },
    {
      name: "African Wild",
      desc: "The African Wild Dog is a highly social canine native to sub-Saharan Africa. It lives and hunts in packs, relying on teamwork and speed. This animal is known for intelligence, stamina, and strong group behavior."
    },
    {
      name: "Terrier Boston",
      desc: "The Boston Terrier is a small, lively breed with a friendly and playful personality. It is easy to recognize because of its tuxedo-like markings. This breed is affectionate, adaptable, and great for city living."
    },
    {
      name: "Saluki",
      desc: "The Saluki is a slim and elegant hound known for speed and endurance. It has been admired for centuries and is one of the oldest dog breeds. This breed is gentle, quiet, and graceful in movement."
    },
    {
      name: "Papillon",
      desc: "The Papillon is a small toy breed famous for its butterfly-shaped ears. It is lively, intelligent, and eager to learn. This breed is playful and makes a cheerful companion."
    },
    {
      name: "Terrier Fox",
      desc: "The Fox Terrier is an active and alert breed with a bold personality. It was originally developed for hunting and is known for quick movement and confidence. This breed is energetic and enjoys play and activity."
    },
    {
      name: "Terrier Norfolk",
      desc: "The Norfolk Terrier is one of the smallest working terriers, but it is brave and full of spirit. It is friendly, curious, and enjoys human company. This breed is a great choice for people who want a small but lively dog."
    },
    {
      name: "Hound Plott",
      desc: "The Plott Hound is a strong scent hound originally bred for hunting in the United States. It is fearless, determined, and athletic. This breed is also loyal and affectionate with its family."
    },
    {
      name: "Boxer",
      desc: "The Boxer is a muscular and energetic breed with a playful personality. It is loyal, protective, and known for being good with families. This breed combines strength with affection and enthusiasm."
    }
  ],
  cats: [
    {
      name: "Persian",
      desc: "The Persian cat is known for its long coat, round face, and calm personality. It enjoys quiet spaces and gentle attention. This breed is often kept as a relaxed indoor companion."
    },
    {
      name: "Siamese",
      desc: "The Siamese cat is vocal, social, and highly intelligent. It forms strong bonds with people and likes to stay involved in daily activity. This breed is known for its sleek body and striking blue eyes."
    },
    {
      name: "Maine Coon",
      desc: "The Maine Coon is one of the largest domestic cat breeds. It is friendly, playful, and often described as gentle despite its size. This breed is admired for its thick fur and bushy tail."
    },
    {
      name: "British Shorthair",
      desc: "The British Shorthair is a calm and easygoing cat with a dense plush coat. It is independent but still enjoys companionship. This breed is recognized for its round face and sturdy build."
    },
    {
      name: "Ragdoll",
      desc: "The Ragdoll is famous for its gentle and affectionate temperament. It often relaxes when picked up and enjoys staying close to people. This breed is popular for its soft coat and calm nature."
    },
    {
      name: "Bengal",
      desc: "The Bengal cat has a wild appearance with spotted or marbled markings. It is active, curious, and loves to climb and explore. This breed needs play, attention, and mental stimulation."
    },
    {
      name: "Sphynx",
      desc: "The Sphynx is a hairless cat breed with a very distinctive appearance. It is energetic, affectionate, and loves being around people. This breed is playful and often seeks warmth and attention."
    },
    {
      name: "Scottish Fold",
      desc: "The Scottish Fold is known for its folded ears and sweet expression. It is calm, affectionate, and gentle in behavior. This breed is loved for both its appearance and friendly personality."
    },
    {
      name: "Abyssinian",
      desc: "The Abyssinian is an active and curious breed with a sleek, ticked coat. It enjoys climbing, exploring, and staying busy. This breed is often chosen by owners who want an energetic cat."
    },
    {
      name: "Russian Blue",
      desc: "The Russian Blue is a graceful cat with a dense silver-blue coat and green eyes. It is quiet, intelligent, and often reserved with strangers. This breed is known for elegance and loyalty."
    }
  ]
};

export default function AnimalDetails() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const filteredBreeds = useMemo(() => {
    if (!selectedCategory) return [];

    return breedData[selectedCategory].filter((breed) =>
      breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCategory, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBreeds.length / itemsPerPage)
  );

  const paginatedBreeds = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBreeds.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBreeds, currentPage]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="breed-page">
      {!selectedCategory ? (
        <>
          <h1>Breed Information</h1>
          <p className="breed-subtitle">
            Select a category to explore different breeds.
          </p>

          <div className="category-grid">
            <div
              className="category-card"
              onClick={() => handleCategorySelect("cats")}
            >
              <div className="category-icon">🐾</div>
              <h2>Cat Breeds</h2>
              <p>Browse and learn about 10 different cat breeds.</p>
            </div>

            <div
              className="category-card"
              onClick={() => handleCategorySelect("dogs")}
            >
              <div className="category-icon">🐾</div>
              <h2>Dog Breeds</h2>
              <p>Browse and learn about different dog breeds.</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="breed-top-bar">
            <button className="back-btn" onClick={handleBackToCategories}>
              Back to Categories
            </button>
          </div>

          <h1>{selectedCategory === "dogs" ? "Dog Breeds" : "Cat Breeds"}</h1>
          <p className="breed-subtitle">
            {selectedCategory === "dogs"
              ? "Browse different dog breeds."
              : "Browse different cat breeds."}
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder={`Search ${
                selectedCategory === "dogs" ? "dog" : "cat"
              } breeds...`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="breed-grid">
            {paginatedBreeds.length > 0 ? (
              paginatedBreeds.map((breed, index) => (
                <div className="breed-info-card" key={`${breed.name}-${index}`}>
                  <h3>{breed.name}</h3>
                  <p>{breed.desc}</p>
                </div>
              ))
            ) : (
              <p className="no-results">No breeds found.</p>
            )}
          </div>

          {filteredBreeds.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}