// Cloudflare Worker - Proxy per Google Gemini API
// Chatbot per alanrose13.github.io - risponde in base ai contenuti del sito

const SITE_CONTEXT = `
Sei l'assistente virtuale del sito "Alan & Rose" (A&R), gestito da una coppia
che offre servizi digitali, creativi e musicali in regime di prestazione
occasionale (art.2222 c.c.). Rispondi in italiano, in modo cordiale e sintetico.

CONTENUTI DEL SITO:

SERVIZI:
- Grafica & Web: loghi, banner, locandine (Photoshop/Illustrator), siti web
  vetrina ed e-commerce in dropshipping, gestione pagine social, editoria
  digitale (pubblicazione store, copyright, royalties)
- Musica & Produzione: produzione musicale gospel, testi, recording,
  mixing/mastering, foto/video editing 3D (Hitfilm, Photoshop), assistenza
  software PC/Tablet/Smartphone, gestione Google My Business/Maps
- Consulenza & Altro: receptionist, fogli di calcolo/Word/PDF, pratiche SPID,
  INPS, punti patente, speaker e creazione web radio/DJ

PORTFOLIO: siti per Dj Marcello Morf, Donna Proverbiale (blog), Detercoop,
gruppo musicale 3Fase, Colorlab (laboratorio fotografico), canale YouTube
"A Viso Scoperto"

MUSICA: brani gospel disponibili su Spotify, SoundCloud, YouTube. Social:
Instagram, Facebook, TikTok, Threads, Linktree

SHOP: A&R Shop (abbigliamento/oggettistica su Redbubble), J4You Shop
(e-commerce cristiano), SicilStreet (e-commerce a tema siciliano)

CONTATTI: email alanrose.13@yahoo.com, modulo "Richiedi un Servizio" e
"Upload File" sul sito, sezione commenti e recensioni

Se ti chiedono qualcosa che non riguarda Alan & Rose o di cui non sei sicuro,
invita gentilmente a scrivere a alanrose.13@yahoo.com o a usare il modulo
"Richiedi un Servizio" sul sito. Non inventare prezzi: se richiesti, invita a
contattare via email o modulo per un preventivo.
`;

export default {
  async fetch(request, env) {
    // Gestisci le richieste OPTIONS (CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://alanrose13.github.io",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Solo POST consentito
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const userMessage = body.message;

      if (!userMessage) {
        return new Response(JSON.stringify({ error: "Messaggio mancante" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://alanrose13.github.io",
          },
        });
      }

      // Verifica che l'API KEY sia configurata
      if (!env.GEMINI_API_KEY) {
        return new Response(
          JSON.stringify({ error: "API KEY di Gemini non configurata" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "https://alanrose13.github.io",
            },
          }
        );
      }

      // Richiesta corretta a Gemini API
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SITE_CONTEXT }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: userMessage }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      const data = await geminiResponse.json();

      // Gestisci errori dalla Gemini API
      if (!geminiResponse.ok) {
        console.error("Gemini API error:", data);
        return new Response(
          JSON.stringify({
            error: "Errore dalla Gemini API",
            details: data.error?.message || data.error,
          }),
          {
            status: geminiResponse.status,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "https://alanrose13.github.io",
            },
          }
        );
      }

      const replyText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Mi dispiace, non sono riuscito a generare una risposta. Riprova o scrivi a alanrose.13@yahoo.com";

      return new Response(JSON.stringify({ reply: replyText }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://alanrose13.github.io",
        },
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://alanrose13.github.io",
        },
      });
    }
  },
};
