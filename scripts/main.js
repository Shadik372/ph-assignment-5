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

  const labelConfig = {
    "help wanted": { badgeClass: "badge-warning", icon: "fa-life-ring" },
    bug: { badgeClass: "badge-error", icon: "fa-bug" },
    enhancement: { badgeClass: "badge-success", icon: "fa-star" },
    "good first issue": {
      badgeClass: "badge-secondary",
      icon: "fa-triangle-exclamation",
    },
    documentation: { badgeClass: "badge-neutral", icon: "fa-tag" },
  };

  issues.forEach((issue) => {
    const title = issue.title;
    const desc = issue.description;
    const status = issue.status;
    const priority = issue.priority;
    const id = issue.id;
    const author = issue.author;
    const date = issue.createdAt.slice(0, 10);
    const labels = issue.labels;

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

    let labelsHTML = "";
    if (labels.length > 0) {
      const badges = labels
        .map((labelName) => {
          const lowerLabel = labelName.toLowerCase();
          const config = labelConfig[lowerLabel];

          return `
          <div class="badge badge-soft ${config.badgeClass} rounded-sm px-2 py-3">
            <p class="text-xs font-semibold flex items-center gap-1">
              <i class="fa-solid ${config.icon}"></i>
              <span class="uppercase">${labelName}</span>
            </p>
          </div>
        `;
        })
        .join("");

      labelsHTML = `
        <div class="flex flex-wrap gap-2 mt-3 pb-2 border-b border-gray-100">
          ${badges}
        </div>
      `;
    }

    const cardHTML = `
      <div onclick="openIssueModal('${id}')" class="status-border w-full border-t-4 ${borderColor} rounded-sm transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
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
            ${labelsHTML}
          </div>

          <div class="mt-4 text-sm pt-3">
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
  [btnAll, btnOpen, btnClosed].forEach((btn) => {
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
    (issue) => issue.status.toLowerCase() === "open",
  );
  renderIssues(openIssues);
});

btnClosed.addEventListener("click", () => {
  setActiveButton(btnClosed);
  const closedIssues = allIssues.filter(
    (issue) => issue.status.toLowerCase() === "closed",
  );
  renderIssues(closedIssues);
});

async function openIssueModal(id) {
  const modal = document.getElementById("issue_modal");
  const loader = document.getElementById("modal-loader");
  const content = document.getElementById("modal-content");

  modal.showModal();
  loader.classList.remove("hidden");
  content.classList.add("hidden");

  const response = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const jsonResponse = await response.json();
  const issue = jsonResponse.data;

  document.getElementById("modal-title").textContent = issue.title;
  document.getElementById("modal-author").textContent = issue.author;
  document.getElementById("modal-assignee").textContent =
    issue.assignee || "No one is assigned";
  document.getElementById("modal-date").textContent = issue.createdAt.slice(
    0,
    10,
  );
  document.getElementById("modal-desc").textContent = issue.description;

  const isClosed = issue.status.toLowerCase() === "closed";
  const statusBadge = document.getElementById("modal-status-badge");
  statusBadge.textContent = isClosed ? "Closed" : "Opened";
  statusBadge.className = `badge text-white font-medium border-0 px-3 py-3 rounded-full ${isClosed ? "bg-purple-600" : "bg-emerald-500"}`;

  const priorityBadge = document.getElementById("modal-priority");
  priorityBadge.textContent = issue.priority.toUpperCase();
  let priorityColor = "bg-gray-400";
  if (issue.priority.toLowerCase() === "high") priorityColor = "bg-red-500";
  if (issue.priority.toLowerCase() === "medium")
    priorityColor = "bg-yellow-500";
  if (issue.priority.toLowerCase() === "low") priorityColor = "bg-blue-500";
  priorityBadge.className = `badge text-white font-semibold text-xs border-0 px-3 py-3 rounded-full shadow-sm ${priorityColor}`;

  const labelConfig = {
    "help wanted": {
      classes: "bg-orange-50 text-orange-600 border border-orange-200",
      icon: "fa-life-ring",
    },
    bug: {
      classes: "bg-red-50 text-red-500 border border-red-200",
      icon: "fa-bug",
    },
    enhancement: {
      classes: "bg-green-50 text-green-600 border border-green-200",
      icon: "fa-star",
    },
    "good first issue": {
      classes: "bg-purple-50 text-purple-600 border border-purple-200",
      icon: "fa-triangle-exclamation",
    },
    documentation: {
      classes: "bg-gray-50 text-gray-600 border border-gray-200",
      icon: "fa-tag",
    },
  };

  const labelsContainer = document.getElementById("modal-labels");
  labelsContainer.innerHTML = "";

  if (issue.labels && issue.labels.length > 0) {
    issue.labels.forEach((label) => {
      const config = labelConfig[label.toLowerCase()] || {
        classes: "bg-gray-100 text-gray-700 border border-gray-200",
        icon: "fa-tag",
      };
      labelsContainer.innerHTML += `
                    <span class="badge ${config.classes} rounded-full px-3 py-3 gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        <i class="fa-solid ${config.icon}"></i> ${label}
                    </span>
                `;
    });
  }

  loader.classList.add("hidden");
  content.classList.remove("hidden");
}

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

async function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    fetchIssues();
    return;
  }

  issuesGrid.innerHTML = `<p class="col-span-full text-center text-gray-500"><span class="loading loading-spinner loading-md text-primary"></span> Searching...</p>`;

  const response = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`,
  );
  const jsonResponse = await response.json();

  allIssues = jsonResponse.data;
  setActiveButton(btnAll);

  if (allIssues.length === 0) {
    issuesGrid.innerHTML = `<p class="col-span-full text-center text-gray-500 mt-10">No issues found matching "${query}".</p>`;
    document.getElementById("issues-counter").textContent = "0";
  } else {
    renderIssues(allIssues);
  }
}

searchBtn.addEventListener("click", handleSearch);

fetchIssues();
