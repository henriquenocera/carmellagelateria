import { Link } from "react-router-dom"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <div className="app">
      <header className="header container">
        <img className="logo" src="/images/logo.svg" alt="Carmella Gelateria" />
        <h1 className="title">@carmellagelateria</h1>
      </header>

      <main className="container">
        <h2 className="sub-title">Confira os sabores</h2>
        <Link className="link" to="/ahu">Ahú</Link>
        <Link className="link" to="/altoxv">Alto da XV</Link>
      </main>

      <Footer />
    </div>
  )
}
