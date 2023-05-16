import TimerTabs from './timerTabs';
import Timer from './timer';

enum TYPES {
    POMODORO = 25 * 60,
    SHORT = 5 * 60,
    LONG = 15 * 60,
}

interface Playable {
    audioEl: HTMLAudioElement;
    play: () => void;
}

class TimerContainer implements Playable {
    _type: TYPES;
    time: number;
    private timerTabs: TimerTabs;
    private timer: Timer;
    private timeBtn: HTMLButtonElement;
    private timeResetBtn: HTMLButtonElement;
    audioEl: HTMLAudioElement;

    constructor() {
        this._type = TYPES.POMODORO;
        this.time = TYPES.POMODORO;
        const timerContainer = document.querySelector(
            '.timer'
        ) as HTMLDivElement;
        this.timerTabs = TimerTabs.getInstance(
            timerContainer,
            this.tabsUpdateHandler.bind(this)
        );

        this.timer = Timer.getInstance(
            this.time,
            timerContainer,
            this.timerNotifyHandler.bind(this)
        );
        this.timeBtn = timerContainer.querySelector(
            '.timer__btn'
        ) as HTMLButtonElement;
        this.timeResetBtn = timerContainer.querySelector(
            '.timer__reset'
        ) as HTMLButtonElement;

        this.audioEl = document.createElement('audio');
        this.audioEl.src = 'public/click.wav';
    }

    init = () => {
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

    private tabsUpdateHandler = (title: string, tab: HTMLLIElement) => {
        this.type = title;
        this.time = this._type;
        this.reset(tab);
        this.hideResetBtn();
    };

    private timerNotifyHandler = () => {
        this.timeBtn.textContent = 'Start';
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
        if (!this.timer.isRunning) {
            this.timer.start();
            this.timeBtn.textContent = 'Pause';
            this.showResetBtn();
        } else {
            if (this.time === 0) {
                this.time = this._type;
                return this.reset();
            }
            this.timer.stop();
            this.timeBtn.textContent = 'Start';
        }
        this.play();
    };

    private showResetBtn = () => {
        this.timeResetBtn.classList.remove('hidden');
    };

    private hideResetBtn = () => {
        this.timer.stop();
        this.timeResetBtn.classList.add('rotatable');
        setTimeout(() => {
            this.timeResetBtn.classList.add('hidden');
            this.timeResetBtn.classList.remove('rotatable');
        }, 300);
        this.time = this._type;
        this.timer.setTimeOnEl(this.time);
    };

    reset = (tab?: HTMLLIElement) => {
        this.timer.isRunning = false;
        this.timer.stop();
        this.timer.setTimeOnEl(this.time);
        this.timeBtn.textContent = 'Start';
        if (!tab) {
            return;
        }
        this.timerTabs.resetTabs();
    };
}

const timer = new TimerContainer();

export default timer;
