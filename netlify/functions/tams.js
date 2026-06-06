function pick(html, name) {
  const re = new RegExp(`name="${name}"[^>]*value="([^"]*)"`, "i");
  const m = html.match(re);
  return m ? m[1] : "";
}

exports.handler = async function(event) {
  const flight = (event.queryStringParameters.flight || "AR1886").toUpperCase();
  const airport = (event.queryStringParameters.airport || "AEP").toUpperCase();
  const url = "http://www.tams.com.ar/organismos/vuelos.aspx";

  try {
    const first = await fetch(url);
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
    const idx = html.toUpperCase().indexOf(flight);
    const around = idx >= 0 ? html.substring(Math.max(0, idx - 1500), idx + 2500) : "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        flight,
        airport,
        found: idx >= 0,
        length: html.length,
        around
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: String(e) })
    };
  }
};
