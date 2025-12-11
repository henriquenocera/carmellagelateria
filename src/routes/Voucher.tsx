// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import "../css/HomeCopy.css";

import supabase from "../supabase-client";
import { Helmet } from "react-helmet";
import moment from "moment";
import { ListId } from "../id.ts";

type VoucherRow = {
  id: number;
  created_at: string;
  voucher_id: string;
  value: string;
};

function Voucher() {
  const store = "Ahu";
  const dateNow = new Date();
  const [vouchers, setVouchers] = useState<VoucherRow[]>([]);
  const [rowId, setRowId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState("");
  const idInputRef = useRef<HTMLInputElement | null>(null);

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

  function checkId(e) {
    console.log("Check ID");
    e.preventDefault();
    let idInput = idInputRef.current.value;

    if (idInput == ListId[0].value) {
      setUser(ListId[0].nome);
    } else if (idInput == ListId[1].value) {
      setUser(ListId[1].nome);
    } else if (idInput == ListId[2].value) {
      setUser(ListId[2].nome);
    } else if (idInput == ListId[3].value) {
      setUser(ListId[3].nome);
    } else if (idInput == ListId[4].value) {
      setUser(ListId[4].nome);
    } else if (idInput == ListId[5].value) {
      setUser(ListId[5].nome);
    } else if (idInput == ListId[6].value) {
      setUser(ListId[6].nome);
    } else {
      setUser("");
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
                  >
                    Confirmar ID
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
        <h1>Vouchers Ativos</h1>
        <div className="container">
          {vouchers.length === 0 ? (
            <p>Nenhum voucher ativo.</p>
          ) : (
            <table className="vales-table">
              <thead>
                <tr>
                  <th>Criado em:</th>
                  <th>Nome do Voucher</th>
                  <th>Item</th>
                  <th>Utilizar Voucher</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((list) => (
                  <tr key={list.id}>
                    <td>{moment(list.created_at).format("DD/MM/YYYY [às] HH:mm")}</td>
                    <td>{list.voucher_id}</td>
                    <td>{list.value}</td>
                    <td>
                      <button
                        onClick={() => {
                          handleClick(list.id);
                        }}
                        className="btn"
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
