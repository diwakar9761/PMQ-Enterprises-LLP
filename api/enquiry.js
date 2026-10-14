
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_ENQUIRY_URL;

  if (!scriptUrl) {
    console.error("GOOGLE_APPS_SCRIPT_ENQUIRY_URL is missing.");

    return res.status(500).json({
      success: false,
      message: "Google Apps Script URL is not configured.",
    });
  }

  try {
    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(req.body ?? {}),
      redirect: "follow",
    });

    const responseText = await upstream.text();

    console.log("Apps Script HTTP status:", upstream.status);
    console.log("Apps Script final URL:", upstream.url);
    console.log(
      "Apps Script response preview:",
      responseText.slice(0, 1000)
    );

    if (!upstream.ok) {
      return res.status(502).json({
        success: false,
        message: `Google Apps Script returned HTTP ${upstream.status}.`,
      });
    }

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      return res.status(502).json({
        success: false,
        message:
          "Google Apps Script returned something other than JSON. Check the Vercel terminal logs.",
      });
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || "Google Apps Script rejected the enquiry.",
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message || "Enquiry submitted successfully.",
    });
  } catch (error) {
    console.error("Enquiry proxy failed:", error);

    return res.status(502).json({
      success: false,
      message: "Unable to connect to Google Apps Script.",
    });
  }
}
