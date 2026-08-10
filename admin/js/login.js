async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const error = document.getElementById("error");

  error.textContent = "";

  try {
    const response = await fetch("../api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    if (data.success && data.token) {
      sessionStorage.setItem("adminLogged", "true");
      sessionStorage.setItem("adminToken", data.token);

      location.href = "dashboard.html";
    } else {
      error.textContent =
        data.error || "Погрешно корисничко име или лозинка.";
    }

  } catch (err) {
    console.error(err);
    error.textContent = "Грешка при поврзување со серверот.";
  }
}

function logout() {
  sessionStorage.removeItem("adminLogged");
  sessionStorage.removeItem("adminToken");
  location.href = "login.html";
}

if (location.pathname.endsWith("dashboard.html")) {
  if (
    sessionStorage.getItem("adminLogged") !== "true" ||
    !sessionStorage.getItem("adminToken")
  ) {
    location.href = "login.html";
  }
}