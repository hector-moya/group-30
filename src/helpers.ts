export let displayMatrixAsTable = (matrix: any, containerId: string) => {

    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container element with ID '${containerId}' not found.`);
        return;
    }

    // Clear the container's content before adding the new table
    container.innerHTML = '';

    const table = document.createElement("table");
    for (const row of matrix) {
        const rowElement = document.createElement("tr");
        for (const cell of row) {
            const cellElement = document.createElement("td");
            cellElement.textContent = cell;
            rowElement.appendChild(cellElement);
        }
        table.appendChild(rowElement);
    }

    container.appendChild(table);
}