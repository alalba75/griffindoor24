/* ============================================================
   GriffinDoor24 — script.js
   Header / Footer injection + active nav + canonical helper
   ============================================================ */

(function () {

  function setCanonical() {
    const link = document.getElementById("canonical");
    const og = document.getElementById("ogurl");
    if (!link || !og) return;
    const url = location.origin + location.pathname;
    link.href = url;
    og.content = url;
  }

  function highlightActiveNav() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach(a => {
      if (a.getAttribute("href") === path) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  const headerTarget = document.getElementById("site-header");
  if (headerTarget) {
    headerTarget.innerHTML = `
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

  const footerTarget = document.getElementById("site-footer");
  if (footerTarget) {
    const year = new Date().getFullYear();
    footerTarget.innerHTML = `
      <div class="container">
        <div class="small">© ${year} GriffinDoor24 — All rights reserved.</div>
      </div>
    `;
  }

  setCanonical();
  highlightActiveNav();

})();
