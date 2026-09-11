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
      overflow: hidden;
    }
    #arChatHeader .header-left .avatar-small img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
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
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .ar-msg.bot .bot-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      border: 1px solid rgba(201,169,97,0.4);
      margin-top: 2px;
    }
    .ar-msg.bot .bot-content {
      flex: 1;
      min-width: 0;
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
  var AR_LOGO_URL = "https://raw.githubusercontent.com/alanrose13/alanrose13.github.io/refs/heads/main/img/AI%20CHAT.png";

  var AR_CHAT_HTML =
    '<div id="arChatTooltip" onclick="arOpenFromTooltip()">' +
      '<span class="tt-close" onclick="event.stopPropagation();arDismissTooltip()">×</span>' +
      '💬 Chatta con noi!' +
    '</div>' +

    '<div id="arChatBadge">1</div>' +

    '<button id="arChatBtn" onclick="arToggleChat()" aria-label="Apri chat assistente BLESS">' +
      '<img src="' + AR_LOGO_URL + '" alt="BLESS" id="arChatBtnImg">' +
    '</button>' +

    '<div id="arChatWindow">' +
      '<div id="arChatHeader">' +
        '<div class="header-left">' +
          '<div class="avatar-small"><img src="' + AR_LOGO_URL + '" alt="BLESS"></div>' +
          '<div class="chat-title">' +
            '<span class="name">BLESS </span>' +
            '<span class="sub">Assistente Virtuale A&amp;R</span>' +
          '</div>' +
        '</div>' +
        '<div class="header-right">' +
          '<button id="arChatClearBtn" onclick="arClearChat()" title="Svuota la chat" aria-label="Svuota chat">🗑️ Svuota</button>' +
          '<span class="close" onclick="arToggleChat()">×</span>' +
        '</div>' +
      '</div>' +
      '<div id="arChatMessages" role="log" aria-live="polite" aria-relevant="additions">' +
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
          '🔒 I dati che mi scrivi restano salvati solo sul tuo dispositivo e vengono elaborati da un servizio IA esterno per generare le risposte, secondo la nostra <a href="cookie-policy.html" target="_blank" rel="noopener">Privacy Policy</a>.' +
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
     4) Logica del chatbot
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

  // SINTESI VOCALE — fallback speechSynthesis (usato solo se Piper non è disponibile)
  var arVoiceEnabled = true;
  var arVoicesLoaded = false;
  var arItalianVoice = null;
  var arVoiceLoadAttempts = 0;

  var arMaleVoiceNames = [
    'diego', 'luca', 'giuseppe', 'benigno', 'calimero', 'cataldo',
    'gianni', 'lisandro', 'palmiro', 'rinaldo', 'cosimo', 'marco',
    'roberto', 'fabio', 'matteo', 'nicola', 'giorgio', 'mario',
    'antonio', 'alessandro', 'valerio', 'riccardo', 'enrico',
    'male', 'uomo', 'man'
  ];

  function arScoreVoice(v) {
    var n = v.name.toLowerCase();
    var score = 0;
    var isMaleKnown = arMaleVoiceNames.some(function (name) { return n.includes(name); });
    if (!isMaleKnown) return -1000;

    if (n.includes('online (natural)') || n.includes('neural2') || n.includes('neural') || n.includes('wavenet')) score += 200;
    if (n.includes('premium') || n.includes('enhanced') || n.includes('plus')) score += 60;
    if (n.includes('compact')) score -= 100;
    if (n.includes('standard') && !n.includes('online') && !n.includes('neural') && !n.includes('wavenet')) score -= 60;
    if (v.lang === 'it-IT') score += 10;
    if (v.localService === false) score += 30;
    return score;
  }

  function arLoadVoices() {
    if (!('speechSynthesis' in window)) return;
    var voices = window.speechSynthesis.getVoices();

    var italianMale = voices.filter(function (v) {
      return v.lang && v.lang.toLowerCase().startsWith('it') &&
        arMaleVoiceNames.some(function (name) { return v.name.toLowerCase().includes(name); });
    });

    if (italianMale.length > 0) {
      italianMale.sort(function (a, b) { return arScoreVoice(b) - arScoreVoice(a); });
      arItalianVoice = italianMale[0];
    } else {
      var anyMale = voices.filter(function (v) {
        return arMaleVoiceNames.some(function (name) { return v.name.toLowerCase().includes(name); });
      });
      anyMale.sort(function (a, b) { return arScoreVoice(b) - arScoreVoice(a); });
      arItalianVoice = anyMale.length > 0 ? anyMale[0] : null;
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
    var raw = text.split(/(?<=[.!?…])\s+/);
    return raw.map(function (s) { return s.trim(); }).filter(Boolean);
  }

  /* ============================================================
     SINTESI VOCALE — Piper TTS (WebAssembly, offline, gratis)
     Voce neurale maschile italiana it_IT-riccardo-x_low.
     Gira interamente nel browser: nessun server, nessun account.
     ============================================================ */

  var AR_PIPER_VOICE = 'it_IT-riccardo-x_low';
  var arPiperModule = null;
  var arPiperLoading = null;
  var arPiperAudioEl = null;
  var arPiperAbort = null;
  var arPiperUnavailable = false;

  function arLoadPiper() {
    if (arPiperModule) return Promise.resolve(arPiperModule);
    if (arPiperLoading) return arPiperLoading;

    arPiperLoading = import('https://cdn.jsdelivr.net/npm/@mintplex-labs/piper-tts-web@1.0.4/+esm')
      .then(function (mod) {
        arPiperModule = mod;
        return mod;
      })
      .catch(function (err) {
        arPiperLoading = null;
        throw err;
      });

    return arPiperLoading;
  }

  function arStopEdgeAudio() {
    if (arPiperAbort) {
      try { arPiperAbort.abort(); } catch (e) {}
      arPiperAbort = null;
    }
    if (arPiperAudioEl) {
      try {
        arPiperAudioEl.pause();
        arPiperAudioEl.src = '';
      } catch (e) {}
      arPiperAudioEl = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }
  window.arStopEdgeAudio = arStopEdgeAudio;

  function arSpeakFallback(text) {
    if (!arVoiceEnabled || !('speechSynthesis' in window)) return;
    if (!arItalianVoice) { arLoadVoices(); return; }
    window.speechSynthesis.cancel();
    if (!arVoicesLoaded) arLoadVoices();

    var segments = arSplitIntoSegments(text);
    if (segments.length === 0) segments = [text];

    var baseRate = 0.97;
    var basePitch = 0.93;

    segments.forEach(function (segment) {
      var utterance = new SpeechSynthesisUtterance(segment);
      utterance.lang = arItalianVoice.lang;
      utterance.voice = arItalianVoice;
      utterance.rate = +(baseRate + (Math.random() * 0.08 - 0.04)).toFixed(3);
      utterance.pitch = +(basePitch + (Math.random() * 0.08 - 0.04)).toFixed(3);
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    });
  }

  function arSpeak(text) {
    if (!arVoiceEnabled) return;

    arStopEdgeAudio();

    var plainText = String(text || '').replace(/<[^>]*>/g, '').trim();
    if (!plainText) return;

    if (arPiperUnavailable) {
      arSpeakFallback(plainText);
      return;
    }

    var segments = arSplitIntoSegments(plainText);
    if (segments.length === 0) segments = [plainText];

    var controller = new AbortController();
    arPiperAbort = controller;

    (async function playAll() {
      try {
        var mod = await arLoadPiper();

        if (typeof mod.predict !== 'function') {
          throw new Error('Piper: funzione predict non trovata');
        }

        for (var i = 0; i < segments.length; i++) {
          if (!arVoiceEnabled || controller.signal.aborted) { arPiperAbort = null; return; }

          var blob = await mod.predict({
            text: segments[i],
            voiceId: AR_PIPER_VOICE
          });

          if (!blob || blob.size === 0) throw new Error('Piper: audio vuoto');

          var url = URL.createObjectURL(blob);
          var audio = new Audio(url);
          arPiperAudioEl = audio;

          await new Promise(function (resolve, reject) {
            audio.onended = function () {
              URL.revokeObjectURL(url);
              arPiperAudioEl = null;
              resolve();
            };
            audio.onerror = function () {
              URL.revokeObjectURL(url);
              arPiperAudioEl = null;
              reject(new Error('Piper: errore riproduzione'));
            };
            audio.play().catch(reject);
          });

          if (!arVoiceEnabled) { arPiperAbort = null; return; }
        }
        arPiperAbort = null;
      } catch (err) {
        arPiperAbort = null;
        if (err && err.name === 'AbortError') return;
        console.warn('BLESS: Piper TTS non riuscito, uso fallback.', err);
        arPiperUnavailable = true;
        arSpeakFallback(plainText);
      }
    })();
  }

  function arToggleVoiceOutput() {
    arVoiceEnabled = !arVoiceEnabled;
    var btn = document.getElementById('arVoiceOutBtn');
    if (btn) {
      btn.classList.toggle('active', arVoiceEnabled);
      btn.textContent = arVoiceEnabled ? '🔊' : '🔇';
      btn.setAttribute('aria-pressed', arVoiceEnabled ? 'true' : 'false');
    }
    if (!arVoiceEnabled) arStopEdgeAudio();
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
    if (!isOpen) { loadChatHistory(); } else { chatWin.style.transform = ''; arStopEdgeAudio(); }
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
        welcomeDiv.innerHTML = '<img class="bot-avatar" src="' + AR_LOGO_URL + '" alt="BLESS"><div class="bot-content">👋 Bentornato <strong>' + history.userName + '</strong>! Come posso aiutarti oggi?</div>';
        box.appendChild(welcomeDiv);
      }
    } else {
      var welcomeDiv2 = document.createElement('div');
      welcomeDiv2.className = 'ar-msg bot welcome-msg';
      welcomeDiv2.innerHTML =
        '<img class="bot-avatar" src="' + AR_LOGO_URL + '" alt="BLESS"><div class="bot-content">' +
        '👋 Ciao! Sono <strong>BLESS</strong>, l\'assistente virtuale di <strong>Alan &amp; Rose</strong>.<br><br>' +
        'Posso aiutarti a conoscere i nostri servizi, il portfolio, la musica e lo shop.<br><br>' +
        'Come ti chiami? Così possiamo darti un trattamento personalizzato.' +
        '</div>';
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
    div.innerHTML = '<img class="bot-avatar" src="' + AR_LOGO_URL + '" alt="BLESS"><div class="bot-content"><div class="ar-action-buttons">' +
      buttons.map(function (b) {
        return '<button onclick="arHandleAction(\'' + b.action + '\')">' + b.label + '</button>';
      }).join('') +
      '</div></div>';
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
      '<img class="bot-avatar" src="' + AR_LOGO_URL + '" alt="BLESS"><div class="bot-content">' +
      '<div style="margin-bottom:6px;font-weight:600;">📝 Compila il modulo qui sotto:</div>' +
      '<div class="ar-inline-form"><iframe src="' + formUrl + '"></iframe></div>' +
      '<div style="font-size:0.8rem;opacity:0.7;margin-top:6px;">🔒 I tuoi dati sono trattati secondo la nostra Privacy Policy.</div>' +
      '</div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }
  window.arShowFormInChat = arShowFormInChat;

  // --- FILTRO BESTEMMIE / BLASFEMIE (multilingua) -----------------------
  // Sostituisce ogni bestemmia/blasfemia con una frase di incoraggiamento.
  // Include italiano, tutti i principali dialetti italiani e le lingue straniere.
  var AR_BLESSED_REPLACEMENT =
    'Evita di dire brutte parole. Dio ti ama, e ama che il tuo parlare pulito non sia un obbligo ma un\'opportunità per essere davanti agli altri uno splendore di Dio, così chiunque ti vede come un esempio da seguire e sarai amato/a.';

  var AR_BLASFEMY_PATTERNS = [
    // ============ ITALIANO STANDARD ============
    /\b(?:dio|d10|ddio)\s+(?:bono|bon[ou]|can[e]?|porc[oa]|maiale|boia|ladro|bestia|serpente|impiccat[oa]|strozzat[oa]|santo\s+no)\b/gi,
    /\b(?:porco|porca)\s+(?:dio|ddio|d10|madonna|maronna|giuda|giuda\s+no)\b/gi,
    /\b(?:madonna|madò|mado|maronna|maronn|mariàng|mariang)\s+(?:santa|puttana|porca|cane|cagna|boia|ladra|impiccata|strozzata|bestia|maiala|serpente|delle\s+grazie\s+no|lurda|becera)\b/gi,
    /\b(?:gesù|gesu|gesù\s+cristo|gesu\s+cristo|cristo)\s+(?:porco|cane|boia|ladro|impiccato|strozzato|bestia|maiale|serpente)\b/gi,
    /\b(?:santissimo|santissimu|ssantissimo|sacramento|sacramentu|ssacramento|sagramento|sagramendu)\s*(?:no|sacramento)?\b/gi,
    /\b(?:ostia|ostia\s+santa|ostia\s+consacrata|ostia\s+porca|ostia\s+cane|ostia\s+boia|ostia\s+ladra|ostia\s+impiccata|ostia\s+strozzata)\b/gi,

    // ============ DIALETTO VENETO / FRIULANO ============
    /\b(?:dio\s+can|dio\s+cane|dio\s+boia|dio\s+porco|dio\s+maiale|dio\s+bestia|dio\s+serpente|dio\s+impicà|dio\s+strozzà|dio\s+ladro|dio\s+santo\s+no|madonna\s+santa\s+no|madonna\s+puttana|madonna\s+lurda|madonna\s+cagna|madonna\s+becera|porco\s+dio|porca\s+madonna|porco\s+can|porca\s+maronna|porca\s+lurda|porco\s+giuda|porco\s+giuda\s+no)\b/gi,

    // ============ DIALETTO NAPOLETANO / CAMPANO ============
    /\b(?:ddio|dio\s+ca|dio\s+cane|dio\s+can|dio\s+putt|dio\s+boia|dio\s+ladro|dio\s+mpicciat|dio\s+mpicc|dio\s+strozz|dio\s+serpente|dio\s+bestia|dio\s+maiale|maronna|maronn|maronna\s+santa|maronna\s+putt|maronna\s+cane|maronna\s+boia|maronna\s+ladra|maronna\s+mpicciat|maronna\s+strozz|maronna\s+bestia|maronna\s+maiala|maronna\s+serpente|santissimo|ssantissimo|santissimu|ssacramento|sacramento|sagramento|sagramendu|ostia|ostia\s+santa|ostia\s+consacrata|porco\s+ddio|porca\s+maronna|porco\s+dio|porca\s+madonna|porco\s+giuda|porco\s+giuda\s+no)\b/gi,

    // ============ DIALETTO SICILIANO ============
    /\b(?:diu|dio\s+can|dio\s+cani|dio\s+boia|dio\s+ladru|dio\s+mpiccatu|dio\s+strozzatu|dio\s+serpenti|dio\s+bestia|dio\s+maiali|matri|matri\s+santa|matri\s+putt|matri\s+cani|matri\s+boia|matri\s+ladra|matri\s+mpiccata|matri\s+strozzata|matri\s+bestia|matri\s+maiala|matri\s+serpenti|santissimu|ssantissimu|sacramentu|ssacramentu|sagrammentu|ostia|ostia\s+santa|ostia\s+consacrata|porcu\s+diu|porca\s+matri|porcu\s+dio|porca\s+madonna|porcu\s+giuda|porcu\s+giuda\s+no)\b/gi,

    // ============ DIALETTO ROMANO / LAZIALE ============
    /\b(?:ddio|dio\s+cane|dio\s+can|dio\s+boia|dio\s+ladro|dio\s+impiccato|dio\s+strozzato|dio\s+serpente|dio\s+bestia|dio\s+maiale|madonna|madonna\s+santa|madonna\s+puttana|madonna\s+cagna|madonna\s+boia|madonna\s+ladra|madonna\s+impiccata|madonna\s+strozzata|madonna\s+bestia|madonna\s+maiala|madonna\s+serpente|santissimo|ssantissimo|sacramento|ssacramento|sagramento|ostia|ostia\s+santa|ostia\s+consacrata|porco\s+ddio|porca\s+madonna|porco\s+dio|porco\s+giuda|porco\s+giuda\s+no)\b/gi,

    // ============ DIALETTO TOSCANO ============
    /\b(?:dio\s+cane|dio\s+can|dio\s+boia|dio\s+ladro|dio\s+impiccato|dio\s+strozzato|dio\s+serpente|dio\s+bestia|dio\s+maiale|madonna|madonna\s+santa|madonna\s+puttana|madonna\s+cagna|madonna\s+boia|madonna\s+ladra|madonna\s+impiccata|madonna\s+strozzata|madonna\s+bestia|madonna\s+maiala|madonna\s+serpente|santissimo|ssantissimo|sacramento|ssacramento|sagramento|ostia|ostia\s+santa|ostia\s+consacrata|porco\s+dio|porca\s+madonna|porco\s+giuda|porco\s+giuda\s+no)\b/gi,

    // ============ DIALETTO PIEMONTESE / LOMBARDO ============
    /\b(?:dio\s+can|dio\s+cane|dio\s+boia|dio\s+ladru|dio\s+impicà|dio\s+strozzà|dio\s+serpent|dio\s+bestia|dio\s+maial|madonna|madonna\s+santa|madonna\s+puttana|madonna\s+cagna|madonna\s+boia|madonna\s+ladra|madonna\s+impiccata|madonna\s+strozzata|madonna\s+bestia|madonna\s+maiala|madonna\s+serpent|santissimo|ssantissimo|sacrament|ssacrament|sagrament|ostia|ostia\s+santa|ostia\s+consacrata|porco\s+dio|porca\s+madonna|porco\s+giuda|porco\s+giuda\s+no)\b/gi,

    // ============ INGLESE ============
    /\b(?:god\s*damn|goddamn|goddam|god\s*damn\s*it|jesus\s*christ|jesus\s*f+u+c*k+i+n+g*\s*christ|christ\s*almighty|holy\s*shit|holy\s*f+u+c*k*|bloody\s*hell|f+u+c*k+|sh[i1]t|b[i1]tch|bastard|asshole|motherf+u+c*k+er|d[a4]mn|hell)\b/gi,

    // ============ FRANCESE ============
    /\b(?:merde\s*alors|putain\s*de\s*merde|putain|bordel\s*de\s*merde|bordel|merde|salope|encul[ée]|connard|connasse|fils\s*de\s*pute|nique\s*ta\s*m[èe]re|sacr[ée]\s*bleu|nom\s*de\s*dieu|bon\s*dieu|sacr[ée]|pute)\b/gi,

    // ============ SPAGNOLO ============
    /\b(?:puta\s*madre|me\s*cago\s*en\s*dios|hostia\s*puta|hostia\s*de\s*dios|hostia|joder|co[ñn]o|carajo|mierda|puta|puto|gilipollas|cabron|cabr[óo]n|hijo\s*de\s*puta|la\s*puta\s*madre|a\s*la\s*puta\s*madre)\b/gi,

    // ============ TEDESCO ============
    /\b(?:gott\s*verdammt|gottesl[äa]sterung|verdammt|schei[ßs]+e|scheisse|scheiss|arschloch|fick|ficken|hurensohn|wichser|mistst[üu]ck|bl[öo]dsinn|himmel\s*herrgott|herrgott\s*sakrament|kreuz\s*donnerwetter|kreuzdonnerwetter)\b/gi,

    // ============ PORTOGHESE ============
    /\b(?:porra|caralho|foda[- ]?se|filho\s*da\s*puta|puta\s*que\s*pariu|puta\s*merda|merda|bosta|c[óo]rn[oa]|vai\s*para\s*o\s*caralho|arrombado)\b/gi,

    // ============ ALTRE LINGUE EUROPEE + INSULTI ============
    /\b(?:verdomme|godverdomme|klootzak|kut|neuken|shit|fuck|bitch|cazzo|stronzo|stronza|vaffanculo|fanculo|coglione|cogliona|minchia|minchione|zoccola|troia|puttana|mignotta|bagascia|squaldrina|bastardo|bastarda|idiota|imbecille|deficiente|ritardato|handicappato|negro|negra|frocio|finocchio|ricchione|terrone|zingaro\s*di\s*merda|sporco\s*negro)\b/gi
  ];

  // Sostituisce le bestemmie con la frase di incoraggiamento.
  function arFilterBlasphemy(text) {
    if (!text) return text;
    var out = String(text);
    AR_BLASFEMY_PATTERNS.forEach(function (re) {
      out = out.replace(re, AR_BLESSED_REPLACEMENT);
    });
    return out;
  }
  window.arFilterBlasphemy = arFilterBlasphemy;

  // --- SICUREZZA: sanitizzazione HTML -----------------------------------
  function arEscapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = String(str == null ? '' : str);
    return div.innerHTML;
  }

  var AR_SAFE_TAGS = ['B', 'STRONG', 'I', 'EM', 'BR', 'A', 'UL', 'OL', 'LI', 'P', 'SPAN'];
  var AR_SAFE_ATTRS = { A: ['href', 'target', 'rel'] };

  function arSanitizeBotHtml(html) {
    var template = document.createElement('template');
    template.innerHTML = String(html == null ? '' : html);

    function clean(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 1) {
          var tag = child.tagName;
          if (AR_SAFE_TAGS.indexOf(tag) === -1) {
            node.replaceChild(document.createTextNode(child.textContent), child);
            return;
          }
          var allowedAttrs = AR_SAFE_ATTRS[tag] || [];
          Array.prototype.slice.call(child.attributes).forEach(function (attr) {
            var name = attr.name.toLowerCase();
            if (name.indexOf('on') === 0 || allowedAttrs.indexOf(name) === -1) {
              child.removeAttribute(attr.name);
            }
          });
          if (tag === 'A') {
            var href = child.getAttribute('href') || '';
            if (/^\s*javascript:/i.test(href)) {
              child.removeAttribute('href');
            }
            child.setAttribute('target', '_blank');
            child.setAttribute('rel', 'noopener');
          }
          clean(child);
        } else if (child.nodeType !== 3) {
          node.removeChild(child);
        }
      });
    }
    clean(template.content);
    return template.innerHTML;
  }

  var AR_NON_NAME_WORDS = [
    'felice', 'contento', 'contenta', 'pronto', 'pronta', 'qui', 'qua',
    'bene', 'male', 'stanco', 'stanca', 'curioso', 'curiosa', 'nuovo',
    'nuova', 'interessato', 'interessata', 'sicuro', 'sicura', 'certo',
    'certa', 'd\'accordo', 'daccordo', 'ok', 'io'
  ];

  function arAddMessage(text, cls, saveToHistory) {
    if (saveToHistory === undefined) saveToHistory = true;
    if (cls === 'bot') text = arFilterBlasphemy(text);
    var box = document.getElementById('arChatMessages');
    var div = document.createElement('div');
    div.className = 'ar-msg ' + cls;
    if (cls === 'bot') {
      var avatarImg = '<img class="bot-avatar" src="' + AR_LOGO_URL + '" alt="BLESS">';
      var content = document.createElement('div');
      content.className = 'bot-content';
      content.innerHTML = arSanitizeBotHtml(text);
      div.innerHTML = avatarImg;
      div.appendChild(content);
    } else {
      var avatarSpan = document.createElement('span');
      avatarSpan.className = 'user-avatar';
      avatarSpan.textContent = '💛';
      var textSpan = document.createElement('span');
      textSpan.textContent = text;
      div.appendChild(avatarSpan);
      div.appendChild(textSpan);
    }
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;

    if (saveToHistory && cls === 'user') {
      addMessageToHistory('user', text);
      var nameMatch = text.match(/^(?:mi chiamo|sono|io sono)\s+([A-Za-zÀ-ÖØ-öø-ÿ']+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ']+){0,2})$/i);
      if (nameMatch) {
        var name = nameMatch[1].trim();
        var firstWord = name.split(/\s+/)[0].toLowerCase();
        var looksLikeName = AR_NON_NAME_WORDS.indexOf(firstWord) === -1;
        if (looksLikeName) {
          saveUserName(name);
          var msgs = box.querySelectorAll('.ar-msg.bot');
          if (msgs.length > 0) {
            var lastBot = msgs[msgs.length - 1];
            if (lastBot.textContent.includes('Come ti chiami')) lastBot.remove();
          }
          setTimeout(function () {
            arAddMessage('Piacere di conoscerti <strong>' + arEscapeHtml(name) + '</strong>! Sono qui per aiutarti. Cosa ti serve? Trovi Servizi, Musica e le altre scorciatoie appena sotto il campo di scrittura.', 'bot', false);
          }, 300);
        }
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
    text = arFilterBlasphemy(text);
    return new Promise(function (resolve) {
      var box = document.getElementById('arChatMessages');
      var div = document.createElement('div');
      div.className = 'ar-msg ' + cls;
      if (cls === 'bot') {
        div.innerHTML = '<img class="bot-avatar" src="' + AR_LOGO_URL + '" alt="BLESS"><div class="bot-content"></div>';
      } else {
        div.innerHTML = '<span class="user-avatar">💛</span><span></span>';
      }
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
            var content = div.querySelector('.bot-content');
            content.textContent += text.charAt(i);
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

    // Filtro bestemmie sul messaggio dell'utente prima dell'invio.
    msg = arFilterBlasphemy(msg);

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
      var history = getChatHistory();
      var contextMessages = [];
      if (history && history.messages && history.messages.length > 0) {
        var recent = history.messages.slice(-16);
        contextMessages = recent
          .filter(function (m) { return m.role === 'user' || m.role === 'bot'; })
          .map(function (m) {
            return {
              role: m.role === 'bot' ? 'assistant' : 'user',
              content: m.content.replace(/<[^>]*>/g, '')
            };
          });
      }

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
              content: 'Sei l\'assistente virtuale "BLESS" di "Alan & Rose" (A&R).\n\nREGOLE FISSE (rispettale sempre):\n1. **LINGUA**: Rispondi SEMPRE nella stessa lingua in cui l\'utente scrive.\n2. **SALUTI BREVI**: Ai saluti come "ciao", "hello", "hola", "hey", "salve" rispondi con un saluto breve di MASSIMO 2 FRASI. Non elencare mai i servizi in risposta a un saluto.\n3. **NON MOSTRARE MAI IL TUO RAGIONAMENTO**: Non includere mai il tuo processo di pensiero nella risposta. Rispondi solo con il messaggio finale destinato all\'utente.\n4. **RICHIESTE DI SERVIZIO O QUALSIASI ALTRA RICHIESTA**: quando un utente chiede un servizio, un preventivo, informazioni commerciali o qualunque richiesta che necessiti un seguito, NON raccogliere dati sensibili aggiuntivi in chat (numeri di carte, documenti, ecc.): accompagna invece la persona a scrivere direttamente una email a alanrose.13@yahoo.com, suggerendole in breve cosa includere (es. il tipo di servizio desiderato e una breve descrizione della richiesta), cosi Alan & Rose potranno risponderle e conservare la richiesta correttamente.\n5. **PRIVACY**: se l\'utente chiede dove finiscono i suoi messaggi, spiega con chiarezza che la conversazione resta salvata solo sul suo dispositivo (nel browser) per poterla ritrovare più tardi, e che ogni messaggio viene elaborato da un servizio esterno di intelligenza artificiale per generare le risposte. Rimanda alla Privacy Policy del sito per i dettagli. Non dire mai che "la conversazione non viene conservata da nessuna parte".\n6. Se chiedono che canzoni/brani abbiamo, rispondi con l\'elenco qui sotto (non inventare altri titoli) e invita ad ascoltarli su Spotify/SoundCloud/YouTube.\n7. **CONOSCENZA GENERALE AMPIA**: sei istruito al massimo su ogni argomento possibile. Se un utente fa una domanda che esce dal contesto del sito (scienza, storia, attualita, vita quotidiana, cultura generale, ecc.) rispondi comunque con competenza, naturalezza e precisione, come farebbe una persona colta e curiosa, senza mai dire che l\'argomento "non e di tua competenza".\n8. **CONOSCENZA BIBLICA, SPIRITUALE E ARCHEOLOGICA PROFONDA**: hai una conoscenza approfondita, teologica, storica e archeologica di tutte le tradizioni bibliche e delle loro traduzioni/canoni (Tanakh ebraico, Settanta greca, Vulgata latina, Bibbie cattoliche, ortodosse, protestanti ed evangeliche, testi apocrifi/deuterocanonici), dei manoscritti antichi (es. rotoli del Mar Morto, codici e papiri), del contesto storico-archeologico del Vicino Oriente antico e del mondo greco-romano, e delle principali correnti teologiche cristiane ed ebraiche nel tempo. Quando la conversazione lo richiede, aiuta la persona a cogliere il filo conduttore comune tra le diverse tradizioni e confessioni, mostrando come, pur con parole, culture, epoche e sensibilita diverse, esse parlino spesso della stessa ricerca di senso e dello stesso Dio, e come le religioni siano in fondo interpretazioni umane diverse di quella ricerca. Il tuo scopo in questi discorsi non e promuovere una denominazione o un\'istituzione specifica, ma aiutare la persona ad avvicinarsi a Dio stesso, oltre le etichette religiose, con rispetto profondo per ogni fede, tradizione e persona, senza mai sminuire o giudicare nessuna interpretazione.\n9. Se un argomento religioso o spirituale e delicato o personale, mantieni sempre un tono empatico, rispettoso e mai giudicante, lasciando alla persona la liberta di trarre le proprie conclusioni.\n10. **CONTESTO**: nei messaggi precedenti di questa conversazione (se presenti) trovi lo storico recente della chat: usalo per ricordare cosa l\'utente ti ha già detto (nome, richieste, preferenze) invece di richiederlo di nuovo.\n\nServizi: Grafica & Web, Musica & Produzione, Consulenza.\nTeam: Alan (Alfio Ragusa) e Rose. Genere musicale: gospel/cristiano.\nSito: alanrose13.github.io | Email: alanrose.13@yahoo.com\n\nBrani pubblicati (titolo - anno):\n- El es el rey - 2026\n- Mai Solo - 2025\n- Sopra Un\'Isola - 2025\n- Ali D\'Aquila - 2025\n- In Ginocchio Da Te - 2025\n- La Tua Anima - 2024\n- Tu Vedrai - 2024\n- Tu Mi Fai Vivere - 2024\n\nAscolto: Spotify (open.spotify.com/intl-it/artist/4ZvjO3hNZdxsMZmRadwqoV), SoundCloud (soundcloud.com/alanrose-13), YouTube (youtube.com/@Alan_e_Rose).\n\nTono: professionale, amichevole, caloroso, e spiritualmente maturo quando il discorso lo richiede. Usa "noi" e "ti capiamo".\n\n**IMPORTANTE: Tutti i tuoi messaggi devono essere al MASCHILE.** Non usare mai "pronta", "sono pronta", "disponibile" al femminile. Usa sempre "pronto", "sono pronto", "disponibile" al maschile.\n\n**IMPORTANTE SUL LINGUAGGIO**: Non usare MAI bestemmie, blasfemie, parolacce o insulti, in nessuna lingua e in nessun dialetto. Se l\'utente ne usa, ricorda con dolcezza che il parlare pulito è un\'opportunità per essere davanti agli altri uno splendore di Dio, e invitalo a esprimersi con rispetto e amore.'
            }
          ].concat(contextMessages, [{ role: 'user', content: msg }]),
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
      // Filtro bestemmie anche sulle risposte del bot prima di mostrarle.
      reply = arFilterBlasphemy(reply);

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
