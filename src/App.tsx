import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Clock, ChevronDown, Send, X } from 'lucide-react';

export default function App() {
  // Estado para controlar a animação do envelope
  const [envelopeState, setEnvelopeState] = useState<'closed' | 'opening' | 'opened'>('closed');
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpGuests, setRsvpGuests] = useState('1');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Nomes dos noivos
  const noivo = "Daniel";
  const noiva = "Ana Beatriz";
  const nomeCompletoNoivo = "Daniel Gomes Moura";
  const nomeCompletoNoiva = "Ana Beatriz Pereira dos Santos";
  
  // Data do casamento
  const dataCasamento = new Date('2026-10-20T16:00:00');

  // Lógica do contador
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = dataCasamento.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Bloqueia o scroll da página enquanto o envelope não for aberto
  useEffect(() => {
    if (envelopeState !== 'opened') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [envelopeState]);

  // Função que dispara a animação de abrir o envelope
  const handleOpenEnvelope = () => {
    setEnvelopeState('opening');
    // Espera a animação terminar (2.5 segundos) para sumir com o envelope da tela
    setTimeout(() => {
      setEnvelopeState('opened');
    }, 2500);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    setTimeout(() => {
      setIsRsvpOpen(false);
      setRsvpSubmitted(false);
      setRsvpName('');
      setRsvpGuests('1');
    }, 3000);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
          
          .font-serif { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Montserrat', sans-serif; }
          
          .bg-texture {
            background-color: #fdfbf7;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='#e7e5e4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          }

          /* --- ANIMAÇÕES DO ENVELOPE --- */
          .perspective-container {
            perspective: 1200px;
          }
          .envelope-top {
            clip-path: polygon(0 0, 50% 55%, 100% 0);
            transform-origin: top;
            transition: transform 0.8s ease-in-out;
            z-index: 40;
          }
          .envelope-top.open {
            transform: rotateX(180deg);
            z-index: 10;
          }
          .envelope-left {
            clip-path: polygon(0 0, 50% 55%, 0 100%);
            z-index: 30;
          }
          .envelope-right {
            clip-path: polygon(100% 0, 50% 55%, 100% 100%);
            z-index: 30;
          }
          .envelope-bottom {
            clip-path: polygon(0 100%, 50% 55%, 100% 100%);
            z-index: 30;
          }
          .letter-content {
            transition: transform 1s ease-in-out, opacity 1s ease-in-out;
            transition-delay: 0.6s;
            z-index: 20;
          }
          .letter-content.slide-up {
            transform: translateY(-70%);
          }
          .overlay-fade {
            transition: opacity 1s ease-in-out;
            transition-delay: 1.5s;
          }
          .overlay-fade.open {
            opacity: 0;
            pointer-events: none;
          }
        `}
      </style>

      {/* --- TELA DE ABERTURA (ENVELOPE) --- */}
      {envelopeState !== 'opened' && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-100/95 backdrop-blur-md overlay-fade ${envelopeState === 'opening' ? 'open' : ''}`}>
          
          <div className="relative w-[90vw] max-w-[450px] aspect-[4/3] perspective-container drop-shadow-2xl">
            
            {/* Fundo interno do envelope (mais escuro) */}
            <div className="absolute inset-0 bg-[#dcd6d0] rounded-lg"></div>

            {/* O Convite (Cartão Branco) que desliza para cima */}
            <div className={`absolute left-4 right-4 top-4 bottom-4 bg-white rounded-md shadow-md flex flex-col items-center justify-center p-6 text-center letter-content ${envelopeState === 'opening' ? 'slide-up' : ''}`}>
              <Heart className="text-rose-300 mb-3 w-8 h-8" strokeWidth={1} />
              <h2 className="text-2xl md:text-3xl font-serif text-stone-700 mb-2">{noiva} & {noivo}</h2>
              <div className="w-12 h-px bg-rose-200 my-3"></div>
              <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-stone-400">20 de Outubro de 2026</p>
            </div>

            {/* Abas do Envelope (Laterais e Fundo) */}
            <div className="absolute inset-0 bg-[#e6e0da] rounded-lg envelope-left shadow-[2px_0_5px_rgba(0,0,0,0.02)]"></div>
            <div className="absolute inset-0 bg-[#e6e0da] rounded-lg envelope-right shadow-[-2px_0_5px_rgba(0,0,0,0.02)]"></div>
            <div className="absolute inset-0 bg-[#f0ece7] rounded-lg envelope-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"></div>

            {/* Aba Superior (Que abre) */}
            <div className={`absolute inset-0 bg-[#ebe6e1] rounded-lg envelope-top shadow-[0_2px_10px_rgba(0,0,0,0.05)] ${envelopeState === 'opening' ? 'open' : ''}`}></div>

            {/* Selo de Cera / Botão de Abrir */}
            <button 
              onClick={handleOpenEnvelope}
              disabled={envelopeState !== 'closed'}
              className={`absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-rose-400 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-rose-500 hover:shadow-rose-400/50 transition-all duration-300 z-50 border-2 border-rose-300/50 cursor-pointer ${envelopeState === 'opening' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
              <div className="absolute inset-1 border border-rose-300/30 rounded-full"></div>
              <span className="font-serif italic text-2xl font-medium tracking-wide">A<span className="text-xl">&</span>D</span>
            </button>

          </div>
          
          {/* Texto de incentivo */}
          <div className={`mt-16 text-stone-500 font-serif italic text-xl transition-opacity duration-500 ${envelopeState === 'opening' ? 'opacity-0' : 'opacity-100'}`}>
            Tem um convite para ti...
          </div>
        </div>
      )}

      {/* --- CONTEÚDO PRINCIPAL DO SITE --- */}
      <div className={`min-h-screen bg-texture text-stone-800 font-sans selection:bg-rose-200 ${envelopeState !== 'opened' ? 'h-screen overflow-hidden' : ''}`}>
        
        {/* --- HERO SECTION --- */}
        <header className="relative flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white/80 backdrop-blur-sm border-b border-stone-200">
          <div className="absolute top-10 w-full flex justify-center">
             <Heart className="text-rose-200 w-8 h-8 animate-pulse" strokeWidth={1.5} />
          </div>

          <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-rose-400 mb-8 font-medium">
            Com a bênção de Deus e de nossos pais
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-stone-700 mb-6 leading-tight flex flex-col md:flex-row items-center gap-4">
            <span className="drop-shadow-sm">{noiva}</span>
            <span className="text-rose-300 italic text-5xl md:text-7xl lg:text-8xl mx-4 font-light">&amp;</span>
            <span className="drop-shadow-sm">{noivo}</span>
          </h1>
          
          <p className="text-lg md:text-xl font-light text-stone-500 mb-12 max-w-2xl leading-relaxed mt-4">
            Temos a imensa alegria de convidar-vos para celebrar o início da nossa nova vida juntos.
          </p>
          
          <div className="w-24 h-[1px] bg-rose-300 mb-12"></div>
          
          <p className="text-2xl md:text-3xl text-stone-600 font-serif italic mb-2">
            15 de Novembro de 2026
          </p>
          
          <div className="absolute bottom-10 animate-bounce cursor-pointer text-stone-400 hover:text-rose-400 transition-colors">
             <ChevronDown size={32} strokeWidth={1} />
          </div>
        </header>

        {/* --- CONTADOR --- */}
        <section className="py-16 bg-rose-50/50 border-y border-rose-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-sm tracking-[0.3em] uppercase text-rose-400 mb-10 font-semibold">Contagem Decrescente</h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { label: 'Dias', value: timeLeft.days },
                { label: 'Horas', value: timeLeft.hours },
                { label: 'Minutos', value: timeLeft.minutes },
                { label: 'Segundos', value: timeLeft.seconds },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center bg-white p-6 rounded-full w-28 h-28 md:w-32 md:h-32 justify-center shadow-sm border border-stone-100">
                  <span className="text-3xl md:text-4xl font-serif text-stone-700 mb-1">{item.value}</span>
                  <span className="text-xs uppercase tracking-wider text-rose-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- DETALHES DO EVENTO --- */}
        <section className="py-24 px-6 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-700 mb-4">Quando & Onde</h2>
          <p className="text-stone-500 mb-16 font-light">Os detalhes para nos acompanharem neste dia especial.</p>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Cerimónia */}
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-200 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="flex justify-center mb-6 text-rose-300">
                <Clock size={40} strokeWidth={1} />
              </div>
              <h3 className="text-3xl text-stone-700 font-serif mb-6">A Cerimónia</h3>
              <p className="mb-6 text-stone-800 font-medium text-lg border-b border-stone-100 pb-4 inline-block">Às 16:00 horas</p>
              <p className="text-stone-500 leading-relaxed mb-8 font-light">
                Igreja Menino Jesus de Praga<br />
                Constatino Nery<br />
                Manaus - Amazonas
              </p>
              <button className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-500 transition-colors text-sm font-semibold tracking-wider uppercase">
                <MapPin size={16} /> Ver no Mapa
              </button>
            </div>

            {/* Receção */}
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-200 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="flex justify-center mb-6 text-rose-300">
                <Calendar size={40} strokeWidth={1} />
              </div>
              <h3 className="text-3xl text-stone-700 font-serif mb-6">A Receção</h3>
              <p className="mb-6 text-stone-800 font-medium text-lg border-b border-stone-100 pb-4 inline-block">Às 18:00 horas</p>
              <p className="text-stone-500 leading-relaxed mb-8 font-light">
                Quinta dos Jardins<br />
                Avenida das Árvores, 456 - Bosque<br />
                Cidade - Estado
              </p>
              <button className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-stone-50 text-stone-600 hover:bg-rose-50 hover:text-rose-500 transition-colors text-sm font-semibold tracking-wider uppercase">
                <MapPin size={16} /> Ver no Mapa
              </button>
            </div>
          </div>
        </section>

        {/* --- RSVP SECTION --- */}
        <section className="bg-stone-800 text-stone-100 py-24 px-6 text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern)" />
              </svg>
           </div>
           
           <div className="relative z-10 max-w-2xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Confirmar Presença</h2>
             <p className="text-stone-300 mb-10 text-lg font-light leading-relaxed">
               A tua presença é o nosso maior presente. Por favor, confirma a tua participação até ao dia 15 de Outubro para organizarmos tudo com muito carinho.
             </p>
             <button 
               onClick={() => setIsRsvpOpen(true)}
               className="bg-rose-300 text-stone-900 px-10 py-4 rounded-full hover:bg-rose-200 transition duration-300 font-semibold tracking-wider uppercase text-sm shadow-lg hover:shadow-rose-300/20 hover:-translate-y-1"
             >
               Confirmar Agora (RSVP)
             </button>
           </div>
        </section>

        {/* --- RODAPÉ --- */}
        <footer className="bg-stone-900 text-stone-400 py-16 text-center text-sm px-6">
          <Heart className="mx-auto text-stone-600 mb-6 w-6 h-6" />
          <p className="font-serif text-2xl mb-4 text-stone-300">{noiva} & {noivo}</p>
          <p className="font-light mb-1">{nomeCompletoNoiva}</p>
          <p className="font-light mb-8">{nomeCompletoNoivo}</p>
          <p className="text-xs tracking-widest uppercase text-stone-600">Com amor, 2026</p>
        </footer>

        {/* --- MODAL DE RSVP --- */}
        {isRsvpOpen && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-fade-in-up">
              <button 
                onClick={() => setIsRsvpOpen(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-serif text-stone-700 mb-2 text-center">RSVP</h3>
              <p className="text-stone-500 text-center text-sm mb-8 font-light">Estamos felizes por partilhar este momento.</p>

              {rsvpSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                    <Heart size={32} fill="currentColor" />
                  </div>
                  <h4 className="text-xl text-stone-800 font-serif mb-2">Obrigado!</h4>
                  <p className="text-stone-500">A tua presença foi confirmada com sucesso.</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all bg-stone-50"
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Acompanhantes (incluindo tu)</label>
                    <select 
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all bg-stone-50"
                    >
                      <option value="1">Apenas eu (1)</option>
                      <option value="2">2 Pessoas</option>
                      <option value="3">3 Pessoas</option>
                      <option value="4">4 Pessoas</option>
                      <option value="5">5 Pessoas</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full mt-6 bg-stone-800 text-white py-4 rounded-xl hover:bg-stone-700 transition duration-300 font-semibold flex items-center justify-center gap-2 shadow-md"
                  >
                    <Send size={18} /> Enviar Confirmação
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
        
      </div>
    </>
  );
}