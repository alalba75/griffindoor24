// Highlight current nav link
(() => {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.getAttribute("href") === here) a.classList.add("active");
  });
})();

// Livestream detection + swap player on index page
(async () => {
  const liveFrame = document.getElementById("ytLive");
  const uploadsFrame = document.getElementById("ytUploads");
  const liveBadge = document.getElementById("liveBadge");
  if (!liveFrame || !uploadsFrame) return; // only runs where player exists

  const channelId = "UCuYQxoOH-MnuEQsxdywLzqw"; // GriffinDoor24 channel ID
  const liveUrl = `https://www.youtube.com/embed/live_stream?channel=${channelId}`;
  const oembed = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(liveUrl)}`;

  async function checkLive() {
    try {
      const res = await fetch(oembed, { method: "GET" });
      if (!res.ok) throw new Error("Not live");
      await res.json();

      // Live detected
      liveFrame.style.display = "block";
      uploadsFrame.style.display = "none";
      if (liveBadge) liveBadge.style.display = "block";
    } catch {
      // Not live
      liveFrame.style.display = "none";
      uploadsFrame.style.display = "block";
      if (liveBadge) liveBadge.style.display = "none";
    }
  }

  await checkLive();
  setInterval(checkLive, 60_000);
})();
