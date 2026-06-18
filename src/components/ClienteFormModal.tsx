import React, { useState, useEffect } from "react";
import * as Icons from "react-icons/bs";
import axios from "axios";
import supabase from "../services/supabase-client";

interface ClienteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: any;
  onSuccess: () => void;
}

const STATUS_OPTIONS = [
  "Lead",
  "Em Contato",
  "Negócio Fechado",
  "Perdido",
];

const TIPOS_OPTIONS = [
  "Restaurante", 
  "Lanchonete", 
  "Hotel", 
  "Bar", 
  "Pizzaria", 
  "Hamburgueria", 
  "Cafeteria", 
  "Padaria", 
  "Eventos", 
  "Parque", 
  "Outros"
];

const ClienteFormModal: React.FC<ClienteFormModalProps> = ({ isOpen, onClose, cliente, onSuccess }) => {
  const [saving, setSaving] = useState(false);

  // States
  const [ativo, setAtivo] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [status, setStatus] = useState("Lead");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Novos campos
  const [tipo, setTipo] = useState("Restaurante");
  const [nomeContato, setNomeContato] = useState("");
  const [dataPrimeiroContato, setDataPrimeiroContato] = useState("");
  const [dataUltimoContato, setDataUltimoContato] = useState("");
  const [dataProximoContato, setDataProximoContato] = useState("");

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (cliente) {
        setAtivo(cliente.ativo ?? true);
        setNome(cliente.nome || "");
        setEmail(cliente.email || "");
        setTelefone(cliente.telefone || "");
        setCpfCnpj(cliente.cpf_cnpj || "");
        setEndereco(cliente.endereco || "");
        setObservacoes(cliente.observacoes || "");
        setStatus(cliente.status || "Lead");
        setNumero("");
        setCep(cliente.cep || "");
        setLatitude(cliente.latitude || null);
        setLongitude(cliente.longitude || null);
        setGeocodeResult(cliente.latitude ? "success" : null);

        setTipo(cliente.tipo || "Restaurante");
        setNomeContato(cliente.nome_contato || "");
        setDataPrimeiroContato(cliente.data_primeiro_contato || "");
        setDataUltimoContato(cliente.data_ultimo_contato || "");
        setDataProximoContato(cliente.data_proximo_contato || "");
      } else {
        setAtivo(true);
        setNome("");
        setEmail("");
        setTelefone("");
        setCpfCnpj("");
        setEndereco("");
        setObservacoes("");
        setStatus("Lead");
        setNumero("");
        setCep("");
        setLatitude(null);
        setLongitude(null);
        setGeocodeResult(null);

        setTipo("Restaurante");
        setNomeContato("");
        setDataPrimeiroContato("");
        setDataUltimoContato("");
        setDataProximoContato("");
      }
    }
  }, [isOpen, cliente]);

  if (!isOpen) return null;

  async function getCoordinates(address: string, cepCode: string) {
    try {
      let searchAddress = address;
      if (cepCode.trim()) {
        searchAddress += `, ${cepCode.trim()}`;
      } else if (!searchAddress.toLowerCase().includes("curitiba") && !searchAddress.toLowerCase().includes("pr")) {
        searchAddress += ", Curitiba, PR, Brasil";
      }

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`
      );
      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      return null;
    }
  }

  const buscarCEP = async () => {
    const cepClean = cep.replace(/\D/g, "");
    if (cepClean.length !== 8) {
      alert("Digite um CEP válido com 8 dígitos.");
      return;
    }

    setGeocodeResult(null);
    setIsGeocoding(true);
    
    try {
      const viaCepRes = await axios.get(`https://viacep.com.br/ws/${cepClean}/json/`);
      if (viaCepRes.data.erro) {
        setGeocodeResult("error");
        setIsGeocoding(false);
        return;
      }
      
      const { logradouro, bairro, localidade, uf } = viaCepRes.data;
      const enderecoCompleto = `${logradouro}, ${bairro}, ${localidade} - ${uf}`;
      setEndereco(enderecoCompleto);
      
      const coords = await getCoordinates(`${logradouro}, ${localidade}, ${uf}`, cepClean);
      if (coords) {
        setLatitude(coords.lat);
        setLongitude(coords.lon);
        setGeocodeResult("success");
      } else {
        setLatitude(null);
        setLongitude(null);
        setGeocodeResult("success");
      }
    } catch (err) {
      console.error(err);
      setGeocodeResult("error");
    } finally {
      setIsGeocoding(false);
    }
  };

  const atualizarCoordenadas = async () => {
    if (!endereco) {
      alert("Preencha o endereço completo primeiro.");
      return;
    }
    setGeocodeResult(null);
    setIsGeocoding(true);
    
    try {
      let enderecoAtual = endereco;
      if (numero && !endereco.includes(`Nº ${numero}`)) {
        enderecoAtual = `${endereco}, Nº ${numero}`;
        setEndereco(enderecoAtual);
      }

      const enderecoParaBusca = enderecoAtual.replace(", Nº ", ", ");
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(enderecoParaBusca)}&key=${apiKey}`
      );

      if (response.data && response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
        setGeocodeResult("success");
      } else {
        setGeocodeResult("error");
        alert("Não foi possível encontrar este endereço no mapa do Google. Você pode inserir a Latitude e Longitude manualmente.");
      }
    } catch (err) {
      console.error(err);
      setGeocodeResult("error");
    } finally {
      setIsGeocoding(false);
    }
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Preencha o nome do cliente.");
      return;
    }

    // Evita duplicar o número se o usuário já tiver clicado no botão ou preenchido manualmente
    const enderecoFinal = numero && !endereco.includes(`Nº ${numero}`) ? `${endereco}, Nº ${numero}` : endereco;

    const payload = {
      ativo,
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      cpf_cnpj: cpfCnpj.trim(),
      endereco: enderecoFinal.trim(),
      observacoes: observacoes.trim(),
      status: status,
      cep: cep.trim(),
      latitude: latitude,
      longitude: longitude,
      tipo: tipo,
      nome_contato: nomeContato.trim(),
      data_primeiro_contato: dataPrimeiroContato || null,
      data_ultimo_contato: dataUltimoContato || null,
      data_proximo_contato: dataProximoContato || null,
    };

    try {
      setSaving(true);
      
      if (cliente?.id) {
        const { error } = await supabase
          .from("clientes_food_service")
          .update(payload)
          .eq("id", cliente.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("clientes_food_service")
          .insert([payload]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      alert(err.message || "Erro ao salvar cliente");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
            {cliente?.id ? "Editar Cliente" : "Cadastrar Novo Cliente"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
            <Icons.BsX />
          </button>
        </div>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome Completo / Razão Social *</label>
              <input
                type="text"
                required
                className="frequencia-select"
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Tipo</label>
              <select
                className="frequencia-select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                {TIPOS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Status</label>
              <select
                className="frequencia-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Pessoa de Contato</label>
              <input
                type="text"
                className="frequencia-select"
                placeholder="Ex: Maria"
                value={nomeContato}
                onChange={(e) => setNomeContato(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Telefone</label>
              <input
                type="text"
                className="frequencia-select"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>E-mail</label>
              <input
                type="email"
                className="frequencia-select"
                placeholder="cliente@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Data 1º Contato</label>
              <input
                type="date"
                className="frequencia-select"
                value={dataPrimeiroContato}
                onChange={(e) => setDataPrimeiroContato(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Data Último Contato</label>
              <input
                type="date"
                className="frequencia-select"
                value={dataUltimoContato}
                onChange={(e) => setDataUltimoContato(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Data Próx. Contato</label>
              <input
                type="date"
                className="frequencia-select"
                value={dataProximoContato}
                onChange={(e) => setDataProximoContato(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>CEP</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="frequencia-select"
                  placeholder="Ex: 80000-000"
                  value={cep}
                  onChange={(e) => {
                    setCep(e.target.value);
                    setGeocodeResult(null);
                  }}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={buscarCEP}
                  disabled={isGeocoding}
                  className="primary-btn"
                  style={{ margin: 0, padding: "0 16px", whiteSpace: "nowrap" }}
                >
                  {isGeocoding ? "Buscando..." : "Buscar CEP"}
                </button>
              </div>
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Número</label>
              <input
                type="text"
                className="frequencia-select"
                placeholder="Ex: 110"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Endereço Completo</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                className="frequencia-select"
                placeholder="Preenchido automaticamente pelo CEP"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                onClick={atualizarCoordenadas}
                disabled={isGeocoding}
                className="primary-btn"
                style={{ margin: 0, padding: "0 16px", whiteSpace: "nowrap", backgroundColor: "var(--secondary-color)" }}
              >
                {isGeocoding ? "Buscando..." : "Localizar no Mapa"}
              </button>
            </div>
            {geocodeResult === "success" && (
              <div style={{ marginTop: "8px", color: "#10b981", fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                <Icons.BsCheckCircleFill /> Endereço validado no mapa!
              </div>
            )}
            {geocodeResult === "error" && (
              <div style={{ marginTop: "8px", color: "#ef4444", fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                <Icons.BsXCircleFill /> Coordenadas não encontradas.
              </div>
            )}
            {endereco && nome && (
              <div style={{ marginTop: "12px", fontSize: "0.95rem" }}>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nome} ${endereco}`)}`} target="_blank" rel="noopener noreferrer" style={{ color: "#4285F4", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600, textDecoration: "none" }}>
                  <Icons.BsGoogle /> Abrir {nome} no Google Maps
                </a>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Latitude</label>
              <input
                type="number"
                step="any"
                className="frequencia-select"
                placeholder="Ex: -25.4206"
                value={latitude || ""}
                onChange={(e) => setLatitude(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Longitude</label>
              <input
                type="number"
                step="any"
                className="frequencia-select"
                placeholder="Ex: -49.2635"
                value={longitude || ""}
                onChange={(e) => setLongitude(e.target.value ? parseFloat(e.target.value) : null)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)" }}>Observações</label>
            <textarea
              className="frequencia-select"
              style={{ minHeight: "80px", resize: "vertical" }}
              placeholder="Detalhes adicionais do cliente."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "10px", marginTop: "12px" }}>
            <input
              type="checkbox"
              id="clienteAtivo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              style={{ width: "18px", height: "18px", cursor: "pointer", margin: 0 }}
            />
            <label htmlFor="clienteAtivo" style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--secondary-color)", cursor: "pointer", margin: 0 }}>
              Cliente Ativo no Mapa
            </label>
          </div>

          <div className="modal-actions" style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" className="cancel-btn" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="primary-btn">
              {saving ? "Salvando..." : "Salvar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteFormModal;
