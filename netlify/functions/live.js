/**
 * Netlify Function: /.netlify/functions/live
 * Query:
 *   channelId=UC...
 *   debug=1   (optional)
 *
 * Env var required on Netlify:
 *   YT_API_KEY
 */

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    },
    body: JSON.stringify(obj)
  };
}

async function yt(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) return { ok: false, status: res.status, text };
  try { return { ok: true, json: JSON.parse(text) }; }
  catch { return { ok: false, status: res.status, text }; }
}

exports.handler = async function (event) {
  try {
    const qs = event.queryStringParameters || {};
    const channelId = qs.channelId;
    const debug = qs.debug === "1";

    if (!channelId) return json(400, { error: "Missing channelId" });

    const key = process.env.YT_API_KEY;
    if (!key) return json(500, { error: "Missing server env var YT_API_KEY" });

    const liveSearchUrl =
      "https://www.googleapis.com/youtube/v3/search" +
      `?part=snippet&channelId=${encodeURIComponent(channelId)}` +
      "&eventType=live&type=video&maxResults=1" +
      `&key=${encodeURIComponent(key)}`;

    const a = await yt(liveSearchUrl);
    if (!a.ok) return json(502, { error: "YouTube API error (search live)", status: a.status, body: a.text });

    const aItem = a.json.items && a.json.items[0];
    if (aItem && aItem.id && aItem.id.videoId) {
      const videoId = aItem.id.videoId;
      const title = (aItem.snippet && aItem.snippet.title) ? aItem.snippet.title : null;
      return json(200, {
        live: true,
        videoId,
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        mode: "eventType=live",
        ...(debug ? { debug: { liveSearchUrl, liveSearch: a.json } } : {})
      });
    }

    const recentUrl =
      "https://www.googleapis.com/youtube/v3/search" +
      `?part=snippet&channelId=${encodeURIComponent(channelId)}` +
      "&type=video&order=date&maxResults=5" +
      `&key=${encodeURIComponent(key)}`;

    const b = await yt(recentUrl);
    if (!b.ok) return json(502, { error: "YouTube API error (search recent)", status: b.status, body: b.text });

    const ids = (b.json.items || [])
      .map(it => it && it.id && it.id.videoId)
      .filter(Boolean);

    if (!ids.length) {
      return json(200, {
        live: false, videoId: null, title: null, url: null, mode: "no-recent",
        ...(debug ? { debug: { recentUrl, recent: b.json } } : {})
      });
    }

    const videosUrl =
      "https://www.googleapis.com/youtube/v3/videos" +
      `?part=snippet,liveStreamingDetails&id=${encodeURIComponent(ids.join(","))}` +
      `&key=${encodeURIComponent(key)}`;

    const c = await yt(videosUrl);
    if (!c.ok) return json(502, { error: "YouTube API error (videos.list)", status: c.status, body: c.text });

    const liveNow = (c.json.items || []).find(v => {
      const d = v.liveStreamingDetails || {};
      return d.actualStartTime && !d.actualEndTime;
    });

    if (liveNow) {
      const videoId = liveNow.id;
      const title = liveNow.snippet && liveNow.snippet.title ? liveNow.snippet.title : null;
      return json(200, {
        live: true,
        videoId,
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        mode: "liveStreamingDetails",
        ...(debug ? { debug: { liveSearchUrl, liveSearch: a.json, recentUrl, recent: b.json, videosUrl, videos: c.json } } : {})
      });
    }

    return json(200, {
      live: false, videoId: null, title: null, url: null, mode: "not-live",
      ...(debug ? { debug: { liveSearchUrl, liveSearch: a.json, recentUrl, recent: b.json, videosUrl, videos: c.json, ids } } : {})
    });
  } catch (e) {
    return json(500, { error: "Unhandled error", message: String(e) });
  }
};
