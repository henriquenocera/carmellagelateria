const fetch = require("node-fetch");

exports.handler = async function () {
  const API_KEY = "68c821de116f8b65737668adc66e62f1";
  const TOKEN =
    "ATTA4607b0c667bc6b061ba9deb7eb850fb1e000aa77fe479de728a7945216e62c6aF34C6FD7";
  const AHU_LIST_ID = "63bf0dba82f78500d81e8843";
  const ALTOXV_LIST_ID = "63c05f1f59d5e80260c52c56";
  const BATEL_LIST_ID = "659bd6c9f1b2bc4d35121255";

  const AHU_URL = `https://api.trello.com/1/lists/${AHU_LIST_ID}/cards?key=${API_KEY}&token=${TOKEN}`;
  const ALTOXV_URL = `https://api.trello.com/1/lists/${ALTOXV_LIST_ID}/cards?key=${API_KEY}&token=${TOKEN}`;
  const BATEL_URL = `https://api.trello.com/1/lists/${BATEL_LIST_ID}/cards?key=${API_KEY}&token=${TOKEN}`;

  const response_ahu = await fetch(AHU_URL);
  const data_ahu = await response_ahu.json();
  const response_altoxv = await fetch(ALTOXV_URL);
  const data_altoxv = await response_altoxv.json();
  const response_batel = await fetch(BATEL_URL);
  const data_batel = await response_batel.json();
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Allow from anywhere
    },
    body: JSON.stringify({ data_ahu, data_altoxv, data_batel }),
  };
};
