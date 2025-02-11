export class Timer {
    private duration: number;
    private callback: () => void;
    private updateCallback: (time: number) => void;
    private timeLeft: number;
    private intervalId: number | null = null;

    constructor(duration: number, updateCallback: (time: number) => void, callback: () => void) {
        this.duration = duration;
        this.timeLeft = duration;
        this.updateCallback = updateCallback;
        this.callback = callback;
    }

    start() {
        if (this.intervalId) return; // Prevent multiple intervals

        this.updateCallback(this.timeLeft); // Initial update

        this.intervalId = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft <= 0) {
                this.stop();
                this.callback();
            } else {
                this.updateCallback(this.timeLeft);
            }
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reset() {
        this.stop();
        this.timeLeft = this.duration;
        this.updateCallback(this.timeLeft);
    }

    pause() {
        this.stop();
    }

    resume() {
        if (!this.intervalId) {
            this.start();
        }
    }
}
