const chatForm = document.querySelector("#chat-form");
const messageInput = document.querySelector("#message-input");
const prototypeNote = document.querySelector("#prototype-note");
const actionCards = document.querySelectorAll("[data-message]");
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page-view");
const planDate = document.querySelector("#plan-date");
const taskGroups = document.querySelector("#task-groups");
const emptyState = document.querySelector("#empty-state");
const completionCount = document.querySelector("#completion-count");
const taskProgress = document.querySelector("#task-progress");
const taskProgressFill = document.querySelector("#task-progress-fill");
const taskDialog = document.querySelector("#task-dialog");
const addTaskForm = document.querySelector("#add-task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskTimeInput = document.querySelector("#task-time");
const openTaskButtons = document.querySelectorAll("[data-open-task-form]");
const closeTaskButtons = document.querySelectorAll("[data-close-task-form]");
const taskPeriods = ["Morning", "Afternoon", "Evening"];
const tasks = [
	{ id: 1, title: "Review biology lecture notes", time: "08:30", period: "Morning", completed: false },
	{ id: 2, title: "Work on the LifeOS project", time: "10:00", period: "Morning", completed: false },
	{ id: 3, title: "Practice calculus problems", time: "13:30", period: "Afternoon", completed: false },
	{ id: 4, title: "Take a walk and reset", time: "18:00", period: "Evening", completed: false },
];
let nextTaskId = tasks.length + 1;

function showPrototypeMessage(message) {
	if (!message) {
		return;
	}

	prototypeNote.textContent = `Draft received: "${message}" (local prototype)`;
	messageInput.value = "";
	messageInput.focus();
}

function formatTaskTime(time) {
	const [hours, minutes] = time.split(":").map(Number);
	const date = new Date();
	date.setHours(hours, minutes, 0, 0);
	return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

function getTaskPeriod(time) {
	const hour = Number(time.split(":")[0]);
	return hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
}

function updateProgress() {
	const completed = tasks.filter((task) => task.completed).length;
	const total = tasks.length;
	completionCount.textContent = `${completed} of ${total} tasks complete`;
	taskProgress.setAttribute("aria-valuemax", String(Math.max(total, 1)));
	taskProgress.setAttribute("aria-valuenow", String(completed));
	taskProgressFill.style.width = total ? `${(completed / total) * 100}%` : "0%";
}

function createTaskPeriod(period, periodTasks) {
	const section = document.createElement("section");
	section.className = "task-period";
	section.setAttribute("aria-labelledby", `period-${period.toLowerCase()}`);

	const heading = document.createElement("div");
	heading.className = "task-period-heading";
	const title = document.createElement("h2");
	title.id = `period-${period.toLowerCase()}`;
	title.textContent = period;
	const count = document.createElement("span");
	count.textContent = `${periodTasks.length} ${periodTasks.length === 1 ? "TASK" : "TASKS"}`;
	heading.append(title, count);

	const list = document.createElement("div");
	list.className = "task-items";
	periodTasks.forEach((task) => {
		const item = document.createElement("label");
		item.className = `task-item${task.completed ? " completed" : ""}`;

		const checkbox = document.createElement("input");
		checkbox.className = "task-checkbox";
		checkbox.type = "checkbox";
		checkbox.checked = task.completed;
		checkbox.dataset.taskId = String(task.id);

		const copy = document.createElement("span");
		copy.className = "task-copy";
		const taskTitle = document.createElement("span");
		taskTitle.className = "task-title";
		taskTitle.textContent = task.title;
		const time = document.createElement("time");
		time.className = "task-time";
		time.dateTime = task.time;
		time.textContent = formatTaskTime(task.time);
		copy.append(taskTitle, time);
		item.append(checkbox, copy);
		list.append(item);
	});

	section.append(heading, list);
	return section;
}

function renderPlan() {
	planDate.textContent = new Intl.DateTimeFormat(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date());

	taskGroups.replaceChildren();
	const groupedTasks = taskPeriods.map((period) => [
		period,
		tasks.filter((task) => task.period === period),
	]);
	groupedTasks
		.filter(([, periodTasks]) => periodTasks.length > 0)
		.forEach(([period, periodTasks]) => {
			taskGroups.append(createTaskPeriod(period, periodTasks));
		});

	const hasTasks = tasks.length > 0;
	taskGroups.hidden = !hasTasks;
	emptyState.hidden = hasTasks;
	updateProgress();
}

function openTaskForm() {
	taskDialog.showModal();
	taskTitleInput.focus();
}

chatForm.addEventListener("submit", (event) => {
	event.preventDefault();
	showPrototypeMessage(messageInput.value.trim());
});

actionCards.forEach((card) => {
	card.addEventListener("click", () => {
		messageInput.value = card.dataset.message;
		messageInput.focus();
	});
});

taskGroups.addEventListener("change", (event) => {
	const checkbox = event.target;
	if (!(checkbox instanceof HTMLInputElement) || !checkbox.matches("[data-task-id]")) {
		return;
	}

	const task = tasks.find((item) => item.id === Number(checkbox.dataset.taskId));
	if (!task) {
		return;
	}

	task.completed = checkbox.checked;
	checkbox.closest(".task-item").classList.toggle("completed", task.completed);
	updateProgress();
});

openTaskButtons.forEach((button) => {
	button.addEventListener("click", openTaskForm);
});

closeTaskButtons.forEach((button) => {
	button.addEventListener("click", () => taskDialog.close());
});

taskDialog.addEventListener("close", () => addTaskForm.reset());

addTaskForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const title = taskTitleInput.value.trim();
	const time = taskTimeInput.value;
	if (!title || !time) {
		return;
	}

	tasks.push({
		id: nextTaskId++,
		title,
		time,
		period: getTaskPeriod(time),
		completed: false,
	});
	renderPlan();
	taskDialog.close();
});

renderPlan();

navItems.forEach((item) => {
	item.addEventListener("click", (event) => {
		event.preventDefault();
		const pageId = item.getAttribute("href").slice(1);

		pages.forEach((page) => {
			page.hidden = page.id !== pageId;
		});

		navItems.forEach((navItem) => {
			navItem.classList.remove("active");
			navItem.removeAttribute("aria-current");
		});
		item.classList.add("active");
		item.setAttribute("aria-current", "page");
	});
});