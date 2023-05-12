import Task from './task';

interface ITaskList {
    tasks: Task[];
}

class TaskList implements ITaskList {
    tasks: Task[];

    private taskList: HTMLUListElement;
    private tasksAdd: HTMLButtonElement;
    constructor() {
        this.tasks = [];
        const tasksEl = document.querySelector('.tasks')!;
        this.taskList = tasksEl.querySelector(
            '.tasks__list'
        ) as HTMLUListElement;
        this.tasksAdd = tasksEl.querySelector(
            '.tasks__add'
        ) as HTMLButtonElement;
    }
}

export default TaskList;
