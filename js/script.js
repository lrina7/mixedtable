document.addEventListener("DOMContentLoaded", function () {
  // Элементы интерфейса
  const timerDisplay = document.getElementById("timer");
  const startButton = document.querySelector(".btn_timer");
  const answerButton = document.querySelector(".btn_praxis");
  const answerInput = document.getElementById("answer");
  const questionElement = document.getElementById("question");
  const resultIcon = document.getElementById("resultIcon");
  const resultRight = document.getElementById("result_right");
  const resultWrong = document.getElementById("result_wrong");
  const textResult = document.getElementById("text_result");

  // Переменные игры
  let currentMode = "multiplication";
  let currentAnswer;
  let isTimerExpired = false;
  let timerInterval;
  let durationInSeconds = 60;

  // Инициализация кнопок режимов
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      setMode(this.dataset.mode);
    });
  });

  // Установка режима игры
  function setMode(mode) {
    currentMode = mode;

    // Обновляем активные кнопки
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    // Обновляем заголовок
    const titles = {
      multiplication: "Тренажёр умножения",
      division: "Тренажёр деления",
      mixed: "Смешанный тренажёр",
    };
    document.querySelector(".h2").textContent = titles[mode];

    // Перезапускаем игру
    resetGame();
  }

  // Генерация вопроса
  function generateQuestion() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;

    switch (currentMode) {
      case "division":
        const product = num1 * num2;
        return {
          question: `${product} ÷ ${num1} =`,
          answer: num2,
        };

      case "mixed":
        const isMultiplication = Math.random() > 0.5;
        if (isMultiplication) {
          return {
            question: `${num1} × ${num2} =`,
            answer: num1 * num2,
          };
        } else {
          const product = num1 * num2;
          return {
            question: `${product} ÷ ${num1} =`,
            answer: num2,
          };
        }

      default: // multiplication
        return {
          question: `${num1} × ${num2} =`,
          answer: num1 * num2,
        };
    }
  }

  // Отображение вопроса
  function displayQuestion() {
    if (isTimerExpired) return;
    const { question, answer } = generateQuestion();
    questionElement.textContent = question;
    answerInput.value = "";
    currentAnswer = answer;
    resultIcon.textContent = "";
    answerInput.focus();
  }

  // Проверка ответа
  function checkAnswer() {
    const userAnswer = answerInput.value.trim();

    if (userAnswer === "") {
      resultIcon.textContent = "Введите ответ!";
      resultIcon.style.color = "red";
      return;
    }

    const numericAnswer = parseInt(userAnswer);
    let scoreRight = parseInt(resultRight.textContent);
    let scoreWrong = parseInt(resultWrong.textContent);

    if (numericAnswer === currentAnswer) {
      scoreRight++;
      resultIcon.textContent = "✔️";
      resultIcon.style.color = "green";
    } else {
      scoreWrong++;
      resultIcon.textContent = "❌";
      resultIcon.style.color = "red";
    }

    resultRight.textContent = scoreRight;
    resultWrong.textContent = scoreWrong;

    setTimeout(displayQuestion, 500);
  }

  // Запуск таймера
  function startTimer() {
    if (startButton.parentNode === timerDisplay) {
      timerDisplay.removeChild(startButton);
    }

    displayQuestion();

    function updateTimer() {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;

      timerDisplay.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

      if (--durationInSeconds < 0) {
        clearInterval(timerInterval);
        timerDisplay.innerHTML =
          'Время вышло! <button class="btn_timer"><span></span><span></span><span></span><span></span>Играть ещё</button>';
        timerDisplay.style.fontFamily = "Caveat";
        timerDisplay.style.color = "red";

        isTimerExpired = true;
        answerButton.disabled = true;
        answerInput.disabled = true;
        showAnswer();

        // Перепривязываем обработчик к новой кнопке
        document
          .querySelector(".btn_timer")
          .addEventListener("click", startGame);
      }
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  // Показ результатов
  function showAnswer() {
    const scoreAll =
      parseInt(resultRight.textContent) + parseInt(resultWrong.textContent);
    const scoreRight = parseInt(resultRight.textContent);
    textResult.textContent = `Ваш результат ${scoreRight} из ${scoreAll}`;
    textResult.style.color = "red";
  }

  // Сброс игры
  function resetGame() {
    clearInterval(timerInterval);
    isTimerExpired = false;
    durationInSeconds = 60;
    timerDisplay.innerHTML =
      '01:00<button class="btn_timer"><span></span><span></span><span></span><span></span>Старт</button>';
    timerDisplay.style.fontFamily = "";
    timerDisplay.style.color = "";
    resultRight.textContent = "0";
    resultWrong.textContent = "0";
    textResult.textContent = "";
    textResult.style.color = "";
    answerButton.disabled = false;
    answerInput.disabled = false;
    resultIcon.textContent = "";
    questionElement.textContent = "";
    answerInput.value = "";

    // Перепривязываем обработчик к кнопке
    document.querySelector(".btn_timer").addEventListener("click", startGame);
  }

  // Запуск игры
  function startGame() {
    resetGame();
    startTimer();
  }

  // Обработчики событий
  startButton.addEventListener("click", startGame);
  answerButton.addEventListener("click", checkAnswer);
  answerInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });
});
