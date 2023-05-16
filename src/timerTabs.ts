type updateFnType = (title: string, tab: HTMLLIElement) => void;

class TimerTabs {
    private static timerTabsInstance: TimerTabs;
    private timerTabs: HTMLUListElement;
    private timerTabsArr: NodeListOf<HTMLLIElement>;
    private updateFn: updateFnType;

    private constructor(
        timerContainer: HTMLDivElement,
        updateFn: updateFnType
    ) {
        this.timerTabs = timerContainer.querySelector(
            '.timer__tabs'
        ) as HTMLUListElement;
        this.timerTabsArr = this.timerTabs.querySelectorAll('.timer__tab');

        this.updateFn = updateFn;

        this.timerTabs.addEventListener(
            'click',
            this.tabsClickHandler.bind(this)
        );
    }

    static getInstance = function (
        timerContainer: HTMLDivElement,
        updateFn: updateFnType
    ) {
        if (TimerTabs.timerTabsInstance === undefined) {
            TimerTabs.timerTabsInstance = new TimerTabs(
                timerContainer,
                updateFn
            );
        }
        return TimerTabs.timerTabsInstance;
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
        this.updateFn(title, tab);
        tab.classList.add('timer__tab--active');
        document.body.className = title.toLowerCase();
    };

    resetTabs = () => {
        this.timerTabsArr.forEach(tab =>
            tab.classList.remove('timer__tab--active')
        );
    };
}

export default TimerTabs;
