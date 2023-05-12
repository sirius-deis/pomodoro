interface ITask {
    isDone: boolean;
    title: string;
    times: number;
    timesDone: number;
    note: string;

    toggleIsDone: () => void;
    incrementTimesDone: () => void | never;
    changeNumberOfTimes: (n: number) => void;
    changeText: (text: string) => void;
    changeNote: (text: string) => void;
}

class Task implements ITask {
    isDone: boolean;
    title: string;
    times: number;
    timesDone: number;
    note: string;
    constructor(title: string, times: number, note: string) {
        this.isDone = false;
        this.title = title;
        this.times = times;
        this.timesDone = 0;
        this.note = note;
    }

    toggleIsDone = () => {
        this.isDone = !this.isDone;
    };

    incrementTimesDone = () => {
        if (this.timesDone >= this.times) {
            throw new Error(
                "Amount of times task was done can't be more then amount of how it should've been done itself"
            );
        }
        this.timesDone++;
    };

    changeNumberOfTimes = (n: number) => {
        this.times = n;
    };

    changeText = (text: string) => {
        if (text.trim().length < 1) {
            throw new Error('Title cannot be empty string');
        }
        this.title = text;
    };
    changeNote = (text: string) => {
        this.note = text;
    };
}

export default Task;
