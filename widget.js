console.log("WIDGET STARTET");

(function() {
 'use strict';

 // Pivot 2026-04-21 — auto-contrast Helper fuer --cw-bubble-contrast
 // Berechnet Luminanz und gibt weiss oder schwarz fuer Text auf dem Bubble zurueck.
 function pickReadableContrast(hex) {
 try {
 const clean = String(hex || '').replace('#', '');
 const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
 if (full.length !== 6) return '#FFFFFF';
 const r = parseInt(full.slice(0, 2), 16) / 255;
 const g = parseInt(full.slice(2, 4), 16) / 255;
 const b = parseInt(full.slice(4, 6), 16) / 255;
 const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
 return lum > 0.55 ? '#0A0A0A' : '#FFFFFF';
 } catch (_e) {
 return '#FFFFFF';
 }
 }

 // Embedded CSS Styles
 const WIDGET_CSS = `
 /* ChatBot Widget — Minimal Schwarz/Weiss (2026-04-21 Rewrite)
 Einzige Customization: --cw-bubble (Bubble-Farbe) + Logo via bubble_icon_url.
 Design fix: weiss-basiert, Inter-font, subtile Schatten, konsistent ueberall. */

 #chatbot-widget *,
 #chatbot-widget *::before,
 #chatbot-widget *::after {
 box-sizing: border-box;
 }

 #chatbot-widget {
 --cw-bubble: #0A0A0A;
 --cw-bubble-contrast: #FFFFFF;
 --cw-bg: #FFFFFF;
 --cw-surface: #F5F5F5;
 --cw-text: #0A0A0A;
 --cw-text-muted: #737373;
 --cw-border: #E5E5E5;
 --cw-ring: rgba(10, 10, 10, 0.08);
 --cw-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
 --cw-radius: 14px;
 --cw-radius-sm: 10px;
 --cw-radius-lg: 20px;
 --cw-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 16px 48px rgba(0, 0, 0, 0.10);
 --cw-ease: cubic-bezier(0.4, 0, 0.2, 1);
 font-family: var(--cw-font);
 font-size: 14px;
 line-height: 1.5;
 color: var(--cw-text);
 position: fixed;
 bottom: 0;
 right: 0;
 z-index: 2147483000;
 pointer-events: none;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 }

 /* ====== Chat Bubble (floating button) ====== */
 .chat-bubble {
 position: fixed;
 bottom: 24px;
 right: 24px;
 width: 58px;
 height: 58px;
 background: var(--cw-bubble);
 border-radius: 50%;
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08);
 transition: transform 180ms var(--cw-ease), box-shadow 180ms var(--cw-ease);
 pointer-events: auto;
 color: var(--cw-bubble-contrast);
 overflow: hidden;
 }

 .chat-bubble:hover {
 transform: translateY(-2px) scale(1.03);
 box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2), 0 12px 32px rgba(0, 0, 0, 0.12);
 }

 .chat-bubble:active {
 transform: scale(0.97);
 }

 .chat-bubble svg {
 width: 26px;
 height: 26px;
 fill: currentColor;
 }

 .chat-bubble img {
 width: 68%;
 height: 68%;
 object-fit: contain;
 border-radius: 50%;
 }

 /* ====== Chat Window ====== */
 .chat-window {
 position: fixed;
 bottom: 96px;
 right: 24px;
 width: 384px;
 height: 620px;
 max-height: calc(100vh - 120px);
 background: var(--cw-bg);
 border: 1px solid var(--cw-border);
 border-radius: var(--cw-radius-lg);
 box-shadow: var(--cw-shadow);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: auto;
 animation: cwSlideUp 240ms var(--cw-ease);
 }

 @keyframes cwSlideUp {
 from { opacity: 0; transform: translateY(12px) scale(0.98); }
 to { opacity: 1; transform: translateY(0) scale(1); }
 }

 /* ====== Chat Header — Logo + Name DEFINITIV gleiche Höhe + vertikal mittig ====== */
 /* Strategie: EIN flex-row container, BEIDE children (logo + text) exakt 40px hoch,
 align-items:center, padding oben=unten → kein Versatz moeglich. */
 .chat-header {
 position: relative;
 padding: 16px 48px 16px 18px;
 display: flex;
 flex-direction: row;
 align-items: center;
 justify-content: flex-start;
 min-height: 64px;
 border-bottom: 1px solid #000;
 background: #0A0A0A;
 color: #FFFFFF;
 flex-shrink: 0;
 box-sizing: border-box;
 }

 .header-content {
 display: flex;
 flex-direction: row;
 align-items: center;
 gap: 10px;
 flex: 1;
 min-width: 0;
 height: 32px;
 }

 .header-content h3 {
 margin: 0;
 padding: 0;
 font-size: 17px;
 line-height: 32px;
 font-weight: 700;
 color: #FFFFFF;
 letter-spacing: -0.01em;
 display: flex;
 align-items: center;
 gap: 10px;
 min-width: 0;
 height: 32px;
 }

 .header-content h3 span {
 overflow: hidden;
 text-overflow: ellipsis;
 white-space: nowrap;
 display: block;
 line-height: 32px;
 height: 32px;
 }

 .cw-header-logo {
 height: 32px;
 width: auto;
 max-width: 90px;
 object-fit: contain;
 border-radius: 6px;
 flex-shrink: 0;
 display: block;
 }

 .header-status-corner {
 position: absolute;
 bottom: 5px;
 right: 12px;
 display: flex;
 align-items: center;
 gap: 4px;
 font-size: 9px;
 font-weight: 500;
 color: #A3A3A3;
 letter-spacing: 0.03em;
 opacity: 0.8;
 }

 .status-dot {
 width: 5px;
 height: 5px;
 border-radius: 50%;
 flex-shrink: 0;
 }
 .status-online { background: #10B981; }
 .status-offline { background: #EF4444; }

 .close-btn {
 position: absolute;
 top: 10px;
 right: 10px;
 background: transparent;
 border: none;
 color: #A3A3A3;
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 width: 28px;
 height: 28px;
 border-radius: 8px;
 transition: background 160ms var(--cw-ease), color 160ms var(--cw-ease);
 flex-shrink: 0;
 z-index: 2;
 }

 .close-btn:hover {
 background: #1F1F1F;
 color: #FFFFFF;
 }

 .close-btn svg {
 width: 16px;
 height: 16px;
 fill: currentColor;
 }

 /* ====== Chat Messages ====== */
 .chat-messages {
 flex: 1;
 overflow-y: auto;
 padding: 20px;
 display: flex;
 flex-direction: column;
 gap: 10px;
 background: var(--cw-bg);
 scroll-behavior: smooth;
 }

 .message {
 display: flex;
 animation: cwFadeIn 220ms var(--cw-ease);
 }

 @keyframes cwFadeIn {
 from { opacity: 0; transform: translateY(6px); }
 to { opacity: 1; transform: translateY(0); }
 }

 .message.user { justify-content: flex-end; }
 .message.bot { justify-content: flex-start; }

 .message-content {
 max-width: 78%;
 padding: 10px 14px;
 border-radius: var(--cw-radius);
 font-size: 14px;
 line-height: 1.45;
 word-wrap: break-word;
 white-space: pre-wrap;
 }

 .message.user .message-content {
 background: var(--cw-text);
 color: var(--cw-bg);
 border-bottom-right-radius: 4px;
 }

 .message.bot .message-content {
 background: var(--cw-surface);
 color: var(--cw-text);
 border-bottom-left-radius: 4px;
 }

 /* Typing indicator */
 .cw-typing {
 display: inline-flex;
 align-items: center;
 gap: 4px;
 padding: 12px 14px;
 background: var(--cw-surface);
 border-radius: var(--cw-radius);
 border-bottom-left-radius: 4px;
 }
 .cw-typing span {
 width: 6px;
 height: 6px;
 background: var(--cw-text-muted);
 border-radius: 50%;
 animation: cwTyping 1200ms ease-in-out infinite;
 }
 .cw-typing span:nth-child(2) { animation-delay: 150ms; }
 .cw-typing span:nth-child(3) { animation-delay: 300ms; }
 @keyframes cwTyping {
 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
 30% { opacity: 1; transform: translateY(-3px); }
 }

 /* Scrollbar */
 .chat-messages::-webkit-scrollbar { width: 6px; }
 .chat-messages::-webkit-scrollbar-track { background: transparent; }
 .chat-messages::-webkit-scrollbar-thumb {
 background: var(--cw-border);
 border-radius: 3px;
 }
 .chat-messages::-webkit-scrollbar-thumb:hover {
 background: var(--cw-text-muted);
 }

 /* Message buttons (slot-picker, date-picker etc) */
 .chat-messages button {
 font-family: inherit;
 font-weight: 500;
 transition: transform 120ms var(--cw-ease), opacity 120ms var(--cw-ease);
 }
 .chat-messages button:hover:not(:disabled) { transform: translateY(-1px); }
 .chat-messages button:active:not(:disabled) { transform: translateY(0); }

 /* ====== Chat Input (weiss, nahtlos mit chat-messages, kein Trennstreifen) ====== */
 .chat-input-container {
 display: flex;
 align-items: center;
 gap: 8px;
 padding: 14px 16px;
 background: var(--cw-bg);
 border-top: none;
 flex-shrink: 0;
 }

 .chat-input {
 flex: 1;
 border: 1px solid var(--cw-border);
 border-radius: 12px;
 padding: 10px 14px;
 font-size: 14px;
 font-family: inherit;
 color: var(--cw-text);
 background: var(--cw-bg);
 outline: none;
 transition: border-color 160ms var(--cw-ease), box-shadow 160ms var(--cw-ease);
 }

 .chat-input::placeholder {
 color: var(--cw-text-muted);
 }

 .chat-input:focus {
 border-color: var(--cw-text);
 box-shadow: 0 0 0 3px var(--cw-ring);
 }

 .send-btn {
 background: #0A0A0A;
 color: #FFFFFF;
 border: none;
 width: 38px;
 height: 38px;
 border-radius: 10px;
 cursor: pointer;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: transform 120ms var(--cw-ease), opacity 120ms var(--cw-ease);
 flex-shrink: 0;
 }

 .send-btn:hover { transform: scale(1.04); }
 .send-btn:active { transform: scale(0.95); }

 .send-btn svg {
 width: 18px;
 height: 18px;
 }

 /* ====== Mobile ====== */
 @media (max-width: 480px) {
 .chat-window {
 width: calc(100vw - 16px);
 height: calc(100vh - 100px);
 max-height: calc(100dvh - 100px);
 bottom: 88px;
 right: 8px;
 left: 8px;
 }
 .message-content { max-width: 88%; }
 .chat-bubble {
 width: 54px;
 height: 54px;
 bottom: 18px;
 right: 18px;
 }
 .chat-bubble svg { width: 24px; height: 24px; }
 }
 `;

 // Dynamic client ID from script tag: <script src="widget.js" data-client-id="kunde123" data-backend="https://your-server.onrender.com"></script>
 const scriptTag = document.currentScript || document.querySelector('script[data-client-id]');
 const CLIENT_ID = scriptTag?.getAttribute('data-client-id');
 const BACKEND_BASE = (scriptTag?.getAttribute('data-backend') || 'https://chatbot-widget-kaqe.onrender.com').replace(/\/$/, '');

 // Supabase config
 const SUPABASE_URL = "https://lzvmtctyzicdtgtoevaf.supabase.co";
 const SUPABASE_ANON_KEY = 'sb_publishable_p_JbsG1bB7f-zWossrLETA_Pe_0W19o';

 // Backend proxy URL for AI intent parsing (no API key in frontend)
 const INTENT_PROXY_URL = `${BACKEND_BASE}/api/parse-intent`;

 // AI reservation intent parser — calls local backend proxy
 const parseReservationIntentWithAI = async (userMessage, tone) => {
 try {
 const response = await fetch(INTENT_PROXY_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ message: userMessage, tone })
 });
 if (!response.ok) return null;
 const parsed = await response.json();
 if (!parsed) return null;
 console.log('AI parse result:', parsed);
 return parsed;
 } catch (e) {
 console.warn('ChatBot Widget AI Error (falling back to classic logic):', e);
 return null;
 }
 };

 // Backend proxy URL for full chat (response text + extracted data)
 const CHAT_PROXY_URL = `${BACKEND_BASE}/api/chat`;
 const CHAT_V2_URL = `${BACKEND_BASE}/api/chat-v2`;

 // Sprint 3d — Feature-Flag fuer Intent-Graph-Backend (/api/chat-v2).
 // Aktiviert via: window.CHATBOT_USE_V2 = true, URL-Hash #chatv2, oder localStorage.CHATBOT_USE_V2='true'
 const USE_CHAT_V2 = (typeof window !== 'undefined' && (
 window.CHATBOT_USE_V2 === true ||
 (window.location && window.location.hash && window.location.hash.indexOf('chatv2') >= 0) ||
 (window.localStorage && window.localStorage.getItem('CHATBOT_USE_V2') === 'true')
 ));

 // Session-ID (stable fuer conversation_log)
 const SESSION_ID = (function() {
 try {
 const k = 'cw_session_id';
 let s = window.sessionStorage && window.sessionStorage.getItem(k);
 if (!s) {
 s = 'cw-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
 if (window.sessionStorage) window.sessionStorage.setItem(k, s);
 }
 return s;
 } catch (_e) { return 'cw-fallback-' + Date.now(); }
 })();

 // Calls /api/chat — returns { intent, response, data } or null on failure
 const callChatAPI = async (userMessage, state, tone) => {
 try {
 const res = await fetch(CHAT_PROXY_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ message: userMessage, state, tone, client_id: CLIENT_ID })
 });
 if (!res.ok) return null;
 const parsed = await res.json();
 if (!parsed) return null;
 console.log('Chat API result:', parsed);
 return parsed;
 } catch (e) {
 console.warn('ChatBot Widget /api/chat error (falling back):', e);
 return null;
 }
 };

 // Sprint 3d — /api/chat-v2 Caller (Intent-Graph-Backend)
 // Returned: { response, attachments, state, uiAction, _intent, _confidence, _rag_used, ... }
 const callChatV2 = async (userMessage, state, tone) => {
 try {
 const consent = (function() {
 try { return window.localStorage && window.localStorage.getItem('CHATBOT_CONSENT') === 'true'; }
 catch(_e) { return false; }
 })();
 const res = await fetch(CHAT_V2_URL, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ message: userMessage, state, tone, client_id: CLIENT_ID, session_id: SESSION_ID, consent })
 });
 if (!res.ok) return null;
 return await res.json();
 } catch (e) {
 console.warn('ChatBot Widget /api/chat-v2 error:', e);
 return null;
 }
 };

 // Load supabase-js from CDN (browser)
 const loadSupabase = async () => {
 if (window.supabase) return window.supabase;

 await new Promise((resolve, reject) => {
 const existingScript = document.querySelector('script[src*="@supabase/supabase-js"]');

 if (existingScript) {
 existingScript.addEventListener('load', resolve, { once: true });
 existingScript.addEventListener('error', reject, { once: true });
 return;
 }

 const script = document.createElement('script');
 script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
 script.onload = resolve;
 script.onerror = reject;
 document.head.appendChild(script);
 });

 return window.supabase;
 };

 // Get active flag from Supabase table "clients"
 async function checkClientActive() {
 try {
 const supabaseLib = await loadSupabase();
 const supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

 console.log("SUPABASE_URL:", SUPABASE_URL);
 console.log("CLIENT_ID:", CLIENT_ID);

 const { data, error } = await supabase
 .from('clients')
 .select('active')
 .eq('id', CLIENT_ID)
 .single();

 console.log("Supabase result:", { data, error });

 if (error) {
 console.error('ChatBot Widget Supabase Error:', error);
 return null;
 }

 return data ? data.active === true : null;
 } catch (error) {
 console.error('ChatBot Widget Supabase Error:', error);
 return null;
 }
 }

 // Load full client data from Supabase table "clients"
 async function loadClientData() {
 try {
 const supabaseLib = await loadSupabase();
 const supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

 const { data, error } = await supabase
 .from('clients')
 .select('active, business_name, phone, email, address, opening_hours, prices, tone, capacity_per_slot, slot_interval, default_duration_minutes, primary_color, secondary_color, reservations_enabled, note')
 .eq('id', CLIENT_ID)
 .single();

 if (error) {
 console.error('ChatBot Widget Supabase Error:', error);
 return null;
 }

 if (!data || !data.active) return null;

 // business_type bleibt (wird von Backend gelesen, nicht Widget).
 // Pivot 2026-04-21: nur noch bubble_color + bubble_icon_url als Customization,
 // alles andere (font_family, theme_preset, design_dna) obsolet + ignoriert.
 let businessType = null;
 let bubbleColor = null;
 let bubbleIconUrl = null;
 try {
 const { data: extra } = await supabase
 .from('clients')
 .select('business_type, bubble_color, bubble_icon_url')
 .eq('id', CLIENT_ID)
 .single();
 if (extra) {
 if (extra.business_type) businessType = extra.business_type;
 if (extra.bubble_color) bubbleColor = extra.bubble_color;
 if (extra.bubble_icon_url) bubbleIconUrl = extra.bubble_icon_url;
 }
 } catch (_e) { /* columns missing — widget falls back to black bubble */ }

 return {
 businessName: data.business_name,
 phone: data.phone,
 email: data.email,
 address: data.address,
 openingHours: data.opening_hours,
 prices: data.prices,
 tone: data.tone,
 capacityPerSlot: data.capacity_per_slot,
 slotInterval: data.slot_interval,
 defaultDurationMinutes: data.default_duration_minutes,
 businessType,
 reservationsEnabled: data.reservations_enabled,
 note: data.note,
 bubbleColor,
 bubbleIconUrl
 };
 } catch (error) {
 console.error('ChatBot Widget Supabase Error:', error);
 return null;
 }
 }

 // Chat responses generator
 const generateResponse = (userMessage, clientData, tone) => {
 const message = userMessage.toLowerCase();
 const normalizedMessage = message
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g, '')
 .replace(/[^a-z0-9\s]/g, ' ')
 .replace(/\s+/g, ' ')
 .trim();
 const messageWithoutFillers = normalizedMessage
 .replace(/\b(hey|bro|bitte|mal|doch|eigentlich|denn)\b/g, ' ')
 .replace(/\s+/g, ' ')
 .trim();
 const ft = (friendly, formal, casual) => {
 if (tone === 'formal') return formal;
 if (tone === 'casual') return casual;
 return friendly;
 };

 // Reservation intent detection — delegates to stateful flow in initWidget
 // Typo-tolerant patterns
 const _hasDateKeyword =
 /\b(heute|morgen|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b/.test(messageWithoutFillers) ||
 /\b(heite|heut|hete|morgn|morgrn|moren|moreg|morgeen|morgnm|mogren|mogen|mogn)\b/.test(messageWithoutFillers) ||
 /\bmorg[a-z]{0,3}\b/.test(messageWithoutFillers) ||
 /\bheut[a-z]{0,2}\b/.test(messageWithoutFillers);
 const _hasPersonCount = /\b\d{1,2}\b/.test(messageWithoutFillers);
 const _hasPersonWord =
 /\b(leute|personen?|person|platz|platze|platzen)\b/.test(messageWithoutFillers) ||
 /\b(leude|leut|perosn|persn|pernson|persnnen?|peronen?|pursonen?|prsonen?|persnn|pernen|pernon|pernonen)\b/.test(messageWithoutFillers) ||
 /\bpers[a-z]{0,4}\b/.test(messageWithoutFillers);
 const _hasReservWord =
 /\breserv\b|\breserve\b|reservier|reservierung|reservieren|resrvier|reseriv|reseriver|buchen|buchung/.test(messageWithoutFillers) ||
 /\b(resrvieren|resrvierung|resrvierng|reesrvieren|reseriveren|reservirn|resrvierern)\b/.test(messageWithoutFillers);
 const hasReservationIntent =
 _hasReservWord ||
 /tisch\s+fur\s+\d{1,2}/.test(messageWithoutFillers) ||
 /platz\s+fur\s+\d{1,2}/.test(messageWithoutFillers) ||
 (/platz/.test(messageWithoutFillers) && /personen?|person|heute|abend|uhr/.test(messageWithoutFillers)) ||
 (_hasDateKeyword && _hasPersonCount) ||
 (_hasDateKeyword && _hasPersonWord) ||
 (_hasPersonCount && _hasPersonWord);

 if (hasReservationIntent) {
 // Businesses mit reservations_enabled=false nehmen keine Chat-Reservierungen entgegen (z.B. Blumenladen)
 if (clientData && clientData.reservationsEnabled === false) {
 return ft(
 `Wir nehmen Reservierungen nicht über den Chat entgegen — ruf uns gern an${clientData.phone ? ' unter ' + clientData.phone : ''} oder schreib uns eine Email!`,
 `Reservierungen nehmen wir nicht über den Chat entgegen. Bitte kontaktieren Sie uns telefonisch${clientData.phone ? ' unter ' + clientData.phone : ''} oder per E-Mail.`,
 `Reservierungen gehen bei uns nur per Anruf${clientData.phone ? ' (' + clientData.phone + ')' : ''} oder Email!`
 );
 }
 return '__START_RESERVATION__';
 }

 // Greeting keywords
 if (
 message.includes('hallo') ||
 message.includes('hi') ||
 message.includes('hey') ||
 message.includes('guten tag') ||
 messageWithoutFillers.includes('hallo') ||
 messageWithoutFillers.includes('guten tag')
 ) {
 return ft('Hallo! Wie kann ich dir helfen?', 'Guten Tag! Womit kann ich Ihnen behilflich sein?', 'Hey! Was kann ich für dich tun?');
 }

 // Thanks keywords
 if (message.includes('danke') || message.includes('merci') || messageWithoutFillers.includes('danke')) {
 return ft('Sehr gerne! Wenn du noch Fragen zu Pizza, Öffnungszeiten oder Kontakt hast, bin ich da.', 'Sehr gerne! Für weitere Fragen zu Preisen, Öffnungszeiten oder Kontakt stehe ich Ihnen gerne zur Verfügung.', 'Klar doch! Falls du noch was wissen willst – einfach fragen.');
 }

 // Goodbye keywords
 if (
 message.includes('tschüss') ||
 message.includes('tschuess') ||
 message.includes('ciao') ||
 messageWithoutFillers.includes('tschuss')
 ) {
 return ft('Danke dir, bis bald!', 'Vielen Dank, auf Wiedersehen!', 'Tschau, bis bald!');
 }

 // Price-related keywords
 if (
 message.includes('preis') ||
 message.includes('preise') ||
 normalizedMessage.includes('prese') ||
 normalizedMessage.includes('preiss') ||
 message.includes('kosten') ||
 message.includes('wieviel') ||
 message.includes('koste')
 ) {
 if (clientData.prices) {
 const prices = Object.entries(clientData.prices)
 .map(([name, price]) => `${name}: ${price}`)
 .join('\n');
 return ft(`Unsere Preise:\n\n${prices}\n\nHast du noch Fragen?`, `Unsere Preisübersicht:\n\n${prices}\n\nHaben Sie weitere Fragen?`, `Hier unsere Preise:\n\n${prices}\n\nNoch was?`);
 }
 return ft('Für genaue Preise ruf uns gerne an!', 'Für genaue Preise kontaktieren Sie uns bitte direkt.', 'Für Preise ruf uns einfach an!');
 }

 // Opening hours related keywords
 if (
 message.includes('öffnungszeit') ||
 normalizedMessage.includes('offnungszeit') ||
 normalizedMessage.includes('offnugszeiten') ||
 normalizedMessage.includes('oeffnungszeiten') ||
 normalizedMessage.includes('offen') ||
 message.includes('öffnung') ||
 message.includes('wann offen') ||
 message.includes('geöffnet') ||
 normalizedMessage.includes('offnungszeiten heute') ||
 normalizedMessage.includes('heute offen') ||
 normalizedMessage.includes('wann habt ihr offen') ||
 normalizedMessage.includes('wann seid ihr offen') ||
 normalizedMessage.includes('wann macht ihr auf') ||
 /habt\s+ihr\s+(heute\s+)?offen/.test(messageWithoutFillers) ||
 /seid\s+ihr\s+(heute\s+)?offen/.test(messageWithoutFillers) ||
 /wann\s+(habt|seid)\s+ihr\s+offen/.test(messageWithoutFillers) ||
 /wann\s+macht\s+ihr\s+auf/.test(messageWithoutFillers)
 ) {
 if (clientData.openingHours) {
 // opening_hours kommt als Free-Text-String aus Supabase — einfach raw anzeigen
 const raw = typeof clientData.openingHours === 'string'
 ? clientData.openingHours
 : Object.entries(clientData.openingHours).map(([d,h]) => `${d}: ${h}`).join('\n');
 return ft(`Unsere Öffnungszeiten:\n${raw}`, `Unsere Öffnungszeiten:\n${raw}`, `Unsere Öffnungszeiten:\n${raw}`);
 }
 return ft('Öffnungszeiten findest du auf unserer Website.', 'Unsere Öffnungszeiten finden Sie auf unserer Website.', 'Schau mal auf unsere Website für die Öffnungszeiten!');
 }

 // Location/Address related keywords
 if (
 message.includes('adresse') ||
 message.includes('standort') ||
 normalizedMessage.includes('standot') ||
 normalizedMessage.includes('wo seid ihr') ||
 message.includes('wo') ||
 message.includes('location')
 ) {
 if (clientData.address) {
 return ft(`Du findest uns unter:\n${clientData.address}\n\nWir freuen uns auf deinen Besuch!`, `Sie finden uns unter:\n${clientData.address}\n\nWir freuen uns auf Ihren Besuch!`, `Hier findet ihr uns:\n${clientData.address}\n\nKommt vorbei!`);
 }
 return ft('Kontaktiere uns für unsere Adresse.', 'Bitte kontaktieren Sie uns für unsere Adresse.', 'Meld dich bei uns für die Adresse!');
 }

 // Contact related keywords
 if (
 message.includes('kontakt') ||
 normalizedMessage.includes('kontat') ||
 message.includes('telefon') ||
 normalizedMessage.includes('nummer') ||
 message.includes('mail') ||
 message.includes('erreichbar')
 ) {
 let contact = ft('Kontaktiere uns:\n', 'Sie erreichen uns hier:\n', 'Erreich uns so:\n');
 if (clientData.phone) contact += `${clientData.phone}\n`;
 if (clientData.email) contact += `${clientData.email}`;
 return contact;
 }

 // Default responses
 const defaultResponses = [
 ft(
 `Hallo! Wie kann ich dir helfen?\n\nIch kann dir über folgende Themen informieren:\n- Preise\n- Öffnungszeiten\n- Standort\n- Kontakt`,
 `Guten Tag! Womit kann ich Ihnen behilflich sein?\n\nIch informiere Sie gerne zu:\n- Preisen\n- Öffnungszeiten\n- Standort\n- Kontakt`,
 `Hey! Was kann ich für dich tun?\n\nIch kenn mich aus mit:\n- Preisen\n- Öffnungszeiten\n- Standort\n- Kontakt`
 ),
 ft(
 `Gute Frage! Leider kenne ich die Antwort nicht genau. Bitte kontaktiere uns direkt für weitere Informationen.`,
 `Eine gute Frage! Leider kann ich diese nicht vollständig beantworten. Bitte kontaktieren Sie uns direkt.`,
 `Gute Frage! Das weiß ich leider nicht – ruf uns einfach an!`
 ),
 ft(
 `Bezüglich "${userMessage}" können dir unsere Mitarbeiter besser helfen. Melde dich gerne bei uns!`,
 `Bezüglich "${userMessage}" stehen Ihnen unsere Mitarbeiter gerne zur Verfügung.`,
 `Wegen "${userMessage}" – da helfen dir unsere Leute besser! Einfach melden.`
 )
 ];

 return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
 };

 // Widget initialization
 const initWidget = async (clientId) => {
 const clientData = await loadClientData();

 if (!clientData) {
 console.warn(`ChatBot Widget: Client "${clientId}" not found`);
 return;
 }

 const tone = clientData.tone || 'friendly';
 const t = (friendly, formal, casual) => {
 if (tone === 'formal') return formal;
 if (tone === 'casual') return casual;
 return friendly;
 };

 // Reservation multi-step state
 const reservationState = {
 active: false,
 step: null, // 'people' | 'date' | 'time' | 'email' | 'confirm'
 people: null,
 date: null,
 time: null,
 email: null,
 urgency: null, // 'priority' wenn User Dringlichkeits-Keywords nutzt (jetzt/sofort/Schmerzen)
 showAllSlots: false, // Flag: hat User "weitere Zeiten" geklickt?
 language: 'de' // Backend setzt die via state.language — de/en/fr/it
 };

 // Widget-UI-Uebersetzungen — Backend liefert state.language, Widget localisiert Chrome
 const UI_STRINGS = {
 placeholder: { de: 'Schreib eine Nachricht...', en: 'Write a message...', fr: 'Écrivez un message...', it: 'Scrivi un messaggio...' },
 summaryTitle: { de: 'Reservierungsübersicht', en: 'Booking summary', fr: 'Récapitulatif', it: 'Riepilogo prenotazione' },
 labelPeople: { de: 'Personen', en: 'People', fr: 'Personnes', it: 'Persone' },
 labelDate: { de: 'Datum', en: 'Date', fr: 'Date', it: 'Data' },
 labelTime: { de: 'Uhrzeit', en: 'Time', fr: 'Heure', it: 'Ora' },
 labelEmail: { de: 'E-Mail', en: 'Email', fr: 'E-mail', it: 'Email' },
 btnConfirm: { de: 'Bestätigen', en: 'Confirm', fr: 'Confirmer', it: 'Conferma' },
 btnEdit: { de: 'Bearbeiten', en: 'Edit', fr: 'Modifier', it: 'Modifica' },
 btnCancel: { de: 'Abbrechen', en: 'Cancel', fr: 'Annuler', it: 'Annulla' },
 slotsAvailable: { de: 'Diese Zeiten sind verfügbar:', en: 'These times are available:', fr: 'Ces heures sont disponibles:', it: 'Questi orari sono disponibili:' },
 moreTimes: { de: '+ weitere Zeiten', en: '+ more times', fr: '+ plus d\'horaires', it: '+ altri orari' },
 closedOtherDate: { de: 'An diesem Tag haben wir leider geschlossen. Bitte wähle ein anderes Datum.', en: 'We\'re closed that day. Please choose another date.', fr: 'Nous sommes fermés ce jour-là. Veuillez choisir une autre date.', it: 'Siamo chiusi quel giorno. Scegli un\'altra data.' }
 };
 const uiT = (key) => {
 const variants = UI_STRINGS[key];
 if (!variants) return '';
 const lang = reservationState.language || 'de';
 return variants[lang] || variants.de;
 };

 // Medical-Urgency-Detection: Schmerz/Notfall-Keywords erkennen (nur medical business_type)
 // Ausgelöst ausserhalb einer laufenden Reservation als empathischer Notfall-Trigger.
 const MEDICAL_URGENCY_RE = /\b(weh|schmerz|schmerzen|akut|dringend|notfall|kaputt|abgebroch|entzund|entzünd|pocht|blutet|blutung|eitert|eiter|nagt|autsch|aua|emergency|urgent)\b/i;
 const isMedicalUrgency = (txt) => inferBusinessType() === 'medical' && MEDICAL_URGENCY_RE.test(String(txt || ''));

 // Zeit-Urgency: explizite Sofort-Wünsche
 const TIME_URGENCY_RE = /\b(jetzt|sofort|gleich|direkt|asap|so\s+bald|so\s*schnell\s*wie|gleich\s*vorbei|heute\s+noch)\b/i;
 const isTimeUrgent = (txt) => TIME_URGENCY_RE.test(String(txt || ''));

 // Business-Type-Detection: primär aus Supabase-Spalte business_type,
 // Legacy-Fallback für die 5 Demo-Clients falls die Spalte noch nicht migriert ist.
 const inferBusinessType = () => {
 if (clientData && clientData.businessType) return clientData.businessType;
 const legacyMap = {
 'demo-zahnarzt': 'medical',
 'demo-coiffeur': 'beauty',
 'demo-pizzeria': 'restaurant',
 'demo-cafe': 'cafe',
 'demo-blumenladen':'retail'
 };
 return legacyMap[CLIENT_ID] || 'other';
 };
 // Service-Businesses (medical/beauty/service) buchen Einzeltermine — nie "für wie viele Personen" fragen.
 const SERVICE_BUSINESS_TYPES = ['medical', 'beauty', 'service'];
 const isServiceBusiness = () => SERVICE_BUSINESS_TYPES.indexOf(inferBusinessType()) !== -1;
 // Reservations-Enabled: wenn Supabase-Spalte explizit false ist, nimmt der Bot keine Reservierungen entgegen.
 const reservationsAreEnabled = () => clientData && clientData.reservationsEnabled !== false;

 const toMinutes = (timeText) => {
 const m = String(timeText).match(/^(\d{1,2}):(\d{2})/);
 if (!m) return null;
 return (parseInt(m[1], 10) * 60) + parseInt(m[2], 10);
 };

 const toISODate = (dateObj) => {
 const y = dateObj.getFullYear();
 const m = String(dateObj.getMonth() + 1).padStart(2, '0');
 const d = String(dateObj.getDate()).padStart(2, '0');
 return `${y}-${m}-${d}`;
 };

 const resolveDateToISO = (dateText) => {
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const value = String(dateText || '').toLowerCase();

 if (value === 'heute' || /^heut[a-z]{0,2}$/.test(value) || value === 'jetzt' || value === 'sofort' || value === 'gleich') return toISODate(today);
 if (value === 'morgen' || /^(morgn|morgrn|moren|moreg|morgeen|morgnm|mogren|mogen|mogn)$/.test(value) || /^morg[a-z]{1,3}$/.test(value)) {
 const d = new Date(today);
 d.setDate(d.getDate() + 1);
 return toISODate(d);
 }

 const weekdayMap = {
 sonntag: 0,
 montag: 1,
 dienstag: 2,
 mittwoch: 3,
 donnerstag: 4,
 freitag: 5,
 samstag: 6
 };
 if (Object.prototype.hasOwnProperty.call(weekdayMap, value)) {
 const target = weekdayMap[value];
 let diff = (target - today.getDay() + 7) % 7;
 if (diff === 0) diff = 7;
 const d = new Date(today);
 d.setDate(d.getDate() + diff);
 return toISODate(d);
 }

 const numericMatch = value.match(/^(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?$/);
 if (numericMatch) {
 const day = parseInt(numericMatch[1], 10);
 const month = parseInt(numericMatch[2], 10) - 1;
 let year = numericMatch[3] ? parseInt(numericMatch[3], 10) : today.getFullYear();
 if (year < 100) year += 2000;
 const d = new Date(year, month, day);
 if (!Number.isNaN(d.getTime())) return toISODate(d);
 }

 return null;
 };

 const formatDateForDisplay = (dateText) => {
 const iso = resolveDateToISO(dateText);
 if (!iso) return String(dateText || '');
 const parts = iso.split('-');
 if (parts.length !== 3) return String(dateText || '');
 return `${parts[2]}.${parts[1]}.${parts[0]}`;
 };

 const buildSlots = (startMinutes, durationMinutes, intervalMinutes) => {
 const slots = [];
 const end = startMinutes + durationMinutes;
 for (let t = startMinutes; t < end; t += intervalMinutes) {
 slots.push(t);
 }
 return slots;
 };

 const formatMinutesToTime = (minutes) => {
 const h = Math.floor(minutes / 60);
 const m = minutes % 60;
 return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
 };

 // Parse free-text opening_hours string from Supabase into a day-keyed map of ranges.
 // Handles: Day abbreviations (Mo/Di/Mi/Do/Fr/Sa/So) + full names, day ranges (Mo–Fr, Di–Do),
 // multiple ranges per day separated by "&"/"und"/"," (e.g. "11:30-14:00 & 17:30-22:00"),
 // closed markers (Geschlossen/Ruhetag/closed/-), and parenthetical notes (ignored).
 // Returns: { montag: [{start, end}], ..., sonntag: [] } — all 7 weekdays always present.
 const parseOpeningHours = (str) => {
 const DAY_NAMES = ['montag','dienstag','mittwoch','donnerstag','freitag','samstag','sonntag'];
 const IDX = { mo:0, montag:0, di:1, dienstag:1, mi:2, mittwoch:2, do:3, donnerstag:3, fr:4, freitag:4, sa:5, samstag:5, so:6, sonntag:6 };
 const result = {};
 for (const d of DAY_NAMES) result[d] = [];
 if (!str || typeof str !== 'string') return result;

 const lines = str.split(/\r?\n/);
 for (const raw of lines) {
 const line = raw.trim();
 if (!line) continue;
 const colonSplit = line.match(/^([^:]+?):\s*(.+)$/);
 if (!colonSplit) continue;
 const dayPart = colonSplit[1].trim().toLowerCase();
 let hoursPart = colonSplit[2].trim().toLowerCase();
 // Strip parenthetical notes: "(nur nach Vereinbarung)"
 hoursPart = hoursPart.replace(/\([^)]*\)/g, '').trim();

 const days = [];
 const rangeMatch = dayPart.match(/^(mo|di|mi|do|fr|sa|so|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\s*[-–—]\s*(mo|di|mi|do|fr|sa|so|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)$/);
 if (rangeMatch) {
 const a = IDX[rangeMatch[1]], b = IDX[rangeMatch[2]];
 if (a !== undefined && b !== undefined) {
 if (a <= b) { for (let i = a; i <= b; i++) days.push(DAY_NAMES[i]); }
 else { for (let i = a; i <= 6; i++) days.push(DAY_NAMES[i]); for (let i = 0; i <= b; i++) days.push(DAY_NAMES[i]); }
 }
 } else {
 const tokens = dayPart.split(/[,\s/]+/).filter(Boolean);
 for (const t of tokens) { if (IDX[t] !== undefined) days.push(DAY_NAMES[IDX[t]]); }
 }
 if (days.length === 0) continue;

 if (/^(geschlossen|ruhetag|closed|-|\s*)$/.test(hoursPart)) continue;

 const rangeRegex = /(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/g;
 const ranges = [];
 let m;
 while ((m = rangeRegex.exec(hoursPart)) !== null) {
 const start = parseInt(m[1],10)*60 + parseInt(m[2],10);
 const end = parseInt(m[3],10)*60 + parseInt(m[4],10);
 if (end > start) ranges.push({ start, end });
 }
 for (const d of days) result[d].push(...ranges);
 }
 return result;
 };

 // Returns an array of {start, end} ranges in minutes for the given day label,
 // or null if the business is closed / day cannot be resolved.
 const getDayRanges = (dateLabel) => {
 const openingHours = clientData.openingHours;
 const parsed = (typeof openingHours === 'string')
 ? parseOpeningHours(openingHours)
 : (openingHours && typeof openingHours === 'object' ? openingHours : null);

 if (!parsed) return null;

 let key = String(dateLabel || '').toLowerCase();
 if (key === 'heute' || key === 'morgen' || key === 'jetzt' || key === 'sofort' || key === 'gleich') {
 const d = new Date();
 if (key === 'morgen') d.setDate(d.getDate() + 1);
 key = d.toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
 }
 const _ndm = key.match(/^(\d{1,2})[.](\d{1,2})(?:[.](\d{2,4}))?$/);
 if (_ndm) {
 let _yr = _ndm[3] ? parseInt(_ndm[3], 10) : new Date().getFullYear();
 if (_yr < 100) _yr += 2000;
 const _dd = new Date(_yr, parseInt(_ndm[2], 10) - 1, parseInt(_ndm[1], 10));
 if (!Number.isNaN(_dd.getTime())) key = _dd.toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
 }

 const dayRanges = parsed[key];
 if (!Array.isArray(dayRanges) || dayRanges.length === 0) return null;
 return dayRanges;
 };

 // Legacy-compat helper: returns first {start, end} union wrapper for single-range usage.
 // Used by code paths that only need to know IF the business has any opening, not the details.
 const getDayWindow = (dateLabel) => {
 const ranges = getDayRanges(dateLabel);
 if (!ranges || ranges.length === 0) return null;
 return { start: ranges[0].start, end: ranges[ranges.length - 1].end };
 };

 // True if the given minute-of-day falls inside ANY opening range on the given day.
 const isTimeWithinOpeningHours = (dateLabel, minutes) => {
 const ranges = getDayRanges(dateLabel);
 if (!ranges) return false;
 for (const r of ranges) {
 if (minutes >= r.start && minutes < r.end) return true;
 }
 return false;
 };

 const getSlotAvailabilityForCurrentReservation = async () => {
 const capacityPerSlot = parseInt(clientData.capacityPerSlot, 10);
 const hasCapacity = !Number.isNaN(capacityPerSlot);
 const slotInterval = parseInt(clientData.slotInterval, 10) || 15;
 const defaultDuration = parseInt(clientData.defaultDurationMinutes, 10) || 120;
 const reservationDateISO = resolveDateToISO(reservationState.date);

 if (!reservationDateISO) {
 return null;
 }

 const dayRanges = getDayRanges(reservationState.date);
 if (!dayRanges) return { closed: true };

 // If capacity is not configured, show all slots as free without a Supabase query
 if (!hasCapacity) {
 const slots = [];
 for (const range of dayRanges) {
 const latestStart = range.end - defaultDuration;
 for (let start = range.start; start <= latestStart; start += slotInterval) {
 slots.push({ time: formatMinutesToTime(start), isFree: true });
 }
 }
 return slots;
 }

 const supabaseLib = await loadSupabase();
 const supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

 const { data: existingReservations, error: fetchError } = await supabase
 .from('reservations')
 .select('guests, start_time, duration_minutes')
 .eq('client_id', CLIENT_ID)
 .eq('date', reservationDateISO)
 .eq('status', 'confirmed');

 if (fetchError) {
 console.error('ChatBot Widget Supabase Error:', fetchError);
 return null;
 }

 const slots = [];

 for (const range of dayRanges) {
 const latestStart = range.end - defaultDuration;
 for (let start = range.start; start <= latestStart; start += slotInterval) {
 const newSlots = buildSlots(start, defaultDuration, slotInterval);
 let isFree = true;

 for (const slotStart of newSlots) {
 const slotEnd = slotStart + slotInterval;
 let occupied = 0;

 for (const reservation of (existingReservations || [])) {
 const existingPeople = parseInt(reservation.guests, 10) || 0;
 const existingStart = toMinutes(reservation.start_time);
 const existingDuration = parseInt(reservation.duration_minutes, 10) || defaultDuration;
 if (existingStart === null || existingPeople <= 0) continue;
 const existingEnd = existingStart + existingDuration;
 if (existingStart < slotEnd && existingEnd > slotStart) {
 occupied += existingPeople;
 }
 }

 if ((occupied + reservationState.people) > capacityPerSlot) {
 isFree = false;
 break;
 }
 }

 slots.push({
 time: formatMinutesToTime(start),
 isFree
 });
 }
 }

 return slots;
 };

 const checkCapacityAndSaveReservation = async () => {
 const capacityPerSlot = parseInt(clientData.capacityPerSlot, 10);
 const hasCapacity = !Number.isNaN(capacityPerSlot);
 const slotInterval = parseInt(clientData.slotInterval, 10) || 15;
 const defaultDuration = parseInt(clientData.defaultDurationMinutes, 10) || 120;
 const reservationDateISO = resolveDateToISO(reservationState.date);
 const newStart = toMinutes(reservationState.time);

 if (!reservationDateISO || newStart === null) {
 return 'Die Reservierung konnte gerade nicht gespeichert werden. Bitte versuche es gleich nochmal.';
 }

 // Bug 3: reject reservations on closed days
 const dayRanges = getDayRanges(reservationState.date);
 if (!dayRanges) {
 return t(
 'An diesem Tag haben wir leider geschlossen. Bitte wähle ein anderes Datum.',
 'An diesem Tag ist unser Restaurant geschlossen. Bitte wählen Sie ein anderes Datum.',
 'An dem Tag sind wir zu! Bitte wähle ein anderes Datum.'
 );
 }

 // Bug 4: reject times outside opening hours (inclusive of split hours like 11:30-14:00 & 17:30-22:00)
 if (!isTimeWithinOpeningHours(reservationState.date, newStart)) {
 const hoursText = dayRanges.map(r => `${formatMinutesToTime(r.start)}–${formatMinutesToTime(r.end)}`).join(' & ');
 return t(
 `Diese Uhrzeit liegt außerhalb unserer Öffnungszeiten (${hoursText} Uhr). Bitte wähle eine andere Zeit.`,
 `Diese Uhrzeit liegt außerhalb unserer Öffnungszeiten (${hoursText} Uhr). Bitte wählen Sie eine andere Zeit.`,
 `Außerhalb unserer Öffnungszeiten! Wir haben ${hoursText} Uhr auf. Andere Zeit?`
 );
 }

 try {
 const supabaseLib = await loadSupabase();
 const supabase = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

 // Only run capacity check when capacity_per_slot is configured in Supabase
 if (hasCapacity) {
 const { data: existingReservations, error: fetchError } = await supabase
 .from('reservations')
 .select('guests, start_time, duration_minutes')
 .eq('client_id', CLIENT_ID)
 .eq('date', reservationDateISO)
 .eq('status', 'confirmed');

 if (fetchError) {
 console.error('ChatBot Widget Supabase Error:', fetchError);
 return 'Die Reservierung konnte gerade nicht gespeichert werden. Bitte versuche es gleich nochmal.';
 }

 const newSlots = buildSlots(newStart, defaultDuration, slotInterval);

 for (const slotStart of newSlots) {
 const slotEnd = slotStart + slotInterval;
 let occupied = 0;

 for (const reservation of (existingReservations || [])) {
 const existingPeople = parseInt(reservation.guests, 10) || 0;
 const existingStart = toMinutes(reservation.start_time);
 const existingDuration = parseInt(reservation.duration_minutes, 10) || defaultDuration;
 if (existingStart === null || existingPeople <= 0) continue;
 const existingEnd = existingStart + existingDuration;
 if (existingStart < slotEnd && existingEnd > slotStart) {
 occupied += existingPeople;
 }
 }

 if ((occupied + reservationState.people) > capacityPerSlot) {
 return 'Zu dieser Zeit ist leider kein Platz mehr frei. Möchtest du eine andere Uhrzeit versuchen?';
 }
 }
 }

 const payload = {
 client_id: CLIENT_ID,
 date: reservationDateISO,
 start_time: reservationState.time,
 duration_minutes: defaultDuration,
 guests: reservationState.people,
 email: reservationState.email,
 status: 'confirmed'
 };
 console.log("Reservation payload:", payload);

 const { error: insertError } = await supabase
 .from('reservations')
 .insert(payload);

 if (insertError) {
 console.error('ChatBot Widget Supabase Error:', insertError);
 return 'Die Reservierung konnte gerade nicht gespeichert werden. Bitte versuche es gleich nochmal.';
 }

 const email = reservationState.email;
 reservationState.active = false;
 reservationState.step = null;
 reservationState.people = null;
 reservationState.date = null;
 reservationState.time = null;
 reservationState.email = null;
 reservationState.urgency = null;
 reservationState.showAllSlots = false;
 reservationState.displayedSlotTimes = null;
 return `Reservierung bestätigt. Wir melden uns per E-Mail unter ${email}.`;
 } catch (error) {
 console.error('ChatBot Widget Supabase Error:', error);
 return 'Die Reservierung konnte gerade nicht gespeichert werden. Bitte versuche es gleich nochmal.';
 }
 };

 const extractTime = (raw) => {
 // colon/dot separator: "19:05", "19.30"
 const colonMatch = raw.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);
 if (colonMatch) {
 const h = parseInt(colonMatch[1], 10);
 if (h >= 1 && h <= 12) return { text: null, ambiguous: h };
 return { text: `${colonMatch[1].padStart(2, '0')}:${colonMatch[2]}`, ambiguous: null };
 }
 // 4-digit format: "1905", "0900", "1930" — inherently 24h, never ambiguous
 const fourDigitMatch = raw.match(/\b([01]\d|2[0-3])([0-5]\d)\b/);
 if (fourDigitMatch) {
 return { text: `${fourDigitMatch[1]}:${fourDigitMatch[2]}`, ambiguous: null };
 }
 // "19 uhr", "9 uhr"
 const hourOnly = raw.match(/\b([01]?\d|2[0-3])\s*uhr\b/);
 if (hourOnly) {
 const h = parseInt(hourOnly[1], 10);
 if (h >= 1 && h <= 12) return { text: null, ambiguous: h };
 return { text: `${String(h).padStart(2, '0')}:00`, ambiguous: null };
 }
 // "um 19", "um 9"
 const umMatch = raw.match(/\bum\s+([01]?\d|2[0-3])\b/);
 if (umMatch) {
 const h = parseInt(umMatch[1], 10);
 if (h >= 1 && h <= 12) return { text: null, ambiguous: h };
 return { text: `${String(h).padStart(2, '0')}:00`, ambiguous: null };
 }
 // bare unambiguous hour: "19", "20", "21"
 const bareUnambiguous = raw.match(/\b(1[3-9]|2[0-3])\b/);
 if (bareUnambiguous) {
 return { text: `${bareUnambiguous[1]}:00`, ambiguous: null };
 }
 // bare ambiguous hour: "8", "9", "12"
 const bareAmbiguous = raw.match(/\b([01]?\d)\b/);
 if (bareAmbiguous) {
 const h = parseInt(bareAmbiguous[1], 10);
 if (h >= 1) return { text: null, ambiguous: h };
 }
 return { text: null, ambiguous: null };
 };

 const extractReservationFacts = (userInput) => {
 const norm = String(userInput || '').toLowerCase()
 .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
 .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

 let date = null;
 if (/\b(jetzt|sofort|gleich|direkt|asap)\b/.test(norm)) {
 date = 'heute';
 } else if (/\b(morgen|morgn|morgrn|moren|moreg|morgeen|morgnm|mogren|mogen|mogn)\b/.test(norm) || /\bmorg[a-z]{0,3}\b/.test(norm)) {
 date = 'morgen';
 } else if (/\b(heute|heite|heut|hete)\b/.test(norm) || /\bheut[a-z]{0,2}\b/.test(norm)) {
 date = 'heute';
 } else {
 const weekdayMatch = norm.match(/\b(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b/);
 const numericMatch = norm.match(/\b(\d{1,2}[./]\d{1,2}(?:[./]\d{2,4})?)\b/);
 if (weekdayMatch) date = weekdayMatch[1];
 if (!date && numericMatch) date = numericMatch[1];
 }

 let people = null;
 // "nur ich" / "allein" / "mich allein" → 1 Person (vor dem generischen Zahl-Match!)
 if (/\b(nur\s+ich|nur\s+mich|mich\s+allein|allein|alleine|selber|einzeln|individuell)\b/.test(norm)) {
 people = 1;
 } else {
 const peopleMatch =
 norm.match(/\bfur\s+(\d{1,2})\b/) ||
 norm.match(/\b(\d{1,2})\s*(?:leute|personen?|person)\b/) ||
 norm.match(/\b(\d{1,2})\b/);
 if (peopleMatch) {
 people = parseInt(peopleMatch[1], 10);
 } else if (/\bzu\s*zweit\b/.test(norm)) {
 people = 2;
 } else if (/\bzu\s*dritt\b/.test(norm)) {
 people = 3;
 } else if (/\bzu\s*viert\b/.test(norm)) {
 people = 4;
 }
 }

 return { date, people };
 };

 const handleReservationStep = async (userInput) => {
 const norm = userInput.toLowerCase()
 .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
 .replace(/[^a-z0-9@._\s]/g, ' ').replace(/\s+/g, ' ').trim();
 const facts = extractReservationFacts(userInput);

 if (!reservationState.date && facts.date) reservationState.date = formatDateForDisplay(facts.date) || facts.date;
 if (!reservationState.people && facts.people) reservationState.people = facts.people;

 // Service-Business: niemals nach Personenzahl fragen, immer 1 (Einzeltermin)
 if (isServiceBusiness() && !reservationState.people) reservationState.people = 1;

 // If date and people are both known but no time yet, show available slots
 if (
 reservationState.date &&
 reservationState.people &&
 !reservationState.time &&
 reservationState.step !== 'time' &&
 reservationState.step !== 'email' &&
 reservationState.step !== 'confirm'
 ) {
 reservationState.step = 'time';
 return '__SHOW_TIME_SLOTS__';
 }

 if (reservationState.step === 'people') {
 if (!reservationState.people) return t('Bitte gib die Personenanzahl ein.', 'Bitte geben Sie die Personenanzahl an.', 'Wie viele seid ihr?');
 reservationState.step = 'date';
 if (reservationState.date) {
 reservationState.step = 'time';
 return '__SHOW_TIME_SLOTS__';
 }
 return t('Für welches Datum möchtest du reservieren?', 'Für welches Datum möchten Sie reservieren?', 'Für welchen Tag soll es sein?');
 }

 if (reservationState.step === 'date') {
 if (!reservationState.date) {
 return t('Für welches Datum möchtest du reservieren?', 'Für welches Datum möchten Sie reservieren?', 'Für welchen Tag soll es sein?');
 }
 reservationState.step = 'time';
 return '__SHOW_TIME_SLOTS__';
 }

 if (reservationState.step === 'time') {
 const normalizedInput = userInput.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

 // 11:30-Bug-Fix: Wenn User exakt eine Slot-Zeit tippt die wir gerade angezeigt haben
 // → direkt akzeptieren. Keine Ambiguity-Frage, weil der User sieht die Buttons und waehlt konkret.
 const colonMatch = normalizedInput.match(/^(\d{1,2}):(\d{2})$/);
 if (colonMatch && Array.isArray(reservationState.displayedSlotTimes)) {
 const candidate = `${colonMatch[1].padStart(2, '0')}:${colonMatch[2]}`;
 if (reservationState.displayedSlotTimes.includes(candidate)) {
 reservationState.time = candidate;
 reservationState.step = 'email';
 return t('Auf welche E-Mail soll ich die Bestätigung schicken?', 'An welche E-Mail-Adresse soll ich die Bestätigung senden?', 'Deine E-Mail-Adresse?');
 }
 }

 const result = extractTime(normalizedInput);
 if (result.ambiguous !== null) {
 // Zweite Verteidigungs-Linie: Wenn HH:MM Format getippt UND innerhalb Oeffnungszeiten → kein Ambiguity-Prompt.
 // User die "11:30" tippen meinen quasi immer 11:30 Uhr morgens, nicht 23:30.
 const explicitColon = normalizedInput.match(/^(\d{1,2}):(\d{2})$/);
 if (explicitColon) {
 const h = parseInt(explicitColon[1], 10);
 const m = parseInt(explicitColon[2], 10);
 const candidate = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
 const inputMinutes = h * 60 + m;
 if (isTimeWithinOpeningHours(reservationState.date, inputMinutes)) {
 reservationState.time = candidate;
 reservationState.step = 'email';
 return t('Auf welche E-Mail soll ich die Bestätigung schicken?', 'An welche E-Mail-Adresse soll ich die Bestätigung senden?', 'Deine E-Mail-Adresse?');
 }
 }
 const pm = result.ambiguous + 12;
 return `Meinst du ${String(pm).padStart(2, '0')}:00 Uhr oder ${String(result.ambiguous).padStart(2, '0')}:00 Uhr?`;
 }
 if (!result.text) return '__SHOW_TIME_SLOTS__';

 // Bug 4: validate typed time against opening hours (supports split hours like lunch + dinner)
 const dayRanges = getDayRanges(reservationState.date);
 if (dayRanges) {
 const inputMinutes = toMinutes(result.text);
 if (inputMinutes !== null && !isTimeWithinOpeningHours(reservationState.date, inputMinutes)) {
 const hoursText = dayRanges.map(r => `${formatMinutesToTime(r.start)}–${formatMinutesToTime(r.end)}`).join(' & ');
 return t(
 `Diese Uhrzeit liegt außerhalb unserer Öffnungszeiten (${hoursText} Uhr). Bitte wähle eine andere Zeit.`,
 `Diese Uhrzeit liegt außerhalb unserer Öffnungszeiten (${hoursText} Uhr). Bitte wählen Sie eine andere Zeit.`,
 `Außerhalb unserer Öffnungszeiten! Wir haben ${hoursText} Uhr auf. Andere Zeit?`
 );
 }
 }

 reservationState.time = result.text;
 reservationState.step = 'email';
 return t('Auf welche E-Mail soll ich die Bestätigung schicken?', 'An welche E-Mail-Adresse soll ich die Bestätigung senden?', 'Deine E-Mail-Adresse?');
 }

 if (reservationState.step === 'email') {
 const emailMatch = norm.match(/[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/);
 if (!emailMatch) return t('Das sieht nicht wie eine gültige E-Mail-Adresse aus. Bitte nochmal eingeben.', 'Diese E-Mail-Adresse scheint ungültig zu sein. Bitte versuchen Sie es erneut.', 'Hmm, das sieht nach keiner E-Mail aus. Nochmal?');
 reservationState.email = emailMatch[0];
 reservationState.step = 'confirm';
 return '__SHOW_SUMMARY__';
 }

 if (reservationState.step === 'confirm') {
 if (norm === 'bestaetigen' || norm === '__confirm__') {
 return await checkCapacityAndSaveReservation();
 }
 if (norm === 'bearbeiten' || norm === '__edit__') {
 reservationState.step = 'people';
 reservationState.people = null;
 reservationState.date = null;
 reservationState.time = null;
 reservationState.email = null;
 return t('Kein Problem! Fangen wir nochmal von vorne an.\nFür wie viele Personen möchtest du reservieren?', 'Natürlich. Beginnen wir von vorne.\nFür wie viele Personen möchten Sie reservieren?', 'Klar! Nochmal.\nFür wie viele soll es sein?');
 }
 if (norm === 'abbrechen' || norm === '__cancel__') {
 reservationState.active = false;
 reservationState.step = null;
 reservationState.people = null;
 reservationState.date = null;
 reservationState.time = null;
 reservationState.email = null;
 reservationState.urgency = null;
 reservationState.showAllSlots = false;
 reservationState.displayedSlotTimes = null;
 return t('Die Reservierung wurde abgebrochen. Falls du es dir anders überlegst, einfach wieder schreiben!', 'Die Reservierung wurde abgebrochen. Falls Sie es sich anders überlegen, stehen wir Ihnen gerne zur Verfügung.', 'Reservierung abgebrochen! Falls du\'s dir anders überlegst – einfach nochmal schreiben.');
 }
 return '__SHOW_SUMMARY__';
 }

 return null;
 };

 // Pivot 2026-04-21 — Bot-Icon im Chat-Bubble.
 // Prioritaet: bubbleIconUrl (vom Kunden) > generisches Chat-Bubble-SVG
 const getBotIconSVG = () => {
 const icon = clientData.bubbleIconUrl;
 if (icon) {
 const alt = String(clientData.businessName || 'Logo').replace(/"/g, '&quot;');
 return `<img src="${icon}" alt="${alt}" onerror="this.remove(); this.parentElement.insertAdjacentHTML('beforeend','<svg viewBox=\\'0 0 24 24\\' fill=\\'currentColor\\'><path d=\\'M12 2c5.522 0 10 3.59 10 8 0 4.41-4.478 8-10 8-1.54 0-3-.32-4.28-.93L4.1 21.86c-.4 1.02-1.59 1.36-2.35.74L0 20c-1.05-1.05-.53-2.8.81-3.32 3.77-1.64 5.88-4.36 5.88-8.68 0-4.41-4.478-8-10-8z\\'/></svg>')"/>`;
 }
 return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c5.522 0 10 3.59 10 8 0 4.41-4.478 8-10 8-1.54 0-3-.32-4.28-.93L4.1 21.86c-.4 1.02-1.59 1.36-2.35.74L0 20c-1.05-1.05-.53-2.8.81-3.32 3.77-1.64 5.88-4.36 5.88-8.68 0-4.41-4.478-8-10-8z"/></svg>';
 };

 // Chat-Header-Logo: Gleiches bubbleIconUrl-Icon, kompakt links vom Business-Namen
 const getChatHeaderLogoHTML = () => {
 const icon = clientData.bubbleIconUrl;
 if (!icon) return '';
 const alt = String(clientData.businessName || 'Logo').replace(/"/g, '&quot;');
 return `<img class="cw-header-logo" src="${icon}" alt="${alt}" onerror="this.style.display='none'"/>`;
 };

 // Create widget HTML
 const createWidgetHTML = () => {
 return `
 <div id="chatbot-widget" class="chatbot-widget">
 <!-- Chat Bubble -->
 <div id="chat-bubble" class="chat-bubble">
 ${getBotIconSVG()}
 </div>

 <!-- Chat Window -->
 <div id="chat-window" class="chat-window" style="display: none;">
 <!-- Header: Status oben links (klein), Logo+Name mittig, Close oben rechts -->
 <div class="chat-header">
 <span class="header-status-corner"><span class="status-dot status-online"></span>Online</span>
 <button class="close-btn" id="close-btn" aria-label="Schliessen">
 <svg viewBox="0 0 24 24" fill="currentColor">
 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
 </svg>
 </button>
 <div class="header-content">
 <h3>${getChatHeaderLogoHTML()}<span>${clientData.businessName || 'Chat'}</span></h3>
 </div>
 </div>

 <!-- Messages -->
 <div id="chat-messages" class="chat-messages"></div>

 <!-- Input -->
 <div class="chat-input-container">
 <input
 type="text"
 id="chat-input"
 class="chat-input"
 placeholder="Schreib eine Nachricht..."
 data-i18n-placeholder="placeholder"
 autocomplete="off"
 maxlength="500"
 />
 <button id="send-btn" class="send-btn" aria-label="Senden">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
 <line x1="12" y1="19" x2="12" y2="5"/>
 <polyline points="5 12 12 5 19 12"/>
 </svg>
 </button>
 </div>
 </div>
 </div>
 `;
 };

 // Inject CSS
 const injectCSS = () => {
 const style = document.createElement('style');
 style.id = 'chatbot-widget-styles';
 style.textContent = WIDGET_CSS;
 document.head.appendChild(style);
 };

 // Initialize when DOM is ready
 const init = () => {
 // Inject CSS
 injectCSS();

 // Add widget HTML to page
 const widgetContainer = document.createElement('div');
 widgetContainer.innerHTML = createWidgetHTML();
 document.body.appendChild(widgetContainer);

 // 2026-04-21 Pivot — Widget ist fix schwarz/weiss.
 // Einzige Customization: bubble_color (Chat-Bubble + Send-Button-Farbe) + bubble_icon_url (Logo im Bubble).
 // Design-DNA-Auto-Extraction wurde weggeworfen — User-Feedback: "hässlich und unkonsistent".
 const w = document.getElementById('chatbot-widget');
 if (w) {
 const bubbleColor = clientData.bubbleColor || '#0A0A0A';
 w.style.setProperty('--cw-bubble', bubbleColor);
 // Kontrast-Farbe auto-berechnen: wenn Bubble hell → schwarzer Text, sonst weiss
 w.style.setProperty('--cw-bubble-contrast', pickReadableContrast(bubbleColor));
 }

 // Get DOM elements
 const chatBubble = document.getElementById('chat-bubble');
 const chatWindow = document.getElementById('chat-window');
 const closeBtn = document.getElementById('close-btn');
 const chatInput = document.getElementById('chat-input');
 const sendBtn = document.getElementById('send-btn');
 const chatMessages = document.getElementById('chat-messages');

 // Toggle chat window
 const toggleWindow = () => {
 const isVisible = chatWindow.style.display !== 'none';
 chatWindow.style.display = isVisible ? 'none' : 'flex';
 if (!isVisible) {
 chatInput.focus();
 // Show welcome message if empty
 if (chatMessages.children.length === 0) {
 addMessage('bot', t(
 `Hallo! Wie kann ich dir helfen?\n\nIch beantworte Fragen zu:\nPreise\nÖffnungszeiten\nStandort\nKontakt`,
 `Hallo! Wie kann ich dir helfen?\n\nIch beantworte Fragen zu:\nPreise\nÖffnungszeiten\nStandort\nKontakt`,
 `Hallo! Wie kann ich dir helfen?\n\nIch beantworte Fragen zu:\nPreise\nÖffnungszeiten\nStandort\nKontakt`
 ));
 }
 }
 };

 // Add message to chat
 // Safe HTML escape for use inside innerHTML templates
 const esc = (s) => String(s == null ? '' : s)
 .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

 // Phase 2+ — Typing-Indicator (3 bouncing dots in bot-bubble) waehrend Bot-Response erwartet wird
 const showTypingIndicator = () => {
 const msgDiv = document.createElement('div');
 msgDiv.className = 'message bot cw-typing-msg';
 msgDiv.innerHTML = '<div class="cw-typing"><span></span><span></span><span></span></div>';
 chatMessages.appendChild(msgDiv);
 chatMessages.scrollTop = chatMessages.scrollHeight;
 return msgDiv;
 };
 const removeTypingIndicator = (node) => {
 if (node && node.parentNode) node.parentNode.removeChild(node);
 };

 const addMessage = (sender, text, attachments) => {
 const messageDiv = document.createElement('div');
 messageDiv.className = `message ${sender}`;
 const content = document.createElement('div');
 content.className = 'message-content';
 // Use textContent per line + <br> — prevents XSS from any source
 String(text).split('\n').forEach((line, i) => {
 if (i > 0) content.appendChild(document.createElement('br'));
 content.appendChild(document.createTextNode(line));
 });
 messageDiv.appendChild(content);

 // Sprint 4b — Multi-Modal Attachments (image/link/map)
 if (Array.isArray(attachments) && attachments.length > 0) {
 const attWrap = document.createElement('div');
 attWrap.style.marginTop = '8px';
 attWrap.style.display = 'flex';
 attWrap.style.flexDirection = 'column';
 attWrap.style.gap = '8px';
 attachments.forEach(att => attWrap.appendChild(renderAttachment(att)));
 messageDiv.appendChild(attWrap);
 }

 chatMessages.appendChild(messageDiv);
 chatMessages.scrollTop = chatMessages.scrollHeight;
 };

 // Sprint 4b — Render single attachment (safe: uses textContent/setAttribute, no innerHTML)
 const renderAttachment = (att) => {
 const wrap = document.createElement('div');
 wrap.style.borderRadius = 'var(--cw-radius-md, 10px)';
 wrap.style.overflow = 'hidden';
 wrap.style.maxWidth = '280px';
 if (!att || !att.type) { wrap.textContent = ''; return wrap; }
 if (att.type === 'image' && att.url) {
 const img = document.createElement('img');
 img.src = att.url;
 img.alt = att.caption || '';
 img.style.width = '100%';
 img.style.height = 'auto';
 img.style.display = 'block';
 wrap.appendChild(img);
 if (att.caption) {
 const cap = document.createElement('div');
 cap.style.padding = '6px 10px';
 cap.style.fontSize = '12px';
 cap.style.color = 'var(--cw-text, #555)';
 cap.style.background = 'var(--cw-surface, #f8f8f8)';
 cap.textContent = att.caption;
 wrap.appendChild(cap);
 }
 return wrap;
 }
 if (att.type === 'link' && att.url) {
 const a = document.createElement('a');
 a.href = att.url;
 a.target = '_blank';
 a.rel = 'noopener noreferrer';
 a.style.display = 'block';
 a.style.padding = '10px 12px';
 a.style.background = 'var(--cw-surface, #f8fafc)';
 a.style.border = '1px solid var(--cw-border, #e2e8f0)';
 a.style.borderRadius = 'var(--cw-radius-md, 10px)';
 a.style.color = 'var(--cw-text, #0f172a)';
 a.style.textDecoration = 'none';
 const title = document.createElement('div');
 title.style.fontWeight = '600';
 title.style.fontSize = '13px';
 title.textContent = att.title || att.url;
 a.appendChild(title);
 if (att.description) {
 const desc = document.createElement('div');
 desc.style.fontSize = '12px';
 desc.style.opacity = '0.75';
 desc.style.marginTop = '2px';
 desc.textContent = att.description;
 a.appendChild(desc);
 }
 wrap.appendChild(a);
 return wrap;
 }
 if (att.type === 'map' && att.address) {
 const a = document.createElement('a');
 a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(att.address);
 a.target = '_blank';
 a.rel = 'noopener noreferrer';
 a.style.display = 'block';
 a.style.padding = '10px 12px';
 a.style.background = 'var(--cw-surface, #f8fafc)';
 a.style.border = '1px solid var(--cw-border, #e2e8f0)';
 a.style.borderRadius = 'var(--cw-radius-md, 10px)';
 a.style.color = 'var(--cw-text, #0f172a)';
 a.style.textDecoration = 'none';
 const title = document.createElement('div');
 title.style.fontWeight = '600';
 title.style.fontSize = '13px';
 title.textContent = '' + att.address;
 a.appendChild(title);
 const hint = document.createElement('div');
 hint.style.fontSize = '12px';
 hint.style.opacity = '0.75';
 hint.textContent = 'Auf Karte öffnen';
 a.appendChild(hint);
 wrap.appendChild(a);
 return wrap;
 }
 wrap.textContent = '';
 return wrap;
 };

 // Show reservation summary with action buttons
 const showReservationSummary = () => {
 const messageDiv = document.createElement('div');
 messageDiv.className = 'message bot';
 messageDiv.innerHTML = `
 <div class="message-content" style="max-width:90%;">
 <strong>${uiT('summaryTitle')}</strong><br><br>
 <strong>${esc(clientData.businessName)}</strong><br>
 ${uiT('labelPeople')}: ${esc(reservationState.people)}<br>
 ${uiT('labelDate')}: ${esc(formatDateForDisplay(reservationState.date))}<br>
 ${uiT('labelTime')}: ${esc(reservationState.time)}<br>
 ${uiT('labelEmail')}: ${esc(reservationState.email)}<br><br>
 <button id="res-confirm-btn" style="display:block;width:100%;padding:12px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:8px;">${uiT('btnConfirm')}</button>
 <div style="display:flex;gap:8px;">
 <button id="res-edit-btn" style="flex:1;padding:9px;background:#e9ecef;color:#333;border:none;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;">${uiT('btnEdit')}</button>
 <button id="res-cancel-btn" style="flex:1;padding:9px;background:#e9ecef;color:#333;border:none;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;">${uiT('btnCancel')}</button>
 </div>
 </div>`;
 chatMessages.appendChild(messageDiv);
 chatMessages.scrollTop = chatMessages.scrollHeight;
 document.getElementById('res-confirm-btn').addEventListener('click', () => { processMessage('__confirm__'); });
 document.getElementById('res-edit-btn').addEventListener('click', () => { processMessage('__edit__'); });
 document.getElementById('res-cancel-btn').addEventListener('click', () => { processMessage('__cancel__'); });
 };

 // Default-Slot-Fallback wenn opening_hours/capacity fehlen. Branche-abhaengig.
 const generateDefaultSlots = () => {
 const bt = String(clientData.businessType || 'other').toLowerCase();
 // Range in Minuten
 let startMin, endMin, interval = 30;
 if (bt === 'restaurant' || bt === 'cafe' || bt === 'pizzeria' || bt === 'bar') {
 startMin = 17 * 60; endMin = 22 * 60 + 30;
 } else if (bt === 'medical' || bt === 'beauty' || bt === 'service' || bt === 'salon' || bt === 'coiffeur') {
 startMin = 9 * 60; endMin = 18 * 60; interval = 30;
 } else {
 startMin = 10 * 60; endMin = 20 * 60;
 }
 const slots = [];
 for (let m = startMin; m <= endMin; m += interval) {
 slots.push({ time: formatMinutesToTime(m), isFree: true });
 }
 return slots;
 };

 const showTimeSlotOptions = async (botAvailableSlots) => {
 // Backend-authoritativ: wenn Bot per-Tisch-Verfuegbarkeits-Liste schickt, bauen
 // wir die Slot-Liste daraus (statt lokaler flat-capacity-Check der per-Tisch-blind ist).
 // Default-Range fuer "voll"-Markierung: Restaurant 17-22 Uhr im 30-Min-Raster.
 let slots;
 if (Array.isArray(botAvailableSlots)) {
 const freeSet = new Set(botAvailableSlots);
 const allSlots = [];
 for (let h = 17; h <= 22; h++) {
 for (const mm of [0, 30]) {
 const t = `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
 allSlots.push({ time: t, isFree: freeSet.has(t) });
 }
 }
 slots = allSlots;
 } else {
 slots = await getSlotAvailabilityForCurrentReservation();
 }

 if (slots && slots.closed) {
 reservationState.date = null;
 reservationState.step = 'date';
 addMessage('bot', t(
 'An diesem Tag haben wir leider geschlossen. Bitte wähle ein anderes Datum.',
 'An diesem Tag ist unser Restaurant geschlossen. Bitte wählen Sie ein anderes Datum.',
 'Hmm, an dem Tag sind wir zu! Wähle ein anderes Datum.'
 ));
 return;
 }

 // Wenn keine Slots aus Client-Daten berechenbar (opening_hours fehlt, capacity null, etc.),
 // sensiblen Default aus businessType generieren — so sieht der User IMMER Chips.
 // Kritisch fuer Demo-UX: Leon's Feedback 2026-04-22 "anstatt ne zeit zu schreiben ... kästchen".
 let effectiveSlots = (slots && slots.length > 0) ? slots : null;
 if (!effectiveSlots) {
 effectiveSlots = generateDefaultSlots();
 }

 // Smart-Slots-Filter: wenn Datum heute ist, Slots die bereits in Vergangenheit liegen
 // (inkl. 15-Min-Buffer für Puffer/Anfahrt) ausblenden.
 let filteredSlots = effectiveSlots;
 const todayIso = toISODate(new Date());
 if (reservationState.date === todayIso) {
 const now = new Date();
 const nowMin = now.getHours() * 60 + now.getMinutes() + 15; // 15-Min-Buffer
 filteredSlots = slots.filter(s => {
 const [h, m] = String(s.time).split(':').map(Number);
 return (h * 60 + m) >= nowMin;
 });
 if (filteredSlots.length === 0) {
 reservationState.date = null;
 reservationState.step = 'date';
 addMessage('bot', t(
 'Für heute sind alle Zeiten schon vorbei. Probier\'s mit einem anderen Tag?',
 'Für heute sind leider alle Zeiten bereits vergangen. Bitte wählen Sie einen anderen Tag.',
 'Für heute ist der Zug leider abgefahren. Welcher andere Tag passt?'
 ));
 return;
 }
 }

 // Limit setzen: urgency=2, default=6, "alle anzeigen"=unbegrenzt
 const urgency = reservationState.urgency === 'priority';
 // Leon-Feedback 2026-04-22: "er soll wenn er die verfügbaren zeiten sieht
 // das er nicht nur einen teil zeigt sondern alle." → Default zeigt ALLE Slots.
 // Nur bei urgency-Mode wird auf 2 reduziert (Notfall-Flow bleibt unveraendert).
 const LIMIT_DEFAULT = urgency ? 2 : 100;
 const showAll = urgency ? reservationState.showAllSlots : true;

 // Nur freie Slots zuerst, dann zeige ggf. belegte dazwischen chronologisch.
 const freeOnly = filteredSlots.filter(s => s.isFree);
 const displaySlots = showAll ? filteredSlots : freeOnly.slice(0, LIMIT_DEFAULT);
 const remainingCount = freeOnly.length - displaySlots.filter(s => s.isFree).length;

 // Merken welche Slots wir gerade anzeigen — wenn User nachher einen davon tippt, nicht ambiguity-fragen.
 reservationState.displayedSlotTimes = freeOnly.map(s => s.time);

 const messageDiv = document.createElement('div');
 messageDiv.className = 'message bot';

 const buttonsHtml = displaySlots.map((slot, index) => {
 if (slot.isFree) {
 const highlight = urgency && index === 0 && !showAll
 ? 'background:linear-gradient(135deg,#10b981 0%,#059669 100%);box-shadow:0 0 0 2px rgba(16,185,129,0.3);'
 : 'background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);';
 const label = urgency && index === 0 && !showAll ? `${slot.time} · nächster freier` : slot.time;
 return `<button type="button" data-slot-time="${slot.time}" data-slot-index="${index}" style="padding:8px 10px;border:none;border-radius:10px;${highlight}color:#fff;font-size:13px;cursor:pointer;">${label}</button>`;
 }
 return `<button type="button" disabled data-slot-index="${index}" style="padding:8px 10px;border:none;border-radius:10px;background:#dee2e6;color:#6c757d;font-size:13px;cursor:not-allowed;">${slot.time} Voll</button>`;
 }).join('');

 const moreBtnHtml = (!showAll && remainingCount > 0)
 ? `<button type="button" data-slot-action="more" style="padding:8px 12px;border:1px solid #667eea;border-radius:10px;background:transparent;color:#667eea;font-size:12px;cursor:pointer;">+ weitere Zeiten (${remainingCount})</button>`
 : '';

 const header = urgency
 ? t('Hier ist der nächstverfügbare Termin:', 'Hier sehen Sie den nächstverfügbaren Termin:', 'Der nächste freie Slot:')
 : uiT('slotsAvailable');

 messageDiv.innerHTML = `
 <div class="message-content" style="max-width:90%;">
 ${header}<br><br>
 <div style="display:flex;flex-wrap:wrap;gap:8px;">${buttonsHtml}${moreBtnHtml}</div>
 </div>`;

 chatMessages.appendChild(messageDiv);
 chatMessages.scrollTop = chatMessages.scrollHeight;

 const freeButtons = messageDiv.querySelectorAll('button[data-slot-time]');
 freeButtons.forEach((btn) => {
 btn.addEventListener('click', async () => {
 const slotTime = btn.getAttribute('data-slot-time');
 if (!slotTime) return;
 addMessage('user', slotTime);
 await processMessage(slotTime);
 });
 });

 const moreBtn = messageDiv.querySelector('button[data-slot-action="more"]');
 if (moreBtn) {
 moreBtn.addEventListener('click', async () => {
 reservationState.showAllSlots = true;
 await showTimeSlotOptions();
 });
 }
 };

 // Sprint 3d — Intent-Graph-Backend-Pfad (/api/chat-v2). Aktiv via USE_CHAT_V2 Feature-Flag.
 const processMessageV2 = async (text) => {
 const v2State = {
 step: reservationState.step || 'idle',
 guests: reservationState.people || null,
 date: reservationState.date || null,
 time: reservationState.time || null,
 email: reservationState.email || null,
 service: reservationState.service || null,
 urgency: reservationState.urgency || null
 };
 // Typing-Indicator waehrend Backend-Call (zeigt User "Bot schreibt...")
 const typingNode = showTypingIndicator();
 let result;
 try {
 result = await callChatV2(text, v2State, tone);
 } finally {
 removeTypingIndicator(typingNode);
 }
 if (!result) {
 addMessage('bot', t('Kurze Netz-Pause — probier nochmal?', 'Die Verbindung ist kurz unterbrochen — bitte nochmal versuchen.'));
 return;
 }
 // State uebernehmen
 if (result.state) {
 reservationState.step = result.state.step || reservationState.step;
 reservationState.people = result.state.guests ?? reservationState.people;
 // Bug-Fix 2026-04-21 Phase 1a: Backend liefert date als Freitext ("morgen", "samstag").
 // Widget-Slot-Logic erwartet ISO (YYYY-MM-DD). resolveDateToISO konvertiert mit
 // Deutsch-Schweizer-Kontext. Wenn bereits ISO, wird durchgereicht.
 if (result.state.date) {
 const isISO = /^\d{4}-\d{2}-\d{2}$/.test(result.state.date);
 reservationState.date = isISO ? result.state.date : (resolveDateToISO(result.state.date) || result.state.date);
 }
 // Zeit normalisieren: "19 uhr"→"19:00", "1720"→"17:20", "19.30"→"19:30", "17:20"→"17:20"
 if (result.state.time) {
 const s = String(result.state.time).trim().toLowerCase().replace(/\s*(uhr|h)\s*$/i, '');
 let m;
 if ((m = s.match(/^(\d{1,2}):(\d{2})$/))) reservationState.time = `${m[1].padStart(2,'0')}:${m[2]}`;
 else if ((m = s.match(/^(\d{1,2})\.(\d{2})$/))) reservationState.time = `${m[1].padStart(2,'0')}:${m[2]}`;
 else if ((m = s.match(/^(\d{1,2})(\d{2})$/))) reservationState.time = `${m[1].padStart(2,'0')}:${m[2]}`;
 else if ((m = s.match(/^(\d{1,2})$/))) reservationState.time = `${m[1].padStart(2,'0')}:00`;
 else reservationState.time = result.state.time;
 }
 reservationState.email = result.state.email ?? reservationState.email;
 reservationState.service = result.state.service ?? reservationState.service;
 reservationState.urgency = result.state.urgency ?? reservationState.urgency;
 if (result.state.language) reservationState.language = result.state.language;
 reservationState.active = !['idle', 'complete', 'cancelled'].includes(result.state.step);
 // Placeholder nachziehen falls Sprache gewechselt
 const input = document.getElementById('chat-input');
 if (input && input.dataset.i18nPlaceholder) input.placeholder = uiT(input.dataset.i18nPlaceholder);
 }
 // Text-Bubble + Attachments
 if (result.response) addMessage('bot', result.response, result.attachments || []);
 // uiAction auf existing UI mappen
 switch (result.uiAction) {
 case 'show_date_picker':
 if (typeof showDateOptions === 'function') await showDateOptions();
 break;
 case 'show_time_slots':
 // Backend liefert availableSlots[] mit per-Tisch-Verfuegbarkeit (wenn guests bekannt).
 // Widget bevorzugt diese authoritativ vor lokalem Capacity-Check.
 if (typeof showTimeSlotOptions === 'function') await showTimeSlotOptions(result.availableSlots);
 break;
 case 'show_summary':
 if (typeof showReservationSummary === 'function') showReservationSummary();
 break;
 case 'reset_state':
 reservationState.active = false;
 reservationState.step = null;
 break;
 default:
 break;
 }
 };

 // Central message processor (shared by sendMessage and button handlers)
 const processMessage = async (text) => {
 // Sprint 3d — Backend-authoritative Flow via /api/chat-v2 wenn Flag gesetzt
 if (USE_CHAT_V2) return processMessageV2(text);

 // Urgency-Flag setzen (persistiert bis zum Reservierungs-Ende/Cancel).
 // Wichtig: VOR der reservationState.active-Branch, damit auch die Initial-Message greift.
 if (!reservationState.urgency && (isMedicalUrgency(text) || isTimeUrgent(text))) {
 reservationState.urgency = 'priority';
 }

 if (reservationState.active) {
 // Kontext-Switch während Reservierung: wenn User off-topic fragt (Preis, Menü, Adresse etc.),
 // kurz über /api/chat beantworten und dann zum aktuellen Reservierungs-Schritt zurückkehren.
 // Plain-number/date/time/email gehen direkt in handleReservationStep.
 const looksLikeOffTopic = /\?|kostet|preis|menu|menü|karte|adresse|standort|wo\s+seid|wo\s+befind|kontakt|telefon|email|mail|parkplatz|wlan|hund|vegetar|vegan|glutenfrei|allerg/i.test(text);
 if (looksLikeOffTopic) {
 const chatResult = await callChatAPI(text, {
 guests: reservationState.people, date: reservationState.date,
 time: reservationState.time, email: reservationState.email
 }, tone);
 if (chatResult && chatResult.response) {
 addMessage('bot', chatResult.response);
 // Reservierung fortsetzen — Erinnerung je nach aktuellem Schritt
 const step = reservationState.step;
 const resumeMsg = step === 'people'
 ? t('Zurück zur Reservierung — für wie viele Personen?', 'Zurück zur Reservierung — für wie viele Personen?', 'Zurück zur Reservierung — wie viele Leute?')
 : step === 'date'
 ? t('Zurück zur Reservierung — an welchem Tag?', 'Zurück zur Reservierung — an welchem Tag?', 'Zurück zur Reservierung — welcher Tag?')
 : step === 'time'
 ? t('Zurück zur Reservierung — für welche Uhrzeit?', 'Zurück zur Reservierung — für welche Uhrzeit?', 'Zurück zur Reservierung — welche Uhrzeit?')
 : step === 'email'
 ? t('Zurück zur Reservierung — an welche E-Mail soll die Bestätigung?', 'Zurück zur Reservierung — an welche E-Mail soll die Bestätigung?', 'Zurück zur Reservierung — deine E-Mail?')
 : null;
 if (resumeMsg) addMessage('bot', resumeMsg);
 return;
 }
 // Wenn /api/chat fehlschlägt, weiter mit normaler Reservierungs-Logik
 }
 const result = await handleReservationStep(text);
 if (result === '__SHOW_SUMMARY__') {
 showReservationSummary();
 } else if (result === '__SHOW_TIME_SLOTS__') {
 await showTimeSlotOptions();
 } else if (result !== null) {
 addMessage('bot', result);
 }
 return;
 }

 // Try /api/chat first — returns AI-generated response text + extracted data
 const chatResult = await callChatAPI(text, {
 guests: reservationState.people,
 date: reservationState.date,
 time: reservationState.time,
 email: reservationState.email
 }, tone);
 if (chatResult) {
 // Apply any newly extracted data into state.
 // Use local regex extraction as fallback for fields the AI missed.
 const d = chatResult.data || {};
 const localFacts = extractReservationFacts(text);

 if (d.guests) {
 reservationState.people = d.guests;
 } else if (!reservationState.people && localFacts.people) {
 reservationState.people = localFacts.people;
 }

 if (d.date_text) {
 reservationState.date = formatDateForDisplay(d.date_text) || d.date_text;
 } else if (!reservationState.date && localFacts.date) {
 reservationState.date = formatDateForDisplay(localFacts.date) || localFacts.date;
 }

 if (d.time_text) {
 const t = extractTime(d.time_text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());
 if (t && t.text) reservationState.time = t.text;
 }
 if (d.email) reservationState.email = d.email;

 if (chatResult.intent === 'reservation') {
 reservationState.active = true;
 // Service-Business: automatisch 1 Person (Einzeltermin), nie die "Personen"-Frage stellen
 if (isServiceBusiness() && !reservationState.people) reservationState.people = 1;
 // Show the AI's natural language response
 addMessage('bot', chatResult.response);
 // Determine next step based on what's still missing
 if (reservationState.people && reservationState.date && reservationState.time && reservationState.email) {
 reservationState.step = 'confirm';
 showReservationSummary();
 } else if (reservationState.people && reservationState.date && reservationState.time) {
 reservationState.step = 'email';
 } else if (reservationState.people && reservationState.date) {
 reservationState.step = 'time';
 await showTimeSlotOptions();
 } else if (reservationState.people) {
 reservationState.step = 'date';
 } else {
 reservationState.step = 'people';
 }
 } else {
 addMessage('bot', chatResult.response);
 }
 return;
 }

 // Fallback: try parse-intent, then classic logic
 const aiResult = await parseReservationIntentWithAI(text, tone);
 if (aiResult && aiResult.intent === 'reservation' && aiResult.confidence >= 0.6) {
 reservationState.active = true;
 const localFacts2 = extractReservationFacts(text);

 if (aiResult.guests) {
 reservationState.people = aiResult.guests;
 } else if (!reservationState.people && localFacts2.people) {
 reservationState.people = localFacts2.people;
 }
 // Service-Business: automatisch 1 Person
 if (isServiceBusiness() && !reservationState.people) reservationState.people = 1;

 if (aiResult.date_text) {
 reservationState.date = formatDateForDisplay(aiResult.date_text) || aiResult.date_text;
 } else if (!reservationState.date && localFacts2.date) {
 reservationState.date = formatDateForDisplay(localFacts2.date) || localFacts2.date;
 }

 if (aiResult.time_text) {
 const t = extractTime(aiResult.time_text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());
 if (t.text) reservationState.time = t.text;
 }
 if (aiResult.email) reservationState.email = aiResult.email;

 if (reservationState.people && reservationState.date && reservationState.time && reservationState.email) {
 reservationState.step = 'confirm';
 showReservationSummary();
 } else if (reservationState.people && reservationState.date && reservationState.time) {
 reservationState.step = 'email';
 addMessage('bot', t('Auf welche E-Mail soll ich die Bestätigung schicken?', 'An welche E-Mail-Adresse soll ich die Bestätigung senden?', 'Deine E-Mail-Adresse?'));
 } else if (reservationState.people && reservationState.date) {
 reservationState.step = 'time';
 await showTimeSlotOptions();
 } else if (reservationState.people) {
 reservationState.step = 'date';
 addMessage('bot', t('Für welches Datum möchtest du reservieren?', 'Für welches Datum möchten Sie reservieren?', 'Für welchen Tag soll es sein?'));
 } else if (reservationState.date) {
 reservationState.step = 'people';
 addMessage('bot', t('Gerne. Für wie viele Personen?', 'Für wie viele Personen möchten Sie reservieren?', 'Für wie viele soll es sein?'));
 } else {
 reservationState.step = 'people';
 addMessage('bot', t('Gerne. Für wie viele Personen?', 'Für wie viele Personen möchten Sie reservieren?', 'Für wie viele soll es sein?'));
 }
 return;
 }

 const response = generateResponse(text, clientData, tone);
 if (response === '__START_RESERVATION__') {
 reservationState.active = true;
 const facts = extractReservationFacts(text);
 reservationState.people = facts.people || null;
 reservationState.date = facts.date ? (formatDateForDisplay(facts.date) || facts.date) : null;
 // Service-Business: automatisch 1 Person
 if (isServiceBusiness() && !reservationState.people) reservationState.people = 1;

 if (reservationState.people && reservationState.date) {
 reservationState.step = 'time';
 await showTimeSlotOptions();
 return;
 }

 if (reservationState.people) {
 reservationState.step = 'date';
 addMessage('bot', t('Für welches Datum möchtest du reservieren?', 'Für welches Datum möchten Sie reservieren?', 'Für welchen Tag soll es sein?'));
 return;
 }

 if (reservationState.date) {
 reservationState.step = 'people';
 addMessage('bot', t('Gerne. Für wie viele Personen?', 'Für wie viele Personen möchten Sie reservieren?', 'Für wie viele soll es sein?'));
 return;
 }

 reservationState.step = 'people';
 addMessage('bot', t('Gerne. Für wie viele Personen?', 'Für wie viele Personen möchten Sie reservieren?', 'Für wie viele soll es sein?'));
 } else {
 addMessage('bot', response);
 }
 };

 // Send message
 const sendMessage = () => {
 const text = chatInput.value.trim();
 if (!text) return;

 // Add user message
 addMessage('user', text);
 chatInput.value = '';

 // Simulate bot response delay
 setTimeout(async () => { await processMessage(text); }, 300);
 };

 // Event listeners
 chatBubble.addEventListener('click', toggleWindow);
 closeBtn.addEventListener('click', toggleWindow);
 sendBtn.addEventListener('click', sendMessage);
 chatInput.addEventListener('keypress', (e) => {
 if (e.key === 'Enter') sendMessage();
 });
 };

 // Wait for DOM to be ready
 if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', init);
 } else {
 init();
 }
 };

 // Start widget
 const startWidget = async () => {
 const isClientActive = await checkClientActive();

 if (isClientActive !== true) {
 console.log(`ChatBot Widget: Client "${CLIENT_ID}" inactive or not found in Supabase`);
 return;
 }

 initWidget(CLIENT_ID);
 };

 // Public theming API — demo page / rotating-theme JS calls this to sync widget look
 window.ChatbotWidget = {
 setAccentColor: function(hex, secondary) {
 const w = document.getElementById('chatbot-widget');
 if (w) {
 w.style.setProperty('--cw-a', hex);
 w.style.setProperty('--cw-b', secondary || hex);
 }
 },
 // Visual V1: override the font-family. Pass a CSS font-family string like
 // "Fraunces, serif". Pass null to fall back to host-page inheritance.
 setCustomFont: function(family) {
 const w = document.getElementById('chatbot-widget');
 if (!w) return;
 if (family) {
 w.style.setProperty('--cw-font', family);
 } else {
 w.style.removeProperty('--cw-font');
 }
 },
 // Async Google-Fonts loader — injects the link tag if not already present.
 // Example: loadGoogleFont("Fraunces", [600, 700]).
 loadGoogleFont: function(family, weights) {
 const weightStr = (weights && weights.length) ? ':wght@' + weights.join(';') : '';
 const href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(family).replace(/%20/g, '+') + weightStr + '&display=swap';
 if (document.querySelector('link[data-cw-font="' + family + '"]')) return;
 const link = document.createElement('link');
 link.rel = 'stylesheet';
 link.href = href;
 link.setAttribute('data-cw-font', family);
 document.head.appendChild(link);
 }
 };

 startWidget();
})();
