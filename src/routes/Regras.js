import React, { useState, useEffect } from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../supabaseClient";

const rulesData = [
  {
    id: "horarios",
    title: "Horários e Pontualidade",
    icon: "⏰",
    items: [
      "É obrigatório chegar no horário estabelecido em contrato, eventuais faltas e atrasos, justificados ou não, devem ser avisados o quanto antes.",
      "É obrigatório respeitar o tempo de intervalo definido em contrato.",
      "É obrigatório o registro de ponto eletrônico 4 (quatro) vezes ao dia:\n1ª - Início do expediente\n2ª - Saída para o intervalo\n3ª - Retorno do intervalo\n4ª - Fim do expediente",
    ],
  },
  {
    id: "atendimento",
    title: "Atendimento ao Cliente",
    icon: "🤝",
    items: [
      "É obrigatório antes de começar a servir algum produto, higienizar as mãos com álcool líquido, álcool em gel ou lavar as mãos com água e sabão. Preferencialmente na frente do cliente e especialmente após pegar no celular/tablet/computador/dinheiro.",
      "É obrigatório realizar o atendimento ao cliente sempre em pé.",
    ],
  },
  {
    id: "apresentacao",
    title: "Apresentação Pessoal",
    icon: "👕",
    items: [
      "É obrigatório estar de uniforme limpo e em bom estado; conferir se a roupa e uniforme estão livres de pelos e cabelos.",
      "É obrigatório estar sempre de cabelo preso e com faixa de cabelo/boné.",
      "É obrigatório estar com as mãos higienizadas, unhas limpas e curtas.",
      "É proibido o uso de anéis e pulseiras.",
    ],
  },
  {
    id: "checklists",
    title: "Checklists",
    icon: "📋",
    items: [
      "É obrigatório a conclusão do checklist de abertura e fechamento todos os dias.",
      "É proibido a saída sem a conclusão do checklist.",
    ],
  },
  {
    id: "celular",
    title: "Uso de Celular e Dispositivos Pessoais",
    icon: "📱",
    items: [
      "É permitido o uso moderado de celular durante a jornada de trabalho na loja, desde que não atrapalhe no atendimento. E somente após a conferência de limpeza e organização da loja.",
      "É proibido a utilização de fones de ouvido durante a jornada de trabalho na loja, sendo recomendado a utilização dos mesmos durante o horário de intervalo caso o volume interfira na loja e no atendimento.",
      "É proibido escutar músicas e sons no celular enquanto existirem clientes dentro da loja.",
    ],
  },
  {
    id: "seguranca",
    title: "Segurança e Conformidade",
    icon: "🔒",
    items: [
      "É proibido se ausentar do posto de trabalho, mesmo que de forma temporária, sem autorização prévia.",
      "É proibido trocar dinheiro por notas menores. Caso solicitado, informar ao cliente que vocês não tem autorização para “trocar” dinheiro.",
      "É proibido aceitar receber um valor em pix e devolver em dinheiro para o cliente.",
      "É proibido permitir a entrada de visitantes ou terceiros dentro das dependências da loja sem autorização prévia.",
      "É proibido retirar das dependências da loja qualquer material, equipamento, documento ou informação.",
    ],
  },
  {
    id: "comportamento",
    title: "Comportamento e Convivência",
    icon: "👥",
    items: [
      "É proibido o consumo de qualquer produto ou insumo, com exceção dos produtos adquiridos por meio de vales ou comprados pelo pdv.",
      "É proibido colocar na boca qualquer utensílio da loja, incluindo, mas não se limitando a, colheres, facas, espátulas ou outros itens utilizados na preparação ou manipulação de alimentos.",
      "É proibido fumar dentro das dependências da loja.",
    ],
  },
  {
    id: "limpeza",
    title: "Limpeza e Organização",
    icon: "✨",
    items: [
      "É obrigatório manter a loja limpa e organizada como um todo.",
    ],
  },
];

function Regras() {
  const { user } = useAuth();
  const [confirmedAt, setConfirmedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    async function checkConfirmation() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('rules_confirmations')
          .select('confirmed_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching confirmation:", error);
        }

        if (data) {
          setConfirmedAt(data.confirmed_at);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    checkConfirmation();
  }, [user]);

  const handleConfirm = async () => {
    if (!user) return;

    setConfirming(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('rules_confirmations')
        .insert([{ user_id: user.id }]);

      if (error) throw error;

      setConfirmedAt(now);
    } catch (err) {
      console.error("Error confirming rules:", err);
      alert("Houve um erro ao confirmar. Tente novamente.");
    } finally {
      setConfirming(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <>
      <Helmet>
        <title>Regras da Loja - Carmella Gelateria</title>
      </Helmet>
      <div className="manual-page">
        <div className="manual-header">
          <h1>Regras da Loja</h1>
          <p><strong>Normas e diretrizes para o funcionamento da loja</strong></p>
        </div>

        <div className="manual-content">
          <div className="manual-intro" style={{ marginBottom: '2rem', backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <span><strong>Versão:</strong> 1.0</span>
              <span><strong>Última modificação:</strong> 01/01/2026</span>
            </div>

            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Bem-vindo às Regras da Carmella Gelateria!</h3>
            <p style={{ lineHeight: '1.6', color: '#444' }}>
              Este documento reúne todas as normas e orientações que devem ser seguidas no dia a dia da loja. Nosso objetivo é garantir um ambiente de trabalho organizado, seguro, respeitoso e alinhado com os valores da Carmella Gelateria.
            </p>
          </div>

          {rulesData.map((section) => (
            <section key={section.id} className="manual-category">
              <h2 className="manual-category-title">
                <span className="manual-category-icon">{section.icon}</span>
                {section.title}
              </h2>
              <ul className="regras-list">
                {section.items.map((item, i) => {
                  let formattedItem = item;

                  // Regular expressions to find the phrases ignoring case but preserving original case is not strictly necessary since the original data has a specific case, but let's be safe or just replace exactly.
                  // Since we are replacing with React nodes, we need to split the string or use a function that parses it.
                  // A simpler approach for React is splitting the string by the keywords and wrapping them.

                  return (
                    <li key={i} style={{ whiteSpace: 'pre-line', marginBottom: '0.5rem' }}>
                      {item.split(/(É obrigatório|É proibido|É permitido)/gi).map((part, index) => {
                        if (part.toLowerCase() === 'é obrigatório') {
                          return <strong key={index}>{part}</strong>;
                        } else if (part.toLowerCase() === 'é proibido') {
                          return <strong key={index} style={{ color: 'red' }}>{part}</strong>;
                        } else if (part.toLowerCase() === 'é permitido') {
                          return <strong key={index}>{part}</strong>;

                        }
                        return part;
                      })}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {!loading && user && (
            <div className="rules-confirmation-section">
              {confirmedAt ? (
                <div className="rules-confirmed-msg">
                  O usuário leu e confirmou as regras na data {formatDate(confirmedAt)}
                </div>
              ) : (
                <>
                  <button
                    className="rules-confirm-btn"
                    onClick={handleConfirm}
                    disabled={confirming}
                  >
                    {confirming ? "Confirmando..." : "Declaro que li e concordo com as regras"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Regras;
