/* GriffinDoor24 — script.js (header/footer injector + canonical + nav active)
   v=20260114-1100
*/

(function () {
  const VERSION = "20260114-1100";

  const navLinks = [
    { href: "index.html", label: "Home" },
    { href: "videos.html", label: "Videos" },
    { href: "news.html", label: "News" },
    { href: "businesspromos.html", label: "Business Promos" },
    { href: "contact.html", label: "Contact" }
  ];

  function normalizePath(pathname) {
    // Handle domain root ("/") and "/index.html"
    const p = (pathname || "/").split("?")[0].split("#")[0];
    if (p === "/" || p.endsWith("/")) return "index.html";
    const last = p.split("/").pop();
    return last || "index.html";
  }

  function setCanonicalAndOG() {
    const canonicalEl = document.getElementById("canonical");
    const ogUrlEl = document.getElementById("ogurl");
    const url = window.location.href.split("#")[0];

    if (canonicalEl) canonicalEl.href = url;
    if (ogUrlEl) ogUrlEl.content = url;
  }

  function buildHeader(activeFile) {
    const linksHtml = navLinks.map(l => {
      const isActive =
        (activeFile === "index.html" && l.href === "index.html") ||
        activeFile === l.href;
      return `<a class="nav-link${isActive ? " active" : ""}" href="${l.href}">${l.label}</a>`;
    }).join("");

    return `
      <header class="site-header">
        <div class="topbar">
          <a class="brand" href="index.html" aria-label="GriffinDoor24 home">
            <img class="brand-logo" src="assets/logo.png" alt="GriffinDoor24 logo">
            <span class="brand-name">GriffinDoor24</span>
          </a>

          <nav class="nav-links" aria-label="Primary">
            ${linksHtml}
          </nav>

          <a class="nav-youtube" href="https://www.youtube.com/@TheGriffinDoor24" target="_blank" rel="noopener">
            YouTube
          </a>
        </div
