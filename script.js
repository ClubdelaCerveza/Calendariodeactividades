// === VARIABLES ===
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let pendientes = JSON.parse(localStorage.getItem("pendientes")) || [];
let usuarioActivo = null;

// === ELEMENTOS ===
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const dashboard = document.getElementById("dashboard");
const adminPanel = document.getElementById("admin-panel");

const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const adminLogout = document.getElementById("admin-logout");
const addActividad = document.getElementById("add-actividad");

const lista = document.getElementById("lista-actividades");
const calendarDiv = document.getElementById("trimestre-calendar");
const pendingList = document.getElementById("pending-users");

// === CREAR ADMIN POR DEFECTO ===

// === CAMBIO ENTRE LOGIN Y REGISTRO ===
showRegister.addEventListener("click", () => {
  loginContainer.classList.add("hidden");
  registerContainer.classList.remove("hidden");
});

showLogin.addEventListener("click", () => {
  registerContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

// === REGISTRO ===
registerBtn.addEventListener("click", () => {
  const username = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value.trim();

  if (!username || !password) return alert("Completa todos los campos.");

  if (
    usuarios.some(u => u.username === username) ||
    pendientes.some(u => u.username === username)
  )
    return alert("Ese usuario ya existe o está pendiente.");

  });

// === LOGIN ===
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = usuarios.find(u => u.username === username && u.password === password);
  if (!user) return alert("Usuario o contraseña incorrectos.");
  usuarioActivo = user;

  if (user.rol === "admin") {
    mostrarAdmin();
  } else {
    mostrarDashboard();
  }
});

// === ADMIN PANEL ===
function mostrarAdmin() {
  loginContainer.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  renderPendientes();
}

function renderPendientes() {
  pendingList.innerHTML = "";
  pendientes.forEach((u, i) => {
    const li = document.createElement("li");
    li.textContent = u.username;

    const aceptar = document.createElement("button");
    aceptar.textContent = "Aceptar";
    aceptar.onclick = () => {
      usuarios.push(u);
      pendientes.splice(i, 1);
      guardarDatos();
      renderPendientes();
    };

    const rechazar = document.createElement("button");
    rechazar.textContent = "Rechazar";
    rechazar.onclick = () => {
      pendientes.splice(i, 1);
      guardarDatos();
      renderPendientes();
    };

    li.appendChild(aceptar);
    li.appendChild(rechazar);
    pendingList.appendChild(li);
  });
}

adminLogout.addEventListener("click", () => {
  adminPanel.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  usuarioActivo = null;
});

// === DASHBOARD ===
function mostrarDashboard() {
  loginContainer.classList.add("hidden");
  dashboard.classList.remove("hidden");
  document.getElementById("user-display").textContent = usuarioActivo.username;
  renderActividades();
  renderCalendario();
}

logoutBtn.addEventListener("click", () => {
  dashboard.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  usuarioActivo = null;
});

// === ACTIVIDADES ===
addActividad.addEventListener("click", () => {
  const act = document.getElementById("actividad").value.trim();
  const fecha = document.getElementById("fecha").value;
  if (!act || !fecha) return alert("Completa todos los campos.");

  usuarioActivo.actividades.push({ actividad: act, fecha });
  guardarDatos();
  renderActividades();
  renderCalendario();
});

function renderActividades() {
  lista.innerHTML = "";
  usuarioActivo.actividades.forEach((a, i) => {
    const li = document.createElement("li");
    li.textContent = `${a.fecha}: ${a.actividad}`;
    li.onclick = () => {
      if (confirm("¿Eliminar esta actividad?")) {
        usuarioActivo.actividades.splice(i, 1);
        guardarDatos();
        renderActividades();
        renderCalendario();
      }
    };
    lista.appendChild(li);
  });
}

// === CALENDARIO (Octubre, Noviembre, Diciembre) ===
function renderCalendario() {
  calendarDiv.innerHTML = "";
  const meses = ["Octubre", "Noviembre", "Diciembre"];
  const baseMes = 9; // Octubre = 9 (porque enero=0)
  const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];

  const year = new Date().getFullYear();

  for (let i = 0; i < 3; i++) {
    const monthDiv = document.createElement("div");
    monthDiv.classList.add("month");
    const title = document.createElement("h3");
    title.textContent = `${meses[i]} ${year}`;
    monthDiv.appendChild(title);

    const daysDiv = document.createElement("div");
    daysDiv.classList.add("days");

    diasSemana.forEach(d => {
      const dn = document.createElement("div");
      dn.textContent = d;
      dn.classList.add("day-name");
      daysDiv.appendChild(dn);
    });

    const primerDia = new Date(year, baseMes + i, 1).getDay();
    const diasMes = new Date(year, baseMes + i + 1, 0).getDate();
    const offset = primerDia === 0 ? 6 : primerDia - 1;

    for (let j = 0; j < offset; j++) {
      const empty = document.createElement("div");
      empty.classList.add("day");
      daysDiv.appendChild(empty);
    }

    for (let d = 1; d <= diasMes; d++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      dayDiv.textContent = d;

      const fecha = `${year}-${String(baseMes + i + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      if (usuarioActivo.actividades.some(a => a.fecha === fecha)) {
        dayDiv.classList.add("has-event");
      }
      daysDiv.appendChild(dayDiv);
    }

    monthDiv.appendChild(daysDiv);
    calendarDiv.appendChild(monthDiv);
  }
}

function guardarDatos() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("pendientes", JSON.stringify(pendientes));
}
