/* ============================================================
   BLESS — Chatbot Assistente Virtuale di Alan & Rose
   Widget autonomo: si inietta da solo (CSS + HTML + logica).
   Uso: <script src="chatbot.js"></script> prima di </body>
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     1) CSS del widget
  ------------------------------------------------------------ */
  var AR_CHAT_CSS = `
    #arChatBtn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, #F5F1E8 0%, #C9A961 100%);
      border: 2px solid #C9A961;
      box-shadow: 0 8px 30px rgba(201, 169, 97, 0.3), 0 0 60px rgba(201, 169, 97, 0.1);
      cursor: pointer;
      z-index: 10000;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: chatPulse 3s ease-in-out infinite;
    }
    @keyframes chatPulse {
      0%, 100% { box-shadow: 0 8px 30px rgba(201, 169, 97, 0.3), 0 0 60px rgba(201, 169, 97, 0.1); }
      50% { box-shadow: 0 8px 40px rgba(201, 169, 97, 0.4), 0 0 80px rgba(201, 169, 97, 0.15); }
    }
    #arChatBtn:hover {
      transform: scale(1.1) rotate(-3deg);
      box-shadow: 0 12px 40px rgba(201, 169, 97, 0.4), 0 0 80px rgba(201, 169, 97, 0.15);
    }
    #arChatBtn img {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }

    #arChatBadge {
      position: fixed;
      bottom: 66px;
      right: 14px;
      width: 22px;
      height: 22px;
      background: #E24C4C;
      color: #fff;
      border-radius: 50%;
      font-size: .75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      box-shadow: 0 2px 8px rgba(0,0,0,.25);
      animation: badgePop .4s cubic-bezier(0.23,1,0.32,1) both;
      pointer-events: none;
      font-family: 'Segoe UI', sans-serif;
    }
    @keyframes badgePop {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); }
    }
    #arChatBadge.hidden { display: none; }

    #arChatTooltip {
      position: fixed;
      bottom: 96px;
      right: 14px;
      max-width: 190px;
      background: #fff;
      color: #4A3B2A;
      font-family: 'Segoe UI', sans-serif;
      font-size: .85rem;
      font-weight: 600;
      padding: 10px 14px;
      border-radius: 14px;
      border-bottom-right-radius: 4px;
      box-shadow: 0 8px 24px rgba(0,0,0,.15);
      z-index: 10001;
      cursor: pointer;
      opacity: 0;
      transform: translateY(8px) scale(0.96);
      transition: opacity .4s cubic-bezier(0.23,1,0.32,1), transform .4s cubic-bezier(0.23,1,0.32,1);
      pointer-events: none;
    }
    #arChatTooltip.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    #arChatTooltip .tt-close {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 18px;
      height: 18px;
      background: #4A3B2A;
      color: #fff;
      border-radius: 50%;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    @media (max-width: 480px) {
      #arChatTooltip { right: 10px; bottom: 86px; max-width: 160px; font-size: .8rem; }
      #arChatBadge { right: 12px; bottom: 58px; width: 20px; height: 20px; font-size: .7rem; }
    }

    #arChatWindow {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 380px;
      max-width: 92vw;
      height: 560px;
      max-height: min(78vh, 78dvh);
      background: rgba(255, 255, 255, 0.92);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 80px rgba(201,169,97,0.05);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 10000;
      font-family: 'Segoe UI', sans-serif;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border: 1px solid rgba(201,169,97,0.2);
      color: #4A3B2A;
    }
    #arChatWindow.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    #arChatHeader {
      background: linear-gradient(135deg, #4A3B2A 0%, #3A2B1A 100%);
      color: #fff;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      border-bottom: 1px solid rgba(201,169,97,0.2);
      flex-shrink: 0;
    }
    #arChatHeader .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #arChatHeader .header-left .avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #F5F1E8 0%, #C9A961 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 1px solid rgba(201,169,97,0.4);
    }
    #arChatHeader .header-left .chat-title .name {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    #arChatHeader .header-left .chat-title .sub {
      font-size: 0.65rem;
      opacity: 0.7;
      font-weight: 400;
    }
    #arChatHeader .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #arChatHeader span.close {
      cursor: pointer;
      font-size: 22px;
      transition: .2s;
      opacity: 0.7;
    }
    #arChatHeader span.close:hover { opacity: 1; }
    #arChatClearBtn {
      background: transparent;
      border: none;
      color: #fff;
      opacity: 0.75;
      font-size: 0.68rem;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 3px 6px;
      border-radius: 6px;
      transition: .2s;
      font-family: 'Segoe UI', sans-serif;
      font-weight: 600;
    }
    #arChatClearBtn:hover { opacity: 1; background: rgba(255,255,255,0.1); }

    #arChatMessages {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
      background: rgba(245, 241, 232, 0.3);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
      position: relative;
    }
    #arChatMessages::-webkit-scrollbar { width: 4px; }
    #arChatMessages::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.05);
      border-radius: 10px;
    }
    #arChatMessages::-webkit-scrollbar-thumb {
      background: rgba(201,169,97,0.3);
      border-radius: 10px;
    }

    #arConsentOverlay {
      position: absolute;
      inset: 0;
      z-index: 20;
      background: linear-gradient(160deg, rgba(245,241,232,0.98) 0%, rgba(245,241,232,0.94) 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
      text-align: center;
      gap: 14px;
    }
    #arConsentOverlay .consent-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #F5F1E8 0%, #C9A961 100%);
      border: 1px solid rgba(201,169,97,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 2px;
    }
    #arConsentOverlay h4 { color: #4A3B2A; font-size: 0.98rem; font-weight: 700; }
    #arConsentOverlay p {
      color: #4A3B2A;
      font-size: 0.82rem;
      opacity: 0.85;
      line-height: 1.5;
      max-width: 280px;
    }
    #arConsentOverlay .consent-check-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background: #fff;
      border: 1px solid rgba(201,169,97,0.35);
      border-radius: 10px;
      padding: 12px 14px;
      max-width: 300px;
      text-align: left;
      box-shadow: 0 4px 12px rgba(0,0,0,.05);
    }
    #arConsentOverlay .consent-check-row input[type="checkbox"] {
      margin-top: 3px; flex-shrink: 0; width: 16px; height: 16px; accent-color: #C9A961;
    }
    #arConsentOverlay .consent-check-row label {
      font-size: 0.78rem; color: #4A3B2A; line-height: 1.4; cursor: pointer;
    }
    #arConsentOverlay .consent-check-row a { color: #C9A961; text-decoration: underline; }
    #arConsentOverlay .consent-accept-btn {
      background: linear-gradient(135deg, #C9A961 0%, #B8962E 100%);
      color: #fff; border: none; border-radius: 10px; padding: 10px 26px;
      font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: .3s;
      font-family: 'Segoe UI', sans-serif; opacity: 0.5; pointer-events: none;
    }
    #arConsentOverlay .consent-accept-btn.enabled { opacity: 1; pointer-events: auto; }
    #arConsentOverlay .consent-accept-btn.enabled:hover {
      transform: scale(1.03); box-shadow: 0 4px 15px rgba(201,169,97,0.35);
    }
    #arConsentOverlay.hidden { display: none; }

    .ar-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: .9rem;
      line-height: 1.5;
      animation: arMsgIn .3s cubic-bezier(0.23, 1, 0.32, 1);
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    @keyframes arMsgIn {
      from { opacity: 0; transform: translateY(8px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .ar-msg.bot {
      background: #fff;
      border: 1px solid rgba(201,169,97,0.2);
      align-self: flex-start;
      color: #4A3B2A;
      border-top-left-radius: 4px;
    }
    .ar-msg.user {
      background: linear-gradient(135deg, #C9A961 0%, #B8962E 100%);
      color: #fff;
      align-self: flex-end;
      font-weight: 500;
      border-top-right-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ar-msg.user .user-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: linear-gradient(135deg, #C9A961 0%, #B8962E 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; flex-shrink: 0;
      border: 2px solid rgba(255,255,255,0.3);
      color: #fff; font-weight: 700;
      box-shadow: 0 2px 8px rgba(201,169,97,0.4);
    }
    .ar-msg.typing {
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(201,169,97,0.15);
      align-self: flex-start;
      color: #999;
      font-style: italic;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px 16px;
      border-radius: 20px;
      border-top-left-radius: 4px;
    }
    .ar-msg.typing .dot {
      display: inline-block; width: 7px; height: 7px;
      background: #C9A961; border-radius: 50%;
      animation: dotPulse 1.2s ease-in-out infinite;
    }
    .ar-msg.typing .dot:nth-child(2) { animation-delay: .15s; }
    .ar-msg.typing .dot:nth-child(3) { animation-delay: .3s; }
    @keyframes dotPulse {
      0%, 60%, 100% { opacity: .3; transform: scale(.8); }
      30% { opacity: 1; transform: scale(1.2); }
    }

    #arChatInputRow {
      display: flex;
      align-items: flex-end;
      border-top: 1px solid rgba(201,169,97,0.15);
      padding: 10px 12px;
      gap: 6px;
      background: rgba(255,255,255,0.5);
      flex-shrink: 0;
    }
    #arChatInput {
      flex: 1;
      min-width: 0;
      border: 1px solid rgba(201,169,97,0.2);
      border-radius: 12px;
      padding: 10px 14px;
      font-family: 'Segoe UI', sans-serif;
      font-size: .9rem;
      background: rgba(255,255,255,0.7);
      transition: .3s;
      resize: none;
      overflow-y: auto;
      max-height: 100px;
      line-height: 1.4;
    }
    #arChatInput:focus {
      outline: none;
      border-color: #C9A961;
      box-shadow: 0 0 0 3px rgba(201,169,97,0.1);
    }
    #arChatInput:disabled { opacity: 0.6; cursor: not-allowed; }

    #arChatMicSend {
      background: linear-gradient(135deg, #C9A961 0%, #B8962E 100%);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      transition: .3s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4A3B2A;
    }
    #arChatMicSend svg { width: 19px; height: 19px; display: block; }
    #arChatMicSend:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(201,169,97,0.3); }
    #arChatMicSend.recording {
      background: #E24C4C;
      color: #fff;
      animation: pulseMic 1s ease-in-out infinite;
    }
    #arChatMicSend:disabled { opacity: 0.4; cursor: not-allowed; animation: none; }
    @keyframes pulseMic {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.12); }
    }

    .ar-voice-out-wrap {
      display: flex; flex-direction: column; align-items: center; flex-shrink: 0; gap: 2px;
    }
    .ar-voice-out-wrap .voice-out-label {
      font-size: .55rem; line-height: 1; color: #4A3B2A; opacity: 0.65;
      white-space: nowrap; font-weight: 600; text-align: center;
    }
    #arVoiceOutBtn {
      background: rgba(201,169,97,0.12);
      border: 1px solid rgba(201,169,97,0.3);
      border-radius: 10px;
      width: 38px; height: 34px; font-size: 17px; cursor: pointer; transition: .3s;
      display: flex; align-items: center; justify-content: center; color: #4A3B2A;
    }
    #arVoiceOutBtn.active {
      background: linear-gradient(135deg, #C9A961 0%, #B8962E 100%);
      border-color: #B8962E; color: #fff;
      box-shadow: 0 2px 10px rgba(201,169,97,0.35);
    }
    #arVoiceOutBtn:hover { transform: scale(1.05); }
    #arVoiceOutBtn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

    #arChatFooterBar {
      padding: 8px 14px 12px;
      background: rgba(255,255,255,0.5);
      border-top: 1px solid rgba(201,169,97,0.1);
      flex-shrink: 0;
    }
    .ar-quick-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
    .ar-quick-actions button {
      background: #C9A961;
      color: #4A3B2A;
      padding: 6px 12px;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      font-size: .74rem;
      transition: .3s;
      font-family: 'Segoe UI', sans-serif;
      white-space: nowrap;
    }
    .ar-quick-actions button:hover { background: #4A3B2A; color: #fff; transform: scale(1.03); }
    #arChatFooterBar .ar-privacy-note { font-size: .7rem; line-height: 1.4; color: #8a7a63; margin-bottom: 6px; }
    #arChatFooterBar .ar-privacy-note a { color: #C9A961; text-decoration: underline; }
    #arChatFooterBar .ai-disclaimer {
      font-size: .66rem; line-height: 1.4; color: #8a7a63; opacity: 0.85; margin-top: 6px;
    }

    .ar-action-buttons { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .ar-action-buttons button {
      background: #C9A961;
      color: #4A3B2A;
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: .8rem;
      transition: .3s;
      font-family: 'Segoe UI', sans-serif;
    }
    .ar-action-buttons button:hover { background: #4A3B2A; color: #fff; transform: scale(1.03); }

    .ar-msg.bot .ar-inline-form {
      margin: 10px 0 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(201,169,97,0.2);
    }
    .ar-msg.bot .ar-inline-form iframe {
      width: 100%; height: 380px; border: none; display: block;
    }

    .ar-msg.bot a { color: #B8962E; text-decoration: underline; font-weight: 600; }
    .ar-msg.bot a:hover { color: #8A7024; }

    @media (max-width: 480px) {
      #arChatWindow {
        right: 8px;
        left: 8px;
        bottom: calc(76px + env(safe-area-inset-bottom, 0px));
        width: auto;
        max-width: none;
        height: min(72vh, 72dvh);
        max-height: min(72vh, 72dvh);
        border-radius: 16px;
      }
      #arChatBtn { right: 15px; bottom: 15px; width: 60px; height: 60px; }
      #arChatBtn img { width: 48px; height: 48px; }
      #arChatHeader { padding: 12px 14px; }
      #arChatHeader .header-left .avatar-small { width: 28px; height: 28px; font-size: 14px; }
      #arChatHeader .header-left .chat-title .name { font-size: .9rem; }
      #arChatHeader .header-left .chat-title .sub { font-size: .6rem; }
      #arChatClearBtn { font-size: .62rem; }
      #arChatMessages { padding: 12px; gap: 6px; }
      .ar-msg { font-size: .85rem; max-width: 90%; padding: 9px 12px; }
      .ar-msg.user .user-avatar { width: 24px; height: 24px; font-size: 12px; }
      .ar-msg.bot .ar-inline-form iframe { height: 280px; }
      #arChatInputRow { padding: 8px 8px; gap: 4px; }
      #arChatInput { font-size: .85rem; padding: 9px 12px; }
      #arChatMicSend { width: 36px; height: 38px; }
      #arChatMicSend svg { width: 17px; height: 17px; }
      #arVoiceOutBtn { width: 32px; height: 32px; font-size: 15px; }
      .ar-voice-out-wrap .voice-out-label { font-size: .5rem; }
      #arChatFooterBar { padding: 6px 10px 10px; }
      .ar-quick-actions { gap: 4px; margin-bottom: 6px; }
      .ar-quick-actions button { font-size: .68rem; padding: 5px 10px; }
      #arChatFooterBar .ar-privacy-note { font-size: .64rem; }
      #arChatFooterBar .ai-disclaimer { font-size: .6rem; }
      #arConsentOverlay .consent-check-row { font-size: .7rem; padding: 10px 12px; }
    }
    @media (max-width: 360px) {
      #arChatInput { font-size: .8rem; }
      .ar-quick-actions button { font-size: .64rem; padding: 4px 8px; }
    }
  `;

  /* ------------------------------------------------------------
     2) Markup del widget
  ------------------------------------------------------------ */
  var AR_CHAT_HTML =
    '<div id="arChatTooltip" onclick="arOpenFromTooltip()">' +
      '<span class="tt-close" onclick="event.stopPropagation();arDismissTooltip()">×</span>' +
      '💬 Chatta con noi!' +
    '</div>' +

    '<div id="arChatBadge">1</div>' +

    '<button id="arChatBtn" onclick="arToggleChat()" aria-label="Apri chat assistente BLESS">' +
      '<img src="https://raw.githubusercontent.com/alanrose13/alanrose13.github.io/refs/heads/main/img/AI%20CHAT.png" alt="BLESS" id="arChatBtnImg">' +
    '</button>' +

    '<div id="arChatWindow">' +
      '<div id="arChatHeader">' +
        '<div class="header-left">' +
          '<div class="avatar-small">✨</div>' +
          '<div class="chat-title">' +
            '<span class="name">BLESS</span>' +
            '<span class="sub">Assistente Virtuale A&amp;R</span>' +
          '</div>' +
        '</div>' +
        '<div class="header-right">' +
          '<button id="arChatClearBtn" onclick="arClearChat()" title="Svuota la chat" aria-label="Svuota chat">🗑️ Svuota</button>' +
          '<span class="close" onclick="arToggleChat()">×</span>' +
        '</div>' +
      '</div>' +
      '<div id="arChatMessages">' +
        '<div id="arConsentOverlay">' +
          '<div class="consent-icon">🔒</div>' +
          '<h4>Prima di iniziare</h4>' +
          '<p>Per chattare con BLESS abbiamo bisogno del tuo consenso al trattamento dei dati che scriverai in questa conversazione.</p>' +
          '<div class="consent-check-row">' +
            '<input type="checkbox" id="arChatConsentCheck">' +
            '<label for="arChatConsentCheck">Acconsento al trattamento dei dati che scrivo in questa chat, come da <a href="cookie-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.</label>' +
          '</div>' +
          '<button class="consent-accept-btn" id="arConsentAcceptBtn" onclick="arAcceptConsent()">Accetta e inizia a chattare</button>' +
        '</div>' +
      '</div>' +
      '<div id="arChatInputRow">' +
        '<textarea id="arChatInput" rows="1" placeholder="Scrivi o parla..." oninput="arUpdateMicSendIcon(); arAutoResizeInput(this);" onkeydown="if(event.key===\'Enter\' && !event.shiftKey){event.preventDefault();arSendMessage();}"></textarea>' +
        '<button id="arChatMicSend" onclick="arMicSendClick()" title="Parla ora" aria-label="Registra audio o invia messaggio">' +
          '<svg id="arMicSendIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M19 11a7 7 0 0 1-14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<path d="M12 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg>' +
        '</button>' +
        '<div class="ar-voice-out-wrap">' +
          '<span class="voice-out-label">Ascolta testo</span>' +
          '<button id="arVoiceOutBtn" class="active" onclick="arToggleVoiceOutput()" title="Attiva/disattiva la voce del bot" aria-label="Attiva o disattiva l\'ascolto dei messaggi" aria-pressed="true">🔊</button>' +
        '</div>' +
      '</div>' +
      '<div id="arChatFooterBar">' +
        '<div class="ar-quick-actions">' +
          '<button onclick="arHandleAction(\'mostraServizi\')">📋 Servizi</button>' +
          '<button onclick="arHandleAction(\'mostraMusica\')">🎵 Musica</button>' +
          '<button onclick="arHandleAction(\'mostraContatti\')">📧 Contatti</button>' +
          '<button onclick="arHandleAction(\'mostraFormRichiesta\')">📝 Richiedi Servizio</button>' +
        '</div>' +
        '<div class="ar-privacy-note">' +
          '🔒 I dati che mi scrivi sono trattati secondo la nostra <a href="cookie-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.' +
        '</div>' +
        '<div class="ai-disclaimer">' +
          '🤖 BLESS è un assistente IA: le risposte potrebbero non essere sempre accurate, verifica sempre le informazioni importanti.' +
        '</div>' +
      '</div>' +
    '</div>';

  /* ------------------------------------------------------------
     3) Iniezione nella pagina ospitante
  ------------------------------------------------------------ */
  function arInject() {
    var styleEl = document.createElement('style');
    styleEl.id = 'ar-chatbot-styles';
    styleEl.textContent = AR_CHAT_CSS;
    document.head.appendChild(styleEl);

    var wrapper = document.createElement('div');
    wrapper.innerHTML = AR_CHAT_HTML;
    while (wrapper.firstChild) {
      document.body.appendChild(wrapper.firstChild);
    }
  }
  arInject();

  /* ------------------------------------------------------------
     4) Logica del chatbot (invariata rispetto all'originale)
  ------------------------------------------------------------ */

  // FIX CHAT COPERTA DALLA TASTIERA SU MOBILE
  if (window.visualViewport) {
    var arKeyboardChatWin = null;
    function arFixKeyboardOverlap() {
      if (!arKeyboardChatWin) arKeyboardChatWin = document.getElementById('arChatWindow');
      if (!arKeyboardChatWin || !arKeyboardChatWin.classList.contains('open')) return;
      var overlap = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop;
      arKeyboardChatWin.style.transform = overlap > 0
        ? 'translateY(-' + overlap + 'px) scale(1)'
        : 'translateY(0) scale(1)';
    }
    window.visualViewport.addEventListener('resize', arFixKeyboardOverlap);
    window.visualViewport.addEventListener('scroll', arFixKeyboardOverlap);
  }

  // SINTESI VOCALE
  var arVoiceEnabled = true;
  var arVoicesLoaded = false;
  var arItalianVoice = null;
  var arVoiceLoadAttempts = 0;

  var arFemaleVoiceNames = [
    'elsa', 'isabella', 'fabiola', 'fiamma', 'imelda', 'irma', 'pierina',
    'alice', 'federica', 'paola', 'silvia', 'valentina', 'giorgia',
    'chiara', 'laura', 'monica', 'francesca', 'martina', 'serena',
    'female', 'donna', 'woman'
  ];
  var arMaleVoiceNames = [
    'diego', 'luca', 'giuseppe', 'benigno', 'calimero', 'cataldo',
    'gianni', 'lisandro', 'palmiro', 'rinaldo', 'cosimo', 'marco',
    'roberto', 'fabio', 'matteo', 'nicola', 'giorgio', 'mario',
    'antonio', 'male', 'uomo', 'man'
  ];

  function arIsFemaleVoice(v) {
    var n = v.name.toLowerCase();
    return arFemaleVoiceNames.some(function (name) { return n.includes(name); });
  }

  function arScoreVoice(v) {
    var n = v.name.toLowerCase();
    var score = 0;
    var isMaleKnown = arMaleVoiceNames.some(function (name) { return n.includes(name); });

    if (n.includes('online (natural)') || n.includes('neural')) {
      score += 100;
      if (isMaleKnown) score += 50;
    }
    if (n.includes('google') && n.includes('itali')) score += 70;
    if (isMaleKnown) score += 40;
    if (n.includes('compact')) score -= 20;
    if (n.includes('standard') && !n.includes('online') && !n.includes('neural')) score -= 30;
    if (v.lang === 'it-IT') score += 10;

    return score;
  }

  function arLoadVoices() {
    if (!('speechSynthesis' in window)) return;
    var voices = window.speechSynthesis.getVoices();

    var italianVoices = voices.filter(function (v) {
      return v.lang && v.lang.toLowerCase().startsWith('it') && !arIsFemaleVoice(v);
    });

    if (italianVoices.length > 0) {
      italianVoices.sort(function (a, b) { return arScoreVoice(b) - arScoreVoice(a); });
      arItalianVoice = italianVoices[0];
    } else {
      var nonFemale = voices.filter(function (v) { return !arIsFemaleVoice(v); });
      arItalianVoice = nonFemale.length > 0 ? nonFemale[0] : (voices[0] || null);
    }
    arVoicesLoaded = true;
  }

  function arForceLoadVoices() {
    arLoadVoices();
    if (!arItalianVoice && arVoiceLoadAttempts < 5) {
      arVoiceLoadAttempts++;
      setTimeout(arForceLoadVoices, 500 * arVoiceLoadAttempts);
    }
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function () { arLoadVoices(); };
    setTimeout(arForceLoadVoices, 200);
    setTimeout(arForceLoadVoices, 600);
    setTimeout(arForceLoadVoices, 1200);
    setTimeout(arForceLoadVoices, 2500);
  }

  function arSplitIntoSegments(text) {
    var raw = text.split(/(?<=[.!?…])\s+|(?<=[,;:])\s+(?=\S)/);
    return raw.map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function arSpeak(text) {
    if (!arVoiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!arVoicesLoaded) arLoadVoices();

    var segments = arSplitIntoSegments(text);
    if (segments.length === 0) segments = [text];

    var isPremiumVoice = false;
    if (arItalianVoice) {
      var voiceName = arItalianVoice.name.toLowerCase();
      isPremiumVoice = voiceName.includes('online (natural)') || voiceName.includes('neural');
    }

    segments.forEach(function (segment, idx) {
      var utterance = new SpeechSynthesisUtterance(segment);
      utterance.lang = arItalianVoice ? arItalianVoice.lang : 'it-IT';
      if (arItalianVoice) utterance.voice = arItalianVoice;

      var isQuestion = /[?]\s*$/.test(segment);
      var isExclaim = /[!]\s*$/.test(segment);
      var isShort = segment.length < 20;

      var rateJitter = ((idx % 3) - 1) * 0.015;
      var pitchJitter = ((idx % 4) - 1.5) * 0.02;

      var baseRate = isPremiumVoice ? 1.02 : 0.97;
      var basePitch = isPremiumVoice ? 1.05 : 0.98;

      utterance.rate = Math.max(0.8, Math.min(1.4, baseRate + rateJitter + (isShort ? 0.03 : 0)));
      utterance.pitch = Math.max(0.7, Math.min(1.5, basePitch + pitchJitter + (isQuestion ? 0.08 : 0) + (isExclaim ? 0.05 : 0)));
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
    });
  }

  function arToggleVoiceOutput() {
    arVoiceEnabled = !arVoiceEnabled;
    var btn = document.getElementById('arVoiceOutBtn');
    if (btn) {
      btn.classList.toggle('active', arVoiceEnabled);
      btn.textContent = arVoiceEnabled ? '🔊' : '🔇';
      btn.setAttribute('aria-pressed', arVoiceEnabled ? 'true' : 'false');
    }
    if (!arVoiceEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  window.arToggleVoiceOutput = arToggleVoiceOutput;

  // AUTO-RESIZE TEXTAREA
  function arAutoResizeInput(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  }
  window.arAutoResizeInput = arAutoResizeInput;

  // MICROFONO / INVIO
  var arMicSvg = '<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 11a7 7 0 0 1-14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
  var arSendSvg = '<path d="M4 12 20 4l-6.5 16-2.5-7-7-2.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';

  function arUpdateMicSendIcon() {
    if (arIsRecording) return;
    var input = document.getElementById('arChatInput');
    var icon = document.getElementById('arMicSendIcon');
    var btn = document.getElementById('arChatMicSend');
    if (!input || !icon || !btn) return;

    if (input.value.trim().length > 0) {
      icon.innerHTML = arSendSvg;
      btn.title = 'Invia messaggio';
      btn.setAttribute('aria-label', 'Invia messaggio');
    } else {
      icon.innerHTML = arMicSvg;
      btn.title = 'Parla ora';
      btn.setAttribute('aria-label', 'Registra audio');
    }
  }
  window.arUpdateMicSendIcon = arUpdateMicSendIcon;

  function arMicSendClick() {
    var input = document.getElementById('arChatInput');
    if (arIsRecording) { arStopRecording(); return; }
    if (input && input.value.trim().length > 0) {
      arSendMessage();
    } else {
      arToggleVoiceRecording();
    }
  }
  window.arMicSendClick = arMicSendClick;

  // TRASCRIZIONE VOCALE
  var arRecognition = null;
  var arIsRecording = false;
  var arFinalTranscript = '';

  function arToggleVoiceRecording() {
    if (arIsRecording) arStopRecording(); else arStartRecording();
  }

  function arStartRecording() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      arAddMessage('Il tuo browser non supporta il riconoscimento vocale. Prova con Chrome o Edge.', 'bot');
      return;
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    arRecognition = new SpeechRecognition();
    arRecognition.lang = 'it-IT';
    arRecognition.continuous = true;
    arRecognition.interimResults = true;
    arRecognition.maxAlternatives = 1;

    arFinalTranscript = '';
    var interimTranscript = '';

    arRecognition.onresult = function (event) {
      interimTranscript = '';
      for (var i = event.resultIndex; i < event.results.length; i++) {
        var transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          arFinalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      var input = document.getElementById('arChatInput');
      input.value = arFinalTranscript ? (arFinalTranscript + interimTranscript) : interimTranscript;
      input.selectionStart = input.selectionEnd = input.value.length;
      arAutoResizeInput(input);
    };

    arRecognition.onerror = function (event) {
      if (event.error === 'not-allowed') {
        arAddMessage('Permesso microfono negato. Abilita il microfono nelle impostazioni del browser.', 'bot');
      } else if (event.error !== 'no-speech') {
        arAddMessage('Errore nel riconoscimento vocale. Riprova.', 'bot');
      }
      arStopRecordingUI();
    };

    arRecognition.onend = function () {
      if (arIsRecording) {
        try { arRecognition.start(); } catch (e) { arStopRecordingUI(); }
      }
    };

    try {
      arRecognition.start();
      arIsRecording = true;
      var btn = document.getElementById('arChatMicSend');
      var icon = document.getElementById('arMicSendIcon');
      icon.innerHTML = arMicSvg;
      btn.classList.add('recording');
      btn.title = 'Sto registrando... clicca per fermare';

      document.getElementById('arChatInput').value = '';
      arAddMessage('🎤 Parla ora!', 'bot');
    } catch (e) {
      arAddMessage('Impossibile avviare il microfono. Riprova.', 'bot');
      arStopRecordingUI();
    }
  }

  function arStopRecording() {
    if (arRecognition) { try { arRecognition.stop(); } catch (e) {} }
    var input = document.getElementById('arChatInput');
    var text = input.value.trim();
    arStopRecordingUI();
    if (text) { arSendMessage(); } else { arAddMessage('Non ho rilevato alcun parlato. Riprova o scrivi il tuo messaggio.', 'bot'); }
  }

  function arStopRecordingUI() {
    arIsRecording = false;
    var btn = document.getElementById('arChatMicSend');
    if (btn) btn.classList.remove('recording');
    arUpdateMicSendIcon();
    if (arRecognition) { try { arRecognition.stop(); } catch (e) {} arRecognition = null; }
  }

  // CRONOLOGIA CHAT - localStorage
  function getChatHistory() {
    try {
      var data = localStorage.getItem('arChatHistory');
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  }

  function saveChatHistory(history) {
    try { localStorage.setItem('arChatHistory', JSON.stringify(history)); } catch (e) {}
  }

  function addMessageToHistory(role, content) {
    var history = getChatHistory();
    if (!history) {
      history = { userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6), userName: null, messages: [], created: Date.now() };
    }
    history.messages.push({ role: role, content: content, timestamp: Date.now() });
    if (history.messages.length > 200) history.messages = history.messages.slice(-200);
    saveChatHistory(history);
  }

  function saveUserName(name) {
    var history = getChatHistory();
    if (history) { history.userName = name; saveChatHistory(history); }
  }

  // CONSENSO PRIVACY
  function getConsentGiven() {
    try { return localStorage.getItem('arChatConsentGiven') === '1'; } catch (e) { return false; }
  }
  function setConsentGiven(val) {
    try { localStorage.setItem('arChatConsentGiven', val ? '1' : '0'); } catch (e) {}
  }

  function arAcceptConsent() {
    var check = document.getElementById('arChatConsentCheck');
    if (!check || !check.checked) return;
    setConsentGiven(true);
    var overlay = document.getElementById('arConsentOverlay');
    if (overlay) overlay.classList.add('hidden');
    arSetInputEnabled(true);
    arShowWelcomeIfNeeded();
  }
  window.arAcceptConsent = arAcceptConsent;

  // SVUOTA CHAT
  function arClearChat() {
    try { localStorage.removeItem('arChatHistory'); } catch (e) {}
    var box = document.getElementById('arChatMessages');
    Array.prototype.slice.call(box.children).forEach(function (child) {
      if (child.id !== 'arConsentOverlay') child.remove();
    });
    if (getConsentGiven()) arShowWelcomeIfNeeded(true);
    box.scrollTop = 0;
  }
  window.arClearChat = arClearChat;

  // FUNZIONI DI BASE CHAT
  var AR_WORKER_URL = "https://ai.alanrose-13-1eb.workers.dev";
  var typingInterval = null;
  var isBotTyping = false;
  var currentBotMessage = null;

  function cleanBotResponse(text) {
    if (!text) return "Mi dispiace, non ho capito. Puoi riformulare?";
    var cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    cleaned = cleaned.replace(/<think>[\s\S]*$/i, '').trim();
    return cleaned || "Mi dispiace, non ho capito. Puoi riformulare?";
  }

  function arToggleChat() {
    var chatWin = document.getElementById('arChatWindow');
    var isOpen = chatWin.classList.contains('open');
    if (!isOpen) { loadChatHistory(); } else { chatWin.style.transform = ''; }
    chatWin.classList.toggle('open');
    arDismissTooltip();
    arHideBadge();
  }

  function arOpenFromTooltip() {
    document.getElementById('arChatWindow').classList.add('open');
    loadChatHistory();
    arDismissTooltip();
    arHideBadge();
  }

  function arDismissTooltip() {
    var tt = document.getElementById('arChatTooltip');
    if (tt) tt.classList.remove('visible');
    sessionStorage.setItem('arChatTooltipDismissed', '1');
  }

  function arHideBadge() {
    var badge = document.getElementById('arChatBadge');
    if (badge) badge.classList.add('hidden');
    sessionStorage.setItem('arChatBadgeDismissed', '1');
  }

  function arSetInputEnabled(enabled) {
    var input = document.getElementById('arChatInput');
    var micSendBtn = document.getElementById('arChatMicSend');
    if (input) input.disabled = !enabled;
    if (micSendBtn) micSendBtn.disabled = !enabled;
  }

  function arShowWelcomeIfNeeded(forceGeneric) {
    var box = document.getElementById('arChatMessages');
    var history = getChatHistory();

    if (!forceGeneric && history && history.messages.length > 0) {
      history.messages.slice(-20).forEach(function (msg) {
        arAddMessage(msg.content, msg.role, false);
      });
      if (history.userName) {
        var welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'ar-msg bot welcome-msg';
        welcomeDiv.innerHTML = '👋 Bentornato <strong>' + history.userName + '</strong>! Come posso aiutarti oggi?';
        box.appendChild(welcomeDiv);
      }
    } else {
      var welcomeDiv2 = document.createElement('div');
      welcomeDiv2.className = 'ar-msg bot welcome-msg';
      welcomeDiv2.innerHTML =
        '👋 Ciao! Sono <strong>BLESS</strong>, l\'assistente virtuale di <strong>Alan &amp; Rose</strong>.<br><br>' +
        'Posso aiutarti a conoscere i nostri servizi, il portfolio, la musica e lo shop.<br><br>' +
        'Come ti chiami? Così possiamo darti un trattamento personalizzato.';
      box.appendChild(welcomeDiv2);
    }
    box.scrollTop = box.scrollHeight;
  }

  function loadChatHistory() {
    var overlay = document.getElementById('arConsentOverlay');
    var consentGiven = getConsentGiven();

    if (!consentGiven) {
      if (overlay) overlay.classList.remove('hidden');
      arSetInputEnabled(false);
      return;
    }

    if (overlay) overlay.classList.add('hidden');
    arSetInputEnabled(true);

    var box = document.getElementById('arChatMessages');
    Array.prototype.slice.call(box.children).forEach(function (child) {
      if (child.id !== 'arConsentOverlay') child.remove();
    });

    arShowWelcomeIfNeeded();
  }
  window.loadChatHistory = loadChatHistory;

  document.addEventListener('DOMContentLoaded', function () {
    var consentCheck = document.getElementById('arChatConsentCheck');
    var acceptBtn = document.getElementById('arConsentAcceptBtn');
    if (consentCheck && acceptBtn) {
      consentCheck.addEventListener('change', function () {
        acceptBtn.classList.toggle('enabled', this.checked);
      });
    }
    if (document.getElementById('arChatWindow') && document.getElementById('arChatWindow').classList.contains('open')) {
      loadChatHistory();
    }
  });

  // PULSANTI INTERATTIVI
  function arAddActionButtons(buttons) {
    var box = document.getElementById('arChatMessages');
    var div = document.createElement('div');
    div.className = 'ar-msg bot';
    div.innerHTML = '<div class="ar-action-buttons">' +
      buttons.map(function (b) {
        return '<button onclick="arHandleAction(\'' + b.action + '\')">' + b.label + '</button>';
      }).join('') +
      '</div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function arHandleAction(action) {
    switch (action) {
      case 'mostraServizi':
        arAddMessage('I nostri servizi principali sono: <strong>Grafica & Web</strong>, <strong>Musica & Produzione</strong>, <strong>Consulenza & Altro</strong>. Vuoi sapere più dettagli su uno di questi?', 'bot');
        arAddActionButtons([
          { label: '🖥️ Grafica & Web', action: 'dettaglioGrafica' },
          { label: '🎵 Musica & Produzione', action: 'dettaglioMusica' },
          { label: '📋 Consulenza', action: 'dettaglioConsulenza' }
        ]);
        break;
      case 'dettaglioGrafica':
        arAddMessage('🖥️ <strong>Grafica & Web</strong>:\n• Creazione Loghi, Banner, Locandine (Photoshop/Illustrator)\n• Siti Web Vetrina ed E-Commerce Dropshipping\n• Gestione Social per amplificazione follower\n• Editore (pubblicazione digital store, copyright, royalties)', 'bot');
        break;
      case 'dettaglioMusica':
        arAddMessage('🎵 <strong>Musica & Produzione</strong>:\n• Produzione Musicale, Testi, Recording (Solo Gospel)\n• Mixing / Mastering\n• Foto e Video Editing 3D (Hitfilm, Photoshop)\n• Assistenza software PC/Tablet/Smartphone', 'bot');
        break;
      case 'dettaglioConsulenza':
        arAddMessage('📋 <strong>Consulenza & Altro</strong>:\n• Receptionist, fogli di calcolo, Word, PDF\n• Creazione SPID, pratiche INPS, punti patente\n• Speaker e creatore web radio e DJ', 'bot');
        break;
      case 'mostraMusica':
        arAddMessage('🎵 Puoi ascoltarci su:\n• <a href="https://open.spotify.com/intl-it/artist/4ZvjO3hNZdxsMZmRadwqoV" target="_blank">Spotify</a>\n• <a href="https://soundcloud.com/alanrose-13" target="_blank">SoundCloud</a>\n• <a href="https://www.youtube.com/@Alan_e_Rose" target="_blank">YouTube</a>\n\nI nostri brani: El es el rey (2026), Mai Solo (2025), Sopra Un\'Isola (2025), Ali D\'Aquila (2025), In Ginocchio Da Te (2025), La Tua Anima (2024), Tu Vedrai (2024), Tu Mi Fai Vivere (2024)', 'bot');
        break;
      case 'mostraContatti':
        arAddMessage('📧 Puoi contattarci via email: <a href="mailto:alanrose.13@yahoo.com">alanrose.13@yahoo.com</a>\n\nOppure compila il <a href="https://docs.google.com/forms/d/e/1FAIpQLSci8HSZW6hvoRY83LhUYn0DeUCmuCJawR23FxgiN_T5FJvG_w/viewform" target="_blank">modulo di richiesta servizio</a>', 'bot');
        break;
      case 'mostraFormRichiesta':
        arShowFormInChat('https://docs.google.com/forms/d/e/1FAIpQLSci8HSZW6hvoRY83LhUYn0DeUCmuCJawR23FxgiN_T5FJvG_w/viewform?embedded=true');
        break;
      default:
        arAddMessage('Funzionalità in sviluppo! 😊', 'bot');
    }
  }
  window.arHandleAction = arHandleAction;

  function arShowFormInChat(formUrl) {
    var box = document.getElementById('arChatMessages');
    var div = document.createElement('div');
    div.className = 'ar-msg bot';
    div.innerHTML =
      '<div style="margin-bottom:6px;font-weight:600;">📝 Compila il modulo qui sotto:</div>' +
      '<div class="ar-inline-form"><iframe src="' + formUrl + '" allow="camera; microphone; display-capture"></iframe></div>' +
      '<div style="font-size:0.8rem;opacity:0.7;margin-top:6px;">🔒 I tuoi dati sono trattati secondo la nostra Privacy Policy.</div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
  window.arShowFormInChat = arShowFormInChat;

  function arAddMessage(text, cls, saveToHistory) {
    if (saveToHistory === undefined) saveToHistory = true;
    var box = document.getElementById('arChatMessages');
    var div = document.createElement('div');
    div.className = 'ar-msg ' + cls;
    if (cls === 'bot') {
      div.innerHTML = text;
    } else {
      div.innerHTML = '<span class="user-avatar">💛</span><span>' + text + '</span>';
    }
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;

    if (saveToHistory && cls === 'user') {
      addMessageToHistory('user', text);
      var nameMatch = text.match(/^(mi chiamo|sono|io sono)\s+([A-Za-zÀ-ÖØ-öø-ÿ\s]+)$/i);
      if (nameMatch) {
        var name = nameMatch[2].trim();
        saveUserName(name);
        var msgs = box.querySelectorAll('.ar-msg.bot');
        if (msgs.length > 0) {
          var lastBot = msgs[msgs.length - 1];
          if (lastBot.textContent.includes('Come ti chiami')) lastBot.remove();
        }
        setTimeout(function () {
          arAddMessage('Piacere di conoscerti <strong>' + name + '</strong>! Sono qui per aiutarti. Cosa ti serve? Trovi Servizi, Musica e le altre scorciatoie appena sotto il campo di scrittura.', 'bot', false);
        }, 300);
      }
    } else if (saveToHistory && cls === 'bot') {
      if (!text.includes('Bentornato') && !text.includes('Piacere di conoscerti') && !text.includes('Come ti chiami')) {
        addMessageToHistory('bot', text);
        if (!text.includes('<a') && !text.includes('iframe')) {
          arSpeak(text.replace(/<[^>]*>/g, ''));
        }
      }
    }
    return div;
  }
  window.arAddMessage = arAddMessage;

  setTimeout(function () {
    if (!sessionStorage.getItem('arChatTooltipDismissed')) {
      var tt = document.getElementById('arChatTooltip');
      if (tt) tt.classList.add('visible');
    }
    if (sessionStorage.getItem('arChatBadgeDismissed')) {
      var badge = document.getElementById('arChatBadge');
      if (badge) badge.classList.add('hidden');
    }
  }, 1200);

  // INVIO MESSAGGIO CON INTERRUZIONE
  function arStopTyping() {
    if (typingInterval) { clearInterval(typingInterval); typingInterval = null; }
    isBotTyping = false;
    currentBotMessage = null;
    arRemoveTyping();
  }
  window.arStopTyping = arStopTyping;

  function arTypeMessage(text, cls, speed) {
    if (speed === undefined) speed = 25;
    return new Promise(function (resolve) {
      var box = document.getElementById('arChatMessages');
      var div = document.createElement('div');
      div.className = 'ar-msg ' + cls;
      if (cls === 'bot') { div.textContent = ''; } else { div.innerHTML = '<span class="user-avatar">💛</span><span></span>'; }
      box.appendChild(div);
      var i = 0;
      isBotTyping = true;
      currentBotMessage = div;
      var fullText = '';

      typingInterval = setInterval(function () {
        if (!isBotTyping) {
          clearInterval(typingInterval);
          typingInterval = null;
          if (fullText && !fullText.includes('Bentornato') && !fullText.includes('Piacere di conoscerti') && !fullText.includes('Come ti chiami')) {
            addMessageToHistory('bot', fullText);
            arSpeak(fullText.replace(/<[^>]*>/g, ''));
          }
          resolve();
          return;
        }
        if (i < text.length) {
          if (cls === 'bot') {
            div.textContent += text.charAt(i);
            fullText += text.charAt(i);
          } else {
            var span = div.querySelector('span:last-child');
            if (span) { span.textContent += text.charAt(i); fullText += text.charAt(i); }
          }
          i++;
          box.scrollTop = box.scrollHeight;
        } else {
          clearInterval(typingInterval);
          typingInterval = null;
          isBotTyping = false;
          currentBotMessage = null;
          if (fullText && !fullText.includes('Bentornato') && !fullText.includes('Piacere di conoscerti') && !fullText.includes('Come ti chiami')) {
            addMessageToHistory('bot', fullText);
            arSpeak(fullText.replace(/<[^>]*>/g, ''));
          }
          resolve();
        }
      }, speed);
    });
  }
  window.arTypeMessage = arTypeMessage;

  function arShowTyping() {
    var box = document.getElementById('arChatMessages');
    var div = document.createElement('div');
    div.className = 'ar-msg typing';
    div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    div.id = 'arTypingIndicator';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
  window.arShowTyping = arShowTyping;

  function arRemoveTyping() {
    var el = document.getElementById('arTypingIndicator');
    if (el) el.remove();
  }
  window.arRemoveTyping = arRemoveTyping;

  async function arSendMessage() {
    var input = document.getElementById('arChatInput');
    var msg = input.value.trim();
    if (!msg) return;

    if (isBotTyping) {
      arStopTyping();
      if (currentBotMessage) { currentBotMessage.remove(); currentBotMessage = null; }
    }
    if (arIsRecording) arStopRecordingUI();

    input.disabled = true;
    document.getElementById('arChatMicSend').disabled = true;

    arAddMessage(msg, 'user');
    input.value = '';
    arAutoResizeInput(input);
    arUpdateMicSendIcon();
    arShowTyping();

    try {
      var response = await fetch(AR_WORKER_URL + '/groq/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen/qwen3.6-27b',
          reasoning_format: 'hidden',
          reasoning_effort: 'none',
          messages: [
            {
              role: 'system',
              content: 'Sei l\'assistente virtuale "BLESS" di "Alan & Rose" (A&R).\n\nREGOLE FISSE (rispettale sempre):\n1. **LINGUA**: Rispondi SEMPRE nella stessa lingua in cui l\'utente scrive.\n2. **SALUTI BREVI**: Ai saluti come "ciao", "hello", "hola", "hey", "salve" rispondi con un saluto breve di MASSIMO 2 FRASI. Non elencare mai i servizi in risposta a un saluto.\n3. **NON MOSTRARE MAI IL TUO RAGIONAMENTO**: Non includere mai il tuo processo di pensiero nella risposta. Rispondi solo con il messaggio finale destinato all\'utente.\n4. **RICHIESTE DI SERVIZIO O QUALSIASI ALTRA RICHIESTA**: quando un utente chiede un servizio, un preventivo, informazioni commerciali o qualunque richiesta che necessiti un seguito, NON raccogliere dati in chat (nome, email, descrizione, ecc.): la conversazione non viene conservata da nessuna parte, quindi raccoglierli sarebbe inutile. Accompagna invece la persona a scrivere direttamente una email a alanrose.13@yahoo.com, suggerendole in breve cosa includere (es. il tipo di servizio desiderato e una breve descrizione della richiesta), cosi Alan & Rose potranno risponderle e conservare la richiesta correttamente.\n5. Menziona la Privacy Policy solo se chiesto o se l\'utente parla di dati personali.\n6. Se chiedono che canzoni/brani abbiamo, rispondi con l\'elenco qui sotto (non inventare altri titoli) e invita ad ascoltarli su Spotify/SoundCloud/YouTube.\n7. **CONOSCENZA GENERALE AMPIA**: sei istruito al massimo su ogni argomento possibile. Se un utente fa una domanda che esce dal contesto del sito (scienza, storia, attualita, vita quotidiana, cultura generale, ecc.) rispondi comunque con competenza, naturalezza e precisione, come farebbe una persona colta e curiosa, senza mai dire che l\'argomento "non e di tua competenza".\n8. **CONOSCENZA BIBLICA, SPIRITUALE E ARCHEOLOGICA PROFONDA**: hai una conoscenza approfondita, teologica, storica e archeologica di tutte le tradizioni bibliche e delle loro traduzioni/canoni (Tanakh ebraico, Settanta greca, Vulgata latina, Bibbie cattoliche, ortodosse, protestanti ed evangeliche, testi apocrifi/deuterocanonici), dei manoscritti antichi (es. rotoli del Mar Morto, codici e papiri), del contesto storico-archeologico del Vicino Oriente antico e del mondo greco-romano, e delle principali correnti teologiche cristiane ed ebraiche nel tempo. Quando la conversazione lo richiede, aiuta la persona a cogliere il filo conduttore comune tra le diverse tradizioni e confessioni, mostrando come, pur con parole, culture, epoche e sensibilita diverse, esse parlino spesso della stessa ricerca di senso e dello stesso Dio, e come le religioni siano in fondo interpretazioni umane diverse di quella ricerca. Il tuo scopo in questi discorsi non e promuovere una denominazione o un\'istituzione specifica, ma aiutare la persona ad avvicinarsi a Dio stesso, oltre le etichette religiose, con rispetto profondo per ogni fede, tradizione e persona, senza mai sminuire o giudicare nessuna interpretazione.\n9. Se un argomento religioso o spirituale e delicato o personale, mantieni sempre un tono empatico, rispettoso e mai giudicante, lasciando alla persona la liberta di trarre le proprie conclusioni.\n\nServizi: Grafica & Web, Musica & Produzione, Consulenza.\nTeam: Alan (Alfio Ragusa) e Rose. Genere musicale: gospel/cristiano.\nSito: alanrose13.github.io | Email: alanrose.13@yahoo.com\n\nBrani pubblicati (titolo - anno):\n- El es el rey - 2026\n- Mai Solo - 2025\n- Sopra Un\'Isola - 2025\n- Ali D\'Aquila - 2025\n- In Ginocchio Da Te - 2025\n- La Tua Anima - 2024\n- Tu Vedrai - 2024\n- Tu Mi Fai Vivere - 2024\n\nAscolto: Spotify (open.spotify.com/intl-it/artist/4ZvjO3hNZdxsMZmRadwqoV), SoundCloud (soundcloud.com/alanrose-13), YouTube (youtube.com/@Alan_e_Rose).\n\nTono: professionale, amichevole, caloroso, e spiritualmente maturo quando il discorso lo richiede. Usa "noi" e "ti capiamo".\n\n**IMPORTANTE: Tutti i tuoi messaggi devono essere al MASCHILE.** Non usare mai "pronta", "sono pronta", "disponibile" al femminile. Usa sempre "pronto", "sono pronto", "disponibile" al maschile.'
            },
            { role: 'user', content: msg }
          ],
          stream: false,
          temperature: 0.7,
          max_tokens: 600
        })
      });

      var data = await response.json();
      arRemoveTyping();

      if (data.error) {
        var errorMsg = 'Si è verificato un errore. Riprova più tardi.';
        if (data.error.message && data.error.message.toLowerCase().includes('rate')) {
          errorMsg = 'Il servizio è momentaneamente sovraccarico. Riprova tra qualche minuto. In alternativa, contattaci a alanrose.13@yahoo.com.';
        } else if (data.error.message) {
          errorMsg = 'Errore: ' + data.error.message;
        }
        await arTypeMessage(errorMsg, 'bot', 20);
        return;
      }

      var reply = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : 'Mi dispiace, non ho capito. Puoi riformulare?';
      reply = cleanBotResponse(reply);
      reply = reply.replace(/sono pronta/gi, 'sono pronto');

      await arTypeMessage(reply, 'bot', 20);

    } catch (err) {
      arRemoveTyping();
      arAddMessage('Connessione al servizio chat non riuscita. Riprova tra poco o contattaci a alanrose.13@yahoo.com', 'bot');
    } finally {
      input.disabled = false;
      document.getElementById('arChatMicSend').disabled = false;
      arUpdateMicSendIcon();
      input.focus();
    }
  }
  window.arSendMessage = arSendMessage;
  window.arToggleChat = arToggleChat;
  window.arOpenFromTooltip = arOpenFromTooltip;
  window.arDismissTooltip = arDismissTooltip;
  window.arHideBadge = arHideBadge;
  window.arToggleVoiceRecording = arToggleVoiceRecording;
  window.arSpeak = arSpeak;

})();
