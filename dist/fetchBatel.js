;(async () => {
  const SUPABASE_URL = "https://zfkvpqqqekxaxnhevwno.supabase.co"
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U"
  const container = document.getElementById("data-container")

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/cardsbatel?select=title&status=eq.vitrine-atual`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      container.innerHTML =
        '<p class="data-item data-item--empty">Nenhum sabor na vitrine no momento.</p>'
      return
    }

    container.innerHTML = data
      .map(
        (item) => `
      <div class="data-item">
        <div>${item.title}</div>
      </div>`
      )
      .join("")
  } catch (error) {
    console.error("Erro ao buscar sabores:", error)
    container.innerHTML =
      '<p class="data-item data-item--empty">Não foi possível carregar os sabores.</p>'
  }
})()
