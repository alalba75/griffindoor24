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
            <a data-nav href="movingboxes.html">Moving Boxes</a>
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

// ---------- Canonical + OG URL Injection ----------
(function () {
  const canonical = document.getElementById("canonical");
  const ogurl = document.getElementById("ogurl");
  const origin = location.origin;
  const path = location.pathname.endsWith("/") ? "/index.html" : location.pathname;
  const url = origin + path;

  if (canonical) canonical.setAttribute("href", url);
  if (ogurl) ogurl.setAttribute("content", url);
})();

// ---------- Livestream Detection (toggles WRAPPERS for correct 16:9) ----------
(async () => {
  const wrapLive = document.getElementById("wrapLive");
  const wrapUploads = document.getElementById("wrapUploads");
  const liveBadge = document.getElementById("liveBadge");

  // Only run on pages that have these wrappers (index)
  if (!wrapLive || !wrapUploads) return;

  const channelId = "UCuYQxoOH-MnuEQsxdywLzqw";
  const liveUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
  const oembed = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(liveUrl)}`;

  async function checkLive() {
    try {
      const res = await fetch(oembed, { method: "GET" });
      if (!res.ok) throw new Error("Not live");
      await res.json();

      wrapLive.style.display = "block";
      wrapUploads.style.display = "none";
      if (liveBadge) liveBadge.style.display = "block";
    } catch {
      wrapLive.style.display = "none";
      wrapUploads.style.display = "block";
      if (liveBadge) liveBadge.style.display = "none";
    }
  }

  await checkLive();
  setInterval(checkLive, 60_000);
})();
