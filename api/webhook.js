import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore/lite';

// Inicializar Firebase (mesma config do frontend)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyALBAot8B7yFo-sCObaleoaA1sbpAstYCY",
  authDomain: "casamento-90fc8.firebaseapp.com",
  projectId: "casamento-90fc8",
  storageBucket: "casamento-90fc8.firebasestorage.app",
  messagingSenderId: "551558262370",
  appId: "1:551558262370:web:9b67adf2f6ecea03d72b3b"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default async function handler(req, res) {
  // Se o Asaas mandar um GET ou OPTIONS apenas para testar a URL (Ping)
  if (req.method !== 'POST') {
    return res.status(200).json({ received: true, message: 'Webhook is active' });
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
        
        // Busca as informações do presente para saber se ele é exclusivo
        const pSnap = await getDoc(presenteRef);
        
        let updateData = {
          lastPaidAt: Date.now()
        };

        if (pSnap.exists()) {
          const title = (pSnap.data().titulo || '').toLowerCase();
          const isExclusivo = pSnap.data().isExclusivo || 
                              title.includes('pedir') || 
                              title.includes('padrinho') || 
                              title.includes('buffet');
          
          // Apenas marca como vendido (esgotado) se for um dos itens exclusivos
          if (isExclusivo) {
             updateData.status = 'vendido';
          }
        }
        
        await updateDoc(presenteRef, updateData);
        
        console.log('Presente atualizado com sucesso no Firebase!');
      }
    }

    // Retorna 200 OK imediatamente para o Asaas não bloquear o webhook
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro interno ao atualizar Firebase:', error);
    // MESMO COM ERRO, retornamos 200 pro Asaas para não pausar a fila
    return res.status(200).json({ received: true, error: error.message });
  }
}
