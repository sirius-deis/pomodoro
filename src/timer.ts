type notifyFnType = () => void;

interface Runnable {
    _isRunning: boolean;
    start: () => void;
    stop: () => void;
}

interface ITimer {
    time: number;
    intervalId: string | number | NodeJS.Timer | undefined;
    tick: () => void;
}

class Timer implements ITimer, Runnable {
    private static timerInstance: Timer;
    time: number;
    _isRunning = false;
    intervalId: string | number | NodeJS.Timer | undefined;
    private timeEl: HTMLDivElement;

    private notifyFn: notifyFnType;

    private constructor(
        time: number,
        timerContainer: HTMLDivElement,
        notifyFn: notifyFnType
    ) {
        this.time = time;
        this.timeEl = timerContainer.querySelector(
            '.timer__time'
        ) as HTMLDivElement;
        this.notifyFn = notifyFn;
    }

    static getInstance = function (
        time: number,
        timerContainer: HTMLDivElement,
        notifyFn: notifyFnType
    ) {
        if (!Timer.timerInstance) {
            Timer.timerInstance = new Timer(time, timerContainer, notifyFn);
        }
        return Timer.timerInstance;
    };

    set isRunning(value: boolean) {
        this._isRunning = value;
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    start = () => {
        this._isRunning = true;
        this.intervalId = setInterval(this.tick.bind(this), 1000);
        this.tick();
    };

    stop = () => {
        this._isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };

    tick = () => {
        if (this.time <= 0) {
            clearInterval(this.intervalId!);
            this.notifyFn();
        }
        this.setTimeOnEl();
        this.time--;
    };

    setTimeOnEl = (time?: number) => {
        if (time) {
            this.time = time;
        }
        this.timeEl.innerHTML = `${this.formateTime(
            Math.trunc(this.time / 60)
        )}:${this.formateTime(Math.trunc(this.time % 60))}`;
    };

    private formateTime = (value: number): string => {
        return value >= 10 ? value.toString() : `0${value}`;
    };
}

export default Timer;
