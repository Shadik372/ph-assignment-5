const issuesGrid = document.getElementById("issues-grid");
const issuesCounter = document.getElementById("issues-counter");
const btnAll = document.getElementById("filter-all");
const btnOpen = document.getElementById("filter-open");
const btnClosed = document.getElementById("filter-closed");
const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];

async function fetchIssues() {
  issuesGrid.innerHTML = `<p class="col-span-full text-center text-gray-500"></p>`;

  const response = await fetch(API_URL);
  const jsonResponse = await response.json();

  allIssues = jsonResponse.data;

  setActiveButton(btnAll);
  
  renderIssues(allIssues);
}

function renderIssues(issues) {
  issuesGrid.innerHTML = "";

  if (issuesCounter) {
    issuesCounter.textContent = issues.length;
  }

  issues.forEach((issue) => {
    const title = issue.title;
    const desc = issue.description;
    const status = issue.status;
    const priority = issue.priority;
    const id = issue.id;
    const author = issue.author;
    const date = issue.createdAt.slice(0, 10);

    const isClosed = status.toLowerCase() === "closed";
    const statusIcon = isClosed
      ? "assets/Closed- Status .png"
      : "assets/Open-Status.png";
    const borderColor = isClosed ? "border-purple-500" : "border-green-500";

    let priorityColor = "bg-gray-100 text-gray-600";
    if (priority.toLowerCase() === "high")
      priorityColor = "bg-red-100 text-red-600";
    if (priority.toLowerCase() === "medium")
      priorityColor = "bg-yellow-100 text-yellow-700";
    if (priority.toLowerCase() === "low")
      priorityColor = "bg-blue-100 text-blue-600";

    const cardHTML = `
      <div class="status-border w-full border-t-4 ${borderColor} rounded-sm transition-transform hover:-translate-y-1 hover:shadow-md">
        <div class="card bg-base-100 w-full h-full shadow-sm p-4 flex flex-col">
          
          <div class="flex justify-between items-start">
            <div class="status-icon">
              <img src="${statusIcon}" alt="${status}" class="w-5 h-5" />
            </div>
            <div class="priority">
              <span class="text-xs font-bold px-2 py-1 rounded-md ${priorityColor}">${priority.toUpperCase()}</span>
            </div>
          </div>

          <div class="mt-3 flex-grow">
            <p class="issue-title text-lg font-semibold leading-tight">${title}</p>
            <p class="issue-desc text-sm text-[#64748B] mt-2 line-clamp-2">${desc}</p>
          </div>

          <div class="mt-4 text-sm pt-3 border-t border-gray-100">
            <p class="text-gray-500 font-medium">
              #<span class="text-gray-900">${id}</span> by <span class="text-gray-900">${author}</span>
            </p>
            <p class="text-xs text-[#64748B] mt-1">${date}</p>
          </div>
          
        </div>
      </div>
    `;

    issuesGrid.insertAdjacentHTML("beforeend", cardHTML);
  });
  
}

function setActiveButton(activeBtn) {
  [btnAll, btnOpen, btnClosed].forEach(btn => {
    btn.classList.add("btn-outline");
    btn.classList.remove("btn-primary");
  });
  
  activeBtn.classList.remove("btn-outline");
  activeBtn.classList.add("btn-primary");
}
btnAll.addEventListener("click", () => {
  setActiveButton(btnAll);
  renderIssues(allIssues);
});

btnOpen.addEventListener("click", () => {
  setActiveButton(btnOpen);
  const openIssues = allIssues.filter(
    (issue) => issue.status.toLowerCase() === "open"
  );
  renderIssues(openIssues);
});

btnClosed.addEventListener("click", () => {
  setActiveButton(btnClosed);
  const closedIssues = allIssues.filter(
    (issue) => issue.status.toLowerCase() === "closed"
  );
  renderIssues(closedIssues);
});

fetchIssues();