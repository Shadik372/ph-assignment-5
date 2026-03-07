const usernameField = document.getElementById("username-field");
const passwordField = document.getElementById("password-field");
const loginBtn = document.getElementById("login-btn");

const incorrectCredentials = (uname, pass) => {
  const unameSpan = document.getElementById("incorrect-name");
  const passSpan = document.getElementById("incorrect-pass");

  unameSpan.innerText = "";
  passSpan.innerText = "";

  if (uname !== "admin") {
    unameSpan.innerText = "Incorrect Username!";
  }

  if (pass !== "admin123") {
    passSpan.innerText = "Incorrect Password!";
  }
};
const handleLogin = (event) => {
  const uname = usernameField.value;
  const pass = passwordField.value;

  if (uname === "admin" && pass === "admin123") {
    window.location.replace("main.html");
  } else {
    incorrectCredentials(uname, pass);
  }

//   clears input on typing
};
usernameField.addEventListener("input", () => {
  document.getElementById("incorrect-name").innerText = "";
});

passwordField.addEventListener("input", () => {
  document.getElementById("incorrect-pass").innerText = "";
});
loginBtn.addEventListener("click", handleLogin);
