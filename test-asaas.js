const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';

async function test() {
    try {
          const customerRes = await fetch(`${ASAAS_API_URL}/customers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'access_token': ASAAS_API_KEY
            },
            body: JSON.stringify({
              name: "Segundo Convidado",
              cpfCnpj: "69671134297" // same CPF
            })
          });
          const customerData = await customerRes.json();
          console.log("Customer response:", customerData);
    } catch(e) {
        console.error("Test failed:", e.message);
    }
}

test();
