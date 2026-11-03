(() => {
  const dropdown = document.getElementById("dropdown");
  if (!dropdown) return;

  const selectedOption = document.getElementById("selectedOption");
  const workshops = Array.from(document.querySelectorAll('input[name="workshop"]'));
  const selectAll = document.getElementById("selectAll");
  const selectionStatus = document.getElementById("selectionStatus");
  const resetSubjects = document.getElementById("resetSubjects");
  const defaultChecked = ["checkboxDbms", "checkboxNetworks"];

  function updateDropdown() {
    const option = dropdown.options[dropdown.selectedIndex];
    selectedOption.textContent = dropdown.value ? option.text : "No elective selected";
  }

  function updateSelection() {
    const selected = workshops.filter((checkbox) => checkbox.checked);
    const allSelected = selected.length === workshops.length;
    const noneSelected = selected.length === 0;

    selectAll.checked = allSelected;
    selectAll.indeterminate = selected.length > 0 && !allSelected;

    if (noneSelected) {
      selectionStatus.textContent = "No workshops selected.";
      return;
    }

    if (allSelected) {
      selectionStatus.textContent = "All " + workshops.length + " workshops selected.";
      return;
    }

    const names = selected.map((checkbox) => {
      const card = checkbox.closest(".check-card");
      return card ? card.querySelector("strong").textContent.trim() : checkbox.value;
    });

    selectionStatus.textContent =
      selected.length + " of " + workshops.length + " workshops selected: " + names.join(", ") + ".";
  }

  dropdown.addEventListener("change", updateDropdown);

  selectAll.addEventListener("change", () => {
    workshops.forEach((checkbox) => {
      checkbox.checked = selectAll.checked;
    });
    updateSelection();
  });

  workshops.forEach((checkbox) => {
    checkbox.addEventListener("change", updateSelection);
  });

  resetSubjects.addEventListener("click", () => {
    workshops.forEach((checkbox) => {
      checkbox.checked = defaultChecked.includes(checkbox.id);
    });
    updateSelection();
    resetSubjects.blur();
  });

  updateDropdown();
  updateSelection();
})();
