let jobsData = [];

// Load job data from JSON
async function loadJobs() {
  try {
    const res = await fetch('jobs.json');
    jobsData = await res.json();
    renderJobs(jobsData);
  } catch (err) {
    console.error("❌ Failed to load jobs.json", err);
  }
}

// Render job cards on the page
function renderJobs(jobs) {
  const container = document.getElementById('jobList');
  container.innerHTML = '';

  animateJobCount(jobs.length); // 👈 Job count animation

  if (!Array.isArray(jobs) || jobs.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500">No jobs found.</p>';
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = "job-card p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 border hover:shadow-xl transition duration-300";
    card.dataset.title = job.title.toLowerCase();
    card.dataset.type = job.type;
    card.dataset.location = job.location;

    const icon = job.type === 'WFH' ? '🏠' : job.type === 'Full-Time' ? '💼' : '⏰';

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">${icon} ${job.title}</h2>
        <span class="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">${job.type}</span>
      </div>
      <p class="text-sm text-gray-500 mt-1">📍 ${job.location}</p>
      <p class="text-sm text-gray-500">🏢 ${job.company}</p>
      <a href="verify.html" class="inline-block mt-4 px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition">Apply Now</a>
    `;

    container.appendChild(card);
  });
}

// Filter jobs based on search & dropdowns
function filterJobs() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const type = document.getElementById("jobType").value;
  const location = document.getElementById("jobLocation").value;

  const filtered = jobsData.filter(job =>
    job.title.toLowerCase().includes(search) &&
    (type === "All" || job.type === type) &&
    (location === "All" || job.location === location)
  );

  renderJobs(filtered);
}

// Quick filter from category buttons
function quickFilter(keyword, buttonElement) {
  document.getElementById("searchInput").value = keyword;
  filterJobs();

  const buttons = document.querySelectorAll("#categoryButtons button");
  buttons.forEach(btn => btn.classList.remove("active"));
  buttonElement.classList.add("active");
}

// Admin-only job adding (temporary)
function addJob() {
  const title = document.getElementById('jobTitle').value;
  const company = document.getElementById('jobCompany').value;
  const type = document.getElementById('jobTypeInput').value;
  const location = document.getElementById('jobLocationInput').value;

  if (!title || !company || !type || !location) {
    alert("Please fill in all fields");
    return;
  }

  const newJob = { title, company, type, location };
  jobsData.push(newJob);
  renderJobs(jobsData);
  document.getElementById("jobForm").reset();
  alert("✅ Job added (not saved permanently)");
}

// Show admin form with password
function showAdminForm() {
  const key = prompt("Enter admin password:");
  if (key === "jobhunt123") {
    document.getElementById("adminForm").style.display = "block";
  } else {
    alert("Wrong password");
  }
}

// Animate job count
function animateJobCount(target) {
  const countEl = document.getElementById("jobCountNumber");
  let current = 0;
  const increment = Math.ceil(target / 30);
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    countEl.textContent = current;
  }, 20);
}

// Particle background
tsParticles.load("tsparticles", {
  fullScreen: { enable: true, zIndex: -1 },
  particles: {
    number: { value: 60 },
    size: { value: 2 },
    move: { enable: true, speed: 0.3 },
    color: { value: "#ffffff" },
  },
  background: { color: { value: "#1e3a8a" } }
});

// Theme toggle (dark/light)
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

// Load jobs + restore theme
window.onload = () => {
  loadJobs();
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
};



