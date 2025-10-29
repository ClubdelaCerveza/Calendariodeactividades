document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("usuario");
  if (!userName) window.location.href = "index.html";
  document.getElementById("userName").textContent = userName;

  const activityForm = document.getElementById("activityForm");
  const activityList = document.getElementById("activityList");
  const calendar = document.getElementById("calendar");
  const logoutBtn = document.getElementById("logout");

  let activities = JSON.parse(localStorage.getItem("activities")) || [];

  function renderActivities() {
    activityList.innerHTML = "";
    activities.forEach((act, i) => {
      const li = document.createElement("li");
      li.textContent = `${act.name} - ${act.date}`;
      const del = document.createElement("button");
      del.textContent = "❌";
      del.onclick = () => {
        activities.splice(i, 1);
        saveActivities();
      };
      li.appendChild(del);
      activityList.appendChild(li);
    });
  }

  function renderCalendar() {
    calendar.innerHTML = "";
    const months = [9, 10, 11]; // Octubre-Diciembre
    months.forEach(month => {
      const monthName = new Date(2025, month).toLocaleString("es", { month: "long" });
      const title = document.createElement("h4");
      title.textContent = monthName.toUpperCase();
      title.style.gridColumn = "span 7";
      calendar.appendChild(title);

      const daysInMonth = new Date(2025, month + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = d;
        const dateStr = `2025-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        activities
          .filter(a => a.date === dateStr)
          .forEach(a => {
            const tag = document.createElement("span");
            tag.classList.add("activity");
            tag.textContent = a.name;
            dayDiv.appendChild(tag);
          });
        calendar.appendChild(dayDiv);
      }
    });
  }

  function saveActivities() {
    localStorage.setItem("activities", JSON.stringify(activities));
    renderActivities();
    renderCalendar();
  }

  activityForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("activityName").value;
    const date = document.getElementById("activityDate").value;
    activities.push({ name, date });
    saveActivities();
    activityForm.reset();
  });

  logoutBtn.onclick = () => {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
  };

  renderActivities();
  renderCalendar();
});
