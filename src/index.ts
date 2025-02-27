let currentIndex = 0;
let interval: any;
let remainingTime = 0;
let isPaused = false;

const schedule: { name: string; duration: number }[] = [];
const display = document.getElementById("display")!;
const exerciseInfo = document.getElementById("exercise-info")!;
const progressBar = document.getElementById("progress-bar")!;
const startButton = document.getElementById("start-btn")!;
const pauseButton = document.getElementById("pause-btn")!;
const toastContainer = document.getElementById("toast-container")!;

function showToast(message: string, type: "success" | "warning" | "error" = "success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.innerText = message;
    toastContainer.appendChild(toast);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.5s ease-in-out";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Function to play sounds
function playSound(type: "exercise" | "break" | "complete") {
    const sounds = {
        exercise: new Audio("sounds/exercise.mp3"),
        break: new Audio("sounds/break.mp3"),
        complete: new Audio("sounds/complete.mp3"),
    };
    sounds[type].play();
}

// Timer function (Starts or Resumes from Remaining Time)
function startTimer(duration: number, callback: () => void) {
    let timeLeft = remainingTime > 0 ? remainingTime : duration;
    remainingTime = timeLeft;

    display.innerText = formatTime(timeLeft);
    document.title = `⏳ ${formatTime(timeLeft)} - Workout Timer`; // Update title
    progressBar.style.width = `${(timeLeft / duration) * 100}%`;
    progressBar.style.transition = `width ${timeLeft}s linear`;

    interval = setInterval(() => {
        if (isPaused) return; // If paused, do nothing

        timeLeft--;
        remainingTime = timeLeft;
        display.innerText = formatTime(timeLeft);
        document.title = `⏳ ${formatTime(timeLeft)} - Workout Timer`; // Update title dynamically
        progressBar.style.width = `${(timeLeft / duration) * 100}%`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            remainingTime = 0;
            document.title = "✅ Workout Complete!"; // Set title when workout ends
            callback();
        }
    }, 1000);
}


// Function to start the next timer in the sequence
function startNextTimer() {
    if (currentIndex >= schedule.length) {
        exerciseInfo.innerText = "✅ Workout Complete!";
        playSound("complete");
        showToast("Workout Complete!");
        return;
    }

    const { name, duration } = schedule[currentIndex];
    exerciseInfo.innerText = name;

    if (name.includes("Exercise")) {
        playSound("exercise");
        showToast("🏋️ Exercise Time!");
    }
    if (name.includes("Break")) {
        playSound("break");
        showToast("⏸️ Break Time!");
    }

    startTimer(duration, () => {
        currentIndex++;
        startNextTimer();
    });
}

// Start Button Click
startButton.addEventListener("click", () => {
    if (schedule.length === 0) {
        showToast("⚠️ Please apply settings first!");
        return;
    }
    showToast("🚀 Workout Started!");
    if (!isPaused) currentIndex = 0; // Restart only if it's a new session
    isPaused = false;
    pauseButton.innerText = "⏸️ Pause";
    startNextTimer();
});

// Format time function
function formatTime(seconds: number): string {
    return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
