import { Timer } from "./timer";

// Elements
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const pauseBtn = document.createElement("button");
const stopBtn = document.createElement("button");
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement;
const exerciseInfo = document.getElementById("exercise-info") as HTMLHeadingElement;
const display = document.getElementById("display") as HTMLParagraphElement;
const progressBar = document.getElementById("progress-bar") as HTMLDivElement;
const exerciseDurationInput = document.getElementById("exercise-duration") as HTMLInputElement;
const breakDurationInput = document.getElementById("break-duration") as HTMLInputElement;
const roundsInput = document.getElementById("rounds") as HTMLInputElement;
const applySettingsBtn = document.getElementById("apply-settings") as HTMLButtonElement;
const toastContainer = document.getElementById("toast-container") as HTMLDivElement;

let exerciseDuration = Number(exerciseDurationInput.value);
let breakDuration = Number(breakDurationInput.value);
let totalRounds = Number(roundsInput.value);
let currentRound = 1;

let timer: Timer | null = null;
let isPaused = false;
let remainingTime = 0;

// Pause Button Setup
pauseBtn.id = "pause-btn";
pauseBtn.innerText = "⏸ Pause";
pauseBtn.style.display = "none"; // Hide initially
document.querySelector(".buttons")?.appendChild(pauseBtn);

// Stop Button Setup
stopBtn.id = "stop-btn";
stopBtn.innerText = "⏹ Stop";
stopBtn.style.display = "none"; // Hide initially
document.querySelector(".buttons")?.appendChild(stopBtn);

// Function to show toast messages
export function showToast(message: string, type: "success" | "warning" | "error" = "success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.innerText = message;

    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        console.error("Toast container not found!");
        return;
    }

    toastContainer.appendChild(toast);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.5s ease-in-out";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}


// Update Timer Display
function updateDisplay(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    display.innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Update progress bar
    const percentage = (time / exerciseDuration) * 100;
    progressBar.style.width = `${percentage}%`;

    // Warn user if time is below 5 seconds
    if (time <= 5) {
        display.classList.add("timer-warning");
    } else {
        display.classList.remove("timer-warning");
    }
}

// Start Workout Timer
function startWorkout() {
    if (isPaused && timer) {
        // Resume from pause
        isPaused = false;
        timer.start();
        pauseBtn.innerText = "⏸ Pause";
        showToast("Workout Resumed", "success");
    } else {
        // Start new workout session
        exerciseDuration = Number(exerciseDurationInput.value);
        breakDuration = Number(breakDurationInput.value);
        totalRounds = Number(roundsInput.value);
        currentRound = 1;

        startExercise();
    }

    startBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    stopBtn.style.display = "inline-block";
}

// Start Exercise Round
function startExercise() {
    exerciseInfo.innerText = `Round ${currentRound}/${totalRounds} - Exercise`;
    timer = new Timer(exerciseDuration, updateDisplay, () => {
        showToast("Exercise Complete! Break Time", "success");
        startBreak();
    });
    timer.start();
}

// Start Break Round
function startBreak() {
    if (currentRound >= totalRounds) {
        showToast("Workout Complete! 🎉", "success");
        resetTimer();
        return;
    }

    exerciseInfo.innerText = `Break Time!`;
    timer = new Timer(breakDuration, updateDisplay, () => {
        currentRound++;
        showToast(`Break Over! Starting Round ${currentRound}`, "warning");
        startExercise();
    });
    timer.start();
}

// Pause Workout
function pauseWorkout() {
    if (timer) {
        if (!isPaused) {
            isPaused = true;
            remainingTime = Number(display.innerText.split(":")[0]) * 60 + Number(display.innerText.split(":")[1]);
            clearInterval(timer["intervalId"]);
            pauseBtn.innerText = "▶️ Resume";
            showToast("Workout Paused", "warning");
        } else {
            startWorkout();
        }
    }
}

// Stop & Reset Timer
function resetTimer() {
    if (timer) {
        clearInterval(timer["intervalId"]);
        timer = null;
    }
    isPaused = false;
    display.innerText = "00:00";
    exerciseInfo.innerText = "Press Start";
    progressBar.style.width = "100%";
    startBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
    stopBtn.style.display = "none";
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    themeToggle.innerText = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Event Listeners
startBtn.addEventListener("click", startWorkout);
pauseBtn.addEventListener("click", pauseWorkout);
stopBtn.addEventListener("click", resetTimer);
themeToggle.addEventListener("click", toggleDarkMode);
applySettingsBtn.addEventListener("click", () => {
    showToast("Settings Applied", "success");
});
