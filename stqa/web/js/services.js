(() => {
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  const fullName = document.getElementById("fullName");
  const emailAddress = document.getElementById("emailAddress");
  const message = document.getElementById("message");
  const formMessage = document.getElementById("formMessage");

  function showMessage(text, state) {
    formMessage.textContent = text;
    formMessage.className = "form-message is-" + state;
    formMessage.hidden = false;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!fullName.value.trim() || !emailAddress.value.trim() || !message.value.trim()) {
      showMessage("Please complete your name, email address, and message.", "error");
      const firstEmpty = [fullName, emailAddress, message].find((field) => !field.value.trim());
      firstEmpty.focus();
      return;
    }

    if (!emailAddress.checkValidity()) {
      showMessage("Please enter a valid email address.", "error");
      emailAddress.focus();
      return;
    }

    showMessage(
      "Thank you, " + fullName.value.trim() + ". Your enquiry has been sent to the examination cell.",
      "success"
    );
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      formMessage.textContent = "";
      formMessage.className = "form-message";
      formMessage.hidden = true;
    }, 0);
  });
})();
