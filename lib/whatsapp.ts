import axios from 'axios';

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const VERSION = 'v20.0';

export async function sendWhatsAppConfirmation(
  to: string,
  customerName: string,
  roomType: string,
  checkIn: string,
  checkOut: string,
  totalPrice: number
) {
  // Remove any non-digit characters from the phone number
  const cleanTo = to.replace(/\D/g, '');

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.log('--- WHATSAPP CLOUD API MOCK (No Credentials Found) ---');
    console.log(`To: ${cleanTo}`);
    console.log(`Customer: ${customerName}`);
    console.log(`Message: Confirmation for ${roomType} room ($${totalPrice})`);
    console.log('------------------------------------------------------');
    return { success: true, mock: true };
  }

  try {
    const url = `https://graph.facebook.com/${VERSION}/${PHONE_NUMBER_ID}/messages`;
    
    // Using the official "hello_world" template as a default for testing
    // In production, you'd use a custom template like 'booking_confirmation'
    const data = {
      messaging_product: 'whatsapp',
      to: cleanTo,
      type: 'template',
      template: {
        name: 'hello_world', // Note: Meta requires approved templates. 'hello_world' is always available.
        language: {
          code: 'en_US',
        },
      },
    };

    // To send a custom text message (not using a template), you'd use type: 'text'
    // BUT: Meta only allows custom text if the user messaged you in the last 24 hours.
    // For confirmations, you MUST use a Template.
    
    /* 
    // Example of a custom template structure for your real booking:
    const bookingTemplateData = {
      messaging_product: 'whatsapp',
      to: cleanTo,
      type: 'template',
      template: {
        name: 'booking_confirmation',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: customerName },
              { type: 'text', text: roomType },
              { type: 'text', text: checkIn },
              { type: 'text', text: checkOut },
              { type: 'text', text: totalPrice.toFixed(2) }
            ]
          }
        ]
      }
    };
    */

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`WhatsApp message sent via Cloud API: ${response.data.messages[0].id}`);
    return { success: true, id: response.data.messages[0].id };
  } catch (error: any) {
    console.error('Error sending WhatsApp message (Cloud API):', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}
