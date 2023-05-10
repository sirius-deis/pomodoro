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

interface Clickable {
    audioEl: HTMLAudioElement;

    play: () => void;
}

interface ITimer {
    type: TYPES;
    time: number;
    intervalId: string | number | NodeJS.Timer | undefined;
    tick: () => void;
}

class Timer implements ITimer, Runnable, Clickable {
    type: TYPES = TYPES.POMODORO;
    time: number = TYPES.POMODORO;
    intervalId: string | number | NodeJS.Timer | undefined;
    private timerTabs;
    private timerTabsArr: NodeListOf<HTMLLIElement>;
    private timeEl;
    private timeBtn;
    private timeResetBtn;
    isRunning = false;
    audioEl;
    constructor() {
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
        switch (title) {
            case 'Pomodoro':
                this.type = TYPES.POMODORO;
                break;
            case 'Short':
                this.type = TYPES.SHORT;
                break;
            case 'Long':
                this.type = TYPES.LONG;
                break;
        }
        this.time = this.type;
        this.reset(tab);
        tab.classList.add('timer__tab--active');
    };

    private buttonClickHandler = () => {
        if (!this.isRunning) {
            this.start();
            this.timeBtn.textContent = 'Pause';
            this.showResetBtn();
        } else {
            if (this.time === 0) {
                this.time = this.type;
                return this.reset();
            }
            this.stop();
            this.timeBtn.textContent = 'Start';
        }
        this.play();
    };

    showResetBtn = () => {
        this.timeResetBtn.classList.remove('hidden');
    };

    hideResetBtn = () => {
        this.timeResetBtn.classList.add('rotatable');
        setTimeout(() => {
            this.timeResetBtn.classList.add('hidden');
            this.timeResetBtn.classList.remove('rotatable');
        }, 300);
        this.time = this.type;
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
