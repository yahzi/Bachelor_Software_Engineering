const STATUS_TEXT = {
  waiting: "Pending",
  interview: "Interview Invited",
  accepted: "Shortlisted",
  rejected: "Rejected"
};

const state = {
  route: "home",
  currentUserId: null,
  selectedJobId: 101,
  keyword: "",
  users: [
    { id: "coder", name: "coder_demo", role: "coder", uid: 1 },
    { id: "company", name: "company_demo", role: "company", uid: 2, companyId: 1 }
  ],
  companies: [
    {
      id: 1,
      ownerId: "company",
      name: "Galaxy Link",
      stage: "Growth / Series B",
      tags: "Java, Cloud Platform, Enterprise Service",
      product: "Enterprise Recruiting Suite",
      city: "Wuhan",
      description: "A company focused on digitizing enterprise recruiting workflows, including job posting, resume screening, and candidate management."
    },
    {
      id: 2,
      ownerId: "seed-company-2",
      name: "LimeTech",
      stage: "Mature / Series C",
      tags: "Frontend, Data Visualization, SaaS",
      product: "BI Dashboard",
      city: "Hangzhou",
      description: "A lightweight analytics and visualization product company for small and medium-sized businesses, with strong focus on engineering efficiency and user experience."
    },
    {
      id: 3,
      ownerId: "seed-company-3",
      name: "CloudSail AI",
      stage: "Startup / Series A",
      tags: "QA, AI, Quality Platform",
      product: "Automated Testing Cloud",
      city: "Shenzhen",
      description: "A quality engineering platform for development teams, covering automated testing, defect tracking, and quality metrics."
    }
  ],
  jobs: [
    {
      id: 101,
      companyId: 1,
      title: "Java Backend Engineer",
      type: "Java",
      salary: "12k-18k",
      city: "Wuhan",
      experience: "3-5 years",
      education: "Bachelor's degree",
      online: true,
      temptation: "Core business with fast technical growth",
      description: "Join the backend development of the recruiting platform and maintain job, resume, and application modules."
    },
    {
      id: 102,
      companyId: 1,
      title: "Frontend Engineer",
      type: "Frontend",
      salary: "10k-16k",
      city: "Wuhan",
      experience: "1-3 years",
      education: "Bachelor's degree",
      online: true,
      temptation: "Product-driven team with a mature component system",
      description: "Build the web experience for job search, company profiles, and resume editing."
    },
    {
      id: 103,
      companyId: 2,
      title: "Data Visualization Engineer",
      type: "Frontend",
      salary: "15k-22k",
      city: "Hangzhou",
      experience: "3-5 years",
      education: "Bachelor's degree",
      online: true,
      temptation: "Data product with complex charting challenges",
      description: "Develop BI dashboard chart components, interactive analysis workflows, and frontend performance improvements."
    },
    {
      id: 104,
      companyId: 3,
      title: "QA Automation Engineer",
      type: "QA",
      salary: "11k-17k",
      city: "Shenzhen",
      experience: "1-3 years",
      education: "Bachelor's degree",
      online: true,
      temptation: "AI testing platform with deep automation practice",
      description: "Build automated testing capabilities for APIs, UI flows, and quality reporting."
    }
  ],
  resume: {
    title: "My Resume",
    name: "Alex Chen",
    target: "Java Backend Engineer",
    experience: "2 years of project experience",
    education: "Software Engineering / Bachelor's degree",
    attachment: "coder_resume.pdf",
    project: "Built an online recruiting system covering login, job search, resume submission, and employer management modules.",
    summary: "Familiar with Java Web, SSH framework, MySQL, and frontend basics, with experience in complete business workflow development."
  },
  deliveries: [
    {
      id: 1,
      jobId: 101,
      coderId: "coder",
      companyId: 1,
      resumeTitle: "My Resume",
      attachment: "coder_resume.pdf",
      status: "waiting"
    }
  ]
};

