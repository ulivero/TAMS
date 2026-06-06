exports.handler = async function(event) {
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

