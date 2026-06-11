import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correção de ícone padrão do Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const invisibleIcon = new L.DivIcon({
  className: 'invisible-icon',
  html: '',
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

const factoryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const statusIcons: Record<string, L.Icon> = {
  "Lead": new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
  "Em Contato": new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
  "Negócio Fechado": new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
  "Perdido": new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }),
};

const getStatusIcon = (status: string) => {
  return statusIcons[status] || statusIcons["Lead"];
};

// Função para calcular distância entre duas coordenadas (Fórmula de Haversine)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Raio da terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

function MapaFoodService() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRadius, setHoveredRadius] = useState<number | null>(null);

  // Centro do mapa: Rua Sete de Abril, 934, Alto da XV, Curitiba - CEP 80045-165
  const mapCenter: [number, number] = [-25.4234265, -49.2556277];

  useEffect(() => {
    if (!session) {
      navigate("/");
    } else {
      fetchClientes();
    }
  }, [session, navigate]);

  async function fetchClientes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clientes_food_service")
        .select("*")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (error) throw error;
      setClientes(data || []);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      alert("Erro ao carregar o mapa.");
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (statusVal: string) => {
    switch (statusVal) {
      case "Lead": return "#3b82f6"; // Azul
      case "Em Contato": return "#f59e0b"; // Laranja
      case "Negócio Fechado": return "#10b981"; // Verde
      case "Perdido": return "#ef4444"; // Vermelho
      default: return "#94a3b8";
    }
  };

  return (
    <>
      <Helmet>
        <title>Mapa Food Service</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Mapa Food Service</h1>
            <p>Visualização geográfica dos clientes e leads de Food Service.</p>
          </div>
          <button className="primary-btn" onClick={() => navigate("/configuracoes/clientes")}>
            <Icons.BsGear style={{ marginRight: "8px" }} />
            Gerenciar Clientes
          </button>
        </div>

        {/* Componente do Mapa */}
        <div style={{ margin: "20px auto", width: "100%", padding: "0 20px" }}>
          <div style={{ height: "600px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid var(--border-color)", position: "relative", zIndex: 1 }}>
            <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />

              {/* Círculos de Raio (Renderizados do maior para o menor para acertar o clique) */}
              {[5000, 4000, 3000, 2000, 1000].map((radius) => {
                const radiusKm = radius / 1000;
                const latOffset = radiusKm / 111.32;
                const labelPosTop: [number, number] = [mapCenter[0] + latOffset, mapCenter[1]];
                const labelPosBottom: [number, number] = [mapCenter[0] - latOffset, mapCenter[1]];

                const isHovered = hoveredRadius === radius;

                return (
                  <React.Fragment key={`radius-group-${radius}`}>
                    <Circle 
                      center={mapCenter} 
                      radius={radius} 
                      interactive={true}
                      eventHandlers={{
                        mouseover: () => setHoveredRadius(radius),
                        mouseout: () => setHoveredRadius(null),
                      }}
                      pathOptions={{ 
                        color: isHovered ? "var(--secondary-color)" : "var(--primary-color)", 
                        fillColor: isHovered ? "var(--secondary-color)" : "var(--primary-color)", 
                        fillOpacity: isHovered ? 0.08 : 0.03, 
                        opacity: isHovered ? 0.8 : 0.35,
                        weight: isHovered ? 2.5 : 1.5, 
                        dashArray: isHovered ? "" : "5, 8",
                        className: "radar-circle-anim"
                      }} 
                    />
                    {/* Top Label */}
                    <Marker position={labelPosTop} icon={invisibleIcon} interactive={false}>
                      <Tooltip permanent direction="center" offset={[0, 0]} opacity={isHovered ? 1 : 0.8}>
                        <div style={{ 
                          fontWeight: 800, 
                          fontSize: "0.9rem", 
                          color: isHovered ? "#fff" : "var(--primary-color)", 
                          textShadow: isHovered ? "none" : "0 0 5px white, 0 0 5px white", 
                          backgroundColor: isHovered ? "var(--secondary-color)" : "rgba(255,255,255,0.7)", 
                          padding: "2px 8px", 
                          borderRadius: "10px",
                          transition: "all 0.2s ease"
                        }}>
                          {radiusKm} km
                        </div>
                      </Tooltip>
                    </Marker>
                    {/* Bottom Label */}
                    <Marker position={labelPosBottom} icon={invisibleIcon} interactive={false}>
                      <Tooltip permanent direction="center" offset={[0, 0]} opacity={isHovered ? 1 : 0.8}>
                        <div style={{ 
                          fontWeight: 800, 
                          fontSize: "0.9rem", 
                          color: isHovered ? "#fff" : "var(--primary-color)", 
                          textShadow: isHovered ? "none" : "0 0 5px white, 0 0 5px white", 
                          backgroundColor: isHovered ? "var(--secondary-color)" : "rgba(255,255,255,0.7)", 
                          padding: "2px 8px", 
                          borderRadius: "10px",
                          transition: "all 0.2s ease"
                        }}>
                          {radiusKm} km
                        </div>
                      </Tooltip>
                    </Marker>
                  </React.Fragment>
                );
              })}

              {/* Pino Central da Fábrica */}
              <Marker position={mapCenter} icon={factoryIcon}>
                <Tooltip permanent direction="top" offset={[0, -30]}>
                  <strong style={{ fontSize: "1.4em", color: "var(--primary-color)" }}>Fábrica</strong>
                </Tooltip>
                <Popup>
                  <strong style={{ display: "block", fontSize: "1.8em", color: "var(--primary-color)" }}>Fábrica</strong>
                  <div style={{ marginTop: "6px", fontSize: "1.3em", color: "#444" }}>Rua Sete de Abril, 934<br/>Alto da XV - Curitiba - PR<br/>CEP: 80045-165</div>
                </Popup>
              </Marker>
              
              {/* Pinos dos Clientes */}
              {clientes.map((c) => {
                if (c.latitude && c.longitude) {
                  const lat = Number(c.latitude);
                  const lon = Number(c.longitude);
                  const distKm = getDistanceFromLatLonInKm(mapCenter[0], mapCenter[1], lat, lon);
                  const distText = distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`;

                  return (
                    <Marker key={c.id} position={[lat, lon]} icon={getStatusIcon(c.status)}>
                      <Tooltip permanent direction="top" offset={[0, -30]}>
                        <div style={{ textAlign: "center", padding: "2px 4px" }}>
                          <strong style={{ display: "block", fontSize: "1.5em", marginBottom: "4px" }}>{c.nome}</strong>
                          <span style={{ fontSize: "1.35em", color: "var(--primary-color)", fontWeight: 800 }}>📍 {distText}</span>
                        </div>
                      </Tooltip>
                      <Popup>
                        <strong style={{ display: "block", fontSize: "1.6em" }}>{c.nome}</strong>
                        <span style={{ 
                          display: "inline-block",
                          marginTop: "6px",
                          padding: "6px 10px", 
                          borderRadius: "8px", 
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          backgroundColor: `${getStatusColor(c.status || "Lead")}20`,
                          color: getStatusColor(c.status || "Lead")
                        }}>
                          {c.status || "Lead"}
                        </span>
                        {c.telefone && <div style={{ marginTop: "12px", fontSize: "1.3em" }}><Icons.BsTelephone /> {c.telefone}</div>}
                        <div style={{ marginTop: "8px", fontSize: "1.3em", color: "#444" }}>{c.endereco}</div>
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}
            </MapContainer>
          </div>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : clientes.filter(c => c.latitude).length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Nenhum cliente com coordenadas válidas encontradas.</p>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1000px", borderCollapse: "separate", borderSpacing: "0 8px", backgroundColor: "transparent", boxShadow: "none" }}>
                <thead>
                  <tr>
                    <th style={{ width: "350px", textAlign: "left", paddingLeft: "20px" }}>Cliente / Contato</th>
                    <th style={{ width: "200px" }}>Telefone</th>
                    <th style={{ width: "150px", textAlign: "center" }}>Status</th>
                    <th style={{ width: "250px", textAlign: "center" }}>Distância da Fábrica</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.filter(c => c.latitude).map((c) => {
                    const distKm = getDistanceFromLatLonInKm(mapCenter[0], mapCenter[1], Number(c.latitude), Number(c.longitude));
                    const distText = distKm < 1 ? `${Math.round(distKm * 1000)} metros` : `${distKm.toFixed(1)} km`;
                    return (
                      <tr key={c.id} style={{ backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderRadius: "12px", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                        <td style={{ padding: "16px 20px", borderRadius: "12px 0 0 12px", border: "none" }}>
                          <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--secondary-color)", marginBottom: "4px" }}>{c.nome}</div>
                          {c.email && (
                            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                              <Icons.BsEnvelope /> {c.email}
                            </div>
                          )}
                        </td>
                        <td style={{ color: "#444", fontSize: "1rem", border: "none" }}>
                          {c.telefone ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Icons.BsTelephone style={{ color: "var(--primary-color)" }}/> {c.telefone}
                            </div>
                          ) : "-"}
                        </td>
                        <td style={{ textAlign: "center", border: "none" }}>
                          <span style={{ 
                            padding: "6px 14px", 
                            borderRadius: "20px", 
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            backgroundColor: `${getStatusColor(c.status || "Lead")}15`,
                            color: getStatusColor(c.status || "Lead"),
                            display: "inline-block",
                            border: `1px solid ${getStatusColor(c.status || "Lead")}40`
                          }}>
                            {c.status || "Lead"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center", border: "none", borderRadius: "0 12px 12px 0" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--primary-color)", fontSize: "1.1rem", padding: "6px 12px", backgroundColor: "var(--bg-color)", borderRadius: "8px" }}>
                            📍 {distText}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MapaFoodService;
