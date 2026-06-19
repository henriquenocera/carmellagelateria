import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'react-icons/bs';

const ChecklistReturnPopup = () => {
  const [show, setShow] = useState(false);
  const [returnPath, setReturnPath] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a stored checklist path
    const storedPath = localStorage.getItem('returnToChecklist');
    const expiry = localStorage.getItem('returnToChecklistExpiry');

    if (storedPath && expiry) {
      if (Date.now() > Number(expiry)) {
        localStorage.removeItem('returnToChecklist');
        localStorage.removeItem('returnToChecklistExpiry');
        setShow(false);
      } else if (location.pathname !== storedPath) {
        setReturnPath(storedPath);
        setShow(true);

        // Auto hide after expiry
        const timeout = setTimeout(() => {
          setShow(false);
          localStorage.removeItem('returnToChecklist');
          localStorage.removeItem('returnToChecklistExpiry');
        }, Number(expiry) - Date.now());
        
        return () => clearTimeout(timeout);
      } else {
        // We are on the checklist page itself, hide popup
        setShow(false);
      }
    } else {
      setShow(false);
    }
  }, [location]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 9999,
      border: '1px solid #e2e8f0',
      maxWidth: '300px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8c6748', fontWeight: 'bold', fontSize: '15px' }}>
        <Icons.BsInfoCircleFill /> Tarefa pendente
      </div>
      <p style={{ margin: 0, color: '#444', fontSize: '14px', lineHeight: '1.4' }}>
        Você foi redirecionado do checklist. Deseja retornar ao checklist para continuar?
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
        <button 
          onClick={() => {
            localStorage.removeItem('returnToChecklist');
            localStorage.removeItem('returnToChecklistExpiry');
            setShow(false);
          }}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', backgroundColor: '#f8f9fa', borderRadius: '8px', cursor: 'pointer', color: '#555', fontWeight: '600' }}
        >
          Não, fechar
        </button>
        <button 
          onClick={() => {
            navigate(returnPath);
            localStorage.removeItem('returnToChecklist');
            localStorage.removeItem('returnToChecklistExpiry');
            setShow(false);
          }}
          style={{ flex: 1, padding: '10px', border: 'none', backgroundColor: '#a37a57', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          Sim, retornar
        </button>
      </div>
    </div>
  );
};

export default ChecklistReturnPopup;
