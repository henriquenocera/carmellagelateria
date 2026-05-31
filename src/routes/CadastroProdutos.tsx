import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Icons from "react-icons/bs";
import supabase from "../supabase-client";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import "../css/Frequencia.css";

function CadastroProdutos() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<any[]>([]);
  const [insumosList, setInsumosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [unidadeVenda, setUnidadeVenda] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [fichaTecnica, setFichaTecnica] = useState<any[]>([]);

  // Form temporary state for adding an item to the ficha
  const [selectedInsumo, setSelectedInsumo] = useState("");
  const [quantidadeInsumo, setQuantidadeInsumo] = useState("");
  const [selectedProdutoBase, setSelectedProdutoBase] = useState("");
  const [quantidadeProdutoBase, setQuantidadeProdutoBase] = useState("");

  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    } else if (isAdmin === true) {
      fetchData();
    }
  }, [isAdmin, navigate]);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch the latest entradas_mercadoria for each insumo to get the updated cost
      const { data: latestEntradasData } = await supabase
        .from("entradas_mercadoria")
        .select("insumo_id, valor_unitario, created_at")
        .order("created_at", { ascending: false });

      const latestCostMap: Record<string, number> = {};
      if (latestEntradasData) {
        latestEntradasData.forEach((entrada: any) => {
          if (latestCostMap[entrada.insumo_id] === undefined) {
            latestCostMap[entrada.insumo_id] = parseFloat(entrada.valor_unitario) || 0;
          }
        });
      }

      // Fetch insumos for the dropdown
      const { data: insumosData, error: insumosError } = await supabase
        .from("cadastro_insumos")
        .select("*")
        .eq("ativo", true)
        .order("nome", { ascending: true });

      if (insumosError) throw insumosError;
      
      const insumosWithUpdatedCosts = (insumosData || []).map((insumo: any) => {
        const latestValor = latestCostMap[insumo.id];
        let custoAtualizado = insumo.custo_considerado_unitario;
        if (latestValor !== undefined && insumo.quantidade_conversao > 0) {
          custoAtualizado = latestValor / insumo.quantidade_conversao;
        }
        return {
          ...insumo,
          custo_considerado_unitario: custoAtualizado
        };
      });
      setInsumosList(insumosWithUpdatedCosts);

      // Fetch produtos and their ficha tecnica
      const { data: produtosData, error: produtosError } = await supabase
        .from("cadastro_produtos")
        .select(`
          id, nome, categoria, preco_venda, ativo, unidade_venda,
          ficha_tecnica!ficha_tecnica_produto_id_fkey (
            id, insumo_id, quantidade, produto_base_id,
            cadastro_insumos ( id, nome_simples_unitario, nome, custo_considerado_unitario, quantidade_conversao, unidade_conversao ),
            cadastro_produtos!ficha_tecnica_produto_base_id_fkey ( id, nome )
          )
        `)
        .order("nome", { ascending: true });

      if (produtosError) {
        if (produtosError.code !== '42P01') {
          console.error("Erro ao buscar produtos:", produtosError);
        }
        setProdutos([]);
      } else {
        const updatedProdutosData = (produtosData || []).map((prod: any) => ({
          ...prod,
          ficha_tecnica: (prod.ficha_tecnica || []).map((item: any) => {
            if (item.insumo_id) {
              const latestValor = latestCostMap[item.insumo_id];
              let updatedCusto = item.cadastro_insumos?.custo_considerado_unitario || 0;
              if (latestValor !== undefined && item.cadastro_insumos?.quantidade_conversao > 0) {
                updatedCusto = latestValor / item.cadastro_insumos.quantidade_conversao;
              }
              return {
                ...item,
                cadastro_insumos: {
                   ...item.cadastro_insumos,
                   custo_considerado_unitario: updatedCusto
                }
              };
            }
            return item;
          })
        }));
        setProdutos(updatedProdutosData);
      }
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  const openModal = (produto?: any) => {
    if (produto) {
      setEditingId(produto.id);
      setNome(produto.nome);
      setCategoria(produto.categoria || "");
      setPrecoVenda(produto.preco_venda?.toString() || "");
      setUnidadeVenda(produto.unidade_venda || "");
      setAtivo(produto.ativo);
      
      const mappedFicha = (produto.ficha_tecnica || []).map((item: any) => ({
        id: item.id,
        insumo_id: item.insumo_id,
        produto_base_id: item.produto_base_id,
        quantidade: item.quantidade,
        insumo: item.cadastro_insumos
      }));
      setFichaTecnica(mappedFicha);
    } else {
      setEditingId(null);
      setNome("");
      setCategoria("");
      setPrecoVenda("");
      setUnidadeVenda("");
      setAtivo(true);
      setFichaTecnica([]);
    }
    
    setSelectedInsumo("");
    setQuantidadeInsumo("");
    setSelectedProdutoBase("");
    setQuantidadeProdutoBase("");
    setIsModalOpen(true);
  };

  const calculateCustoProduto = (ficha: any[], allProdutos: any[] = produtos) => {
    return ficha.reduce((acc, item) => {
      if (item.insumo_id || item.insumo || item.cadastro_insumos) {
        const insumoData = item.insumo || item.cadastro_insumos;
        const custoUnitario = insumoData?.custo_considerado_unitario || 0;
        return acc + (parseFloat(item.quantidade) * custoUnitario);
      } else if (item.produto_base_id) {
        const baseProd = allProdutos.find(p => p.id === item.produto_base_id);
        if (baseProd) {
          const baseCusto = calculateCustoProduto(baseProd.ficha_tecnica || [], allProdutos);
          return acc + (parseFloat(item.quantidade) * baseCusto);
        }
      }
      return acc;
    }, 0);
  };

  const currentCusto = calculateCustoProduto(fichaTecnica);
  const pv = precoVenda ? parseFloat(precoVenda) : 0;
  const currentLucro = pv - currentCusto;
  const currentMargem = pv > 0 ? (currentLucro / pv) * 100 : 0;

  const handleAddFichaItem = () => {
    if (!selectedInsumo || !quantidadeInsumo) {
      alert("Selecione um insumo e digite a quantidade.");
      return;
    }

    const insumoFound = insumosList.find(i => i.id === selectedInsumo);
    if (!insumoFound) return;

    if (fichaTecnica.some(item => item.insumo_id === selectedInsumo)) {
      alert("Este insumo já foi adicionado à ficha técnica.");
      return;
    }

    setFichaTecnica([
      ...fichaTecnica,
      {
        insumo_id: selectedInsumo,
        quantidade: parseFloat(quantidadeInsumo),
        insumo: {
          nome: insumoFound.nome,
          nome_simples_unitario: insumoFound.nome_simples_unitario,
          custo_considerado_unitario: insumoFound.custo_considerado_unitario,
          unidade_conversao: insumoFound.unidade_conversao
        }
      }
    ]);

    setSelectedInsumo("");
    setQuantidadeInsumo("");
  };

  const handleAddProdutoBaseItem = () => {
    if (!selectedProdutoBase || !quantidadeProdutoBase) {
      alert("Selecione um produto base e digite a quantidade.");
      return;
    }

    if (selectedProdutoBase === editingId) {
      alert("Um produto não pode usar a si mesmo na ficha técnica!");
      return;
    }

    if (fichaTecnica.some(item => item.produto_base_id === selectedProdutoBase)) {
      alert("Este produto base já foi adicionado à ficha técnica.");
      return;
    }

    setFichaTecnica([
      ...fichaTecnica,
      {
        produto_base_id: selectedProdutoBase,
        quantidade: parseFloat(quantidadeProdutoBase)
      }
    ]);

    setSelectedProdutoBase("");
    setQuantidadeProdutoBase("");
  };

  const handleRemoveFichaItem = (index: number) => {
    const newFicha = [...fichaTecnica];
    newFicha.splice(index, 1);
    setFichaTecnica(newFicha);
  };

  const handleSaveProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("O nome do produto é obrigatório.");
      return;
    }

    try {
      setSaving(true);

      const produtoPayload = {
        nome: nome.trim(),
        categoria: categoria.trim() || null,
        preco_venda: precoVenda ? parseFloat(precoVenda) : null,
        unidade_venda: unidadeVenda.trim() || null,
        ativo: ativo
      };

      let produtoId = editingId;

      if (editingId) {
        const { error: prodErr } = await supabase
          .from("cadastro_produtos")
          .update(produtoPayload)
          .eq("id", editingId);
        
        if (prodErr) throw prodErr;

        const { error: deleteErr } = await supabase
          .from("ficha_tecnica")
          .delete()
          .eq("produto_id", editingId);

        if (deleteErr) throw deleteErr;

      } else {
        const { data: newProd, error: prodErr } = await supabase
          .from("cadastro_produtos")
          .insert([produtoPayload])
          .select("id")
          .single();

        if (prodErr) throw prodErr;
        produtoId = newProd.id;
      }

      if (fichaTecnica.length > 0 && produtoId) {
        const insertFicha = fichaTecnica.map(item => ({
          produto_id: produtoId,
          insumo_id: item.insumo_id || null,
          produto_base_id: item.produto_base_id || null,
          quantidade: item.quantidade
        }));

        const { error: fichaErr } = await supabase
          .from("ficha_tecnica")
          .insert(insertFicha);

        if (fichaErr) throw fichaErr;
      }

      setIsModalOpen(false);
      fetchData();

    } catch (err: any) {
      console.error("Erro ao salvar produto:", err);
      alert(err.message || "Erro ao salvar produto. Verifique se as tabelas foram criadas no Supabase.");
    } finally {
      setSaving(false);
    }
  };

  async function handleDeleteProduto(id: string) {
    if (!window.confirm("Deseja realmente excluir este produto e sua ficha técnica?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("cadastro_produtos").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      alert("Erro ao deletar o produto.");
      setLoading(false);
    }
  }

  async function handleToggleAtivo(id: string, currentAtivo: boolean) {
    try {
      setLoading(true);
      const { error } = await supabase.from("cadastro_produtos").update({ ativo: !currentAtivo }).eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Erro ao alterar o status do produto.");
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Cadastro de Produtos</title>
      </Helmet>

      <div className="frequencia-container">
        <div className="frequencia-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="frequencia-title-group">
            <h1>Cadastro de Produtos</h1>
            <p>Gerencie os produtos finais vendidos pela loja e defina suas fichas técnicas (receitas) baseadas nos insumos.</p>
          </div>
          <button className="primary-btn" onClick={() => openModal()}>
            <Icons.BsPlusLg style={{ marginRight: "8px" }} />
            Novo Produto
          </button>
        </div>

        <div className="freq-annual-summary-wrapper" style={{ margin: "20px auto", maxWidth: "100%", padding: "0 20px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Icons.BsArrowClockwise className="spin" style={{ fontSize: "2rem", color: "var(--primary-color)" }} />
            </div>
          ) : produtos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
              <Icons.BsBoxSeam style={{ fontSize: "3rem", color: "#94a3b8", marginBottom: "16px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "1.4rem" }}>Nenhum produto cadastrado.</p>
              <p style={{ color: "#94a3b8", marginTop: "8px" }}>Lembre-se de rodar o SQL no Supabase para criar as tabelas <br/><b>cadastro_produtos</b> e <b>ficha_tecnica</b>.</p>
            </div>
          ) : (
            <div className="freq-table-wrapper" style={{ overflowX: "auto" }}>
              <table className="freq-table" style={{ minWidth: "1000px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center", width: "60px" }}>Ativo</th>
                    <th>Nome do Produto</th>
                    <th>Categoria</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Unid. Venda</th>
                    <th style={{ width: "120px", textAlign: "right" }}>Preço (Venda)</th>
                    <th style={{ width: "120px", textAlign: "right" }}>Custo Total</th>
                    <th style={{ width: "120px", textAlign: "right" }}>Lucro</th>
                    <th style={{ width: "100px", textAlign: "center" }}>Margem</th>
                    <th style={{ textAlign: "center", width: "100px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => {
                    const custo = calculateCustoProduto(produto.ficha_tecnica || []);
                    const pv = produto.preco_venda || 0;
                    const lucro = pv - custo;
                    const margem = pv > 0 ? (lucro / pv) * 100 : 0;

                    return (
                      <tr key={produto.id} style={{ opacity: produto.ativo ? 1 : 0.6 }}>
                        <td 
                          style={{ textAlign: "center", cursor: "pointer" }}
                          onClick={() => handleToggleAtivo(produto.id, produto.ativo)}
                          title={produto.ativo ? "Desativar produto" : "Ativar produto"}
                        >
                          {produto.ativo ? (
                            <Icons.BsCheckCircleFill style={{ color: "#22c55e", fontSize: "1.5rem" }} />
                          ) : (
                            <Icons.BsXCircleFill style={{ color: "#94a3b8", fontSize: "1.5rem" }} />
                          )}
                        </td>
                        <td style={{ fontWeight: 500 }}>{produto.nome}</td>
                        <td>{produto.categoria || "-"}</td>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{produto.unidade_venda || "-"}</td>
                        <td style={{ textAlign: "right", color: "var(--primary-color)", fontWeight: "bold" }}>
                          {pv > 0 ? `R$ ${pv.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ textAlign: "right", color: "#dc2626" }}>
                          R$ {custo.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "right", color: lucro > 0 ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
                          R$ {lucro.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span style={{ 
                            backgroundColor: margem >= 40 ? "#dcfce7" : margem > 10 ? "#fef9c3" : "#fee2e2",
                            color: margem >= 40 ? "#166534" : margem > 10 ? "#854d0e" : "#991b1b",
                            padding: "4px 8px",
                            borderRadius: "20px",
                            fontSize: "1.1rem",
                            fontWeight: "bold"
                          }}>
                            {margem.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => openModal(produto)}
                            className="delete-record-btn"
                            title="Editar Produto"
                            style={{ margin: 0 }}
                          >
                            <Icons.BsPencil />
                          </button>
                          <button
                            onClick={() => handleDeleteProduto(produto.id)}
                            className="delete-record-btn"
                            title="Excluir Produto"
                            style={{ margin: 0 }}
                          >
                            <Icons.BsTrash />
                          </button>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
                {editingId ? "Editar Produto" : "Cadastrar Novo Produto"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}>
                <Icons.BsX />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduto} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsBoxSeam /> Dados do Produto
                </h3>
                
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Nome do Produto *</label>
                    <input
                      type="text"
                      required
                      className="frequencia-select"
                      placeholder="Ex: Copinho P - Pistache"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      style={{ background: "#fff" }}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Categoria</label>
                    <input
                      type="text"
                      className="frequencia-select"
                      placeholder="Ex: Gelatos"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      style={{ background: "#fff" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Unidade de Venda</label>
                    <select
                      className="frequencia-select"
                      value={unidadeVenda}
                      onChange={(e) => setUnidadeVenda(e.target.value)}
                      style={{ background: "#fff", fontSize: "1.1rem" }}
                    >
                      <option value="">Selecione...</option>
                      <option value="Unidade">Unidade</option>
                      <option value="Caixa">Caixa</option>
                      <option value="Pacote">Pacote</option>
                      <option value="Kg">Kg</option>
                      <option value="Pote">Pote</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--secondary-color)" }}>Preço de Venda</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <span style={{ position: "absolute", left: "12px", color: "var(--text-muted)", zIndex: 1, pointerEvents: "none", fontSize: "1.1rem" }}>R$</span>
                      <input
                        type="number"
                        step="0.01"
                        className="frequencia-select"
                        placeholder="0,00"
                        value={precoVenda}
                        onChange={(e) => setPrecoVenda(e.target.value)}
                        style={{ paddingLeft: "36px", background: "#fff" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#334155", fontSize: "1.4rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icons.BsCardList /> Ficha Técnica (Receita)
                </h3>
                
                <div style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748b" }}>Insumo</label>
                    <select
                      className="frequencia-select"
                      value={selectedInsumo}
                      onChange={(e) => setSelectedInsumo(e.target.value)}
                      style={{ background: "#fff" }}
                    >
                      <option value="">Selecione um insumo...</option>
                      {insumosList.map((insumo) => (
                        <option key={insumo.id} value={insumo.id}>
                          {insumo.nome_simples_unitario || insumo.nome} {insumo.custo_considerado_unitario ? `(Custo: R$ ${insumo.custo_considerado_unitario.toFixed(2)})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748b" }}>Quantidade</label>
                    <input
                      type="number"
                      step="0.00001"
                      className="frequencia-select"
                      placeholder="Qtd"
                      value={quantidadeInsumo}
                      onChange={(e) => setQuantidadeInsumo(e.target.value)}
                      style={{ background: "#fff" }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddFichaItem}
                    style={{ 
                      padding: "10px 16px", backgroundColor: "#e2e8f0", color: "#475569", 
                      border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer",
                      height: "42px", display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    <Icons.BsPlusLg /> Adicionar
                  </button>
                </div>

                <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "flex-end" }}>
                  <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748b" }}>Produto Base</label>
                    <select
                      className="frequencia-select"
                      value={selectedProdutoBase}
                      onChange={(e) => setSelectedProdutoBase(e.target.value)}
                      style={{ background: "#fff" }}
                    >
                      <option value="">Selecione um produto base...</option>
                      {produtos.filter(p => p.id !== editingId).map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label style={{ fontSize: "1.1rem", fontWeight: 600, color: "#64748b" }}>Quantidade</label>
                    <input
                      type="number"
                      step="0.00001"
                      className="frequencia-select"
                      placeholder="Qtd"
                      value={quantidadeProdutoBase}
                      onChange={(e) => setQuantidadeProdutoBase(e.target.value)}
                      style={{ background: "#fff" }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddProdutoBaseItem}
                    style={{ 
                      padding: "10px 16px", backgroundColor: "#e2e8f0", color: "#475569", 
                      border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer",
                      height: "42px", display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    <Icons.BsPlusLg /> Adicionar
                  </button>
                </div>

                {fichaTecnica.length > 0 ? (
                  <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #cbd5e1", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "1.2rem" }}>
                      <thead style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #cbd5e1" }}>
                        <tr>
                          <th style={{ padding: "10px", textAlign: "left", color: "#475569" }}>Item</th>
                          <th style={{ padding: "10px", textAlign: "center", color: "#475569" }}>Tipo</th>
                          <th style={{ padding: "10px", textAlign: "center", color: "#475569" }}>Quantidade</th>
                          <th style={{ padding: "10px", textAlign: "right", color: "#475569" }}>Custo Base</th>
                          <th style={{ padding: "10px", textAlign: "right", color: "#475569" }}>Custo Calc.</th>
                          <th style={{ padding: "10px", textAlign: "center", color: "#475569" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fichaTecnica.map((item, index) => {
                          let isProduto = !!item.produto_base_id;
                          let nomeItem = "";
                          let unitario = 0;
                          let unidade = "un";

                          if (isProduto) {
                            const pBase = produtos.find(p => p.id === item.produto_base_id);
                            nomeItem = pBase ? pBase.nome : "Produto Desconhecido";
                            unitario = pBase ? calculateCustoProduto(pBase.ficha_tecnica || [], produtos) : 0;
                          } else {
                            const insumoData = item.insumo || item.cadastro_insumos;
                            nomeItem = insumoData?.nome_simples_unitario || insumoData?.nome || "Insumo Desconhecido";
                            unitario = insumoData?.custo_considerado_unitario || 0;
                            unidade = insumoData?.unidade_conversao || "un";
                          }

                          const calc = parseFloat(item.quantidade) * unitario;
                          
                          return (
                            <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                              <td style={{ padding: "10px" }}>{nomeItem}</td>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                {isProduto ? 
                                  <span style={{ backgroundColor: "#e0e7ff", color: "#3730a3", padding: "2px 6px", borderRadius: "4px", fontSize: "1rem", fontWeight: "bold" }}>Produto</span> : 
                                  <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "2px 6px", borderRadius: "4px", fontSize: "1rem", fontWeight: "bold" }}>Insumo</span>
                                }
                              </td>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                {item.quantidade} {unidade}
                              </td>
                              <td style={{ padding: "10px", textAlign: "right" }}>R$ {unitario.toFixed(2)}</td>
                              <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>R$ {calc.toFixed(2)}</td>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                <button type="button" onClick={() => handleRemoveFichaItem(index)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                  <Icons.BsTrash />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontStyle: "italic", border: "1px dashed #cbd5e1", borderRadius: "8px", backgroundColor: "#fff" }}>
                    Nenhum insumo adicionado a esta ficha técnica.
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.1rem" }}>Custo Total</p>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", color: "#dc2626" }}>R$ {currentCusto.toFixed(2)}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.1rem" }}>Lucro Bruto</p>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", color: currentLucro > 0 ? "#16a34a" : "#dc2626" }}>R$ {currentLucro.toFixed(2)}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", color: "#64748b", fontSize: "1.1rem" }}>Margem de Lucro</p>
                  <p style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", color: currentMargem >= 40 ? "#166534" : currentMargem > 10 ? "#854d0e" : "#991b1b" }}>
                    {currentMargem.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "8px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="primary-btn">
                  {saving ? "Salvando..." : "Salvar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroProdutos;
