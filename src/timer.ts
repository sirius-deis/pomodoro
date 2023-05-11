enum TYPES {
    POMODORO = 25 * 60,
    SHORT = 5 * 60,
    LONG = 15 * 60,
}

interface Runnable {
    isRunning: boolean;
    start: () => void;
    stop: () => void;
}

interface Playable {
    audioEl: HTMLAudioElement;
    play: () => void;
}

interface ITimer {
    _type: TYPES;
    time: number;
    intervalId: string | number | NodeJS.Timer | undefined;
    tick: () => void;
}

class Timer implements ITimer, Runnable, Playable {
    _type: TYPES;
    time: number;
    intervalId: string | number | NodeJS.Timer | undefined;
    private timerTabs: HTMLUListElement;
    private timerTabsArr: NodeListOf<HTMLLIElement>;
    private timeEl: HTMLDivElement;
    private timeBtn: HTMLButtonElement;
    private timeResetBtn: HTMLButtonElement;
    isRunning = false;
    audioEl: HTMLAudioElement;
    constructor() {
        this._type = TYPES.POMODORO;
        this.time = TYPES.POMODORO;
        const timerEl = document.querySelector('.timer') as HTMLDivElement;
        this.timerTabs = timerEl.querySelector(
            '.timer__tabs'
        ) as HTMLUListElement;
        this.timerTabsArr = this.timerTabs.querySelectorAll('.timer__tab');
        this.timeEl = timerEl.querySelector('.timer__time') as HTMLDivElement;
        this.timeBtn = timerEl.querySelector(
            '.timer__btn'
        ) as HTMLButtonElement;
        this.timeResetBtn = timerEl.querySelector(
            '.timer__reset'
        ) as HTMLButtonElement;
        this.audioEl = document.createElement('audio');
        this.audioEl.src = 'public/click.wav';
    }

    init = () => {
        this.timerTabs.addEventListener(
            'click',
            this.tabsClickHandler.bind(this)
        );
        this.timeBtn.addEventListener(
            'click',
            this.buttonClickHandler.bind(this)
        );
        this.timeResetBtn.addEventListener(
            'click',
            this.hideResetBtn.bind(this)
        );
    };

    play = () => {
        this.audioEl.play();
    };

    private tabsClickHandler = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target) {
            return;
        }
        const tab = target.closest('.timer__tab') as HTMLLIElement;
        const title = tab?.textContent?.trim().split(' ')[0];
        if (!title || target.classList.contains('timer__tab--active')) {
            return;
        }
        this.type = title;
        this.time = this._type;
        this.reset(tab);
        tab.classList.add('timer__tab--active');
        document.body.className = title.toLowerCase();
    };

    set type(value: string) {
        switch (value) {
            case 'Short':
                this._type = TYPES.SHORT;
                break;
            case 'Long':
                this._type = TYPES.LONG;
                break;
            case 'Pomodoro':
            default:
                this._type = TYPES.POMODORO;
        }
    }

    private buttonClickHandler = () => {
        if (!this.isRunning) {
            this.start();
            this.timeBtn.textContent = 'Pause';
            this.showResetBtn();
        } else {
            if (this.time === 0) {
                this.time = this._type;
                return this.reset();
            }
            this.stop();
            this.timeBtn.textContent = 'Start';
        }
        this.play();
    };

    private showResetBtn = () => {
        this.timeResetBtn.classList.remove('hidden');
    };

    private hideResetBtn = () => {
        this.timeResetBtn.classList.add('rotatable');
        setTimeout(() => {
            this.timeResetBtn.classList.add('hidden');
            this.timeResetBtn.classList.remove('rotatable');
        }, 300);
        this.time = this._type;
        this.reset();
    };

    reset = (tab?: HTMLLIElement) => {
        this.isRunning = false;
        clearInterval(this.intervalId!);
        this.setTimeOnEl();
        this.timeBtn.textContent = 'Start';
        if (!tab) {
            return;
        }
        this.timerTabsArr.forEach(tab =>
            tab.classList.remove('timer__tab--active')
        );
    };

    start = () => {
        this.isRunning = true;
        this.intervalId = setInterval(this.tick.bind(this), 1000);
        this.tick();
    };

    stop = () => {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };

    tick = () => {
        if (this.time <= 0) {
            clearInterval(this.intervalId!);
            this.timeBtn.textContent = 'Start';
        }
        this.setTimeOnEl();
        this.time--;
    };

    private setTimeOnEl = () => {
        this.timeEl.innerHTML = `${this.formateTime(
            Math.trunc(this.time / 60)
        )}:${this.formateTime(Math.trunc(this.time % 60))}`;
    };

    private formateTime = (value: number): string => {
        return value >= 10 ? value.toString() : `0${value}`;
    };
}

const timer = new Timer();

export default timer;
