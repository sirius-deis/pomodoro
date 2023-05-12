import Task from './task';

interface ITaskList {
    tasks: Task[];
}

class TaskList implements ITaskList {
    tasks: Task[];

    private taskList: HTMLUListElement;
    private tasksAdd: HTMLButtonElement;
    private addForm: HTMLFormElement;
    private titleEl: HTMLInputElement;
    private amountEl: HTMLInputElement;
    private arrowsEl: NodeListOf<HTMLButtonElement>;
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
        this.titleEl = this.addForm.querySelector(
            '.form__title'
        ) as HTMLInputElement;
        this.amountEl = this.addForm.querySelector(
            '.form__amount'
        ) as HTMLInputElement;
        this.arrowsEl = this.addForm.querySelectorAll(
            '.form__arrow'
        ) as NodeListOf<HTMLButtonElement>;
    }

    init = () => {
        this.tasksAdd.addEventListener('click', this.showForm.bind(this));
        (
            this.addForm.querySelector(
                '.form__btn--cancel'
            ) as HTMLButtonElement
        ).addEventListener('click', this.hideForm.bind(this));
        this.addForm.addEventListener('submit', this.createTask.bind(this));

        this.arrowsEl.forEach((arrow: HTMLButtonElement, i: number) => {
            arrow.addEventListener(
                'click',
                this.increaseAmount.bind(this, i === 0 ? 1 : -1)
            );
        });
    };

    private showForm = () => {
        this.tasksAdd.replaceWith(this.addForm);
    };

    private createTask = (event: SubmitEvent) => {
        event.preventDefault();
        const data = this.collectData(this.addForm);
        const newTask = new Task(data.title, data.amount, data.note);
        this.tasks.push(newTask);
        this.hideForm();
    };

    private collectData = (
        element: HTMLFormElement
    ): { title: string; amount: number; note: string } => {
        const formData = new FormData(element);
        return {
            title: formData.get('title') as string,
            amount: +(formData.get('amount') as string),
            note: formData.get('note') as string,
        };
    };

    private hideForm = () => {
        this.addForm.replaceWith(this.tasksAdd);
    };

    private increaseAmount = (n: number) => {
        const newValue = +this.amountEl.value + n;
        if (newValue < 1) {
            return;
        }
        this.amountEl.value = newValue.toString();
    };
}

const taskList = new TaskList();

export default taskList;
