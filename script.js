/* GriffinDoor24 — script.js (safe shell injector)
   Purpose:
   - Inject header + footer into #site-header / #site-footer
   - Keep existing page layout intact
   - Provide a consistent nav across all pages
   - Provide minimal fallback CSS ONLY for the header/footer (won't rewrite your site)
*/

(function () {
  const NAV = [
    { href: "index.html", label: "Home" },
    { href: "videos.html", label: "Videos" },
    { href: "news.html", label: "News" },
    { href: "businesspromos.html", label: "Business Promos" },
    { href: "schoolstuff.html", label: "School Stuff" },
    { href: "contact.html", label: "Contact" }
  ];

  function currentFile() {
    const p = (location.pathname || "/").split("?")[0].split("#")[0];
    if (p === "/" || p.endsWith("/")) return "index.html";
    return p.split("/").pop() || "index.html";
  }

  function setCanonicalAndOG() {
    const canonicalEl = document.getElementById("canonical");
    const ogUrlEl = document.getElementById("ogurl");
    const url = location.href.split("#")[0];
    if (canonicalEl) canonicalEl.href = url;
    if (ogUrlEl) ogUrlEl.content = url;
  }

  function injectShellCSSOnce() {
    if (document.getElementById("gd24-shell-css")) return;

    const css = `
/* --- GriffinDoor24 shell CSS (header/footer only) --- */
.gd24-header{ max-width:1120px; margin:14px auto 10px; padding:0 16px; }
.gd24-topbar{
  display:flex; align-items:center; gap:12px; flex-wrap:wrap;
  padding:12px 14px; border-radius:999px;
  background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.14);
}
.gd24-brand{ display:flex; align-items:center; gap:10px; text-decoration:none; color:inherit; font-weight:900; }
.gd24-brand img{ width:120px; height:auto; object-fit:contain; display:block; } /* logo.png 120px */
.gd24-nav{ display:flex; flex:1; gap:10px; flex-wrap:wrap; justify-content:center; min-width:220px; }
.gd24-nav a{
  text-decoration:none; font-weight:800; font-size:.95rem; color:inherit;
  padding:8px 12px; border-radius:999px;
  border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.04);
}
.gd24-nav a.gd24-active{ border-color:rgba(255,42,79,.45); background:rgba(255,42,79,.18); }

.gd24-banner{
  margin-top:10px; border-radius:24px; overflow:hidden;
  border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.03);
  height:140px;
}
.gd24-banner img{ width:100%; height:100%; object-fit:cover; object-position:center; display:block; }

.gd24-footer{ max-width:1120px; margin:12px auto 26px; padding:0 16px; }
.gd24-foot{
  padding:14px 16px; border-radius:18px;
  background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.10);
  display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;
}
.gd24-foot a{ color:inherit; text-decoration:none; font-weight:800; opacity:.92; }
.gd24-foot a:hover{ opacity:1; text-decoration:underline; }
.gd24-muted{ opacity:.75; font-weight:700; }
`;

    const style = document.createElement("style");
    style.id = "gd24-shell-css";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildHeader(active) {
    const links = NAV.map((l) => {
      const isActive =
        (active === "index.html" && l.href === "index.html") || active === l.href;
      return `<a href="${l.href}" class="${isActive ? "gd24-active" : ""}">${l.label}</a>`;
    }).join("");

    return `
<header class="gd24-header">
  <div class="gd24-topbar">
    <a class="gd24-brand" href="index.html" aria-label="GriffinDoor24 home">
      <img src="assets/logo.png" alt="GriffinDoor24 logo">
      <span>GriffinDoor24</span>
    </a>

    <nav class="gd24-nav" aria-label="Primary">
      ${links}
    </nav>
  </div>

  <div class="gd24-banner">
    <img src="assets/banner.png" alt="GriffinDoor24 banner">
  </div>
</header>`;
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    return `
<footer class="gd24-footer">
  <div class="gd24-foot">
    <div class="gd24-muted">© ${year} GriffinDoor24</div>
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <a href="businesspromos.html">Business Promos</a>
      <a href="schoolstuff.html">School Stuff</a>
      <a href="contact.html">Contact</a>
    </div>
  </div>
</footer>`;
  }

  function run() {
    injectShellCSSOnce();
    setCanonicalAndOG();

    const active = currentFile();
    const headerHost = document.getElementById("site-header");
    const footerHost = document.getElementById("site-footer");

    if (headerHost) headerHost.innerHTML = buildHeader(active);
    if (footerHost) footerHost.innerHTML = buildFooter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
