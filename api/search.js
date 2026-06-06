function pick(html, name) {
  const re = new RegExp(`name="${name}"[^>]*value="([^"]*)"`, "i");
  const m = html.match(re);
  return m ? m[1] : "";
}

export default async function handler(req, res) {
  const flight = String(req.query.flight || "AR1804").toUpperCase();
  const airport = String(req.query.airport || "AEP").toUpperCase();
  const url = "http://www.tams.com.ar/organismos/vuelos.aspx";

  try {
    const first = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const html1 = await first.text();

    const form = new URLSearchParams();
    form.set("__EVENTTARGET", "");
    form.set("__EVENTARGUMENT", "");
    form.set("__LASTFOCUS", "");
    form.set("__VIEWSTATE", pick(html1, "__VIEWSTATE"));
    form.set("__VIEWSTATEGENERATOR", pick(html1, "__VIEWSTATEGENERATOR"));
    form.set("__EVENTVALIDATION", pick(html1, "__EVENTVALIDATION"));

    form.set("ddlMovTp", "D");
    form.set("ddlAeropuerto", airport);
    form.set("ddlSector", "-1");
    form.set("ddlAerolinea", "AR");
    form.set("ddlAterrizados", "-1");
    form.set("ddlVentanaH", "12");
    form.set("btnBuscar", "Buscar");

    const post = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        "Referer": url,
        "Origin": "http://www.tams.com.ar"
      },
      body: form.toString()
    });

    const html = await post.text();
    const clean = html.replace(/\s+/g, " ");
    const idx = clean.toUpperCase().indexOf(flight.replace("AR", ""));

    res.status(200).json({ ok: true, flight, airport, found: idx >= 0, length: html.length, html: html.substring(0,3000) });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
