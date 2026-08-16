import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Inicializar Firebase (mesma config do frontend)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyALBAot8B7yFo-sCObaleoaA1sbpAstYCY",
  authDomain: "casamento-90fc8.firebaseapp.com",
  projectId: "casamento-90fc8",
  storageBucket: "casamento-90fc8.firebasestorage.app",
  messagingSenderId: "551558262370",
  appId: "1:551558262370:web:9b67adf2f6ecea03d72b3b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const { event, payment } = body;

    // Verificar se o evento é de pagamento recebido ou confirmado
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const presenteId = payment?.externalReference;
      
      if (presenteId) {
        console.log(`Pagamento confirmado para o presente: ${presenteId}`);
        // Atualiza o status do presente no Firestore
        const presenteRef = doc(db, 'presentes', presenteId);
        
        // Vamos atualizar o campo 'status' para 'vendido'
        await updateDoc(presenteRef, {
          status: 'vendido' // Usaremos isso no frontend para saber que foi vendido
        });
        
        console.log('Presente atualizado com sucesso no Firebase!');
      }
    }

    // O Asaas exige que retornemos 200 OK rapidamente
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro no Webhook:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
