// cozinha.js — visualizar fila e atualizar status
function iniciarCozinha(){
    carregarTudo();
    montarFila();
    montarPedidosRecentes();
  }
  
  function montarFila(){
    const el = document.getElementById('fila-itens');
    el.innerHTML = '';
    const itensAll = [];
    (window._pedidos||[]).forEach(p=>{
      p.itens.forEach(it => {
        itensAll.push({ pedidoId: p.id, mesaNumero: p.mesaNumero, criadoEm: p.criadoEm, ...it });
      });
    });
    // ordenar por criadoEm (pedido)
    itensAll.sort((a,b)=>{
      const pa = (window._pedidos||[]).find(p=>p.id===a.pedidoId);
      const pb = (window._pedidos||[]).find(p=>p.id===b.pedidoId);
      if (!pa || !pb) return 0;
      return new Date(pa.criadoEm) - new Date(pb.criadoEm);
    });
    if (itensAll.length===0) el.innerHTML = '<div class="mini">Nenhum item na fila</div>';
    itensAll.forEach(item=>{
      const prato = (window._pratos||[]).find(p=>p.id===item.pratoId) || {nome:'—'};
      const div = document.createElement('div'); div.className='fila-item';
      div.innerHTML = `<div><strong>${prato.nome}</strong><div class="mini">Mesa ${item.mesaNumero} • Pedido ${item.pedidoId}</div></div>
        <div style="display:flex;gap:6px;align-items:center">
          <div class="status st-${item.status}">${item.status}</div>
          <button class="botao-pequeno amarelo" onclick="atualizarStatus('${item.pedidoId}','${item.id}','EM_PREPARO')">Em preparo</button>
          <button class="botao-pequeno verde" onclick="atualizarStatus('${item.pedidoId}','${item.id}','PRONTO')">Marcar pronto</button>
        </div>`;
      el.appendChild(div);
    });
  }
  
  function montarPedidosRecentes(){
    const el = document.getElementById('lista-pedidos');
    el.innerHTML = '';
    (window._pedidos||[]).slice().reverse().forEach(p=>{
      const subtotal = p.itens.reduce((s,it)=> s + (it.price_cents * it.quantidade), 0);
      const div = document.createElement('div'); div.className='comanda-item';
      div.innerHTML = `<div><strong>Pedido ${p.id}</strong><div class="mini">Mesa ${p.mesaNumero}</div><div class="mini">Itens: ${p.itens.length}</div></div>
        <div class="mini">R$ ${reaisDeCents(subtotal)}</div>`;
      el.appendChild(div);
    });
  }
  
  function atualizarStatus(pedidoId, itemId, novoStatus){
    const pedido = (window._pedidos||[]).find(p=>p.id===pedidoId);
    if (!pedido) return;
    const item = pedido.itens.find(i=>i.id===itemId);
    if (!item) return;
    item.status = novoStatus;
    salvarTudo(); montarFila(); montarPedidosRecentes();
    if (novoStatus === 'PRONTO') alert('Item marcado como PRONTO (Pedido ' + pedidoId + ')');
  }
  