const dom = {
  navToggle: document.querySelector(".nav-toggle"),
  navMenu: document.querySelector("#app-nav"),
  accountBar: document.querySelector("#account-bar"),
  loginForm: document.querySelector("#login-form"),
  loginUser: document.querySelector("#login-user"),
  logoutButton: document.querySelector("#logout-button"),
  jobSearchForm: document.querySelector("#job-search-form"),
  jobKeyword: document.querySelector("#job-keyword"),
  categoryRow: document.querySelector("#category-row"),
  jobList: document.querySelector("#job-list"),
  jobDetail: document.querySelector("#job-detail"),
  companyList: document.querySelector("#company-list"),
  resumeForm: document.querySelector("#resume-form"),
  resumePreview: document.querySelector("#resume-preview"),
  companyForm: document.querySelector("#company-form"),
  positionForm: document.querySelector("#position-form"),
  companyPositionList: document.querySelector("#company-position-list"),
  deliveryList: document.querySelector("#delivery-list"),
  toast: document.querySelector("#toast")
};

function getCurrentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function getCurrentCompany() {
  const user = getCurrentUser();
  return user?.role === "company"
    ? state.companies.find((company) => company.id === user.companyId)
    : null;
}

function getCompanyById(companyId) {
  return state.companies.find((company) => company.id === companyId);
}

function getJobById(jobId) {
  return state.jobs.find((job) => job.id === jobId);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    dom.toast.classList.remove("show");
  }, 2200);
}

function setRoute(route) {
  const user = getCurrentUser();
  if (route === "resume" && user?.role !== "coder") {
    showToast("Please log in with the candidate demo account first.");
    route = "home";
  }
  if (route === "company-admin" && user?.role !== "company") {
    showToast("Please log in with the employer demo account first.");
    route = "home";
  }
  if (route === "deliveries" && !user) {
    showToast("Please log in with a demo account first.");
    route = "home";
  }

  state.route = route;
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === `view-${route}`);
  });
  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === route);
  });
  dom.navMenu.classList.remove("open");
  dom.navToggle?.setAttribute("aria-expanded", "false");
  render();
}

function renderAccount() {
  const user = getCurrentUser();
  const navLinks = document.querySelectorAll("[data-coder-only], [data-company-only]");

  navLinks.forEach((link) => {
    const coderOnly = link.hasAttribute("data-coder-only");
    const companyOnly = link.hasAttribute("data-company-only");
    link.hidden =
      (coderOnly && user?.role !== "coder") || (companyOnly && user?.role !== "company");
  });

  dom.accountBar.innerHTML = user
    ? `<span class="account-pill">${user.role === "coder" ? "Candidate" : "Employer"}</span><strong>${escapeHtml(user.name)}</strong>`
    : `<span class="account-pill">Guest</span><span>Browse jobs and companies</span>`;
}

function renderSummary() {
  document.querySelector("#summary-job-count").textContent = state.jobs.filter((job) => job.online).length;
  document.querySelector("#summary-company-count").textContent = state.companies.length;
  document.querySelector("#summary-delivery-count").textContent = state.deliveries.length;
}

function getFilteredJobs() {
  const keyword = state.keyword.trim().toLowerCase();
  return state.jobs.filter((job) => {
    if (!job.online) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    const company = getCompanyById(job.companyId);
    const text = `${job.title} ${job.type} ${job.city} ${company?.name ?? ""}`.toLowerCase();
    return text.includes(keyword);
  });
}

function renderCategories() {
  const categories = ["All", "Java", "Frontend", "QA", "Product"];
  dom.categoryRow.innerHTML = categories
    .map((category) => {
      const active = (!state.keyword && category === "All") || state.keyword === category;
      return `<button class="category-button${active ? " active" : ""}" type="button" data-keyword="${category === "All" ? "" : category}">${category}</button>`;
    })
    .join("");
}

