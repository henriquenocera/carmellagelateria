import { useState, useEffect } from 'react';

function ContadorNotasMoedas({ onTotalChange }) {
  const [denominacoes, setDenominacoes] = useState(() => {
    const saved = localStorage.getItem('contador_notas_moedas');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // migração: garantir que valores sejam strings (evita exibir 0 quando vazio)
        const normalized = {};
        for (const k in parsed) normalized[k] = parsed[k] === 0 ? "" : String(parsed[k] ?? "");
        // garantir todas as chaves existem
        const defaults = { hundred: "", fifty: "", twenty: "", ten: "", five: "", two: "", oneReal: "", fiftyCents: "", twentyFiveCents: "", tenCents: "", fiveCents: "", oneCent: "" };
        return { ...defaults, ...normalized };
      } catch {}
    }
    return {
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
    };
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    localStorage.setItem('contador_notas_moedas', JSON.stringify(denominacoes));
    calculateTotal();
  }, [denominacoes]);

  const handleChange = (tipo, valor) => {
    // permitir apenas números inteiros >=0 ou vazio
    if (valor === "") {
      setDenominacoes(prev => ({ ...prev, [tipo]: "" }));
      return;
    }
    // remover caracteres não numéricos
    const onlyDigits = valor.replace(/\D/g, "");
    if (onlyDigits === "") {
      setDenominacoes(prev => ({ ...prev, [tipo]: "" }));
      return;
    }
    const num = parseInt(onlyDigits, 10);
    if (isNaN(num) || num < 0) return;
    // limitar a 9999 para não estourar layout
    const clamped = Math.min(num, 99999);
    setDenominacoes(prev => ({ ...prev, [tipo]: String(clamped) }));
  };

  const calculateTotal = () => {
    const toQty = (v) => parseInt(v) || 0;
    const calculo =
      (toQty(denominacoes.hundred) * 100) +
      (toQty(denominacoes.fifty) * 50) +
      (toQty(denominacoes.twenty) * 20) +
      (toQty(denominacoes.ten) * 10) +
      (toQty(denominacoes.five) * 5) +
      (toQty(denominacoes.two) * 2) +
      (toQty(denominacoes.oneReal) * 1) +
      (toQty(denominacoes.fiftyCents) * 0.50) +
      (toQty(denominacoes.twentyFiveCents) * 0.25) +
      (toQty(denominacoes.tenCents) * 0.10) +
      (toQty(denominacoes.fiveCents) * 0.05) +
      (toQty(denominacoes.oneCent) * 0.01);

    setTotal(calculo);
    if (onTotalChange) {
      onTotalChange({
        total: calculo,
        denominacoes: denominacoes
      });
    }
  };

  const inputStyle = {
    width: '100%',
    height: '32px',
    padding: '6px 10px',
    border: '1px solid #e7ddd0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    color: '#3e3e3e',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    color: '#8a7360',
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: 1
  };

  return (
    <div style={{
      padding: '18px 14px 14px',
      maxWidth: '420px',
      width: '100%',
      margin: '0 auto 16px',
      backgroundColor: '#fdfbf3',
      border: '1px solid #f0e6d8',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      boxSizing: 'border-box'
    }}>
      <h2 style={{
        color: '#9c7a4a',
        textAlign: 'center',
        margin: '0 0 16px 0',
        fontSize: '16px',
        fontWeight: 500,
        letterSpacing: '0.2px',
        borderBottom: '1.5px solid #b08968',
        paddingBottom: '10px',
        lineHeight: 1.2
      }}>
        Contador de Cédulas e Moedas
      </h2>

      <div style={{ display: 'flex', gap: '16px' }}>
        {/* Cédulas */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: '#9c7a4a', margin: '0 0 10px 0', fontSize: '13px', fontWeight: 600 }}>Cédulas</h3>
          {[
            { label: 'R$ 100,00', tipo: 'hundred' },
            { label: 'R$ 50,00', tipo: 'fifty' },
            { label: 'R$ 20,00', tipo: 'twenty' },
            { label: 'R$ 10,00', tipo: 'ten' },
            { label: 'R$ 5,00', tipo: 'five' },
            { label: 'R$ 2,00', tipo: 'two' },
          ].map(({ label, tipo }) => (
            <div key={tipo} style={{ marginBottom: '10px' }}>
              <label style={labelStyle}>{label}</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder=""
                value={denominacoes[tipo]}
                onChange={(e) => handleChange(tipo, e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#a17550'; e.target.style.boxShadow = '0 0 0 3px rgba(161,117,80,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e7ddd0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          ))}
        </div>

        {/* Moedas */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: '#9c7a4a', margin: '0 0 10px 0', fontSize: '13px', fontWeight: 600 }}>Moedas</h3>
          {[
            { label: 'R$ 1,00', tipo: 'oneReal' },
            { label: 'R$ 0,50', tipo: 'fiftyCents' },
            { label: 'R$ 0,25', tipo: 'twentyFiveCents' },
            { label: 'R$ 0,10', tipo: 'tenCents' },
            { label: 'R$ 0,05', tipo: 'fiveCents' },
            { label: 'R$ 0,01', tipo: 'oneCent' },
          ].map(({ label, tipo }) => (
            <div key={tipo} style={{ marginBottom: '10px' }}>
              <label style={labelStyle}>{label}</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder=""
                value={denominacoes[tipo]}
                onChange={(e) => handleChange(tipo, e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#a17550'; e.target.style.boxShadow = '0 0 0 3px rgba(161,117,80,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e7ddd0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '8px',
        padding: '12px 14px',
        backgroundColor: '#a4754a',
        borderRadius: '8px',
        color: 'white',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '0.3px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
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
