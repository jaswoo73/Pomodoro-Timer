let focusButton = document.getElementById("focus");
let button = document.querySelectorAll(".btn");
let shortBreakButton = document.getElementById("shortbreak");
let longBreakButton = document.getElementById("longbreak");
let startButton = document.getElementById("btn-start");
let pauseButton = document.getElementById("btn-pause");
let resetButton = document.getElementById("btn-reset");
let displayTime = document.getElementById("time");
let set;
let activeMode = "focus";
let pause = true;
let [minutes, seconds] = [24, 60];
const audioElement = document.getElementById("timerSound");
let completedCycles = 0;

displayTime.textContent = `${minutes + 1}:00`;

const appendZero = (value) => {
  value = value < 10 ? `0${value}` : value;
  return value;
};

resetButton.addEventListener("click", () => {
  pauseTimer();
  switch (activeMode) {
    case "longbreak":
      minutes = 14;
      break;
    case "shortbreak":
      minutes = 4;
      break;
    default:
      minutes = 24;
      break;
  }
  seconds = 60;
  displayTime.textContent = `${minutes + 1}:00`;
  audioElement.pause();
  audioElement.currentTime = 0;
  document.title = `(${appendZero(minutes + 1)}:00) Pomodoro Timer`;
});
const removeFocus = () => {
  button.forEach((btn) => {
    btn.classList.remove("btn-focus");
  });
};

focusButton.addEventListener("click", () => {
  activeMode = "";
  removeFocus();
  focusButton.classList.add("btn-focus");
  pauseTimer();
  minutes = 24;
  seconds = 60;
  displayTime.textContent =
    seconds == 60
      ? `${appendZero(minutes + 1)}:00`
      : `${appendZero(minutes)}:${appendZero(seconds)}`;
  document.title = `(${appendZero(minutes + 1)}:00) Pomodoro Timer`;
});

longBreakButton.addEventListener("click", () => {
  activeMode = "longbreak";
  removeFocus();
  longBreakButton.classList.add("btn-focus");
  pauseTimer();
  minutes = 14;
  seconds = 60;
  displayTime.textContent =
    seconds == 60
      ? `${appendZero(minutes + 1)}:00`
      : `${appendZero(minutes)}:${appendZero(seconds)}`;
  document.title = `(${appendZero(minutes + 1)}:00) Pomodoro Timer`;
});

shortBreakButton.addEventListener("click", () => {
  activeMode = "shortbreak";
  removeFocus();
  shortBreakButton.classList.add("btn-focus");
  pauseTimer();
  minutes = 4;
  seconds = 60;
  displayTime.textContent =
    seconds == 60
      ? `${appendZero(minutes + 1)}:00`
      : `${appendZero(minutes)}:${appendZero(seconds)}`;
  document.title = `(${appendZero(minutes + 1)}:00) Pomodoro Timer`;
});

pauseButton.addEventListener(
  "click",
  (pauseTimer = () => {
    pause = true;
    clearInterval(set);
    startButton.classList.remove("hide");
    pauseButton.classList.remove("show");
    resetButton.classList.remove("show");
  })
);

startButton.addEventListener("click", () => {
  resetButton.classList.add("show");
  pauseButton.classList.add("show");
  startButton.classList.add("hide");
  pauseButton.style.pointerEvents = "initial";
  startButton.classList.remove("show");
  if (pause) {
    pause = false;
    displayTime.textContent =
      seconds == 60
        ? `${appendZero(minutes + 1)}:00`
        : `${appendZero(minutes)}:${appendZero(seconds)}`;
    set = setInterval(() => {
      seconds--;
      displayTime.textContent = `${appendZero(minutes)}:${appendZero(seconds)}`;
      if (seconds == 0) {
        if (minutes !== 0) {
          minutes--;
          seconds = 60;
        } else {
          clearInterval(set);
          completedCycles++;
          updateCycleIndicator();
          console.log(new Date());
          pauseButton.style.pointerEvents = "none";
          switch (activeMode) {
            case "longbreak":
              audioElement.src = "big_bells.mp3";
              audioElement.play();
              break;
            case "shortbreak":
              minutes = 4;
              audioElement.src = "big_bells.mp3";
              audioElement.play();
              break;
            default:
              audioElement.src = "haki alert.mp3";
              audioElement.play();
          }
        }
      }
      document.title =
        seconds == 60
          ? `(${appendZero(minutes + 1)}:00) Pomodoro Timer`
          : seconds == 0
          ? (document.title = "Buzzz!!")
          : `(${appendZero(minutes)}:${appendZero(seconds)}) Pomodoro Timer`;
    }, 1000);
  }
});

const cycleIndicator = document.getElementById("cycle-indicator");

function updateCycleIndicator() {
  // Clear the previous icons
  cycleIndicator.innerHTML = "";

  // Add Font Awesome icons based on the number of completed cycles
  for (let i = 0; i < completedCycles; i++) {
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-check-circle");
    cycleIndicator.appendChild(icon);
  }
}
