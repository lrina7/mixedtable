document.addEventListener("DOMContentLoaded", function () {
  // Получаем элементы
  const timerElement = document.getElementById("timer");
  const startButton = document.querySelector(".btn_timer");
  const questionElement = document.getElementById("question");
  const answerInput = document.getElementById("answer");
  const answerButton = document.querySelector(".btn_praxis");
  const resultIcon = document.getElementById("resultIcon");
  const rightAnswersElement = document.getElementById("result_right");
  const wrongAnswersElement = document.getElementById("result_wrong");
  const resultTextElement = document.getElementById("text_result");
  const imageContainer = document.getElementById("image");
  const mistakesContainer = document.getElementById("mistakes-container");
  const mistakesList = document.getElementById("mistakes-list");
  const modeTitleElement = document.querySelector(".h2"); // Добавлен элемент заголовка

  // Переменные игры
  let currentMode = "multiplication";
  let currentAnswer;
  let isTimerRunning = false;
  let timerInterval;
  let timeLeft = 60;
  let mistakes = [];

  // Функция обновления заголовка режима
  function updateModeTitle() {
    switch (currentMode) {
      case "multiplication":
        modeTitleElement.textContent = "Тренажёр умножения";
        break;
      case "division":
        modeTitleElement.textContent = "Тренажёр деления";
        break;
      case "mixed":
        modeTitleElement.textContent = "Смешанный тренажёр";
        break;
      default:
        modeTitleElement.textContent = "Тренажёр таблицы умножения";
    }
  }

  // Инициализация кнопок режимов
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      currentMode = this.dataset.mode;
      document.querySelectorAll(".mode-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.mode === currentMode);
      });
      updateModeTitle(); // Обновляем заголовок при смене режима
      resetGame();
    });
  });

  // Генерация вопроса
  function generateQuestion() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;

    if (currentMode === "division") {
      const product = num1 * num2;
      return {
        question: `${product} ÷ ${num1} =`,
        answer: num2,
      };
    }

    if (currentMode === "mixed") {
      return Math.random() > 0.5
        ? { question: `${num1} × ${num2} =`, answer: num1 * num2 }
        : { question: `${num1 * num2} ÷ ${num1} =`, answer: num2 };
    }

    return {
      question: `${num1} × ${num2} =`,
      answer: num1 * num2,
    };
  }

  // Запуск игры
  function startGame() {
    if (isTimerRunning) return;

    resetGame();
    isTimerRunning = true;
    timeLeft = 60;

    // Удаляем кнопку старта
    const existingBtn = timerElement.parentNode.querySelector(".btn_timer");
    if (existingBtn) {
      existingBtn.remove();
    }

    updateTimerDisplay();
    showQuestion();
    startTimer();
  }

  // Таймер
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  // Обновление таймера
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  // Показ вопроса
  function showQuestion() {
    const { question, answer } = generateQuestion();
    questionElement.textContent = question;
    currentAnswer = answer;
    answerInput.value = "";
    resultIcon.textContent = "";
    answerInput.focus();
  }

  // Проверка ответа
  function checkAnswer() {
    if (!isTimerRunning) return;

    const userAnswer = answerInput.value.trim();

    if (!userAnswer) {
      resultIcon.textContent = "Введите ответ!";
      resultIcon.style.color = "red";
      return;
    }

    const answerNum = parseInt(userAnswer);
    const isCorrect = answerNum === currentAnswer;

    if (isCorrect) {
      rightAnswersElement.textContent =
        parseInt(rightAnswersElement.textContent) + 1;
      resultIcon.textContent = "✔️";
      resultIcon.style.color = "green";
    } else {
      wrongAnswersElement.textContent =
        parseInt(wrongAnswersElement.textContent) + 1;
      mistakes.push({
        question: questionElement.textContent,
        userAnswer: answerNum,
        correctAnswer: currentAnswer,
      });
      resultIcon.textContent = "❌";
      resultIcon.style.color = "red";
    }

    setTimeout(showQuestion, 500);
  }

  // Завершение игры
  function endGame() {
    clearInterval(timerInterval);
    isTimerRunning = false;

    // Блокируем ввод
    answerButton.disabled = true;
    answerInput.disabled = true;

    // Показываем результаты
    showResults();

    // Добавляем кнопку "Играть снова"
    const restartBtn = document.createElement("button");
    restartBtn.className = "btn_timer";
    restartBtn.innerHTML =
      "<span></span><span></span><span></span><span></span>Играть снова";
    restartBtn.addEventListener("click", startGame);

    timerElement.innerHTML = "Время вышло! ";
    timerElement.appendChild(restartBtn);
    timerElement.style.color = "red";
  }

  // Показ результатов
  function showResults() {
    const total =
      parseInt(rightAnswersElement.textContent) +
      parseInt(wrongAnswersElement.textContent);
    resultTextElement.textContent = `Результат: ${rightAnswersElement.textContent} из ${total}`;
    resultTextElement.style.color = "red";

    // Для десктопов
    if (window.innerWidth > 768) {
      if (imageContainer) imageContainer.style.display = "none";
      if (mistakesContainer) mistakesContainer.classList.add("visible");
    }
    // Для мобильных
    else {
      const mobileMistakes = document.getElementById(
        "mobile-mistakes-container"
      );
      if (!mobileMistakes) {
        createMobileMistakesContainer();
      }
      document
        .getElementById("mobile-mistakes-container")
        .classList.add("visible");
    }

    // Заполняем список ошибок
    const list =
      window.innerWidth > 768
        ? mistakesList
        : document.getElementById("mobile-mistakes-list");
    list.innerHTML =
      mistakes.length > 0
        ? mistakes
            .map(
              (mistake, i) => `
              <div class="mistake-item">
                  <strong>${i + 1}.</strong> ${mistake.question}<br>
                  Ваш ответ: <span style="color:red">${
                    mistake.userAnswer
                  }</span><br>
                  Правильно: <span style="color:green">${
                    mistake.correctAnswer
                  }</span>
              </div>
          `
            )
            .join("")
        : "<p>Вы не сделали ни одной ошибки! 👍</p>";
  }

  // Создаем контейнер для ошибок на мобильных
  function createMobileMistakesContainer() {
    const container = document.createElement("div");
    container.id = "mobile-mistakes-container";
    container.innerHTML = `
          <h3>Ошибки:</h3>
          <div id="mobile-mistakes-list"></div>
      `;
    document.querySelector("#left").appendChild(container);
  }

  // Сброс игры
  function resetGame() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = 60;
    mistakes = [];

    // Сброс интерфейса
    timerElement.innerHTML = "01:00";

    // Удаляем старую кнопку, если она есть
    const existingBtn = timerElement.parentNode.querySelector(".btn_timer");
    if (existingBtn) {
      existingBtn.remove();
    }

    // Добавляем новую кнопку
    const newStartBtn = startButton.cloneNode(true);
    timerElement.parentNode.appendChild(newStartBtn);
    newStartBtn.addEventListener("click", startGame);

    // Остальной сброс состояния
    questionElement.textContent = "";
    answerInput.value = "";
    resultIcon.textContent = "";
    rightAnswersElement.textContent = "0";
    wrongAnswersElement.textContent = "0";
    resultTextElement.textContent = "";
    answerButton.disabled = false;
    answerInput.disabled = false;
    timerElement.style.color = "";

    // Восстанавливаем изображение (для десктопа)
    if (window.innerWidth > 768 && imageContainer) {
      imageContainer.style.display = "block";
    }
    if (mistakesContainer) {
      mistakesContainer.classList.remove("visible");
    }

    // Скрываем мобильный контейнер с ошибками
    const mobileMistakes = document.getElementById("mobile-mistakes-container");
    if (mobileMistakes) {
      mobileMistakes.classList.remove("visible");
    }
  }

  // Инициализация обработчиков
  updateModeTitle(); // Устанавливаем заголовок при загрузке
  startButton.addEventListener("click", startGame);
  answerButton.addEventListener("click", checkAnswer);
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
  });
});
