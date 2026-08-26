export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const isTestToken = accessToken?.startsWith("TEST-");
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

  const rawSiteUrl = process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || `https://${event.headers.host}`;
  const siteUrl = rawSiteUrl.replace(/\/$/, "").replace(/^http:\/\//, "https://");
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
      email: payload.email || undefined,
    },
    back_urls: {
      success: `${siteUrl}/checkout?mp=success&order=${encodeURIComponent(orderId)}`,
      failure: `${siteUrl}/checkout?mp=failure&order=${encodeURIComponent(orderId)}`,
      pending: `${siteUrl}/checkout?mp=pending&order=${encodeURIComponent(orderId)}`,
    },
    statement_descriptor: "123CONGELADOS",
  };

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
        "x-idempotency-key": orderId,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: data.message || "Mercado Pago rechazó la creación del checkout",
          mercadopago: data,
          debug: {
            mode: isTestToken ? "test" : "production",
            siteUrl,
            orderId,
            itemCount: items.length,
          },
        }),
      };
    }

    const initPoint = isTestToken ? data.sandbox_init_point : data.init_point;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ initPoint, sandboxInitPoint: data.sandbox_init_point, preferenceId: data.id, mode: isTestToken ? "test" : "production" }),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Error creando preferencia Mercado Pago", cause: error instanceof Error ? error.message : String(error) }),
    };
  }
};
