function DocumentacaoPage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#2c3e50" }}>Documentação</h2>
      <p style={{ color: "#666", lineHeight: "1.6" }}>
        Nesta etapa, você precisará preencher e enviar os seguintes documentos:
      </p>
      <ul style={{ color: "#444", paddingLeft: "20px" }}>
        <li>Contrato de Trabalho</li>
        <li>Dados Cadastrais</li>
        <li>Formulário de Benefícios</li>
      </ul>
    </div>
  );
}

export default DocumentacaoPage;
