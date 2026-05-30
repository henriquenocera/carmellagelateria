import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { sendWhatsAppMessage } from '../utils/whatsappCloudService.ts';
import * as Icons from 'react-icons/bs';

function TesteWhatsApp() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !message) {
      setResult({ type: 'error', text: 'Preencha o telefone e a mensagem.' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      await sendWhatsAppMessage(phone, message);
      setResult({ type: 'success', text: 'Mensagem enviada com sucesso! Verifique o WhatsApp.' });
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setResult({ type: 'error', text: err.message || 'Erro ao enviar a mensagem.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Teste WhatsApp Cloud API</title>
      </Helmet>
      
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #f3f4f6', paddingBottom: '16px' }}>
          <Icons.BsWhatsapp style={{ fontSize: '2rem', color: '#25D366' }} />
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#1f2937' }}>Teste WhatsApp Cloud API</h1>
        </div>

        <p style={{ color: '#4b5563', marginBottom: '24px', lineHeight: '1.5' }}>
          Utilize este painel para enviar uma mensagem manual de teste pela API oficial da Meta. Lembre-se que você só pode enviar mensagens livres para números que abriram janela de 24h com seu bot recentemente.
        </p>

        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Número do Destinatário</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 11999999999"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }}
            />
            <small style={{ color: '#6b7280', display: 'block', marginTop: '4px' }}>Digite com DDD (somente números)</small>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>Mensagem</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem de teste aqui..."
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              backgroundColor: loading ? '#9ca3af' : '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? (
              <>
                <Icons.BsArrowClockwise className="spin" />
                Enviando...
              </>
            ) : (
              <>
                <Icons.BsSend />
                Enviar Mensagem
              </>
            )}
          </button>
        </form>

        {result && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: result.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: result.type === 'success' ? '#065f46' : '#b91c1c',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {result.type === 'success' ? <Icons.BsCheckCircleFill /> : <Icons.BsExclamationTriangleFill />}
            <span>{result.text}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default TesteWhatsApp;
