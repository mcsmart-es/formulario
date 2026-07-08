// Cloudflare Pages Function
// Protege la API key del cliente

const WHATSAPP_NUMERO = '34667705084';
const WHATSAPP_APIKEY = '3027963';

export async function onRequestPost({ request }) {
  try {
    const body = await request.json();

    // Validar campos obligatorios
    if (!body.negocio_nombre || !body.negocio_telefono || !body.negocio_ciudad) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Construir mensaje de WhatsApp
    const labelPlanTxt = body.codigo_lite ? 'MC Lite (Restringido)' : body.plan_nombre;

    let mensajeWA = `🆕 NUEVO PEDIDO MCsmart\n\n`;
    mensajeWA += `🏪 Negocio: ${body.negocio_nombre}\n`;
    mensajeWA += `📞 Teléfono: ${body.negocio_telefono}\n`;
    mensajeWA += `📍 Ciudad: ${body.negocio_ciudad}\n`;
    mensajeWA += `🏷️ Tipo: ${body.negocio_tipo || '-'}\n`;
    mensajeWA += `📧 Email: ${body.negocio_email || '-'}\n`;
    mensajeWA += `🗺️ Maps: ${body.negocio_gmaps || '-'}\n`;
    mensajeWA += `📋 Carta: ${body.negocio_carta || '-'}\n\n`;
    mensajeWA += `💼 Plan: ${labelPlanTxt}\n`;
    mensajeWA += `   Setup: ${body.plan_setup}€ | Mensual: ${body.plan_mensual}€ | Tags: ${body.plan_tags}\n\n`;
    mensajeWA += `💳 Modalidad: ${body.fact_modalidad}\n`;

    if (body.fact_modalidad === 'Corporativa') {
      mensajeWA += `\n📄 DATOS DE FACTURACIÓN:\n`;
      mensajeWA += `   Razón social: ${body.fact_nombre}\n`;
      mensajeWA += `   NIF/CIF: ${body.fact_cif}\n`;
      mensajeWA += `   Email facturas: ${body.fact_email}\n`;
      mensajeWA += `   Dirección fiscal: ${body.fact_direccion}\n`;
    }

    // Enviar a CallMeBot
    const urlWhatsapp = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_NUMERO}&text=${encodeURIComponent(mensajeWA)}&apikey=${WHATSAPP_APIKEY}`;

    const response = await fetch(urlWhatsapp);

    if (!response.ok) {
      throw new Error('Error al enviar WhatsApp');
    }

    return new Response(JSON.stringify({
      success: true,
      plan: labelPlanTxt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
