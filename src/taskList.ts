import Task from './task';
import Form from './form';

interface ITaskList {
    tasks: Task[];
}

class TaskList implements ITaskList {
    tasks: Task[];

    private tasksEl: HTMLDivElement;
    private taskList: HTMLUListElement;
    private tasksAdd: HTMLButtonElement;
    constructor() {
        this.tasks = [];
        this.tasksEl = document.querySelector('.tasks')!;
        this.taskList = this.tasksEl.querySelector(
            '.tasks__list'
        ) as HTMLUListElement;
        this.tasksAdd = this.tasksEl.querySelector(
            '.tasks__add'
        ) as HTMLButtonElement;
    }

    init = () => {
        this.tasksAdd.addEventListener('click', () => {
            new Form(this.tasksEl, this.tasksAdd, this.addTask, false);
        });
        this.taskList.addEventListener('click', this.editTask.bind(this));
    };

    editTask = (event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        if (!target || !target.classList.contains('menu')) {
            return;
        }
        const element = target.closest('.tasks__item') as HTMLLIElement;
        new Form(this.tasksEl, element, this.addTask, true);
    };

    private addTask = (task: Task) => {
        this.tasks.push(task);
        this.renderTask(task);
    };

    private renderTask = (task: Task) => {
        const item = document.createElement('li');
        item.classList.add('tasks__item');
        const tick = document.createElement('div');
        tick.classList.add('tasks__tick', 'tick');
        tick.innerHTML = '&#10003;';
        const text = document.createElement('div');
        text.classList.add('tasks__text');
        text.textContent = task.title;
        const progress = document.createElement('div');
        progress.classList.add('tasks__progress');
        progress.textContent = `${task.timesDone}/${task.times}`;
        const menu = document.createElement('button');
        menu.classList.add('menu');
        menu.innerHTML = `
            <div class="menu__item"></div>
            <div class="menu__item"></div>
            <div class="menu__item"></div>
        `;
        item.append(tick, text, progress, menu);

        this.taskList.insertAdjacentElement('beforeend', item);
    };
}

const taskList = new TaskList();

export default taskList;
