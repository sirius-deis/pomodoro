import Task from './task';

type addTaskType = (task: Task) => void;

class Form {
    private addForm: HTMLFormElement;
    private el: HTMLElement;
    private addTask: addTaskType | undefined;
    private titleEl: HTMLInputElement;
    private amountEl: HTMLInputElement;
    private arrowsEl: NodeListOf<HTMLButtonElement>;
    private isTask: boolean;
    constructor(
        tasksEl: HTMLDivElement,
        el: HTMLElement,
        addTask?: addTaskType,
        isTask: boolean = true
    ) {
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
        this.el = el;
        this.addTask = addTask;
        this.isTask = isTask;

        this.showForm();

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
    }

    private showForm = () => {
        if (this.isTask) {
            this.addForm
                .querySelector('.form__btn--delete')!
                .classList.remove('hidden');
        }
        this.el.replaceWith(this.addForm);
    };

    private hideForm = () => {
        this.addForm.replaceWith(this.el);
    };

    private createTask = (event: SubmitEvent) => {
        event.preventDefault();
        const data = this.collectData(this.addForm);
        const newTask = new Task(data.title, data.amount, data.note);
        if (this.addTask) {
            this.addTask(newTask);
        }
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

    private increaseAmount = (n: number) => {
        const newValue = +this.amountEl.value + n;
        if (newValue < 1) {
            return;
        }
        this.amountEl.value = newValue.toString();
    };
}

export default Form;
