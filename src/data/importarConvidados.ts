import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

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
    id: "barbara",
    familia: "Barbara",
    categoria: "madrinha",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Barbara Praia", confirmado: false },
      { nome: "marido da barbara", confirmado: false },
    ],
  },
  {
    id: "aline",
    familia: "Aline",
    categoria: "madrinha",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [{ nome: "Aline Alves", confirmado: false }],
  },
  {
    id: "familia-abadio",
    familia: "Família Abadio",
    categoria: "padrinho",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Gabriel Abadio", confirmado: false },
      { nome: "Lilian Abadio", confirmado: false },
    ],
  },
  {
    id: "familia-araujo-carvalho",
    familia: "Família Araujo & Carvalho",
    categoria: "padrinhos",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Gerson Araújo", confirmado: false },
      { nome: "Camila Carvalho", confirmado: false },
    ],
  },
  {
    id: "familia-lameira",
    familia: "Família Lameira",
    categoria: "padrinhos",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Willian Lameira", confirmado: false },
      { nome: "Janaína Almeida lameira", confirmado: false },
    ],
  },
  {
    id: "familia-luz-carvalho",
    familia: "Família Luz & Carvalho",
    categoria: "padrinhos",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Bruno Carvalho", confirmado: false },
      { nome: "Lorena Luz", confirmado: false },
    ],
  },
  {
    id: "familia-gomes-ramos",
    familia: "Família Gomes & Ramos",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Robeilton Gomes", confirmado: false },
      { nome: "Evelyn Ramos", confirmado: false },
    ],
  },
  {
    id: "familia-godinho-almeida",
    familia: "Família Godinho & Almeida",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Solon Godinho", confirmado: false },
      { nome: "Marla Almeida", confirmado: false },
    ],
  },
  {
    id: "familia-mamani-cecilia",
    familia: "Família Mamani & Cecilia",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Leonardo Mamani", confirmado: false },
      { nome: "Glória Cecilia", confirmado: false },
    ],
  },
  {
    id: "familia-costa-santos",
    familia: "Família Costa & Santos",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Alexandre Costa", confirmado: false },
      { nome: "Marcilena Santos", confirmado: false },
    ],
  },
  {
    id: "familia-oliveira",
    familia: "Família Oliveira",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "William Oliveira", confirmado: false },
      { nome: "Aretusa Oliveira", confirmado: false },
    ],
  },
  {
    id: "familia-ferreira",
    familia: "Família Ferreira",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "João Ferreira", confirmado: false },
      { nome: "Helena Ferreira", confirmado: false },
    ],
  },
  {
    id: "familia-almeida",
    familia: "Família Almeida",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Paula Alemeida", confirmado: false },
      { nome: "Maria Almeida", confirmado: false },
    ],
  },
  {
    id: "familia-almeida-andre",
    familia: "Família Almeida",
    categoria: "convidados",
    qtdPessoas: 4,
    qtdConfirmados: 0,
    convidados: [
      { nome: "André Almeida", confirmado: false },
      { nome: "Vanda Almeida", confirmado: false },
      { nome: "Andreza Almeida", confirmado: false },
      { nome: "Vanessa Almeida", confirmado: false },
    ],
  },
  {
    id: "familia-almeida-luis",
    familia: "Família Almeida",
    categoria: "convidados",
    qtdPessoas: 3,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Luís Almeida", confirmado: false },
      { nome: "Ivone Almeida", confirmado: false },
      { nome: "Sueny Almeida", confirmado: false },
    ],
  },
  {
    id: "familia-andrade",
    familia: "Família Andrade",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Viviane Andrade", confirmado: false },
      { nome: "Klaus Andrade", confirmado: false },
    ],
  },
  {
    id: "familia-lira",
    familia: "Família Lira",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Rosana Lira", confirmado: false },
      { nome: "Miguel Lira", confirmado: false },
    ],
  },
  {
    id: "familia-carneiro-santos",
    familia: "Família Carneiro & Santos",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Daniel Carneiro", confirmado: false },
      { nome: "Luana Santos", confirmado: false },
    ],
  },
  {
    id: "familia-carneiro",
    familia: "Família Carneiro",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Rafael Carneiro", confirmado: false },
      { nome: "Virlene", confirmado: false },
    ],
  },
  {
    id: "familia-alves",
    familia: "Família Alves",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Jade Alves", confirmado: false },
      { nome: "Gabriel", confirmado: false },
    ],
  },
  {
    id: "familia-cavalcante-aoki",
    familia: "Família Cavalcante & Aoki",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "João Cléber Cavalcante", confirmado: false },
      { nome: "Rafaelle Aoki ", confirmado: false },
    ],
  },
  {
    id: "fernanda",
    familia: "Fernanda",
    categoria: "convidados",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Fernanda Avelina", confirmado: false },
    ],
  },
  {
    id: "sonia",
    familia: "Família Verçosa",
    categoria: "convidados",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Sônia Verçosa", confirmado: false },
    ],
  },
  {
    id: "cylmara",
    familia: "Família Verçosa",
    categoria: "convidados",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Cylmara Verçosa", confirmado: false },
    ],
  },
  {
    id: "fabricio",
    familia: "Fabricio",
    categoria: "convidados",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Fabrício Silva", confirmado: false },
    ],
  },
  {
    id: "lucas",
    familia: "Lucas",
    categoria: "convidados",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Lucas Nunes", confirmado: false },
    ],
  },
  {
    id: "gabriel",
    familia: "Gabriel",
    categoria: "convidados",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Gabriel Goes", confirmado: false },
    ],
  },
  {
    id: "juliana",
    familia: "Juliana",
    categoria: "convidados",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [
      { nome: "juliana Almeida", confirmado: false },
    ],
  },
  {
    id: "ivone",
    familia: "Ivone",
    categoria: "convidados",
    qtdPessoas: 1,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Ivone Ketura", confirmado: false },
    ],
  },
  {
    id: "familia-gomes-moura",
    familia: "Família Moura",
    categoria: "convidados",
    qtdPessoas: 2,
    qtdConfirmados: 0,
    convidados: [
      { nome: "Flávio Gomes Moura", confirmado: false },
      { nome: "Cris Moura", confirmado: false },
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