function renderJobs() {
  const jobs = getFilteredJobs();

  if (!jobs.some((job) => job.id === state.selectedJobId)) {
    state.selectedJobId = jobs[0]?.id ?? null;
  }

  dom.jobList.innerHTML = jobs.length
    ? jobs
        .map((job) => {
          const company = getCompanyById(job.companyId);
          return `
            <article class="job-card${job.id === state.selectedJobId ? " active" : ""}">
              <div>
                <h3>${escapeHtml(job.title)}</h3>
                <p>${escapeHtml(company.name)} · ${escapeHtml(company.stage)}</p>
              </div>
              <div class="job-meta">
                <span class="badge primary">${escapeHtml(job.salary)}</span>
                <span class="badge">${escapeHtml(job.city)}</span>
                <span class="badge">${escapeHtml(job.experience)}</span>
                <span class="badge">${escapeHtml(job.type)}</span>
              </div>
              <button class="button secondary small" type="button" data-select-job="${job.id}">View Details</button>
            </article>
          `;
        })
        .join("")
    : `<div class="empty">No open jobs match this search.</div>`;

  renderJobDetail();
}

function renderJobDetail() {
  const job = getJobById(state.selectedJobId);
  if (!job) {
    dom.jobDetail.innerHTML = `<div class="empty">Select a job to view details.</div>`;
    return;
  }

  const company = getCompanyById(job.companyId);
  const hasDelivered = state.deliveries.some(
    (delivery) => delivery.jobId === job.id && delivery.coderId === state.currentUserId
  );
  const user = getCurrentUser();
  const actionButton =
    user?.role === "coder"
      ? `<button class="button primary full" type="button" data-deliver-job="${job.id}" ${hasDelivered ? "disabled" : ""}>${hasDelivered ? "Applied" : "Apply with Resume"}</button>`
      : `<button class="button secondary full" type="button" data-login-coder>Log in as candidate to apply</button>`;

  dom.jobDetail.innerHTML = `
    <h3>${escapeHtml(job.title)}</h3>
    <p>${escapeHtml(company.name)} · ${escapeHtml(company.city)} · ${escapeHtml(company.tags)}</p>
    <div class="job-meta">
      <span class="badge primary">${escapeHtml(job.salary)}</span>
      <span class="badge">${escapeHtml(job.experience)}</span>
      <span class="badge">${escapeHtml(job.education)}</span>
      <span class="badge warning">${escapeHtml(job.temptation)}</span>
    </div>
    <ul>
      <li>Job type: ${escapeHtml(job.type)}</li>
      <li>Description: ${escapeHtml(job.description)}</li>
      <li>Company product: ${escapeHtml(company.product)}</li>
    </ul>
    ${actionButton}
  `;
}

function renderCompanies() {
  dom.companyList.innerHTML = state.companies
    .map((company) => {
      const jobs = state.jobs.filter((job) => job.companyId === company.id && job.online);
      return `
        <article class="company-card">
          <h3>${escapeHtml(company.name)}</h3>
          <p>${escapeHtml(company.description)}</p>
          <ul>
            <li>Location: ${escapeHtml(company.city)}</li>
            <li>Stage: ${escapeHtml(company.stage)}</li>
            <li>Tags: ${escapeHtml(company.tags)}</li>
            <li>Product: ${escapeHtml(company.product)}</li>
          </ul>
          <span class="job-count">${jobs.length} open job${jobs.length === 1 ? "" : "s"}</span>
        </article>
      `;
    })
    .join("");
}

function fillResumeForm() {
  Object.entries(state.resume).forEach(([key, value]) => {
    if (dom.resumeForm.elements[key]) {
      dom.resumeForm.elements[key].value = value;
    }
  });
}

function renderResume() {
  fillResumeForm();
  dom.resumePreview.innerHTML = `
    <section>
      <p class="eyebrow">Online Resume</p>
      <h3>${escapeHtml(state.resume.name)}</h3>
      <p>${escapeHtml(state.resume.title)} · ${escapeHtml(state.resume.target)}</p>
    </section>
    <section>
      <h3>Basic Information</h3>
      <ul>
        <li>Experience: ${escapeHtml(state.resume.experience)}</li>
        <li>Education: ${escapeHtml(state.resume.education)}</li>
        <li>Attachment: ${escapeHtml(state.resume.attachment)}</li>
      </ul>
    </section>
    <section>
      <h3>Project Experience</h3>
      <p>${escapeHtml(state.resume.project)}</p>
    </section>
    <section>
      <h3>Self Summary</h3>
      <p>${escapeHtml(state.resume.summary)}</p>
    </section>
  `;
}

