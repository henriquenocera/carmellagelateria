// Supabase client – loaded via CDN in the HTML
const SUPABASE_URL = "https://zfkvpqqqekxaxnhevwno.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpma3ZwcXFxZWt4YXhuaGV2d25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzYyMzYsImV4cCI6MjA1NDg1MjIzNn0.Rw7bFAtUNMIPYL3cwEEGg_3amQe5aTHeG0Csj1m3v3U";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadCards() {
  const container = document.getElementById("data-container");

  const { data, error } = await supabase
    .from("cardsahu")
    .select("name")
    .eq("status", "vitrine-atual");

  if (error) {
    console.error("Erro ao buscar sabores:", error);
    container.innerHTML =
      '<p class="data-item data-item--empty">Não foi possível carregar os sabores.</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML =
      '<p class="data-item data-item--empty">Nenhum sabor na vitrine no momento.</p>';
    return;
  }

  container.innerHTML = data
    .map(
      (item) => `
      <div class="data-item">
        <div>${item.name}</div>
      </div>`
    )
    .join("");
}

loadCards();
