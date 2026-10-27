
// =========================
// ELEMENTOS DA PÁGINA
// =========================

const openTaskForm = document.getElementById("openTaskForm");
const taskFormContainer = document.getElementById("taskFormContainer");
const taskForm = document.getElementById("taskForm");
const cancelTask = document.getElementById("cancelTask");
const taskList = document.querySelector(".task-list");

const taskName = document.getElementById("taskName");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const progressPercentage = document.getElementById("progressPercentage");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");
const progressMessage = document.getElementById("progressMessage");

const performanceChart = document.getElementById("performanceChart");
const chartPercentage = document.getElementById("chartPercentage");
const chartCompleted = document.getElementById("chartCompleted");
const chartPending = document.getElementById("chartPending");
const chartTotal = document.getElementById("chartTotal");

// =========================
// ARMAZENAMENTO
// =========================

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("devtrack-tasks")
    );

    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch (error) {
    tasks = [];
}

// Garante compatibilidade com tarefas antigas.
tasks = tasks
    .filter(function (task) {
        return task && typeof task === "object";
    })
    .map(function (task) {
        return {
            name: typeof task.name === "string" ? task.name : "Tarefa sem nome",
            priority: ["Alta", "Média", "Baixa"].includes(task.priority)
                ? task.priority
                : "Média",
            completed: task.completed === true,
            dueDate: typeof task.dueDate === "string"
                ? task.dueDate
                : ""
        };
    });

function saveTasks() {
    localStorage.setItem("devtrack-tasks", JSON.stringify(tasks));
}

// =========================
// ATUALIZA O PAINEL
// =========================

function updateDashboard() {
    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pending = tasks.length - completed;

    if (totalTasks) {
        totalTasks.textContent = tasks.length;
    }

    if (completedTasks) {
        completedTasks.textContent = completed;
    }

    if (pendingTasks) {
        pendingTasks.textContent = pending;
    }
}

// =========================
// ATUALIZA O PROGRESSO
// =========================

function updateProgress() {
    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const percentage = total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    if (progressPercentage) {
        progressPercentage.textContent = `${percentage}%`;
    }

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressBar) {
        progressBar.setAttribute("aria-valuenow", percentage);
    }

    if (progressMessage) {
        if (total === 0) {
            progressMessage.textContent =
                "Comece concluindo sua primeira tarefa!";
        } else if (percentage === 100) {
            progressMessage.textContent =
                "Parabéns! Você concluiu todas as tarefas!";
        } else if (percentage >= 50) {
            progressMessage.textContent =
                "Muito bem! Você já avançou bastante.";
        } else {
            progressMessage.textContent =
                "Continue assim! Cada tarefa concluída conta.";
        }
    }
}

// =========================
// GRÁFICO DE DESEMPENHO
// =========================

function updatePerformanceChart() {
    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const percentage = total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    if (chartPercentage) {
        chartPercentage.textContent = `${percentage}%`;
    }

    if (chartCompleted) {
        chartCompleted.textContent = completed;
    }

    if (chartPending) {
        chartPending.textContent = pending;
    }

    if (chartTotal) {
        chartTotal.textContent = total;
    }

    if (performanceChart) {
        performanceChart.style.background = `
            conic-gradient(
                #6D28D9 0% ${percentage}%,
                #38304F ${percentage}% 100%
            )
        `;

        performanceChart.setAttribute(
            "aria-label",
            `${percentage}% das tarefas concluídas: ${completed} concluídas e ${pending} pendentes.`
        );
    }
}

// =========================
// ÍCONE DE EXCLUSÃO
// =========================

function createTrashIcon() {
    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const paths = [
        "M3 6h18",
        "M8 6V4h8v2",
        "m19 6-1 14H6L5 6",
        "M10 11v5",
        "M14 11v5"
    ];

    paths.forEach(function (pathData) {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathData);
        svg.appendChild(path);
    });

    return svg;
}

// =========================
// MOSTRA AS TAREFAS
// =========================

