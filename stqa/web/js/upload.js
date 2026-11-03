(() => {
  const form = document.getElementById("uploadForm");
  if (!form) return;

  const input = document.getElementById("fileUpload");
  const fileName = document.getElementById("fileName");
  const fileDetails = document.getElementById("fileDetails");
  const status = document.getElementById("uploadStatus");
  const clearUpload = document.getElementById("clearUpload");
  const downloadLink = document.getElementById("downloadFile");

  const EXAM_GUIDELINES = [
    "Aldercrest University",
    "Examination Cell",
    "",
    "Semester 5 Examination Guidelines",
    "=================================",
    "",
    "Academic year : 2026-27",
    "Issued on     : 30 October 2026",
    "Applies to    : B.Sc. IT, Semester 5",
    "",
    "1. Carry your identity card to every examination hall.",
    "2. Report to the hall 15 minutes before the scheduled start.",
    "3. Mobile phones and smart watches are not permitted.",
    "4. Use only blue or black ink unless a paper states otherwise.",
    "5. Requests for revaluation must be submitted within 10 days.",
    "",
    "For questions, contact the examination cell:",
    "Room 204, Academic Block",
    "examinations@aldercrest.edu",
    "+91 22 5550 0142",
    ""
  ].join("\n");

  function formatBytes(bytes) {
    if (bytes === 0) return "0 bytes";
    if (bytes < 1024) return bytes + (bytes === 1 ? " byte" : " bytes");

    const units = ["KB", "MB", "GB"];
    let value = bytes / 1024;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    const precision = value >= 10 ? 0 : 1;
    return value.toFixed(precision) + " " + units[unitIndex];
  }

  function showFile(file) {
    if (!file) {
      fileName.textContent = "No file selected";
      fileDetails.textContent = "Choose a file to see its name, size, and type.";
      return;
    }

    fileName.textContent = file.name;
    fileDetails.textContent =
      formatBytes(file.size) + " · " +
      (file.type || "Unknown type") + " · Ready to upload";
  }

  function setStatus(text, state) {
    status.textContent = text;
    status.className = "form-message is-" + state;
    status.hidden = false;
  }

  function hideStatus() {
    status.textContent = "";
    status.className = "form-message";
    status.hidden = true;
  }

  input.addEventListener("change", () => {
    showFile(input.files[0] || null);
    hideStatus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const file = input.files[0];

    if (!file) {
      setStatus("Please select a file.", "error");
      input.focus();
      return;
    }

    const extension = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
      : "";
    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];

    if (!allowedExtensions.includes(extension)) {
      setStatus("Unsupported file type. Use PDF, DOC, DOCX, or TXT.", "error");
      input.focus();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus("This file is larger than 5 MB. Choose a smaller file.", "error");
      input.focus();
      return;
    }

    setStatus("File uploaded successfully: " + file.name, "success");
  });

  clearUpload.addEventListener("click", () => {
    form.reset();
    showFile(null);
    hideStatus();
    input.focus();
  });

  downloadLink.addEventListener("click", (event) => {
    if (!window.Blob || !window.URL || !URL.createObjectURL) return;

    event.preventDefault();
    const blob = new Blob([EXAM_GUIDELINES], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "examination-guidelines.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