function fillCompanyForm() {
  const company = getCurrentCompany();
  if (!company) {
    return;
  }
  ["name", "stage", "tags", "product", "description"].forEach((key) => {
    dom.companyForm.elements[key].value = company[key];
  });
}

function renderCompanyAdmin() {
  const company = getCurrentCompany();
  if (!company) {
    return;
  }

  fillCompanyForm();
  dom.companyPositionList.innerHTML = state.jobs
    .filter((job) => job.companyId === company.id)
    .map((job) => `
      <article class="table-row">
        <div>
          <h4>${escapeHtml(job.title)}</h4>
          <p>${escapeHtml(job.salary)} · ${escapeHtml(job.city)} · ${escapeHtml(job.type)}</p>
        </div>
        <div class="row-actions">
          <span class="status${job.online ? "" : " offline"}">${job.online ? "Online" : "Offline"}</span>
          <button class="button secondary small" type="button" data-toggle-job="${job.id}">${job.online ? "Take Offline" : "Publish"}</button>
        </div>
      </article>
    `)
    .join("");
}

function renderDeliveries() {
  const user = getCurrentUser();
  if (!user) {
    dom.deliveryList.innerHTML = `<div class="empty">Log in to view application records.</div>`;
    return;
  }

  const deliveries =
    user.role === "coder"
      ? state.deliveries.filter((delivery) => delivery.coderId === user.id)
      : state.deliveries.filter((delivery) => delivery.companyId === user.companyId);

  dom.deliveryList.innerHTML = deliveries.length
    ? deliveries
        .map((delivery) => {
          const job = getJobById(delivery.jobId);
          const company = getCompanyById(delivery.companyId);
          const actions =
            user.role === "company"
              ? `
                <div class="status-actions">
                  <button class="button secondary small" type="button" data-status="${delivery.id}:interview">Invite Interview</button>
                  <button class="button secondary small" type="button" data-status="${delivery.id}:accepted">Shortlist</button>
                  <button class="button danger small" type="button" data-status="${delivery.id}:rejected">Reject</button>
                </div>
              `
              : "";
          return `
            <article class="table-row">
              <div>
                <h4>${escapeHtml(job.title)} · ${escapeHtml(company.name)}</h4>
                <p>Resume: ${escapeHtml(delivery.resumeTitle)} / Attachment: ${escapeHtml(delivery.attachment)}</p>
              </div>
              <div class="row-actions">
                <span class="status${delivery.status === "rejected" ? " rejected" : ""}">${STATUS_TEXT[delivery.status]}</span>
                ${actions}
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty">No application records yet.</div>`;
}

function render() {
  renderAccount();
  renderSummary();
  renderCategories();
  renderJobs();
  renderCompanies();
  if (state.route === "resume") {
    renderResume();
  }
  if (state.route === "company-admin") {
    renderCompanyAdmin();
  }
  if (state.route === "deliveries") {
    renderDeliveries();
  }
}

function updateResumeFromForm() {
  const formData = new FormData(dom.resumeForm);
  state.resume = Object.fromEntries(formData.entries());
  renderResume();
  showToast("Resume saved to page memory.");
}

function updateCompanyFromForm() {
  const company = getCurrentCompany();
  const formData = new FormData(dom.companyForm);
  Object.assign(company, Object.fromEntries(formData.entries()));
  render();
  showToast("Company profile saved to page memory.");
}

function addPositionFromForm() {
  const company = getCurrentCompany();
  const formData = Object.fromEntries(new FormData(dom.positionForm).entries());
  const nextId = Math.max(...state.jobs.map((job) => job.id)) + 1;

  state.jobs.unshift({
    id: nextId,
    companyId: company.id,
    title: formData.title,
    type: formData.type,
    salary: formData.salary,
    city: formData.city,
    experience: "No strict requirement",
    education: "Bachelor's degree or above",
    online: true,
    temptation: "Newly posted role",
    description: formData.description
  });

  dom.positionForm.reset();
  state.selectedJobId = nextId;
  render();
  showToast("Job posted to page memory.");
}

function deliverResume(jobId) {
  const user = getCurrentUser();
  if (user?.role !== "coder") {
    showToast("Please log in with the candidate demo account first.");
    return;
  }

  const job = getJobById(jobId);
  const exists = state.deliveries.some(
    (delivery) => delivery.jobId === jobId && delivery.coderId === user.id
  );
  if (exists) {
    showToast("You have already applied to this job.");
    return;
  }

  const nextId = Math.max(0, ...state.deliveries.map((delivery) => delivery.id)) + 1;
  state.deliveries.unshift({
    id: nextId,
    jobId,
    coderId: user.id,
    companyId: job.companyId,
    resumeTitle: state.resume.title,
    attachment: state.resume.attachment,
    status: "waiting"
  });
  render();
  showToast("Application submitted.");
}

function bindEvents() {
  dom.navToggle?.addEventListener("click", () => {
    const open = dom.navMenu.classList.toggle("open");
    dom.navToggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (event) => {
    const routeLink = event.target.closest("[data-route]");
    if (routeLink) {
      event.preventDefault();
      setRoute(routeLink.dataset.route);
      return;
    }

    const categoryButton = event.target.closest("[data-keyword]");
    if (categoryButton) {
      state.keyword = categoryButton.dataset.keyword;
      dom.jobKeyword.value = state.keyword;
      render();
      return;
    }

    const selectJobButton = event.target.closest("[data-select-job]");
    if (selectJobButton) {
      state.selectedJobId = Number(selectJobButton.dataset.selectJob);
      renderJobs();
      return;
    }

    const deliverButton = event.target.closest("[data-deliver-job]");
    if (deliverButton) {
      deliverResume(Number(deliverButton.dataset.deliverJob));
      return;
    }

    if (event.target.closest("[data-login-coder]")) {
      state.currentUserId = "coder";
      setRoute("jobs");
      showToast("Switched to the candidate demo account.");
      return;
    }

    const toggleJobButton = event.target.closest("[data-toggle-job]");
    if (toggleJobButton) {
      const job = getJobById(Number(toggleJobButton.dataset.toggleJob));
      job.online = !job.online;
      render();
      showToast(job.online ? "Job published." : "Job taken offline.");
      return;
    }

    const statusButton = event.target.closest("[data-status]");
    if (statusButton) {
      const [deliveryId, status] = statusButton.dataset.status.split(":");
      const delivery = state.deliveries.find((item) => item.id === Number(deliveryId));
      delivery.status = status;
      renderDeliveries();
      showToast("Application status updated.");
    }
  });

  dom.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.currentUserId = dom.loginUser.value;
    const user = getCurrentUser();
    setRoute(user.role === "company" ? "company-admin" : "resume");
    showToast(`Logged in as ${user.name}.`);
  });

  dom.logoutButton.addEventListener("click", () => {
    state.currentUserId = null;
    setRoute("home");
    showToast("Logged out of the current demo account.");
  });

  dom.jobSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.keyword = dom.jobKeyword.value.trim();
    render();
  });

  dom.resumeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateResumeFromForm();
  });

  dom.companyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateCompanyFromForm();
  });

  dom.positionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addPositionFromForm();
  });

  window.addEventListener("hashchange", () => {
    const route = window.location.hash.replace("#", "") || "home";
    setRoute(route);
  });
}

function init() {
  bindEvents();
  const initialRoute = window.location.hash.replace("#", "") || "home";
  setRoute(initialRoute);
}

init();
