/**
 * Netlify Function: /.netlify/functions/live
 * Query:
 *   channelId=UC...
 *
 * Env var required on Netlify:
 *   YT_API_KEY
 *
 * Response:
 *   { live: boolean, videoId: string|null, title: string|null, url: string|null }
 */

exports.handler = async function (event) {
  try {
    const channelId = event.queryStringParameters && event.queryStringParameters.channelId;
    if (!channelId) {
      return {
        statusCode: 400,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Missing channelId" })
      };
    }

    const key = process.env.YT_API_KEY;
    if (!key) {
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Missing server env var YT_API_KEY" })
      };
    }

    const api =
      "https://www.googleapis.com/youtube/v3/search" +
      `?part=snippet&channelId=${encodeURIComponent(channelId)}` +
      "&eventType=live&type=video&maxResults=1" +
      `&key=${encodeURIComponent(key)}`;

    const res = await fetch(api, { headers: { accept: "application/json" } });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: 502,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "YouTube API error", status: res.status, body: text })
      };
    }

    const data = await res.json();
    const item = (data.items && data.items[0]) ? data.items[0] : null;

    if (!item || !item.id || !item.id.videoId) {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
        body: JSON.stringify({ live: false, videoId: null, title: null, url: null })
      };
    }

    const videoId = item.id.videoId;
    const title = (item.snippet && item.snippet.title) ? item.snippet.title : null;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({
        live: true,
        videoId: videoId,
        title: title,
        url: `https://www.youtube.com/watch?v=${videoId}`
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Unhandled error", message: String(e) })
    };
  }
};
