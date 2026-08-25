export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Falta MERCADOPAGO_ACCESS_TOKEN en Netlify" }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ message: "Body JSON inválido" }) };
  }

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || `https://${event.headers.host}`;
  const orderId = String(payload.orderId || "");
  const items = Array.isArray(payload.items) ? payload.items : [];

  if (!orderId || items.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ message: "Falta orderId o items" }) };
  }

  const preference = {
    external_reference: orderId,
    items: items.map((item) => ({
      title: String(item.name).slice(0, 250),
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "CLP",
    })),
    payer: {
      name: payload.customer || undefined,
      email: payload.email || undefined,
      phone: payload.phone ? { number: payload.phone } : undefined,
    },
    back_urls: {
      success: `${siteUrl}/checkout?mp=success&order=${encodeURIComponent(orderId)}`,
      failure: `${siteUrl}/checkout?mp=failure&order=${encodeURIComponent(orderId)}`,
      pending: `${siteUrl}/checkout?mp=pending&order=${encodeURIComponent(orderId)}`,
    },
    auto_return: "approved",
    statement_descriptor: "123CONGELADOS",
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ initPoint: data.init_point, sandboxInitPoint: data.sandbox_init_point, preferenceId: data.id }),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Error creando preferencia Mercado Pago", cause: error instanceof Error ? error.message : String(error) }),
    };
  }
};
