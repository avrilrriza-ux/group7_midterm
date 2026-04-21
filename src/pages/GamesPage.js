import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useGetDogsQuery, useGetCatsQuery } from "../api/animalsApi";

const MAX_QUESTIONS = 5;
const TIME_PER_QUESTION = 5;

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function GamesPage() {
  const [quizType, setQuizType] = useState("dogs");
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);



  const {
    data: dogAnimals = [],
    isLoading: dogsLoading,
    isError: dogsError,
  } = useGetDogsQuery();

  const {
    data: catAnimals = [],
    isLoading: catsLoading,
    isError: catsError,
  } = useGetCatsQuery();

  const activeAnimals = useMemo(() => {
    return quizType === "dogs" ? dogAnimals : catAnimals;
  }, [quizType, dogAnimals, catAnimals]);

  const generateQuestion = useCallback(() => {
    if (!activeAnimals || activeAnimals.length < 4) return;

    const shuffled = shuffleArray(activeAnimals);
    const correctAnimal = shuffled[0];

    const wrongOptions = shuffled
      .filter((animal) => animal.name !== correctAnimal.name)
      .slice(0, 3);

    const options = shuffleArray([
      correctAnimal.name,
      ...wrongOptions.map((animal) => animal.name),
    ]);

    setCurrentQuestion({
      image: correctAnimal.image,
      correctAnswer: correctAnimal.name,
      options,
    });

    setSelectedAnswer("");
    setAnswerStatus("");
    setTimeLeft(TIME_PER_QUESTION);
    setShowCelebrate(false);
  }, [activeAnimals]);

  useEffect(() => {
    if (activeAnimals.length >= 4) {
      generateQuestion();
    }
  }, [activeAnimals, generateQuestion]);

  useEffect(() => {
    if (!currentQuestion || selectedAnswer || quizFinished) return;

    if (timeLeft <= 0) {
      setSelectedAnswer("TIME_UP");
      setAnswerStatus("timeout");
      setShowCelebrate(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentQuestion, selectedAnswer, quizFinished]);

  useEffect(() => {
    if (!showCelebrate) return;

    const celebrationTimer = setTimeout(() => {
      setShowCelebrate(false);
    }, 1200);

    return () => clearTimeout(celebrationTimer);
  }, [showCelebrate]);

function handleAnswerClick(option) {
  if (selectedAnswer || !currentQuestion) return;

  setSelectedAnswer(option);

  if (option === currentQuestion.correctAnswer) {
    setAnswerStatus("correct");
    setScore((prev) => prev + 1);
    setShowCelebrate(true);

    correctSoundRef.current?.play().catch(() => {});
  } else {
    setAnswerStatus("wrong");
    setShowCelebrate(false);

    wrongSoundRef.current?.play().catch(() => {});
  }
}

  function handleNextQuestion() {
    if (questionNumber >= MAX_QUESTIONS) {
      setQuizFinished(true);

      return;
    }

    setQuestionNumber((prev) => prev + 1);
    generateQuestion();
  }

  function handlePlayAgain() {
    setScore(0);
    setQuestionNumber(1);
    setSelectedAnswer("");
    setAnswerStatus("");
    setQuizFinished(false);
    setTimeLeft(TIME_PER_QUESTION);
    setShowCelebrate(false);
    generateQuestion();
  }

  function handleChangeQuizType(type) {
    setQuizType(type);
    setScore(0);
    setQuestionNumber(1);
    setSelectedAnswer("");
    setAnswerStatus("");
    setQuizFinished(false);
    setTimeLeft(TIME_PER_QUESTION);
    setShowCelebrate(false);
  }

  const loading = quizType === "dogs" ? dogsLoading : catsLoading;
  const error = quizType === "dogs" ? dogsError : catsError;

  return (
    <section className="games-section">
        <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
        <audio ref={wrongSoundRef} src="/sounds/wrong.mp3" preload="auto" />

      <div className="games-header">
        <h2>Guess the Breed 🎮</h2>
        <p>Look at the pet image and choose the correct breed.</p>
      </div>

      <div className="quiz-type-buttons">
        <button
          className={`quiz-type-btn ${
            quizType === "dogs" ? "active-quiz-type" : ""
          }`}
          onClick={() => handleChangeQuizType("dogs")}
        >
          Dog Quiz
        </button>

        <button
          className={`quiz-type-btn ${
            quizType === "cats" ? "active-quiz-type" : ""
          }`}
          onClick={() => handleChangeQuizType("cats")}
        >
          Cat Quiz
        </button>
      </div>

      <div className="quiz-scoreboard">
        <span>
          Question: {quizFinished ? MAX_QUESTIONS : questionNumber} / {MAX_QUESTIONS}
        </span>
        <span>Score: {score}</span>
        <span>Time Left: {quizFinished ? 0 : timeLeft}s</span>
      </div>

      {loading && <p className="status-text">Loading quiz...</p>}
      {error && <p className="error-text">Failed to load quiz data.</p>}

      {!loading && !error && quizFinished && (
        <div className="quiz-card">
          <div className="quiz-content" style={{ width: "100%" }}>
            <h3>{score >= 3 ? "Great Job! 🎉" : "Better Luck Next Time 😅"}</h3>
            <p className="quiz-feedback">
              You got <strong>{score}</strong> out of <strong>{MAX_QUESTIONS}</strong>.
            </p>

            <button className="next-question-btn" onClick={handlePlayAgain}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && !quizFinished && currentQuestion && (
        <div className="quiz-card">
          <div className="quiz-image-wrap">
            <img
              src={currentQuestion.image}
              alt="Quiz animal"
              className="quiz-image"
            />
          </div>

          <div className="quiz-content">
            <h3>What breed is this?</h3>

            {showCelebrate && (
              <div className="celebration-banner">
                Correct! 🎉
              </div>
            )}

            <div className="quiz-options">
              {currentQuestion.options.map((option) => {
                let buttonClass = "quiz-option-btn";

                if (selectedAnswer) {
                  if (option === currentQuestion.correctAnswer) {
                    buttonClass += " correct-option";
                  } else if (option === selectedAnswer) {
                    buttonClass += " wrong-option";
                  }
                }

                return (
                  <button
                    key={option}
                    className={buttonClass}
                    onClick={() => handleAnswerClick(option)}
                    disabled={!!selectedAnswer}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answerStatus === "correct" && (
              <p className="quiz-feedback correct-feedback">
                Good job hooman!
              </p>
            )}

            {answerStatus === "wrong" && (
              <p className="quiz-feedback wrong-feedback">
                Oops! The correct answer is{" "}
                <strong>{currentQuestion.correctAnswer}</strong>.
              </p>
            )}

            {answerStatus === "timeout" && (
              <p className="quiz-feedback wrong-feedback">
                Time’s up! ⏰ The correct answer is{" "}
                <strong>{currentQuestion.correctAnswer}</strong>.
              </p>
            )}

            {selectedAnswer && (
              <button className="next-question-btn" onClick={handleNextQuestion}>
                {questionNumber >= MAX_QUESTIONS ? "Finish Game" : "Next Question"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default GamesPage;