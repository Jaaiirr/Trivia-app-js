//Variables
let form = document.getElementById("trivia-form");
const scoreText = document.getElementById("score");
//
const questionAPI = document.getElementById("question-trivia");
const choices = Array.from(document.getElementsByClassName("label-form-input"));
// console.log(choices);
let currentQuestion = {};
//accepingAnswers
let acceptAnswers = false;
let score = 0;
//questionCounter
let qValue = 0;
//availableQuestions
let aQuestions = [];

let questions = [];

//-------------------------------------
const createURL = (e) => {
  e.preventDefault();
  let amount = document.getElementById("amount").value;
  const API = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
  getDataAPI(API);
};
const getDataAPI = (url) => {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((loadedQuestions) => {
      console.log(loadedQuestions.results);
      questions = loadedQuestions.results.map((loadedQuestion) => {
        const matchQuestion = {
          question: loadedQuestion.question,
        };
        const matchAnswers = [...loadedQuestion.incorrect_answers];
        matchQuestion.answer = Math.floor(Math.random() * 3) + 1;
        matchAnswers.splice(
          matchQuestion.answer - 1,
          0,
          loadedQuestion.correct_answer
        );

        matchAnswers.forEach((choice, index) => {
          matchQuestion["choice" + (index + 1)] = choice;
        });
        return matchQuestion;
      });
      startTrivia();
    })
    .catch((error) => {
      console.log(error);
    });
};

//-------------------------------------
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 100;

startTrivia = () => {
  questionCounter = 0;
  score = 0;
  aQuestions = [...questions];
  //   console.log(aQuestions);
  getNewTriviaQuestion();
};

getNewTriviaQuestion = () => {
  if (aQuestions.length === 0 || qValue >= MAX_QUESTIONS) {
    //El juego termino
    return window.location.assign("/exit.html");
  }
  qValue++;

  const qPosition = Math.floor(Math.random() * aQuestions.length);
  currentQuestion = aQuestions[qPosition];
  questionAPI.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const num = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + num];
  });

  aQuestions.splice(qPosition, 1);
  acceptAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    // console.log(e.target);
    if (!acceptAnswers) return;

    acceptAnswers = false;
    const choiceSel = e.target;
    const answerSel = choiceSel.dataset["number"];

    let classPending = "incorrect";
    if (answerSel == currentQuestion.answer) {
      classPending = "correct";
    }
    if (classPending === "correct") {
      newScore(CORRECT_BONUS);
    }
    // console.log(classPending);
    choiceSel.parentElement.classList.add(classPending);

    setTimeout(() => {
      choiceSel.parentElement.classList.remove(classPending);
      getNewTriviaQuestion();
    }, 1000);
  });
});
newScore = (value) => {
  score += value;
  scoreText.innerText = score;
};

// startTrivia();
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
//Funciones
// const createURL = (e) => {
//   e.preventDefault();
//   let amount = document.getElementById("amount").value;
//   const API = `https://opentdb.com/api.php?amount=${amount}`;
//   getDataAPI(API);
// };
// const getDataAPI = (url) => {
//   fetch(url)
//     .then((response) => response.json())
//     .then((result) => console.log(result.results))
//     .catch((error) => console.log(error));
// };
// Eventos
form.onsubmit = createURL;
