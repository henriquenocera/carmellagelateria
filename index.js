import { fetchStatuses } from "./pontomais-api.mjs";

async function main() {
  try {
    const result = await fetchStatuses();

    if (!result.body) {
      console.error("Status:", result.status, result.statusText);
      console.error("Corpo (não JSON):", result.rawText.slice(0, 800));
      process.exit(1);
    }

    if (!result.ok) {
      console.error("Status:", result.status, result.statusText);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    console.log(JSON.stringify(result.body, null, 2));
  } catch (e) {
    if (e.code === "MISSING_AUTH") {
      console.error(
        "Configure autenticação no .env:\n" +
          "  - Token (Devise): PONTOMAIS_ACCESS_TOKEN, PONTOMAIS_CLIENT, PONTOMAIS_UID (e opcionalmente PONTOMAIS_EXPIRY, PONTOMAIS_TOKEN_TYPE)\n" +
          "  e/ou\n" +
          "  - PONTOMAIS_COOKIE e/ou PONTOMAIS_AUTHORIZATION\n" +
          "Veja .env.example."
      );
      process.exit(1);
    }
    console.error(e.message || e);
    process.exit(1);
  }
}

main();
