(() => {
  const table = document.getElementById("studentTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr[data-student]"));
  const originalRows = [...rows];
  const headers = Array.from(table.querySelectorAll("th[data-key]"));
  const search = document.getElementById("search");
  const resetSearch = document.getElementById("resetSearch");
  const resetSort = document.getElementById("resetSort");
  const resultCount = document.getElementById("resultCount");
  const sortStatus = document.getElementById("sortStatus");
  const studentCount = document.getElementById("studentCount");
  const classAverage = document.getElementById("classAverage");
  const topStudent = document.getElementById("topStudent");
  const topPercentage = document.getElementById("topPercentage");
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  const numericKeys = new Set(["java", "dbms", "total", "percentage"]);

  let currentKey = null;
  let direction = "ascending";

  function getValue(row, key) {
    const cell = row.querySelector('td[data-column="' + key + '"]');
    if (!cell) return "";
    const raw = cell.dataset.sortValue ?? cell.textContent.trim();
    return numericKeys.has(key) ? Number(raw) : raw;
  }

  function updateHeaderState() {
    headers.forEach((header) => {
      const active = header.dataset.key === currentKey;
      const icon = header.querySelector(".sort-icon");
      header.setAttribute("aria-sort", active ? direction : "none");
      header.classList.toggle("is-sorted", active);
      if (icon) {
        icon.textContent = active
          ? direction === "ascending" ? "↑" : "↓"
          : "↕";
      }
    });
  }

  function sortBy(key) {
    const header = headers.find((item) => item.dataset.key === key);
    if (!header) return;

    direction = currentKey === key && direction === "ascending"
      ? "descending"
      : "ascending";
    currentKey = key;

    const sorted = [...rows].sort((first, second) => {
      const firstValue = getValue(first, key);
      const secondValue = getValue(second, key);
      const comparison = typeof firstValue === "number"
        ? firstValue - secondValue
        : collator.compare(firstValue, secondValue);
      return direction === "ascending" ? comparison : -comparison;
    });

    sorted.forEach((row) => tbody.appendChild(row));
    updateHeaderState();

    const label = header.dataset.label || key;
    sortStatus.textContent = "Sorted by " + label + ", " + direction + ".";
  }

  function resetOrder() {
    currentKey = null;
    direction = "ascending";
    originalRows.forEach((row) => tbody.appendChild(row));
    updateHeaderState();
    sortStatus.textContent = "Original order restored.";
  }

  function filterRows() {
    const term = search.value.trim().toLocaleLowerCase();
    let visible = 0;

    rows.forEach((row) => {
      const matches = row.textContent.toLocaleLowerCase().includes(term);
      row.hidden = !matches;
      if (matches) visible += 1;
    });

    resultCount.textContent = term
      ? visible + " of " + rows.length + " students match “" + search.value.trim() + "”."
      : "Showing " + rows.length + " of " + rows.length + " students";
  }

  headers.forEach((header) => {
    const button = header.querySelector(".sort-button");
    const handleSort = () => sortBy(header.dataset.key);

    header.addEventListener("click", handleSort);
    if (button) {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        handleSort();
      });
    }
  });

  search.addEventListener("input", filterRows);
  resetSearch.addEventListener("click", () => {
    search.value = "";
    filterRows();
    search.focus();
  });
  resetSort.addEventListener("click", resetOrder);

  const percentages = rows.map((row) => Number(getValue(row, "percentage")));
  const average = percentages.reduce((total, value) => total + value, 0) / percentages.length;
  const topRow = rows.reduce((best, row) =>
    Number(getValue(row, "percentage")) > Number(getValue(best, "percentage")) ? row : best
  );

  studentCount.textContent = String(rows.length);
  classAverage.textContent = average.toFixed(1) + "%";
  topStudent.textContent = topRow.querySelector('td[data-column="name"]').textContent.trim();
  topPercentage.textContent = Number(getValue(topRow, "percentage")).toFixed(1) + "%";

  filterRows();
  updateHeaderState();
})();