function renderTasks() {
    updateDashboard();
    updateProgress();
    updatePerformanceChart();

    if (!taskList) {
        return;
    }

    taskList.replaceChildren();

    const now = new Date();

    const todayString = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("empty-tasks");
        emptyMessage.textContent =
            "Você ainda não tem tarefas. Clique em + Nova Tarefa para começar.";

        taskList.appendChild(emptyMessage);
        return;
    }

    tasks.forEach(function (task) {
        const article = document.createElement("article");
        article.classList.add("task-card");

        if (task.completed) {
            article.classList.add("task-completed");
        }

        // Título
        const title = document.createElement("h2");
        title.textContent = task.name;

        // Descrição
        const description = document.createElement("p");
        description.textContent = "Tarefa cadastrada no DevTrack";

        // Data de vencimento
        const dueDateElement = document.createElement("p");
        dueDateElement.classList.add("due-date");

        if (task.dueDate) {
            const [year, month, day] = task.dueDate.split("-");

            dueDateElement.textContent =
                `Vencimento: ${day}/${month}/${year}`;

            if (task.dueDate < todayString && !task.completed) {
                article.classList.add("task-overdue");
                dueDateElement.classList.add("due-date-overdue");

                dueDateElement.textContent =
                    `Atrasada! Venceu em ${day}/${month}/${year}`;
            }
        } else {
            dueDateElement.textContent = "Sem data de vencimento";
        }

        // Prioridade
        const badge = document.createElement("span");

        if (task.priority === "Alta") {
            badge.classList.add("priority-high");
        } else if (task.priority === "Média") {
            badge.classList.add("priority-medium");
        } else {
            badge.classList.add("priority-low");
        }

        badge.textContent = task.priority;

        // Área dos botões
        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        // Botão de concluir ou reabrir
        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.classList.add("btn-complete");
        completeButton.textContent = "✓";

        completeButton.setAttribute(
            "aria-label",
            task.completed ? "Reabrir tarefa" : "Concluir tarefa"
        );

        completeButton.title = task.completed
            ? "Reabrir tarefa"
            : "Concluir tarefa";

        if (task.completed) {
            completeButton.classList.add("is-completed");
        }

        completeButton.addEventListener("click", function () {
            task.completed = !task.completed;

            saveTasks();
            renderTasks();
        });

        // Botão de excluir
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("btn-delete");
        deleteButton.appendChild(createTrashIcon());

        deleteButton.setAttribute("aria-label", "Excluir tarefa");
        deleteButton.title = "Excluir tarefa";

        deleteButton.addEventListener("click", function () {
            const confirmed = confirm(
                `Deseja excluir a tarefa "${task.name}"?`
            );

            if (!confirmed) {
                return;
            }

            tasks = tasks.filter(function (item) {
                return item !== task;
            });

            saveTasks();
            renderTasks();
        });

        actions.append(completeButton, deleteButton);

        article.append(
            title,
            description,
            badge,
            dueDateElement,
            actions
        );

        taskList.appendChild(article);
    });
}

// =========================
// ABRIR O FORMULÁRIO
// =========================

if (openTaskForm && taskFormContainer && taskName) {
    openTaskForm.addEventListener("click", function () {
        taskFormContainer.hidden = false;
        taskName.focus();
    });
}

// =========================
// CANCELAR O FORMULÁRIO
// =========================

if (cancelTask && taskForm && taskFormContainer) {
    cancelTask.addEventListener("click", function () {
        taskForm.reset();
        taskFormContainer.hidden = true;
    });
}

// =========================
// CADASTRAR UMA TAREFA
// =========================

if (taskForm && taskName && taskPriority && taskFormContainer) {
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = taskName.value.trim();
        const priority = taskPriority.value;
        const dueDate = taskDueDate ? taskDueDate.value : "";

        if (name === "") {
            taskName.focus();
            return;
        }

        const newTask = {
            name: name,
            priority: priority,
            completed: false,
            dueDate: dueDate
        };

        tasks.push(newTask);

        saveTasks();
        renderTasks();

        taskForm.reset();
        taskFormContainer.hidden = true;
    });
}

// =========================
// INICIALIZAÇÃO
// =========================

renderTasks();
