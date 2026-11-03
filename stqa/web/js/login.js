(() => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");
  const message = document.getElementById("loginMessage");
  const welcomePanel = document.getElementById("welcomePanel");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const logoutButton = document.getElementById("logoutButton");

  const TEST_USERNAME = "student";
  const TEST_PASSWORD = "student123";

  function showMessage(text, state) {
    message.textContent = text;
    message.className = "form-message is-" + state;
    message.hidden = false;
  }

  function clearMessage() {
    message.textContent = "";
    message.hidden = true;
    message.className = "form-message";
  }

  function setInvalid(field, invalid) {
    if (invalid) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function signOut() {
    form.hidden = false;
    form.reset();
    welcomePanel.hidden = true;
    setInvalid(username, false);
    setInvalid(password, false);
    showMessage("You have logged out. You can sign in again.", "info");
    username.focus();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const enteredUsername = username.value.trim();
    const enteredPassword = password.value;
    const missingUsername = enteredUsername.length === 0;
    const missingPassword = enteredPassword.length === 0;

    setInvalid(username, missingUsername);
    setInvalid(password, missingPassword);

    if (missingUsername || missingPassword) {
      welcomePanel.hidden = true;
      showMessage("Please enter both username and password.", "error");
      (missingUsername ? username : password).focus();
      return;
    }

    const credentialsMatch =
      enteredUsername.toLowerCase() === TEST_USERNAME &&
      enteredPassword === TEST_PASSWORD;

    if (!credentialsMatch) {
      welcomePanel.hidden = true;
      showMessage("Login failed. Check your username and password and try again.", "error");
      password.focus();
      password.select();
      return;
    }

    setInvalid(username, false);
    setInvalid(password, false);
    form.hidden = true;
    welcomeMessage.textContent = "Welcome, Student User!";
    welcomePanel.hidden = false;
    showMessage("Login successful. You are now signed in.", "success");
    logoutButton.focus();
  });

  username.addEventListener("input", () => {
    setInvalid(username, false);
    if (!message.hidden && message.classList.contains("is-error")) clearMessage();
  });

  password.addEventListener("input", () => {
    setInvalid(password, false);
    if (!message.hidden && message.classList.contains("is-error")) clearMessage();
  });

  logoutButton.addEventListener("click", signOut);
})();
