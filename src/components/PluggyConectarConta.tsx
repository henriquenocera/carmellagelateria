import React, { useState } from "react";
import { PluggyConnect } from "react-pluggy-connect";
import * as Icons from "react-icons/bs";
import supabase from "../services/supabase-client";

// Liga uma conta bancária (via Open Finance, pelo widget da Pluggy) a uma conta do escritório.
// O token do widget vem da Edge Function "pluggy-extrato"; o Client Secret nunca chega ao navegador.

type ContaPluggy = { id: string; nome: string; numero: string; subtipo: string };

export async function chamarPluggy(body: any) {
  const { data, error } = await supabase.functions.invoke("pluggy-extrato", { body });
  if (error) {
    let mensagem = error.message;
    try {
      const corpo = await (error as any).context?.json?.();
      if (corpo?.mensagem) mensagem = corpo.mensagem;
    } catch { /* resposta sem JSON */ }
    throw new Error(mensagem);
  }
  if (!data?.ok) throw new Error(data?.mensagem || "Resposta inesperada da Pluggy.");
  return data;
}

type Props = {
  conta: string;                 // rótulo da conta do escritório (lancamentos_financeiros.conta)
  userId?: string;
  itemIdParaAtualizar?: string;  // reconectar uma conexão existente (consentimento vencido)
  textoBotao?: string;
  onConectado: () => void;
};

export default function PluggyConectarConta({ conta, userId, itemIdParaAtualizar, textoBotao, onConectado }: Props) {
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [contasPluggy, setContasPluggy] = useState<ContaPluggy[]>([]);

  const abrirWidget = async () => {
    setCarregando(true);
    try {
      const data = await chamarPluggy({ acao: "connect_token", itemId: itemIdParaAtualizar });
      setConnectToken(data.accessToken);
    } catch (err: any) {
      alert("Não foi possível abrir a conexão com a Pluggy: " + (err.message || "Erro desconhecido."));
    } finally {
      setCarregando(false);
    }
  };

  const salvarConexao = async (novoItemId: string, contaPluggy: ContaPluggy) => {
    const { error } = await supabase.from("pluggy_conexoes").upsert(
      [{
        item_id: novoItemId,
        account_id: contaPluggy.id,
        conta,
        descricao: [contaPluggy.nome, contaPluggy.numero].filter(Boolean).join(" - "),
        user_id: userId
      }],
      { onConflict: "account_id" }
    );
    if (error) throw error;
    setItemId(null);
    setContasPluggy([]);
    onConectado();
  };

  const aoConectar = async (dados: any) => {
    setConnectToken(null);
    const novoItemId = dados?.item?.id;
    if (!novoItemId) return;
    setCarregando(true);
    try {
      const { contas } = await chamarPluggy({ acao: "contas", itemId: novoItemId });
      if (!contas || contas.length === 0) {
        alert("A conexão foi feita, mas a Pluggy não retornou nenhuma conta corrente.");
      } else if (contas.length === 1) {
        await salvarConexao(novoItemId, contas[0]);
      } else {
        setItemId(novoItemId);
        setContasPluggy(contas);
      }
    } catch (err: any) {
      alert("Erro ao salvar a conexão: " + (err.message || "Erro desconhecido."));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      {contasPluggy.length > 0 && itemId ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "1.2rem", color: "#475569", fontWeight: "bold" }}>Qual conta do banco corresponde a "{conta}"?</span>
          {contasPluggy.map(c => (
            <button
              key={c.id}
              type="button"
              className="primary-btn"
              onClick={() => salvarConexao(itemId, c).catch(err => alert("Erro ao salvar a conexão: " + err.message))}
              style={{ padding: "8px", fontSize: "1.2rem" }}
            >
              {[c.nome, c.numero, c.subtipo].filter(Boolean).join(" - ")}
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className="primary-btn"
          onClick={abrirWidget}
          disabled={carregando || !conta}
          style={{ padding: "10px", fontSize: "1.3rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", opacity: (carregando || !conta) ? 0.6 : 1, cursor: (carregando || !conta) ? "not-allowed" : "pointer" }}
        >
          {carregando ? <Icons.BsHourglassSplit /> : <Icons.BsLink45Deg />}
          {carregando ? "Aguarde..." : (textoBotao || "Conectar conta pelo Open Finance")}
        </button>
      )}

      {connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={false}
          updateItem={itemIdParaAtualizar}
          onSuccess={aoConectar}
          onError={(erro: any) => console.error("Erro no Pluggy Connect:", erro)}
          onClose={() => setConnectToken(null)}
        />
      )}
    </>
  );
}
