// caixa.js — fechamento e relatório
function iniciarCaixa(){
    carregarTudo();
    montarRelatorio();
  }
  
  function fecharConta(){
    const id = document.getElementById('input-pesquisa-pedido').value.trim();
    if (!id){ alert('Informe ID'); return; }
    const pedido = (window._pedidos||[]).find(p=>p.id===id);
    if (!pedido){ alert('Pedido não encontrado'); return; }
    const tipPercent = Number(document.getElementById('select-gorjeta').value) || 0;
    const metodo = document.getElementById('select-metodo').value;
    const subtotal = pedido.itens.reduce((s,it)=> s + (it.price_cents * it.quantidade), 0);
    const tip = Math.round(subtotal * (tipPercent/100));
    const total = subtotal + tip;
    window._pagamentos.push({ id: gerarId(), pedidoId: pedido.id, amount_cents: total, tip_cents: tip, metodo, criadoEm: new Date().toISOString() });
    pedido.status = 'FECHADO';
    salvarTudo();
    document.getElementById('resumo-caixa').innerHTML = `<strong>Pedido ${pedido.id} fechado</strong><div class="mini">Subtotal R$ ${reaisDeCents(subtotal)} • Gorjeta R$ ${reaisDeCents(tip)} • Total R$ ${reaisDeCents(total)}</div>`;
    montarRelatorio();
    alert('Pagamento registrado: R$ ' + reaisDeCents(total));
  }
  
  function montarRelatorio(){
    const el = document.getElementById('relatorio-diario');
    el.innerHTML = '';
    const hoje = new Date(); const inicio = new Date(hoje.getFullYear(),hoje.getMonth(),hoje.getDate()); const fim = new Date(hoje.getFullYear(),hoje.getMonth(),hoje.getDate()+1);
    const pagamentosDia = (window._pagamentos||[]).filter(p => { const d = new Date(p.criadoEm); return d>=inicio && d<fim; });
    if (pagamentosDia.length===0){ el.innerHTML = '<div class="mini">Nenhum pagamento hoje</div>'; return; }
    const porMetodo = {};
    let totalGorjetas = 0;
    pagamentosDia.forEach(p => { porMetodo[p.metodo] = (porMetodo[p.metodo] || 0) + p.amount_cents; totalGorjetas += (p.tip_cents||0); });
    for (const metodo in porMetodo){
      const div = document.createElement('div'); div.className='relatorio-item';
      div.innerHTML = `<strong>${metodo}</strong><div class="mini">Total: R$ ${reaisDeCents(porMetodo[metodo])}</div>`;
      el.appendChild(div);
    }
    const g = document.createElement('div'); g.className='card'; g.style.marginTop='8px'; g.innerHTML = `<strong>Total como taxa hoje</strong><div class="mini">R$ ${reaisDeCents(totalGorjetas)}</div>`;
    el.appendChild(g);
  }
  