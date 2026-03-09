import React from "react";
import "../css/Home.css";
import { Helmet } from "react-helmet";

function RegulamentoInterno() {
  return (
    <>
      <Helmet>
        <title>Regulamento Interno - Carmella Gelateria</title>
      </Helmet>
      <div className="manual-page">
        <div className="manual-header">
          <h1>Regulamento Interno</h1>
        </div>

        <div className="manual-content">
          {/* Seção 1 */}
          <section className="manual-category">
            <h2 className="manual-category-title">
              <span className="manual-category-icon">📘</span>
              MH EMPREENDIMENTOS
Carmella Gelateria

            </h2>
  
          </section>

          {/* Seção 2 */}
          <section className="manual-category">
            <h2 className="manual-category-title">
              <span className="manual-category-icon">🕒</span>
              2. Jornada de trabalho e pontualidade
            </h2>
          
          </section>

          {/* Seção 3 */}
          <section className="manual-category">
            <h2 className="manual-category-title">
              <span className="manual-category-icon">👕</span>
              3. Apresentação pessoal e uniforme
            </h2>
            <ol className="regras-list">
              <li>
                Item de exemplo sobre uso obrigatório de uniforme e cuidados de
                higiene.
              </li>
              <li>
                Item de exemplo sobre acessórios permitidos ou proibidos.
              </li>
            </ol>
          </section>

          {/* Seção 4 */}
          <section className="manual-category">
            <h2 className="manual-category-title">
              <span className="manual-category-icon">🍨</span>
              4. Atendimento ao cliente e conduta
            </h2>
            <ol className="regras-list">
              <li>
                Item de exemplo sobre postura no atendimento, linguagem e
                cordialidade.
              </li>
              <li>
                Item de exemplo sobre uso de celular, conversas particulares e
                comportamento no balcão.
              </li>
            </ol>
          </section>

          {/* Seção 5 */}
          <section className="manual-category">
            <h2 className="manual-category-title">
              <span className="manual-category-icon">✨</span>
              5. Limpeza, higiene e segurança alimentar
            </h2>
            <ol className="regras-list">
              <li>
                Item de exemplo sobre rotinas de limpeza de equipamentos e
                balcões.
              </li>
              <li>
                Item de exemplo sobre higienização de mãos, luvas e utensílios.
              </li>
              <li>
                Item de exemplo sobre armazenamento correto de produtos e
                validade.
              </li>
            </ol>
          </section>

          {/* Seção 6 */}
          <section className="manual-category">
            <h2 className="manual-category-title">
              <span className="manual-category-icon">⚖️</span>
              6. Penalidades e disposições finais
            </h2>
            <p>
              Espaço para descrever consequências em caso de descumprimento das
              regras, bem como informações sobre revisão do regulamento e
              vigência. Substitua este texto pelo trecho final do seu
              regulamento interno.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default RegulamentoInterno;

