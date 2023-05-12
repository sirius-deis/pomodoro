import Task from './task';

interface ITaskList {
    tasks: Task[];
}

class TaskList implements ITaskList {
    tasks: Task[];

    private taskList: HTMLUListElement;
    private tasksAdd: HTMLButtonElement;
    private addForm: HTMLFormElement;
    constructor() {
        this.tasks = [];
        const tasksEl = document.querySelector('.tasks')!;
        this.taskList = tasksEl.querySelector(
            '.tasks__list'
        ) as HTMLUListElement;
        this.tasksAdd = tasksEl.querySelector(
            '.tasks__add'
        ) as HTMLButtonElement;
        this.addForm = (
            tasksEl.querySelector('#form__template') as HTMLTemplateElement
        ).content
            .querySelector('.form')
            ?.cloneNode(true) as HTMLFormElement;
    }

    init = () => {
        this.tasksAdd.addEventListener('click', this.showForm.bind(this));
        (
            this.addForm.querySelector(
                '.form__btn--cancel'
            ) as HTMLButtonElement
        ).addEventListener('click', this.hideForm.bind(this));
    };

    private showForm = () => {
        this.tasksAdd.replaceWith(this.addForm);
    };

    private hideForm = () => {
        this.addForm.replaceWith(this.tasksAdd);
    };
}

const taskList = new TaskList();

export default taskList;
