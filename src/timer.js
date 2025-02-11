export class Timer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
    }
    start() {
        let timeLeft = this.duration;
        this.onTick(timeLeft);
        this.intervalId = window.setInterval(() => {
            timeLeft--;
            this.onTick(timeLeft);
            console.log(`Time left: ${timeLeft}s`);
            if (timeLeft <= 0) {
                clearInterval(this.intervalId);
                console.log("Timer complete!");
                this.onComplete();
            }
        }, 1000);
    }
}
