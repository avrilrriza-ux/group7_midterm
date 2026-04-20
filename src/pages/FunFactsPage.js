import { useEffect, useState } from "react";
import "../App.css";

export default function FunFactsPage() {
  const [type, setType] = useState("cats");
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFacts = async (animalType) => {
    setLoading(true);

    try {
      let data;

      if (animalType === "cats") {
        const res = await fetch("https://catfact.ninja/facts?limit=5");
        if (!res.ok) throw new Error("Failed to fetch cat facts");

        const json = await res.json();
        data = json.data.map((item) => item.fact);
      } else {
        const res = await fetch("https://dogapi.dog/api/v2/facts?limit=5");
        if (!res.ok) throw new Error("Failed to fetch dog facts");

        const json = await res.json();
        data = json.data.map((item) => item.attributes.body);
      }

      setFacts(data);
    } catch (err) {
      console.error(err);
      setFacts(["Failed to load facts."]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacts(type);
  }, [type]);

  return (
    <div className="funfacts-page">
      <h1>Fun Facts</h1>
      <p>Learn interesting facts about cats and dogs.</p>

      <div className="tabs">
        <button
          className={type === "cats" ? "active" : ""}
          onClick={() => setType("cats")}
        >
          Cat Facts
        </button>
        <button
          className={type === "dogs" ? "active" : ""}
          onClick={() => setType("dogs")}
        >
          Dog Facts
        </button>
      </div>

      <button
        className="refresh-btn"
        onClick={() => fetchFacts(type)}
      >
        Refresh Facts
      </button>

      <div className="facts-grid">
        {loading ? (
          <p>Loading...</p>
        ) : (
          facts.map((fact, index) => (
            <div className="fact-card" key={index}>
              {fact}
            </div>
          ))
        )}
      </div>
    </div>
  );
}