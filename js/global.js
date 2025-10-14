// utilitários e persistência (português)
const KEY_PRATOS = 'rest_pratos';
const KEY_MESAS = 'rest_mesas';
const KEY_PEDIDOS = 'rest_pedidos';
const KEY_PAGAMENTOS = 'rest_pagamentos';

function gerarId(){ return 'id-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*10000).toString(36); }
function centsDeReais(valor){ let v = Number(valor) || 0; return Math.round(v*100); }
function reaisDeCents(cents){ return (cents/100).toFixed(2).replace('.',','); }

function salvarTudo(){
  localStorage.setItem(KEY_PRATOS, JSON.stringify(window._pratos || []));
  localStorage.setItem(KEY_MESAS, JSON.stringify(window._mesas || []));
  localStorage.setItem(KEY_PEDIDOS, JSON.stringify(window._pedidos || []));
  localStorage.setItem(KEY_PAGAMENTOS, JSON.stringify(window._pagamentos || []));
}
function carregarTudo(){
  window._pratos = JSON.parse(localStorage.getItem(KEY_PRATOS) || '[]');
  window._mesas = JSON.parse(localStorage.getItem(KEY_MESAS) || '[]');
  window._pedidos = JSON.parse(localStorage.getItem(KEY_PEDIDOS) || '[]');
  window._pagamentos = JSON.parse(localStorage.getItem(KEY_PAGAMENTOS) || '[]');
  // inicializa mesas se vazio
  if (window._mesas.length === 0) {
    for (let i=1;i<=6;i++) window._mesas.push({ numero:i, comandas:[] });
    salvarTudo();
  }
}
document.addEventListener('DOMContentLoaded', () => { carregarTudo(); });
