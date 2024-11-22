document.addEventListener('DOMContentLoaded', () => {
    const taskContainer = document.querySelector('main'); // Reference to main container

    // Create a parent wrapper for flexbox or grid layout
    const taskWrapper = document.createElement('div');
    taskWrapper.className = 'd-flex flex-wrap gap-4'; // Flexbox wrapper with spacing

    // Append the wrapper to the main container
    taskContainer.appendChild(taskWrapper);

    // Fetch tasks from the server
    fetch('/tasks')
        .then((response) => response.json())
        .then((tasks) => {
            tasks.reverse(); // Display tasks in descending order
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
    innerDiv.className = 'text-center';

    const title = document.createElement('div');
    title.className = 'fw-bold fs-5 text-dark mb-2';
    title.textContent = task.name;

    const description = document.createElement('div');
    description.className = 'text-muted fs-6';
    description.textContent = task.description;

    innerDiv.appendChild(title);
    innerDiv.appendChild(description);
    container.appendChild(innerDiv);

    return container;
}
