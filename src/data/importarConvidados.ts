import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config.ts";

// 2. Interfaces
interface Convidado {
  nome: string;
  confirmado: boolean;
}

interface FamiliaImportacao {
  id: string;
  familia: string;
  categoria: string;
  qtdPessoas: number;
  qtdConfirmados: number;
  convidados: Convidado[];
}

// 3. Sua lista de convidados
const listaParaImportar: FamiliaImportacao[] = [
    {
    id: "familia-lima",
    familia: "Família Lima",
    categoria: "convidados",
    qtdPessoas: 3,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Ellen Assunção", confirmado: false },
      { nome: "Antonio Lima", confirmado: false },
      { nome: "Esmeralda", confirmado: false },
    ],
  },
];

// 4. Função Autoexecutável (IIFE) para rodar o script
(async () => {
  console.log("Iniciando importação para o Firebase...");

  try {
    for (const item of listaParaImportar) {
      const { id, ...dados } = item;
      await setDoc(doc(db, "convite", id), dados);
      console.log(`✅ Importado com sucesso: ${id}`);
    }
    console.log("🎉 Importação concluída! Verifique o painel do Firestore.");
    // @ts-ignore
    process.exit(0); // Encerra o script no terminal
  } catch (error) {
    console.error("❌ Erro ao importar:", error);
    // @ts-ignore
    process.exit(1);
  }
})();
