document.addEventListener('DOMContentLoaded', () => {
    const taskContainer = document.querySelector('main');

    const taskWrapper = document.createElement('div');
    taskWrapper.className = 'd-flex flex-wrap gap-4';
    taskContainer.appendChild(taskWrapper);

    // Fetch tasks from the server
    fetch('/tasks')
        .then((response) => response.json())
        .then((tasks) => {
            tasks.reverse();
            tasks.forEach((task) => {
                const taskElement = createTaskElement(task);
                taskWrapper.appendChild(taskElement);
            });
        })
        .catch((error) => console.error('Error fetching tasks:', error));
});

// Function to create a task card
function createTaskElement(task) {
    const container = document.createElement('div');
    container.className = 'container mt-4 border border-dark rounded p-4 bg-light shadow-sm col-3';

    const innerDiv = document.createElement('div');
    innerDiv.className = 'text-center position-relative';

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'position-relative top-0 end-0 m-2';

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-primary me-1';
    editButton.textContent = 'Edit';

    const doneButton = document.createElement('button');
    doneButton.className = 'btn btn-sm btn-success me-1';
    doneButton.textContent = 'Mark as done';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-danger';
    deleteButton.textContent = 'Delete';

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(doneButton);
    buttonsContainer.appendChild(deleteButton);

    const title = document.createElement('div');
    title.className = 'fw-bold fs-5 text-dark mb-2';
    title.textContent = task.name;

    const description = document.createElement('div');
    description.className = 'text-muted fs-6';
    description.textContent = task.description;

    innerDiv.appendChild(buttonsContainer);
    innerDiv.appendChild(title);
    innerDiv.appendChild(description);
    container.appendChild(innerDiv);

    // Handle Edit functionality
    editButton.addEventListener('click', () => {
        const updatedName = prompt('Edit Task Name:', task.name);
        const updatedDescription = prompt('Edit Task Description:', task.description);

        if (updatedName && updatedDescription) {
            fetch(`/update/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: updatedName, description: updatedDescription }),
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Task updated successfully!');
                        window.location.reload(); // Reload to show updated tasks
                    } else {
                        alert('Failed to update task.');
                    }
                })
                .catch((error) => console.error('Error updating task:', error));
        }
    });

    return container;
}
