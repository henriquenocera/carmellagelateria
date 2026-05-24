import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import Footer from "../components/Footer"

const STORES = {
  ahu: {
    title: "Loja Ahú",
    address: "Rua Colombo, 183",
    table: "cardsahu",
    mapsUrl: "https://maps.app.goo.gl/1Yo4hm7cMo2zWh9R8",
  },
  altoxv: {
    title: "Loja Alto da XV",
    address: "Rua Sete de Abril, 934",
    table: "cardsaltoxv",
    mapsUrl: "https://maps.app.goo.gl/B5QZWhCHEjyfjVAE9",
  },
}

export default function Store() {
  const { id } = useParams()
  const store = STORES[id]
  const [flavors, setFlavors] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!store) return
    let cancelled = false

    async function fetchFlavors() {
      const { data, error } = await supabase
        .from(store.table)
        .select("title")
        .eq("status", "vitrine-atual")

      if (cancelled) return

      if (error) {
        console.error(`Erro ao buscar sabores (${store.title}):`, error)
        setError(true)
        return
      }

      setFlavors(data)
    }

    fetchFlavors()
    return () => { cancelled = true }
  }, [store])

  if (!store) {
    return (
      <div className="app">
        <main className="container">
          <h2 className="sub-title">Loja não encontrada</h2>
          <Link className="link" to="/">Voltar</Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header container">
        <Link to="/">
          <img className="logo" src="/images/logo.svg" alt="Carmella Gelateria" />
        </Link>
        <h1 className="title">{store.title}</h1>
        <p className="store-address">{store.address}</p>
        <a className="map-link" href={store.mapsUrl} target="_blank" rel="noopener">
          Ver rota
        </a>
        <h2 className="sub-title">Confira os sabores:</h2>
      </header>

      <main className="container">
        <div className="data-container" id={`data-${id}`}>
          {flavors === null && !error && (
            <div className="lds-roller">
              <div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div>
            </div>
          )}

          {error && (
            <p className="data-item data-item--empty">
              Não foi possível carregar os sabores.
            </p>
          )}

          {flavors && flavors.length === 0 && (
            <p className="data-item data-item--empty">
              Nenhum sabor na vitrine no momento.
            </p>
          )}

          {flavors && flavors.length > 0 && flavors.map((item, i) => (
            <div className="data-item" key={i}>
              {item.title}
            </div>
          ))}
        </div>

        <p className="disclaimer">
          Atenção! <br /><br />
          Os sabores são atualizados em tempo real, porém em dias de
          muito movimento os sabores podem mudar rapidamente.
        </p>
      </main>

      <Footer />
    </div>
  )
}
