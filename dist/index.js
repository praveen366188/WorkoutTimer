"use strict";
let currentIndex = 0;
let interval;
const schedule = [];
const display = document.getElementById("display");
const exerciseInfo = document.getElementById("exercise-info");
const progressBar = document.getElementById("progress-bar");
const startButton = document.getElementById("start-btn");
const themeToggle = document.getElementById("theme-toggle");
const applySettingsBtn = document.getElementById("apply-settings");
// Function to play sounds
function playSound(type) {
    const sounds = {
        exercise: new Audio("sounds/exercise.mp3"),
        break: new Audio("sounds/break.mp3"),
        complete: new Audio("sounds/complete.mp3"),
    };
    sounds[type].play();
}
// Timer function
function startTimer(duration, callback) {
    let timeLeft = duration;
    display.innerText = formatTime(timeLeft);
    progressBar.style.width = "100%";
    progressBar.style.transition = `width ${duration}s linear`;
    interval = setInterval(() => {
        timeLeft--;
        display.innerText = formatTime(timeLeft);
        progressBar.style.width = `${(timeLeft / duration) * 100}%`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            callback();
        }
    }, 1000);
}
// Function to start the next timer in the sequence
function startNextTimer() {
    if (currentIndex >= schedule.length) {
        exerciseInfo.innerText = "✅ Workout Complete!";
        playSound("complete");
        return;
    }
    const { name, duration } = schedule[currentIndex];
    exerciseInfo.innerText = name;
    if (name.includes("Exercise"))
        playSound("exercise");
    if (name.includes("Break"))
        playSound("break");
    startTimer(duration, () => {
        currentIndex++;
        startNextTimer();
    });
}
// Event listener for Start button
startButton.addEventListener("click", () => {
    if (schedule.length === 0) {
        alert("Please apply settings first!");
        return;
    }
    currentIndex = 0;
    startNextTimer();
});
// Apply settings
applySettingsBtn.addEventListener("click", () => {
    const exerciseTime = parseInt(document.getElementById("exercise-duration").value);
    const breakTime = parseInt(document.getElementById("break-duration").value);
    const rounds = parseInt(document.getElementById("rounds").value);
    schedule.length = 0;
    for (let i = 1; i <= rounds; i++) {
        schedule.push({ name: `Exercise ${i}`, duration: exerciseTime });
        if (i < rounds)
            schedule.push({ name: "Break", duration: breakTime });
    }
    alert("Settings Applied! Click Start to begin.");
});
// Toggle Dark Mode
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.innerText = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});
// Format time function
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
