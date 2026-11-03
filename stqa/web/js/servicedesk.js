(() => {
  const table = document.getElementById("ticketTable");
  if (!table) return;

  const tbody = document.getElementById("ticketRows");
  const search = document.getElementById("ticketSearch");
  const statusFilter = document.getElementById("statusFilter");
  const dateFrom = document.getElementById("dateFrom");
  const dateTo = document.getElementById("dateTo");
  const applyFilters = document.getElementById("applyFilters");
  const clearFilters = document.getElementById("clearFilters");
  const ticketCount = document.getElementById("ticketCount");
  const filterNote = document.getElementById("filterNote");
  const pageInfo = document.getElementById("pageInfo");
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  const openRequests = document.getElementById("openRequests");
  const averageResponse = document.getElementById("averageResponse");
  const resolvedRequests = document.getElementById("resolvedRequests");
  const headers = Array.from(table.querySelectorAll("th[data-key]"));
  const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
  const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" });
  const PAGE_SIZE = 5;

  const tickets = [
    { ref: "SD-1041", requester: "Neha Kulkarni", subject: "Projector not detected in LT-3", category: "Hardware", priority: "High", opened: "2026-10-20", status: "Closed", firstResponse: 3.2 },
    { ref: "SD-1042", requester: "Rahul Sharma", subject: "Wi-Fi disconnects in the library", category: "Network", priority: "Normal", opened: "2026-10-21", status: "Closed", firstResponse: 4.5 },
    { ref: "SD-1043", requester: "Priya Nair", subject: "Password reset for lab account", category: "Accounts", priority: "Normal", opened: "2026-10-21", status: "Closed", firstResponse: 2.0 },
    { ref: "SD-1044", requester: "Amit Verma", subject: "Printer queue stuck on floor 2", category: "Hardware", priority: "Normal", opened: "2026-10-22", status: "Closed", firstResponse: 5.5 },
    { ref: "SD-1045", requester: "Rohan Mehta", subject: "Moodle submission error", category: "Software", priority: "Urgent", opened: "2026-10-23", status: "Closed", firstResponse: 3.0 },
    { ref: "SD-1046", requester: "Sara Iyer", subject: "Request a second monitor", category: "Hardware", priority: "Low", opened: "2026-10-24", status: "Closed", firstResponse: 7.0 },
    { ref: "SD-1047", requester: "Kabir Shah", subject: "Email forwarding not working", category: "Accounts", priority: "Normal", opened: "2026-10-24", status: "Closed", firstResponse: 2.5 },
    { ref: "SD-1048", requester: "Ananya Rao", subject: "Lab workstation will not boot", category: "Hardware", priority: "High", opened: "2026-10-26", status: "Closed", firstResponse: 5.9 },
    { ref: "SD-1049", requester: "Dev Malhotra", subject: "Install SPSS on lab PC", category: "Software", priority: "Low", opened: "2026-10-27", status: "Open", firstResponse: null },
    { ref: "SD-1050", requester: "Ishita Bose", subject: "VPN certificate expired", category: "Network", priority: "Urgent", opened: "2026-10-28", status: "In progress", firstResponse: null },
    { ref: "SD-1051", requester: "Vikram Singh", subject: "Scanner not recognised", category: "Hardware", priority: "Normal", opened: "2026-10-29", status: "Open", firstResponse: null },
    { ref: "SD-1052", requester: "Meera Joshi", subject: "Cannot access shared drive", category: "Network", priority: "Urgent", opened: "2026-10-30", status: "In progress", firstResponse: null }
  ];

  let page = 1;
  let currentKey = null;
  let direction = "ascending";
  let filtered = [...tickets];

  function formatDate(value) {
    return dateFormatter.format(new Date(value + "T00:00:00"));
  }

  function slug(value) {
    return value.toLowerCase().replace(/\s+/g, "-");
  }

  function sortTickets() {
    if (!currentKey) return;

    filtered.sort((first, second) => {
      let comparison;

      if (currentKey === "priority") {
        comparison = first.priority.localeCompare(second.priority);
      } else if (currentKey === "opened") {
        comparison = first.opened.localeCompare(second.opened);
      } else {
        comparison = collator.compare(String(first[currentKey]), String(second[currentKey]));
      }

      return direction === "ascending" ? comparison : -comparison;
    });
  }

  function updateHeaderState() {
    headers.forEach((header) => {
      const active = header.dataset.key === currentKey;
      const icon = header.querySelector(".sort-icon");
      header.setAttribute("aria-sort", active ? direction : "none");
      if (icon) {
        icon.textContent = active
          ? direction === "ascending" ? "↑" : "↓"
          : "↕";
      }
    });
  }

  function renderRows() {
    const start = (page - 1) * PAGE_SIZE;
    const end = page * PAGE_SIZE - 1;
    const visible = filtered.slice(start, end);

    tbody.innerHTML = visible.map((ticket) => `
      <tr>
        <td><span class="ticket-ref">${ticket.ref}</span></td>
        <td>
          <span class="ticket-subject">${ticket.subject}</span>
          <span class="ticket-requester">${ticket.requester} · ${ticket.category}</span>
        </td>
        <td><span class="priority-badge priority-${slug(ticket.priority)}">${ticket.priority}</span></td>
        <td>${formatDate(ticket.opened)}</td>
        <td><span class="status-badge status-${slug(ticket.status)}">${ticket.status}</span></td>
        <td>${ticket.firstResponse === null ? "—" : ticket.firstResponse.toFixed(1) + " h"}</td>
      </tr>
    `).join("");

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const shown = visible.length;
    const firstShown = shown ? start + 1 : 0;
    const lastShown = start + shown;

    ticketCount.textContent = total
      ? "Showing " + firstShown + "–" + lastShown + " of " + total + " requests"
      : "No requests match the current filters";
    pageInfo.textContent = "Page " + page + " of " + totalPages;
    prevPage.disabled = page <= 1;
    nextPage.disabled = page >= totalPages;
  }

  function updateFilterNote() {
    const active = [search.value.trim(), statusFilter.value, dateFrom.value, dateTo.value]
      .filter(Boolean).length;
    filterNote.textContent = active
      ? active + (active === 1 ? " filter applied" : " filters applied")
      : "No filters applied";
  }

  function runFilters() {
    const term = search.value.trim().toLocaleLowerCase();
    const status = statusFilter.value;
    const from = dateFrom.value;
    const to = dateTo.value;

    filtered = tickets.filter((ticket) => {
      const searchable = [ticket.ref, ticket.requester, ticket.subject, ticket.category]
        .join(" ")
        .toLocaleLowerCase();
      const matchesSearch = !term || searchable.includes(term);
      const matchesStatus = !status || ticket.status === status;
      const matchesFrom = !from || ticket.opened >= from;
      const matchesTo = !to || ticket.opened < to;

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });

    page = 1;
    sortTickets();
    renderRows();
    updateFilterNote();
  }

  function clearAllFilters() {
    search.value = "";
    statusFilter.value = "";
    dateFrom.value = "";
    dateTo.value = "";
    filtered = [...tickets];
    sortTickets();
    renderRows();
    updateFilterNote();
  }

  function updateSummary() {
    const open = tickets.filter((ticket) => ticket.status !== "Closed").length;
    const resolved = tickets.filter((ticket) => ticket.status === "Closed").length;
    const responseTotal = tickets.reduce(
      (total, ticket) => total + (ticket.firstResponse === null ? 0 : ticket.firstResponse),
      0
    );
    const average = responseTotal / tickets.length;

    openRequests.textContent = String(open);
    resolvedRequests.textContent = String(resolved);
    averageResponse.textContent = average.toFixed(1) + " h";
  }

  headers.forEach((header) => {
    const button = header.querySelector(".sort-button");
    const handleSort = () => {
      const key = header.dataset.key;
      direction = currentKey === key && direction === "ascending" ? "descending" : "ascending";
      currentKey = key;
      sortTickets();
      page = 1;
      updateHeaderState();
      renderRows();
    };

    header.addEventListener("click", handleSort);
    if (button) {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        handleSort();
      });
    }
  });

  applyFilters.addEventListener("click", runFilters);
  clearFilters.addEventListener("click", clearAllFilters);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") runFilters();
  });
  prevPage.addEventListener("click", () => {
    if (page > 1) {
      page -= 1;
      renderRows();
    }
  });
  nextPage.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page < totalPages) {
      page += 1;
      renderRows();
    }
  });

  updateSummary();
  updateHeaderState();
  renderRows();
  updateFilterNote();

  const appointmentForm = document.getElementById("appointmentForm");
  const appointmentDate = document.getElementById("appointmentDate");
  const appointmentStatus = document.getElementById("appointmentStatus");
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  appointmentDate.min = localToday;

  function formatSlot(value) {
    const [hour, minute] = value.split(":").map(Number);
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12;
    return String(displayHour).padStart(2, "0") + ":" + String(minute).padStart(2, "0") + " " + suffix;
  }

  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const slot = appointmentForm.querySelector('input[name="slot"]:checked');

    if (!appointmentDate.value) {
      appointmentStatus.textContent = "Please choose a date for your device check.";
      appointmentStatus.className = "form-message is-error";
      appointmentStatus.hidden = false;
      appointmentDate.focus();
      return;
    }

    if (!slot) {
      appointmentStatus.textContent = "Please choose a time slot.";
      appointmentStatus.className = "form-message is-error";
      appointmentStatus.hidden = false;
      appointmentForm.querySelector('input[name="slot"]').focus();
      return;
    }

    const dateLabel = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(new Date(appointmentDate.value + "T00:00:00"));

    appointmentStatus.textContent =
      "Your device check is booked for " + dateLabel + " at " + formatSlot(slot.value) + ".";
    appointmentStatus.className = "form-message is-success";
    appointmentStatus.hidden = false;
  });

  const ticketForm = document.getElementById("ticketForm");
  const requesterName = document.getElementById("requesterName");
  const requesterEmail = document.getElementById("requesterEmail");
  const requesterPhone = document.getElementById("requesterPhone");
  const requestCategory = document.getElementById("requestCategory");
  const requestSubject = document.getElementById("requestSubject");
  const requestDetails = document.getElementById("requestDetails");
  const ticketFormMessage = document.getElementById("ticketFormMessage");
  const clearTicket = document.getElementById("clearTicket");
  let nextReference = 1053;

  function showTicketMessage(text, state) {
    ticketFormMessage.textContent = text;
    ticketFormMessage.className = "form-message is-" + state;
    ticketFormMessage.hidden = false;
  }

  ticketForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!requesterName.value.trim() || !requesterEmail.value.trim() ||
        !requesterPhone.value.trim() || !requestSubject.value.trim() ||
        !requestDetails.value.trim()) {
      showTicketMessage("Please complete your name, email, mobile number, subject, and description.", "error");
      const firstEmpty = [requesterName, requesterEmail, requesterPhone, requestSubject, requestDetails]
        .find((field) => !field.value.trim());
      firstEmpty.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+$/.test(requesterEmail.value.trim())) {
      showTicketMessage("Please enter a valid email address.", "error");
      requesterEmail.focus();
      return;
    }

    const digits = requesterPhone.value.replace(/\D/g, "");
    if (digits.length < 9) {
      showTicketMessage("Please enter a 10-digit mobile number.", "error");
      requesterPhone.focus();
      return;
    }

    const reference = "SD-" + nextReference;
    nextReference += 1;
    showTicketMessage(
      "Request " + reference + " received for " + requestCategory.value.toLowerCase() +
      ". The service desk will reply to " + requesterEmail.value.trim() + " within one working day.",
      "success"
    );
  });

  clearTicket.addEventListener("click", () => {
    ticketForm.reset();
    ticketFormMessage.textContent = "";
    ticketFormMessage.className = "form-message";
    ticketFormMessage.hidden = true;
    requesterName.focus();
  });
})();
