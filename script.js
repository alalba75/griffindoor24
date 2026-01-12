// ---------- Shared Header + Footer Injection ----------
(function () {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const year = new Date().getFullYear();
  const here = (location.pathname.split("/").pop() || "index.html");

  if (header) {
    header.innerHTML = `
      <header class="banner-header">
        <img src="assets/banner.png" alt="GriffinDoor24" class="banner-img">
        <div class="banner-overlay">
          <nav class="banner-nav" aria-label="Primary">
            <a data-nav href="index.html">Home</a>
            <a data-nav href="videos.html">Weekly Library</a>
            <a data-nav href="news.html">News</a>
            <a data-nav href="about.html">Moving Boxes</a>
            <a data-nav href="contact.html">Contact</a>
          </nav>
        </div>
      </header>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="site-footer">
        <div>© ${year} GriffinDoor24</div>
        <div class="small">Community-run • Family-friendly</div>
      </div>
    `;
  }

  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
})();

// ---------- Canonical + OG URL In
