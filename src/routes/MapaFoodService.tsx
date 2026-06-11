import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, CircleF } from "@react-google-maps/api";
import ClienteFormModal from "../components/ClienteFormModal.tsx";
const factoryIconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png';
const statusIconUrls: Record<string, string> = {
  "Lead": 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  "Em Contato": 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  "Negócio Fechado": 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  "Perdido": 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
};

const getStatusIconUrl = (status: string) => statusIconUrls[status] || statusIconUrls["Lead"];

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

const mapCenterLat = -25.4234265;
const mapCenterLng = -49.2556277;
const mapCenter = { lat: mapCenterLat, lng: mapCenterLng };

function MapaFoodService() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRadius, setHoveredRadius] = useState<number | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
  });

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
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            <Icons.BsPlusCircle style={{ marginRight: "8px" }} />
            Novo Cliente
          </button>
        </div>

        {/* Componente do Mapa */}
        <div style={{ margin: "20px auto", width: "100%", padding: "0 20px" }}>
          <div style={{ height: "calc(100vh - 220px)", minHeight: "500px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid var(--border-color)", position: "relative", zIndex: 1, backgroundColor: "#f3f4f6" }}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%" }}
                center={mapCenter}
                zoom={13}
                options={{ 
                  disableDefaultUI: false,
                  mapTypeControl: true,
                  streetViewControl: false
                }}
                onMouseMove={(e) => {
                  if (e.latLng) {
                    const distKm = getDistanceFromLatLonInKm(mapCenter.lat, mapCenter.lng, e.latLng.lat(), e.latLng.lng());
                    const distMeters = distKm * 1000;
                    // Encontra o menor círculo em que o mouse está dentro
                    let hovered = null;
                    const radii = [1000, 2000, 3000, 4000, 5000];
                    for (const r of radii) {
                      if (distMeters <= r) {
                        hovered = r;
                        break;
                      }
                    }
                    if (hoveredRadius !== hovered) {
                      setHoveredRadius(hovered);
                    }
                  }
                }}
                onMouseOut={() => setHoveredRadius(null)}
              >
                {/* Círculos de Raio */}
                {[5000, 4000, 3000, 2000, 1000].map((radius) => {
                  const isHovered = hoveredRadius === radius;
                  const radiusKm = radius / 1000;
                  const latOffset = radiusKm / 111.32; // Aproximação de km para graus de latitude
                  const labelPosTop = { lat: mapCenter.lat + latOffset, lng: mapCenter.lng };
                  const labelPosBottom = { lat: mapCenter.lat - latOffset, lng: mapCenter.lng };
                  const transparentIcon = { url: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" };

                  return (
                    <React.Fragment key={`radius-group-${radius}`}>
                      <CircleF
                        center={mapCenter}
                        radius={radius}
                        options={{
                          strokeColor: isHovered ? "var(--secondary-color)" : "var(--primary-color)",
                          strokeOpacity: isHovered ? 0.8 : 0.35,
                          strokeWeight: isHovered ? 2.5 : 1.5,
                          fillColor: isHovered ? "var(--secondary-color)" : "var(--primary-color)",
                          fillOpacity: isHovered ? 0.08 : 0.03,
                          clickable: false
                        }}
                      />
                      {/* Top Label */}
                      <MarkerF
                        position={labelPosTop}
                        icon={transparentIcon}
                        options={{ clickable: false }}
                        label={{
                          text: `${radiusKm} km`,
                          className: `radius-label ${isHovered ? "hovered" : ""}`
                        }}
                      />
                      {/* Bottom Label */}
                      <MarkerF
                        position={labelPosBottom}
                        icon={transparentIcon}
                        options={{ clickable: false }}
                        label={{
                          text: `${radiusKm} km`,
                          className: `radius-label ${isHovered ? "hovered" : ""}`
                        }}
                      />
                    </React.Fragment>
                  );
                })}

                {/* Pino Central da Fábrica */}
                <MarkerF 
                  position={mapCenter} 
                  icon={{ url: factoryIconUrl, scaledSize: new window.google.maps.Size(25, 41) }}
                  onClick={() => setActiveMarker("fabrica")}
                  label={{ text: "Fábrica", className: "marker-permanent-label" }}
                >
                  {activeMarker === "fabrica" && (
                    <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                      <div style={{ minWidth: "220px", padding: "4px 8px 0px 4px" }}>
                        <strong style={{ display: "block", fontSize: "1.3em", color: "var(--primary-color)", marginBottom: "8px" }}>Fábrica</strong>
                        <div style={{ fontSize: "1.05em", color: "#444", lineHeight: "1.4" }}>Rua Sete de Abril, 934<br/>Alto da XV - Curitiba - PR<br/>CEP: 80045-165</div>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
                
                {/* Pinos dos Clientes */}
                {clientes.map((c) => {
                  if (c.latitude && c.longitude) {
                    const lat = Number(c.latitude);
                    const lon = Number(c.longitude);
                    const pos = { lat, lng: lon };
                    
                    return (
                      <MarkerF 
                        key={c.id} 
                        position={pos} 
                        icon={{ url: getStatusIconUrl(c.status), scaledSize: new window.google.maps.Size(25, 41) }}
                        onClick={() => setActiveMarker(c.id)}
                        label={{ text: c.nome, className: "marker-permanent-label" }}
                      >
                        {activeMarker === c.id && (
                          <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                            <div style={{ minWidth: "220px", padding: "4px 8px 0px 4px" }}>
                              <strong style={{ display: "block", fontSize: "1.3em", marginBottom: "8px", color: "var(--secondary-color)" }}>{c.nome}</strong>
                              <span style={{ 
                                display: "inline-block",
                                padding: "4px 8px", 
                                borderRadius: "6px", 
                                fontSize: "0.9rem",
                                fontWeight: 700,
                                backgroundColor: `${getStatusColor(c.status || "Lead")}20`,
                                color: getStatusColor(c.status || "Lead"),
                                marginBottom: "12px"
                              }}>
                                {c.status || "Lead"}
                              </span>
                              {c.telefone && <div style={{ fontSize: "1.05em", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}><Icons.BsTelephone /> {c.telefone}</div>}
                              <div style={{ fontSize: "1.05em", color: "#444", lineHeight: "1.4" }}>{c.endereco}</div>
                            </div>
                          </InfoWindowF>
                        )}
                      </MarkerF>
                    );
                  }
                  return null;
                })}
              </GoogleMap>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
              </div>
            )}
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
                    const distKm = getDistanceFromLatLonInKm(mapCenter.lat, mapCenter.lng, Number(c.latitude), Number(c.longitude));
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
      <ClienteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchClientes}
      />
    </>
  );
}

export default MapaFoodService;
