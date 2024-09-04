// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-08-18
// @description  try to take over the world!
// @author       You
// @match        https://app2.pontomais.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

(function () {
  setInterval(function () {
    console.log("Running every 5sec...");
    let ponto = document.querySelector(
      "#content-wrapper > div.content-container > div.content.p0.pb50 > ng-view > div.panel.panel-default.bb0.m0.br-b0.ng-scope.br-0.bt0 > div.list-group.clearfix > div:nth-child(1)"
    );
    console.log(ponto);
  }, 1000);
})();
