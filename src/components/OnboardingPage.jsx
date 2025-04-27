import React, { useState } from 'react';
import '../css/OnboardingPage.css';

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      id: 1,
      title: "Bem-vindo à Carmella Gelateria!",
      content: (
        <div className="welcome-content">
          <h2>Bem-vindo à nossa equipe!</h2>
          <p>Estamos muito felizes em ter você conosco. Este guia irá ajudá-lo a se familiarizar com nossa loja e procedimentos.</p>
          <div className="welcome-image">
            <img src="/logo.png" alt="Carmella Gelateria Logo" />
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Horários e Uniforme",
      content: (
        <div className="schedule-content">
          <h3>Horários de Trabalho</h3>
          <ul>
            <li>Turno da manhã: 8h às 14h</li>
            <li>Turno da tarde: 14h às 20h</li>
            <li>Turno da noite: 20h às 23h</li>
          </ul>
          <h3>Uniforme</h3>
          <ul>
            <li>Camiseta da loja (fornecida)</li>
            <li>Calça jeans ou preta</li>
            <li>Tênis preto ou branco</li>
            <li>Avental (fornecido)</li>
            <li>Touca (fornecida)</li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      title: "Procedimentos de Abertura",
      content: (
        <div className="procedures-content">
          <h3>Checklist de Abertura</h3>
          <ul>
            <li>Limpeza da vitrine</li>
            <li>Ligação dos equipamentos</li>
            <li>Contagem do malote</li>
            <li>Preparação dos produtos</li>
            <li>Verificação do estoque</li>
          </ul>
          <p>Você pode acessar o checklist completo no sistema da loja.</p>
        </div>
      )
    },
    {
      id: 4,
      title: "Atendimento ao Cliente",
      content: (
        <div className="customer-service-content">
          <h3>Padrões de Atendimento</h3>
          <ul>
            <li>Sempre cumprimentar o cliente com um sorriso</li>
            <li>Manter postura profissional</li>
            <li>Conhecer o cardápio e produtos</li>
            <li>Tratar o cliente pelo nome quando possível</li>
            <li>Agradecer após cada atendimento</li>
          </ul>
        </div>
      )
    },
    {
      id: 5,
      title: "Procedimentos de Fechamento",
      content: (
        <div className="closing-procedures-content">
          <h3>Checklist de Fechamento</h3>
          <ul>
            <li>Limpeza geral da loja</li>
            <li>Fechamento do caixa</li>
            <li>Desligamento dos equipamentos</li>
            <li>Verificação de segurança</li>
            <li>Preparação do malote</li>
          </ul>
          <p>Você pode acessar o checklist completo no sistema da loja.</p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    // Here you can add logic to mark the onboarding as completed
    alert('Parabéns! Você completou o processo de onboarding.');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-progress">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`progress-step ${currentStep === step.id ? 'active' : ''} ${
              completedSteps.includes(step.id) ? 'completed' : ''
            }`}
          >
            <div className="step-number">{step.id}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <div className="onboarding-content">
        <h2>{steps[currentStep - 1].title}</h2>
        {steps[currentStep - 1].content}
      </div>

      <div className="onboarding-navigation">
        {currentStep > 1 && (
          <button onClick={handlePrevious} className="nav-button prev">
            Voltar
          </button>
        )}
        {currentStep < steps.length ? (
          <button onClick={handleNext} className="nav-button next">
            Próximo
          </button>
        ) : (
          <button onClick={handleComplete} className="nav-button complete">
            Concluir
          </button>
        )}
      </div>
    </div>
  );
}

export default OnboardingPage; 