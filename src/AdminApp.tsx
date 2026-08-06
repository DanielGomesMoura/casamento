import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Users, CheckCircle2, Loader2, ArrowLeft, Lock, ChevronRight, Gift, Plus, Trash2, Image as ImageIcon, Edit2 } from 'lucide-react';
import { db } from '../firebase.config';

interface Convidado {
    nome: string;
    confirmado: boolean;
}

interface FamiliaData {
    id: string;
    familia: string;
    categoria: string;
    qtdPessoas: number;
    qtdConfirmados: number;
    convidados: Convidado[];
}

interface Presente {
    id: string;
    titulo: string;
    imagemUrl: string;
    valor: number;
}

export default function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');
    
    const [activeTab, setActiveTab] = useState<'convidados' | 'presentes'>('convidados');

    // Estados para Convidados
    const [familias, setFamilias] = useState<FamiliaData[]>([]);
    
    // Estados para Presentes
    const [presentes, setPresentes] = useState<Presente[]>([]);
    const [novoPresente, setNovoPresente] = useState({ titulo: '', imagemUrl: '', valor: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editandoId, setEditandoId] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Senha de acesso (pode alterar aqui se quiser)
    const ADMIN_PASSWORD = "Bed200816@";

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            fetchData();
        } else {
            setLoginError('Senha incorreta. Tente novamente.');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Convidados
            const querySnapshot = await getDocs(collection(db, 'convite'));
            const familiasData: FamiliaData[] = [];
            querySnapshot.forEach((doc) => {
                familiasData.push({ id: doc.id, ...doc.data() } as FamiliaData);
            });
            setFamilias(familiasData);

            // Fetch Presentes
            const presentesSnapshot = await getDocs(collection(db, 'presentes'));
            const presentesData: Presente[] = [];
            presentesSnapshot.forEach((doc) => {
                presentesData.push({ id: doc.id, ...doc.data() } as Presente);
            });
            setPresentes(presentesData);

        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError('Ocorreu um erro ao carregar os dados.');
        } finally {
            setLoading(false);
        }
    };

    const handleSavePresente = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!novoPresente.titulo || !novoPresente.valor) return;

        setIsSubmitting(true);
        try {
            if (editandoId) {
                // Atualizar existente
                const docRef = doc(db, 'presentes', editandoId);
                await updateDoc(docRef, {
                    titulo: novoPresente.titulo,
                    imagemUrl: novoPresente.imagemUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop',
                    valor: parseFloat(novoPresente.valor)
                });
                
                setPresentes(presentes.map(p => p.id === editandoId ? {
                    ...p,
                    titulo: novoPresente.titulo,
                    imagemUrl: novoPresente.imagemUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop',
                    valor: parseFloat(novoPresente.valor)
                } : p));
                
                setEditandoId(null);
            } else {
                // Criar novo
                const docRef = await addDoc(collection(db, 'presentes'), {
                    titulo: novoPresente.titulo,
                    imagemUrl: novoPresente.imagemUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop',
                    valor: parseFloat(novoPresente.valor)
                });
                
                setPresentes([...presentes, {
                    id: docRef.id,
                    titulo: novoPresente.titulo,
                    imagemUrl: novoPresente.imagemUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop',
                    valor: parseFloat(novoPresente.valor)
                }]);
            }
            
            setNovoPresente({ titulo: '', imagemUrl: '', valor: '' });
        } catch (error) {
            console.error("Erro ao salvar presente:", error);
            alert("Erro ao salvar presente.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleEditClick = (presente: Presente) => {
        setEditandoId(presente.id);
        setNovoPresente({
            titulo: presente.titulo,
            imagemUrl: presente.imagemUrl,
            valor: presente.valor.toString()
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePresente = async (id: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este presente?')) return;
        
        try {
            await deleteDoc(doc(db, 'presentes', id));
            setPresentes(presentes.filter(p => p.id !== id));
        } catch (error) {
            console.error("Erro ao excluir presente:", error);
            alert("Erro ao excluir presente.");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Acesso Restrito</h2>
                    <p className="text-center text-slate-500 mb-8">Digite a senha para acessar o painel.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="Sua senha"
                                value={passwordInput}
                                onChange={(e) => {
                                    setPasswordInput(e.target.value);
                                    setLoginError('');
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                            />
                            {loginError && (
                                <p className="text-red-500 text-sm mt-2">{loginError}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Entrar <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <a href="/" className="text-sm text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Voltar ao site
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const totalConfirmados = familias.reduce((acc, familia) => acc + (familia.qtdConfirmados || 0), 0);
    const familiasConfirmadas = familias.filter(f => f.qtdConfirmados > 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Carregando painel...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100">
                    <p className="text-red-500 font-medium mb-4">{error}</p>
                    <button
                        onClick={() => fetchData()}
                        className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 print:bg-white">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm print:hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary-600" />
                            </div>
                            <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">Painel</h1>
                        </div>
                        
                        {/* Tabs Navegação */}
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setActiveTab('convidados')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'convidados' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <span className="flex items-center gap-2"><Users className="w-4 h-4"/> Convidados</span>
                            </button>
                            <button 
                                onClick={() => setActiveTab('presentes')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'presentes' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <span className="flex items-center gap-2"><Gift className="w-4 h-4"/> Presentes</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {activeTab === 'convidados' && (
                            <button
                                onClick={() => window.print()}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Imprimir
                            </button>
                        )}
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:py-0 print:max-w-full">
                
                {activeTab === 'convidados' ? (
                    <>
                        {/* Cabeçalho exclusivo para impressão */}
                        <div className="hidden print:block mb-8 border-b border-slate-300 pb-4">
                            <h1 className="text-2xl font-bold text-slate-800">Lista de Convidados Confirmados</h1>
                            <p className="text-slate-500 mt-1">Total: {totalConfirmados} pessoas | {familiasConfirmadas.length} famílias</p>
                        </div>

                        {/* Dashboard Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 print:hidden">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Confirmado</p>
                                    <p className="text-3xl font-bold text-slate-800">{totalConfirmados}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Famílias Confirmadas</p>
                                    <p className="text-3xl font-bold text-slate-800">{familiasConfirmadas.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* List of Guests */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none print:rounded-none">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 print:hidden">
                                <h2 className="text-lg font-semibold text-slate-800">Convidados Confirmados</h2>
                            </div>

                            {familiasConfirmadas.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 print:text-left print:p-0">
                                    Nenhuma presença confirmada ainda.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 print:divide-slate-300">
                                    {familiasConfirmadas.map((familia) => (
                                        <div key={familia.id} className="p-6 hover:bg-slate-50/50 transition-colors print:p-0 print:py-4 print:break-inside-avoid">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 text-lg">{familia.familia}</h3>
                                                    <p className="text-sm text-slate-500 capitalize">{familia.categoria}</p>
                                                </div>
                                                <div className="inline-flex items-center justify-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full print:bg-transparent print:text-slate-800 print:p-0 print:font-bold">
                                                    {familia.qtdConfirmados} {familia.qtdConfirmados === 1 ? 'pessoa' : 'pessoas'}
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 print:bg-transparent print:border-none print:p-0">
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {familia.convidados.map((convidado, index) => {
                                                        if (!convidado.confirmado) return null;
                                                        return (
                                                            <li key={index} className="flex items-center gap-2 text-slate-700">
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 print:hidden" />
                                                                <span className="print:list-item print:ml-4">{convidado.nome}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    {editandoId ? <Edit2 className="w-5 h-5 text-primary-600"/> : <Plus className="w-5 h-5 text-primary-600"/>} 
                                    {editandoId ? 'Editar Presente' : 'Adicionar Novo Presente'}
                                </h2>
                                {editandoId && (
                                    <button 
                                        onClick={() => {
                                            setEditandoId(null);
                                            setNovoPresente({ titulo: '', imagemUrl: '', valor: '' });
                                        }}
                                        className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                                    >
                                        Cancelar Edição
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSavePresente} className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Título do Presente *</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ex: Cota Passeio de Lancha"
                                            value={novoPresente.titulo}
                                            onChange={(e) => setNovoPresente({...novoPresente, titulo: e.target.value})}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$) *</label>
                                        <input
                                            required
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            placeholder="Ex: 150.00"
                                            value={novoPresente.valor}
                                            onChange={(e) => setNovoPresente({...novoPresente, valor: e.target.value})}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">URL da Foto (Opcional)</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <ImageIcon className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="url"
                                                placeholder="https://..."
                                                value={novoPresente.imagemUrl}
                                                onChange={(e) => setNovoPresente({...novoPresente, imagemUrl: e.target.value})}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-primary-600 text-white font-medium py-2 px-6 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : (editandoId ? <Edit2 className="w-4 h-4"/> : <Plus className="w-4 h-4"/>)}
                                        {editandoId ? 'Atualizar Presente' : 'Salvar Presente'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-slate-800">Presentes Cadastrados</h2>
                                <span className="text-sm text-slate-500">{presentes.length} itens</span>
                            </div>
                            
                            {presentes.length === 0 ? (
                                <div className="p-12 text-center text-slate-500">
                                    Nenhum presente cadastrado na lista.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {presentes.map((presente) => (
                                        <div key={presente.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                            <img 
                                                src={presente.imagemUrl} 
                                                alt={presente.titulo} 
                                                className="w-16 h-16 rounded-lg object-cover bg-slate-200 shrink-0"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-800">{presente.titulo}</h3>
                                                <p className="text-primary-600 font-medium">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(presente.valor)}
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEditClick(presente)}
                                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePresente(presente.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
