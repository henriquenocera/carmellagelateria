// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import "../css/HomeCopy.css";
import { STORE_CONFIG } from '../config/store.js';

import supabase from "../supabase-client";
import { Helmet } from "react-helmet";
import moment from "moment";

type VoucherRow = {
  id: number;
  created_at: string;
  voucher_id: string;
  value: string;
};

function Voucher() {
  const store = STORE_CONFIG.textName;
  const dateNow = new Date();
  const [vouchers, setVouchers] = useState<VoucherRow[]>([]);
  const [rowId, setRowId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState("");
  const [isCheckingId, setIsCheckingId] = useState(false);
  const idInputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVouchers = vouchers.filter((voucher) => 
    voucher.voucher_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    FetchVouchers();
  }, []);

  const FetchVouchers = async () => {
    const { data, error } = await supabase
      .from("Vouchers")
      .select("*")
      .is("active", true)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setVouchers(data);
      console.log("DB Fetch Ok", data);
    }
  };

  function handleClick(id) {
    console.log("Open Modal");
    setIsModalOpen(true);
    setRowId(id);
  }

  async function checkId(e: any) {
    console.log("Check ID");
    e.preventDefault();
    let idInput = idInputRef.current?.value;

    if (!idInput) return;

    setIsCheckingId(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("short_id", idInput)
      .single();
    
    setIsCheckingId(false);

    if (error || !data) {
      window.alert("ID não encontrado. Verifique e tente novamente.");
      setUser("");
    } else {
      setUser(data.name);
    }
  }

  const updateVouchers = async () => {
    const { data, error } = await supabase
      .from("Vouchers")
      .update({
        active: false,
        store_consumed: store,
        date_consumed: dateNow,
        person_consumed: user,
      })
      .eq("id", rowId);
    setIsModalOpen(false);

    FetchVouchers();
  };

  return (
    <>
      <Helmet>
        <title>Voucher</title>
      </Helmet>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {user == "" ? (
              <>
                <h3 className="modalTitle">Por favor, digite seu ID</h3>
                <input
                  type="password"
                  placeholder="Seu ID"
                  className="userInput"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  min="0"
                  max="9999"
                  required
                  ref={idInputRef}
                />
                <div className="modal-buttons">
                  <button
                    onClick={(e) => checkId(e)}
                    className="confirm-button"
                    disabled={isCheckingId}
                  >
                    {isCheckingId ? "Verificando..." : "Confirmar ID"}
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setUser("");
                    }}
                    className="close-button"
                  >
                    Voltar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modalTextContainer">
                  <p className="modalText">
                    Ao concluir, você confirma que o cliente te informou o
                    voucher e está recebendo o item informado
                  </p>
                </div>
                <h3 className="modalTitle">Responsável pelo Voucher:</h3>
                <h2 className="user">{user}</h2>
                <div className="modal-buttons">
                  <button
                    type="submit"
                    className="confirm-button"
                    onClick={() => updateVouchers()}
                  >
                    Enviar Voucher
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setUser("");
                    }}
                    className="close-button"
                  >
                    Voltar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="homeVoucher">
        <h1 style={{ paddingBottom: "20px", paddingTop: "20px" }}>Vouchers Ativos</h1>

        <div style={{ marginBottom: "20px", width: "100%", maxWidth: "400px" }}>
          <input 
            type="text" 
            placeholder="Pesquisar por nome do voucher..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", outline: "none" }}
          />
        </div>

        <div className="container" style={{ display: "block", maxHeight: "75vh", overflowY: "auto", maxWidth: "1000px", width: "95%", margin: "0 auto" }}>
          {filteredVouchers.length === 0 ? (
            <p>Nenhum voucher encontrado.</p>
          ) : (
            <table className="vales-table" style={{ width: "100%", textAlign: "center" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Criado em:</th>
                  <th style={{ textAlign: "center" }}>Nome do Voucher</th>
                  <th style={{ textAlign: "center" }}>Item</th>
                  <th style={{ textAlign: "center" }}>Utilizar Voucher</th>
                </tr>
              </thead>
              <tbody>
                {filteredVouchers.map((list) => (
                  <tr key={list.id}>
                    <td style={{ textAlign: "center" }}>{moment(list.created_at).format("DD/MM/YYYY [às] HH:mm")}</td>
                    <td style={{ textAlign: "center" }}>{list.voucher_id}</td>
                    <td style={{ textAlign: "center" }}>{list.value}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        onClick={() => {
                          handleClick(list.id);
                        }}
                        className="btn"
                        style={{ margin: "0 auto", display: "block" }}
                      >
                        Utilizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Voucher;
