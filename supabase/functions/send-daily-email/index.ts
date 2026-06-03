import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { avaliarRegrasDeNegocio } from './regrasDeNegocio.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const EMAIL_RECIPIENTS = Deno.env.get('EMAIL_RECIPIENTS') || 'henocera@gmail.com'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch Yesterday's Checklists
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0] // YYYY-MM-DD
    
    const { data: checklistsData, error: checklistsError } = await supabaseClient
      .from('Checklist')
      .select('*')
      .eq('checklist', 'Checklist de Fechamento')
      .gte('created_at', `${yesterdayStr}T00:00:00.000Z`)
      .lte('created_at', `${yesterdayStr}T23:59:59.999Z`)

    if (checklistsError) throw checklistsError

    // Build checklists object
    const checklists = { ahu: null, altoxv: null }
    checklistsData?.forEach(c => {
      if (c.store === 'ahu') checklists.ahu = c
      if (c.store === 'altoxv') checklists.altoxv = c
    })

    // 2. Fetch Cubas (cardsahu & cardsaltoxv)
    const { data: cardsAhu, error: errAhu } = await supabaseClient
      .from('cardsahu')
      .select('id, title, status, production_date')
      .in('status', ['vitrine-atual', 'freezer-estoque'])
      
    if (errAhu) throw errAhu

    const { data: cardsAltoxv, error: errAltoxv } = await supabaseClient
      .from('cardsaltoxv')
      .select('id, title, status, production_date')
      .in('status', ['vitrine-atual', 'freezer-estoque'])

    if (errAltoxv) throw errAltoxv

    // Parse items
    const formatStoreData = (cards: any[]) => {
      const vitrine = cards.filter(c => c.status === 'vitrine-atual')
      const estoque = cards.filter(c => c.status === 'freezer-estoque')
      return {
        vitrine: vitrine.length,
        estoque: estoque.length,
        itensVitrine: vitrine.map(c => (c.title || '').toLowerCase()),
        itensEstoque: estoque.map(c => (c.title || '').toLowerCase()),
        itensEstoqueDetalhado: estoque
      }
    }

    const estoque = {
      ahu: formatStoreData(cardsAhu || []),
      altoxv: formatStoreData(cardsAltoxv || [])
    }

    // 3. Avaliar regras
    const dados = { estoque, checklists }
    const notificacoes = avaliarRegrasDeNegocio(dados)

    // 4. Generate HTML Email
    let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px;">`
    html += `<h2 style="color: #4f46e5; border-bottom: 2px solid #eee; padding-bottom: 10px;">Relatório Diário Carmella</h2>`
    
    html += `<h3>🚨 Alertas e Regras de Negócio (${notificacoes.length})</h3>`
    if (notificacoes.length === 0) {
      html += `<p style="color: #16a34a; font-weight: bold;">Nenhum alerta! O estoque e a vitrine estão dentro das regras.</p>`
    } else {
      html += `<ul style="list-style: none; padding: 0;">`
      notificacoes.forEach(n => {
        const color = n.tipo === 'erro' ? '#ef4444' : '#f59e0b'
        const bg = n.tipo === 'erro' ? '#fef2f2' : '#fffbeb'
        html += `
          <li style="margin-bottom: 10px; padding: 15px; border-left: 4px solid ${color}; background-color: ${bg}; border-radius: 4px;">
            <strong style="display: block; color: ${color}; margin-bottom: 5px;">${n.titulo}</strong>
            ${n.mensagem || ''}
          </li>`
      })
      html += `</ul>`
    }

    html += `<h3>📋 Checklists de Fechamento (${yesterdayStr})</h3>`
    html += `<div style="display: flex; flex-direction: column; gap: 20px;">`
    
    const renderChecklist = (storeName: string, data: any) => {
      if (!data) return `<div style="flex:1; padding: 15px; border: 1px solid #ddd; border-radius: 8px;"><strong>${storeName}</strong><br><span style="color:#ef4444; margin-top: 8px; display: block;">❌ Não preenchido</span></div>`
      
      const formatDetails = (text: string) => {
        if (!text) return '-';
        return text.replace(/ \[/g, '<br>[');
      }

      return `
        <div style="flex:1; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9fafb;">
          <strong style="color: #4f46e5; display: block; margin-bottom: 10px;">${storeName}</strong>
          <div style="margin-bottom: 5px;">Responsável: <strong>${data.person || '-'}</strong></div>
          <div style="margin-bottom: 5px;">Panos Limpos: <strong>${data.panos || '-'}</strong></div>
          <div style="margin-bottom: 5px;">Brownies: <strong>${formatDetails(data.brownies)}</strong></div>
          <div>Massas/Waffles: <strong>${formatDetails(data.massas)}</strong></div>
        </div>
      `
    }
    html += renderChecklist('Ahú', checklists.ahu)
    html += renderChecklist('Alto da XV', checklists.altoxv)
    html += `</div>`

    html += `<h3>🧊 Estoque Atual de Cubas</h3>`
    html += `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Loja</th>
            <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">Vitrine</th>
            <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">Freezer</th>
            <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">Ahú</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${estoque.ahu.vitrine}</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${estoque.ahu.estoque}</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; font-weight: bold; background-color: #f9fafb;">${estoque.ahu.vitrine + estoque.ahu.estoque}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">Alto da XV</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${estoque.altoxv.vitrine}</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center;">${estoque.altoxv.estoque}</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; text-align: center; font-weight: bold; background-color: #f9fafb;">${estoque.altoxv.vitrine + estoque.altoxv.estoque}</td>
          </tr>
        </tbody>
      </table>
    `
    html += `</div>
</body>
</html>`

    // 5. Send via Resend
    const recipientsList = EMAIL_RECIPIENTS.split(',').map(e => e.trim())

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Relatório Carmella <onboarding@resend.dev>", // Using testing domain
        to: recipientsList,
        subject: `Relatório Diário de Fechamento e Estoque - ${yesterdayStr}`,
        html: html,
      }),
    })

    const resData = await res.json()

    return new Response(
      JSON.stringify({ success: true, resend: resData }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    )
  }
})
