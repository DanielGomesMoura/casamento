const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';

function createCpf() {
    const random = (n) => Math.round(Math.random() * n);
    const mod = (dividendo, divisor) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
    const n = 9;
    const n1 = random(n); const n2 = random(n); const n3 = random(n); const n4 = random(n); const n5 = random(n);
    const n6 = random(n); const n7 = random(n); const n8 = random(n); const n9 = random(n);
    let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    d1 = 11 - (mod(d1, 11));
    if (d1 >= 10) d1 = 0;
    let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
    d2 = 11 - (mod(d2, 11));
    if (d2 >= 10) d2 = 0;
    return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
}

async function test() {
    try {
        let customerId = process.env.ASAAS_CUSTOMER_ID;
        const validCpf = createCpf();
    
        if (!customerId) {
          console.log("Creating customer with valid CPF:", validCpf);
          const customerRes = await fetch(`${ASAAS_API_URL}/customers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'access_token': ASAAS_API_KEY
            },
            body: JSON.stringify({
              name: "Convidado do Casamento",
              cpfCnpj: validCpf
            })
          });
          const customerData = await customerRes.json();
          if (!customerData.id) {
            throw new Error('Falha ao criar cliente no Asaas: ' + JSON.stringify(customerData));
          }
          customerId = customerData.id;
          console.log("Customer created:", customerId);
        }

        console.log("Creating payment...");
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);

        const paymentRes = await fetch(`${ASAAS_API_URL}/payments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'access_token': ASAAS_API_KEY
            },
            body: JSON.stringify({
              customer: customerId,
              billingType: 'PIX',
              value: 10,
              dueDate: amanha.toISOString().split('T')[0],
              description: `Presente: Teste`,
              externalReference: "123",
            })
          });

        const paymentData = await paymentRes.json();
        console.log("Payment response:", paymentData.id);

    } catch(e) {
        console.error("Test failed:", e.message);
    }
}

test();
