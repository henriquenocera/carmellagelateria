/**
 * Serviço de integração com a WhatsApp Cloud API (Meta Oficial)
 */

const WHATSAPP_PHONE_ID = process.env.REACT_APP_WHATSAPP_PHONE_ID || '';
const WHATSAPP_TOKEN = process.env.REACT_APP_WHATSAPP_TOKEN || '';
const META_API_VERSION = 'v19.0';

/**
 * Formata o número de telefone para o padrão exigido pela Meta Cloud API.
 * Diferente do WAHA, a Meta não usa @c.us e espera apenas os números, começando pelo DDI.
 * @param phone Número de telefone bruto
 * @returns Número formatado apenas com dígitos (ex: 5511999999999)
 */
const formatWhatsAppNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = '55' + cleaned;
  }
  
  return cleaned;
};

/**
 * Envia uma mensagem de texto simples usando a WhatsApp Cloud API da Meta.
 * NOTA: A Meta exige que números iniciem conversas com você PRIMEIRO (janela de 24h),
 * ou que você envie "Templates" pré-aprovados caso esteja abrindo uma nova conversa.
 * Este método envia um texto livre, que só funciona se houver uma janela de 24h aberta.
 * 
 * @param phone Número de telefone de destino
 * @param text Texto da mensagem a ser enviada
 * @returns Promise com a resposta da API
 */
export const sendWhatsAppMessage = async (phone: string, text: string) => {
  if (!WHATSAPP_PHONE_ID || !WHATSAPP_TOKEN) {
    throw new Error('Credenciais da WhatsApp Cloud API não configuradas no arquivo .env.');
  }

  const formattedPhone = formatWhatsAppNumber(phone);
  const url = `https://graph.facebook.com/${META_API_VERSION}/${WHATSAPP_PHONE_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedPhone,
    type: 'text',
    text: {
      preview_url: false,
      body: text,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Erro Meta API: ${response.status} - ${
          errorData?.error?.message || response.statusText
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Falha ao comunicar com a WhatsApp Cloud API:', error);
    throw error;
  }
};
