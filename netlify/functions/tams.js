exports.handler = async function() {
  try {
    const r = await fetch('http://www.tams.com.ar/organismos/vuelos.aspx');

    const html = await r.text();

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        length: html.length,
        sample: html.substring(0,500)
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: String(e)
      })
    };
  }
};exports.handler = async function(event) {
  const flight = (event.queryStringParameters.flight || "").toUpperCase();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ok: true,
      message: "Función Netlify activa",
      flight
    })
  };
};

