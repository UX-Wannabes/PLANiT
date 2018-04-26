document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("login-btn")) {
    document.getElementById("login-btn").onclick = () => {
      document
        .getElementById("login")
        .classList.replace("login-wrap", "login-unwrap");
    };
  }
});
