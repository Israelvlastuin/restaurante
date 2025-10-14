// cardapio.js — controla a página cardapio.html
function iniciarCardapio(){
    carregarTudo();
    montarCardapioPublico();
  }
  function montarCardapioPublico(){
    const el = document.getElementById('lista-pratos-publico');
    if(!el) return;
    el.innerHTML = '';
    (window._pratos || []).filter(p=>p.disponivel!==false).forEach(p=>{
      const div = document.createElement('div'); div.className='prato';
      div.innerHTML = `<h4>${p.nome}</h4><div class="mini">R$ ${reaisDeCents(p.price_cents)}</div><p>${p.descricao||''}</p>`;
      el.appendChild(div);
    });
  }
  