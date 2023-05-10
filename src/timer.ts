enum TYPES {
    POMODORO = 'Pomodoro',
    SHORT = 'Short',
    LONG = 'Long',
}

interface Runnable {
    running: boolean;
}

interface ITimer {
    _type: TYPES;
    _time: number;
    intervalId: string | number | NodeJS.Timer | undefined;
    timerTabs: HTMLUListElement;
    timerTabsArr: NodeListOf<HTMLLIElement>;
    timeEl: HTMLDivElement;
    timeBtn: HTMLButtonElement;
    start: () => void;
    stop: () => void;
    tick: () => void;
}

class Timer implements ITimer, Runnable {
    _type = TYPES.POMODORO;
    _time = 25 * 60;
    intervalId: string | number | NodeJS.Timer | undefined;
    timerTabs;
    timerTabsArr: NodeListOf<HTMLLIElement>;
    timeEl;
    timeBtn;
    running = false;
    constructor() {
        this.timerTabs = document.querySelector(
            '.timer__tabs'
        ) as HTMLUListElement;
        this.timerTabsArr = this.timerTabs.querySelectorAll('.timer__tab');
        this.timeEl = document.querySelector('.timer__time') as HTMLDivElement;
        this.timeBtn = document.querySelector(
            '.timer__btn'
        ) as HTMLButtonElement;
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
    };

    private tabsClickHandler = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target) {
            return;
        }
        const tab = target.closest('.timer__tab');
        const title = tab?.textContent?.trim().split(' ')[0];
        if (!title || title === this._type) {
            return;
        }
        switch (title) {
            case 'Pomodoro':
                this._type = TYPES.POMODORO;
                break;
            case 'Short':
                this._type = TYPES.SHORT;
                break;
            case 'Long':
                this._type = TYPES.LONG;
                break;
        }
        this.reset();
        (
            Array.prototype.find.call(this.timerTabsArr, (tab: HTMLLIElement) =>
                tab.textContent?.includes(this._type)
            ) as HTMLLIElement
        ).classList.add('timer__tab--active');
    };

    private buttonClickHandler = () => {
        if (!this.running) {
            this.start();
            this.timeBtn.textContent = 'Pause';
        } else {
            clearInterval(this.intervalId!);
            this.timeBtn.textContent = 'Start';
        }
    };

    reset = () => {
        this.running = false;
        clearInterval(this.intervalId!);
        this.timerTabsArr.forEach(tab =>
            tab.classList.remove('timer__tab--active')
        );
        switch (this._type) {
            case TYPES.LONG:
                this._time = 15 * 60;
                break;
            case TYPES.SHORT:
                this._time = 5 * 60;
                break;
            case TYPES.POMODORO:
            default:
                this._time = 25 * 60;
        }
        this.setTimeOnEl();
        this.timeBtn.textContent = 'Start';
    };

    start = () => {
        this.running = true;
        this.intervalId = setInterval(this.tick.bind(this), 1000);
        this.tick();
    };
    stop = () => {
        this.running = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    };
    tick = () => {
        if (this._time <= 0) {
            clearInterval(this.intervalId!);
        }
        this.setTimeOnEl();
        this._time--;
    };

    private setTimeOnEl = () => {
        this.timeEl.innerHTML = `${this.formateTime(
            Math.trunc(this._time / 60)
        )}:${this.formateTime(Math.trunc(this._time % 60))}`;
    };

    private formateTime = (value: number): string => {
        return value >= 10 ? value.toString() : `0${value}`;
    };
}

const timer = new Timer();

export default timer;
