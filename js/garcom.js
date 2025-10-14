// garcom.js — mesas e comandas
let mesaSelecionada = null;
let comandaSelecionada = null;

function iniciarGarcom(){
  carregarTudo();
  montarListaMesas();
  montarSelectPratos();
  atualizarComandasArea();
}

function montarListaMesas(){
  const el = document.getElementById('lista-mesas');
  el.innerHTML = '';
  (window._mesas||[]).forEach(m=>{
    const d = document.createElement('div'); d.className='mesa card';
    d.innerHTML = `<div style="font-weight:700">Mesa ${m.numero}</div><div class="mini">${m.comandas.length} comanda(s)</div>`;
    d.onclick = ()=> { selecionarMesa(m.numero); };
    el.appendChild(d);
  });
}

function selecionarMesa(numero){
  mesaSelecionada = numero;
  comandaSelecionada = null;
  document.getElementById('titulo-mesa-comandas').innerText = 'Mesa ' + numero + ' — Comandas';
  atualizarComandasArea();
}

function atualizarComandasArea(){
  const area = document.getElementById('area-comandas');
  if (!area) return;
  area.innerHTML = '';
  if (mesaSelecionada === null) { area.innerHTML = '<div class="mini">Selecione uma mesa</div>'; return; }
  const mesa = (window._mesas||[]).find(x=>x.numero===mesaSelecionada);
  if (!mesa || mesa.comandas.length===0) { area.innerHTML = '<div class="mini">Nenhuma comanda</div>'; return; }
  mesa.comandas.forEach(c=>{
    const div = document.createElement('div'); div.className='comanda-item';
    div.innerHTML = `<div><strong>${c.nome}</strong><div class="mini">${c.itens.length} item(s)</div></div>
      <div style="display:flex;gap:6px">
        <button class="btn" onclick="abrirComanda('${c.id}')">Abrir</button>
        <button class="btn" onclick="removerComanda('${c.id}')">Remover</button>
      </div>`;
    area.appendChild(div);
  });
  montarItensComanda();
}

function novaComanda(){
  if (mesaSelecionada===null){ alert('Selecione uma mesa'); return; }
  const mesa = (window._mesas||[]).find(x=>x.numero===mesaSelecionada);
  const novo = { id: gerarId(), nome: 'Comanda ' + (mesa.comandas.length+1), itens: [] };
  mesa.comandas.push(novo);
  salvarTudo(); montarListaMesas(); atualizarComandasArea(); abrirComanda(novo.id);
}

function abrirComanda(id){
  comandaSelecionada = id;
  montarItensComanda();
}

function removerComanda(id){
  if (!confirm('Remover comanda?')) return;
  const mesa = (window._mesas||[]).find(x=>x.numero===mesaSelecionada);
  mesa.comandas = mesa.comandas.filter(c=>c.id!==id);
  salvarTudo(); montarListaMesas(); atualizarComandasArea();
}

function montarSelectPratos(){
  const sel = document.getElementById('select-prato');
  sel.innerHTML = '';
  (window._pratos||[]).filter(p=>p.disponivel!==false).forEach(p=>{
    const opt = document.createElement('option'); opt.value=p.id; opt.textContent = `${p.nome} — R$ ${reaisDeCents(p.price_cents)}`;
    sel.appendChild(opt);
  });
}

function montarItensComanda(){
  const el = document.getElementById('itens-comanda'); if(!el) return;
  el.innerHTML = '';
  if (!mesaSelecionada || !comandaSelecionada){ el.innerHTML='<div class="mini">Abra uma comanda</div>'; return; }
  const mesa = (window._mesas||[]).find(x=>x.numero===mesaSelecionada);
  const comanda = mesa.comandas.find(c=>c.id===comandaSelecionada);
  if (!comanda) return;
  if (comanda.itens.length===0) el.innerHTML = '<div class="mini">Sem itens</div>';
  comanda.itens.forEach((it,idx)=>{
    const prato = (window._pratos||[]).find(p=>p.id===it.pratoId) || {nome:'—'};
    const div = document.createElement('div'); div.className='comanda-item';
    div.innerHTML = `<div><strong>${prato.nome}</strong><div class="mini">${it.quantidade} x R$ ${reaisDeCents(it.price_cents)}</div></div>
    <div style="display:flex;gap:6px">
      <div class="status st-${it.status}">${it.status}</div>
      <button class="btn" onclick="removerItem(${idx})">Remover</button>
    </div>`;
    el.appendChild(div);
  });
}

function adicionarItemComanda(){
  if (!mesaSelecionada || !comandaSelecionada){ alert('Abra uma comanda'); return; }
  const pratoId = document.getElementById('select-prato').value;
  const qt = Number(document.getElementById('input-quantidade').value) || 1;
  const prato = (window._pratos||[]).find(p=>p.id===pratoId);
  if (!prato){ alert('Prato inválido'); return; }
  const mesa = (window._mesas||[]).find(x=>x.numero===mesaSelecionada);
  const comanda = mesa.comandas.find(c=>c.id===comandaSelecionada);
  comanda.itens.push({ pratoId: prato.id, quantidade: qt, price_cents: prato.price_cents, status: 'PENDENTE' });
  salvarTudo(); montarItensComanda(); montarListaMesas();
}

function removerItem(indice){
  const mesa = (window._mesas||[]).find(x=>x.numero===mesaSelecionada);
  const comanda = mesa.comandas.find(c=>c.id===comandaSelecionada);
  comanda.itens.splice(indice,1); salvarTudo(); montarItensComanda(); montarListaMesas();
}

/* enviar pedido para cozinha */
function enviarPedido(){
  if (!mesaSelecionada || !comandaSelecionada){ alert('Abra uma comanda com itens antes de enviar'); return; }
  const mesa = (window._mesas||[]).find(x=>x.numero===mesaSelecionada);
  const comanda = mesa.comandas.find(c=>c.id===comandaSelecionada);
  if (comanda.itens.length === 0){ alert('Comanda sem itens'); return; }
  const pedidoId = gerarId();
  const criadoEm = new Date().toISOString();
  const itensCopiados = comanda.itens.map(it => ({ ...it, id: gerarId(), status: 'PENDENTE' }));
  const pedido = { id: pedidoId, mesaNumero: mesa.numero, comandaId: comanda.id, itens: itensCopiados, criadoEm, status: 'ABERTO' };
  window._pedidos.push(pedido);
  // esvaziar comanda (comportamento opcional)
  comanda.itens = [];
  salvarTudo(); montarListaMesas(); atualizarComandasArea();
  alert('Pedido enviado: ' + pedidoId);
}
