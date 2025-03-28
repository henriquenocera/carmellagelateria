import { useState, useEffect } from 'react';

function ContadorNotasMoedas() {
  const [denominacoes, setDenominacoes] = useState({
    hundred: "",
    fifty: "",
    twenty: "",
    ten: "",
    five: "",
    two: "",
    oneReal: "",
    fiftyCents: "",
    twentyFiveCents: "",
    tenCents: "",
    fiveCents: "",
    oneCent: ""
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [denominacoes]);

  const handleChange = (tipo, valor) => {
    const valorNumerico = Math.max(parseInt(valor) || 0, 0);
    setDenominacoes(prev => ({ ...prev, [tipo]: valorNumerico }));
  };

  const calculateTotal = () => {
    const calculo =
      (denominacoes.hundred * 100) +
      (denominacoes.fifty * 50) +
      (denominacoes.twenty * 20) +
      (denominacoes.ten * 10) +
      (denominacoes.five * 5) +
      (denominacoes.two * 2) +
      (denominacoes.oneReal * 1) +
      (denominacoes.fiftyCents * 0.50) +
      (denominacoes.twentyFiveCents * 0.25) +
      (denominacoes.tenCents * 0.10) +
      (denominacoes.fiveCents * 0.05) +
      (denominacoes.oneCent * 0.01);

    setTotal(calculo);
  };

  return (
    <div style={{
      padding: '25px',
      maxWidth: '500px',
      marginBottom: '20px',
      backgroundColor: '#f5f0eb',
      borderRadius: '10px',
      boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        color: '#a17550',
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '1.8em',
        borderBottom: '2px solid #a17550',
        paddingBottom: '10px'
      }}>
        Contador de Cédulas e Moedas
      </h2>

      <div style={{ display: 'flex', gap: '25px' }}>
        {/* Notas */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#a17550', marginBottom: '15px' }}>Cédulas</h3>
          {[
            { label: 'R$ 100,00', tipo: 'hundred' },
            { label: 'R$ 50,00', tipo: 'fifty' },
            { label: 'R$ 20,00', tipo: 'twenty' },
            { label: 'R$ 10,00', tipo: 'ten' },
            { label: 'R$ 5,00', tipo: 'five' },
            { label: 'R$ 2,00', tipo: 'two' },
          ].map(({ label, tipo }) => (
            <div key={tipo} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>{label}</label>
              <input
                type="number"
                min="0"
                value={denominacoes[tipo]}
                onChange={(e) => handleChange(tipo, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#a17550'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          ))}
        </div>

        {/* Moedas */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#a17550', marginBottom: '15px' }}>Moedas</h3>
          {[
            { label: 'R$ 1,00', tipo: 'oneReal' },
            { label: 'R$ 0,50', tipo: 'fiftyCents' },
            { label: 'R$ 0,25', tipo: 'twentyFiveCents' },
            { label: 'R$ 0,10', tipo: 'tenCents' },
            { label: 'R$ 0,05', tipo: 'fiveCents' },
            { label: 'R$ 0,01', tipo: 'oneCent' },
          ].map(({ label, tipo }) => (
            <div key={tipo} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>{label}</label>
              <input
                type="number"
                min="0"
                value={denominacoes[tipo]}
                onChange={(e) => handleChange(tipo, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#a17550'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#a17550',
        borderRadius: '8px',
        color: 'white',
        textAlign: 'center',
        fontSize: '1.5em',
        fontWeight: '600',
        letterSpacing: '0.5px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        Total: R$ {total.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </div>
    </div>
  );
}

export default ContadorNotasMoedas;