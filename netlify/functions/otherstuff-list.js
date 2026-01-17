exports.handler = async function () {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        statusCode: 500,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "Missing Cloudinary env vars" })
      };
    }

    // Only show approved images:
    const prefix = "griffindoor24/otherstuff/";

    const url =
      "https://api.cloudinary.com/v1_1/" +
      encodeURIComponent(cloudName) +
      "/resources/image/upload?prefix=" +
      encodeURIComponent(prefix) +
      "&max_results=60";

    const auth = Buffer.from(apiKey + ":" + apiSecret).toString("base64");

    const r = await fetch(url, {
      headers: {
        Authorization: "Basic " + auth,
        Accept: "application/json"
      }
    });

    const j = await r.json();

    if (!r.ok) {
      return {
        statusCode: r.status,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "Cloudinary API error", details: j })
      };
    }

    const items = (j.resources || []).filter(x => (x.public_id || "").indexOf("griffindoor24/otherstuff/pending/") !== 0).map(x => ({
      public_id: x.public_id,
      created_at: x.created_at,
      width: x.width,
      height: x.height,
      secure_url: x.secure_url
    }));

    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store"
      },
      body: JSON.stringify({ items })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Server error", message: String(e && e.message ? e.message : e) })
    };
  }
};