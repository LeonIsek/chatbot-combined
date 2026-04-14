console.log("WIDGET STARTET");

(function() {
  'use strict';

  // Embedded CSS Styles
  const WIDGET_CSS = `
    /* ====== ChatBot Widget CSS ====== */
    * {
      box-sizing: border-box;
    }

    #chatbot-widget {
      --cw-a: #667eea;
      --cw-b: #764ba2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 9999;
      pointer-events: none;
    }

    /* ====== Chat Bubble ====== */
    .chat-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--cw-a) 0%, var(--cw-b) 100%);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: auto;
      color: white;
    }

    .chat-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }

    .chat-bubble:active {
      transform: scale(0.95);
    }

    .chat-bubble svg {
      width: 28px;
      height: 28px;
    }

    /* ====== Chat Window ====== */
    .chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      height: 600px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      pointer-events: auto;
      animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ====== Chat Header ====== */
    .chat-header {
      background: linear-gradient(135deg, var(--cw-a) 0%, var(--cw-b) 100%);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      border-radius: 12px 12px 0 0;
    }

    .header-content h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .header-content .status {
      margin: 0;
      font-size: 11px;
      opacity: 0.75;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .status-online { background: #4ade80; }
    .status-offline { background: #f87171; }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s;
      opacity: 0.8;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      opacity: 1;
    }

    .close-btn svg {
      width: 20px;
      height: 20px;
    }

    /* ====== Chat Messages ====== */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8f9fa;
    }

    .message {
      display: flex;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.user {
      justify-content: flex-end;
    }

    .message.bot {
      justify-content: flex-start;
    }

    .message-content {
      max-width: 70%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .message.user .message-content {
      background: linear-gradient(135deg, var(--cw-a) 0%, var(--cw-b) 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message.bot .message-content {
      background: #e9ecef;
      color: #333;
      border-bottom-left-radius: 4px;
    }

    /* Scrollbar styling */
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;
    }

    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #a0aec0;
    }

    /* ====== Chat Input ====== */
    .chat-input-container {
      display: flex;
      gap: 8px;
      padding: 16px;
      background: white;
      border-top: 1px solid #e9ecef;
      flex-shrink: 0;
    }

    .chat-input {
      flex: 1;
      border: 1px solid #cbd5e0;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
      resize: none;
    }

    .chat-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .send-btn {
      background: linear-gradient(135deg, var(--cw-a) 0%, var(--cw-b) 100%);
      color: white;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .send-btn:hover {
      transform: scale(1.05);
    }

    .send-btn:active {
      transform: scale(0.95);
    }

    .send-btn svg {
      width: 18px;
      height: 18px;
    }

    /* ====== Responsive Design ====== */
    @media (max-width: 480px) {
      .chat-window {
        width: calc(100vw - 20px);
        height: calc(100vh - 100px);
        max-height: 600px;
        bottom: 80px;
        right: 10px;
      }

      .message-content {
        max-width: 85%;
      }

      .chat-bubble {
        width: 50px;
        height: 50px;
        bottom: 16px;
        right: 16px;
      }

      .chat-bubble svg {
        width: 24px;
        height: 24px;
      }
    }

    /* ====== Dark Mode Support ====== */
    @media (prefers-color-scheme: dark) {
      .chat-window {
        background: #1a1a1a;
      }

      .chat-messages {
        background: #0f0f0f;
      }

      .message.bot .message-content {
        background: #2d2d2d;
        color: #e0e0e0;
      }

      .chat-input {
        background: #2d2d2d;
        border-color: #404040;
        color: #e0e0e0;
      }

      .chat-input::placeholder {
        color: #888;
      }

      .chat-input-container {
        background: #1a1a1a;
        border-top-color: #404040;
      }
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
        .select('active, business_name, phone, email, address, opening_hours, prices, tone, capacity_per_slot, slot_interval, default_duration_minutes')
        .eq('id', CLIENT_ID)
        .single();

      if (error) {
        console.error('ChatBot Widget Supabase Error:', error);
        return null;
      }

      if (!data || !data.active) return null;

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
        defaultDurationMinutes: data.default_duration_minutes
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
      return ft('Sehr gerne! Wenn du noch Fragen zu Pizza, Öffnungszeiten oder Kontakt hast, bin ich da. 😊', 'Sehr gerne! Für weitere Fragen zu Preisen, Öffnungszeiten oder Kontakt stehe ich Ihnen gerne zur Verfügung.', 'Klar doch! Falls du noch was wissen willst – einfach fragen. 😊');
    }

    // Goodbye keywords
    if (
      message.includes('tschüss') ||
      message.includes('tschuess') ||
      message.includes('ciao') ||
      messageWithoutFillers.includes('tschuss')
    ) {
      return ft('Danke dir, bis bald! 👋', 'Vielen Dank, auf Wiedersehen! 👋', 'Tschau, bis bald! 👋');
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
        const today = new Date().toLocaleDateString('de-DE', { weekday: 'long' }).toLowerCase();
        const hours = clientData.openingHours[today] || 'Information nicht verfügbar';
        return ft(`Heute sind wir ${hours} geöffnet.\n\nWeitere Öffnungszeiten gerne auf Anfrage.`, `Heute haben wir von ${hours} geöffnet.\n\nFür weitere Öffnungszeiten stehen wir Ihnen gerne zur Verfügung.`, `Wir haben heute ${hours} auf.\n\nBei Fragen einfach melden!`);
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
        return ft(`Du findest uns unter:\n${clientData.address}\n\nWir freuen uns auf deinen Besuch!`, `Sie finden uns unter:\n${clientData.address}\n\nWir freuen uns auf Ihren Besuch!`, `Hier findet ihr uns:\n${clientData.address}\n\nKommt vorbei! 😊`);
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
      if (clientData.phone) contact += `📞 ${clientData.phone}\n`;
      if (clientData.email) contact += `✉️ ${clientData.email}`;
      return contact;
    }

    // Default responses
    const defaultResponses = [
      ft(
        `Hallo! 👋 Wie kann ich dir helfen?\n\nIch kann dir über folgende Themen informieren:\n- 💰 Preise\n- 🕐 Öffnungszeiten\n- 📍 Standort\n- 📞 Kontakt`,
        `Guten Tag! 👋 Womit kann ich Ihnen behilflich sein?\n\nIch informiere Sie gerne zu:\n- 💰 Preisen\n- 🕐 Öffnungszeiten\n- 📍 Standort\n- 📞 Kontakt`,
        `Hey! 👋 Was kann ich für dich tun?\n\nIch kenn mich aus mit:\n- 💰 Preisen\n- 🕐 Öffnungszeiten\n- 📍 Standort\n- 📞 Kontakt`
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
      email: null
    };

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

      if (value === 'heute' || /^heut[a-z]{0,2}$/.test(value)) return toISODate(today);
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

    // Returns { start, end } in minutes, or null if the restaurant is closed that day.
    // Returns a fallback window only when opening hours are entirely unconfigured.
    const getDayWindow = (dateLabel) => {
      const openingHours = clientData.openingHours;
      if (!openingHours || typeof openingHours !== 'object') {
        return { start: 17 * 60, end: 22 * 60 }; // No hours configured at all → safe fallback
      }

      let key = String(dateLabel || '').toLowerCase();
      if (key === 'heute' || key === 'morgen') {
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

      // Day not listed in opening hours → closed
      if (!Object.prototype.hasOwnProperty.call(openingHours, key)) {
        return null;
      }

      const text = String(openingHours[key]).toLowerCase().trim();

      // Explicitly closed
      if (!text || text === 'closed' || text === 'geschlossen' || text === '-') {
        return null;
      }

      const ranges = text.match(/(\d{1,2})[:.](\d{2})\s*[-–]\s*(\d{1,2})[:.](\d{2})/);
      if (!ranges) {
        return null; // Text present but no parseable time range → treat as closed
      }

      const start = (parseInt(ranges[1], 10) * 60) + parseInt(ranges[2], 10);
      const end = (parseInt(ranges[3], 10) * 60) + parseInt(ranges[4], 10);
      if (end <= start) {
        return null; // Invalid range
      }
      return { start, end };
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

      const windowRange = getDayWindow(reservationState.date);
      if (!windowRange) return { closed: true };

      // If capacity is not configured, show all slots as free without a Supabase query
      if (!hasCapacity) {
        const latestStart = windowRange.end - defaultDuration;
        const slots = [];
        for (let start = windowRange.start; start <= latestStart; start += slotInterval) {
          slots.push({ time: formatMinutesToTime(start), isFree: true });
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

      const latestStart = windowRange.end - defaultDuration;
      const slots = [];

      for (let start = windowRange.start; start <= latestStart; start += slotInterval) {
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
      const windowRange = getDayWindow(reservationState.date);
      if (!windowRange) {
        return t(
          'An diesem Tag haben wir leider geschlossen. Bitte wähle ein anderes Datum.',
          'An diesem Tag ist unser Restaurant geschlossen. Bitte wählen Sie ein anderes Datum.',
          'An dem Tag sind wir zu! Bitte wähle ein anderes Datum. 😊'
        );
      }

      // Bug 4: reject times outside opening hours
      if (newStart < windowRange.start || newStart >= windowRange.end) {
        const open = formatMinutesToTime(windowRange.start);
        const close = formatMinutesToTime(windowRange.end);
        return t(
          `Diese Uhrzeit liegt außerhalb unserer Öffnungszeiten (${open}–${close} Uhr). Bitte wähle eine andere Zeit.`,
          `Diese Uhrzeit liegt außerhalb unserer Öffnungszeiten (${open}–${close} Uhr). Bitte wählen Sie eine andere Zeit.`,
          `Außerhalb unserer Öffnungszeiten! Wir haben ${open}–${close} Uhr auf. Andere Zeit? 😊`
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
      if (/\b(morgen|morgn|morgrn|moren|moreg|morgeen|morgnm|mogren|mogen|mogn)\b/.test(norm) || /\bmorg[a-z]{0,3}\b/.test(norm)) {
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
      const peopleMatch =
        norm.match(/\bfur\s+(\d{1,2})\b/) ||
        norm.match(/\b(\d{1,2})\s*(?:leute|personen?|person)\b/) ||
        norm.match(/\b(\d{1,2})\b/);
      if (peopleMatch) {
        people = parseInt(peopleMatch[1], 10);
      } else if (/\bzu\s*zweit\b/.test(norm)) {
        people = 2;
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
        const result = extractTime(userInput.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());
        if (result.ambiguous !== null) {
          const pm = result.ambiguous + 12;
          return `Meinst du ${String(pm).padStart(2, '0')}:00 Uhr oder ${String(result.ambiguous).padStart(2, '0')}:00 Uhr?`;
        }
        if (!result.text) return '__SHOW_TIME_SLOTS__';

        // Bug 4: validate typed time against opening hours
        const windowRange = getDayWindow(reservationState.date);
        if (windowRange) {
          const inputMinutes = toMinutes(result.text);
          if (inputMinutes !== null && (inputMinutes < windowRange.start || inputMinutes >= windowRange.end)) {
            const open = formatMinutesToTime(windowRange.start);
            const close = formatMinutesToTime(windowRange.end);
            return t(
              `Diese Uhrzeit liegt außerhalb unserer Öffnungszeiten (${open}–${close} Uhr). Bitte wähle eine andere Zeit.`,
              `Diese Uhrzeit liegt außerhalb unserer Öffnungszeiten (${open}–${close} Uhr). Bitte wählen Sie eine andere Zeit.`,
              `Außerhalb unserer Öffnungszeiten! Wir haben ${open}–${close} Uhr auf. Andere Zeit? 😊`
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
          return t('Kein Problem! Fangen wir nochmal von vorne an. 😊\nFür wie viele Personen möchtest du reservieren?', 'Natürlich. Beginnen wir von vorne.\nFür wie viele Personen möchten Sie reservieren?', 'Klar! Nochmal.\nFür wie viele soll es sein?');
        }
        if (norm === 'abbrechen' || norm === '__cancel__') {
          reservationState.active = false;
          reservationState.step = null;
          reservationState.people = null;
          reservationState.date = null;
          reservationState.time = null;
          reservationState.email = null;
          return t('Die Reservierung wurde abgebrochen. Falls du es dir anders überlegst, einfach wieder schreiben! 👋', 'Die Reservierung wurde abgebrochen. Falls Sie es sich anders überlegen, stehen wir Ihnen gerne zur Verfügung.', 'Reservierung abgebrochen! Falls du\'s dir anders überlegst – einfach nochmal schreiben. 👋');
        }
        return '__SHOW_SUMMARY__';
      }

      return null;
    };

    // Create widget HTML
    const createWidgetHTML = () => {
      return `
        <div id="chatbot-widget" class="chatbot-widget">
          <!-- Chat Bubble -->
          <div id="chat-bubble" class="chat-bubble">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>

          <!-- Chat Window -->
          <div id="chat-window" class="chat-window" style="display: none;">
            <!-- Header -->
            <div class="chat-header">
              <div class="header-content">
                <h3>${clientData.businessName}</h3>
                <p class="status"><span class="status-dot status-online"></span>Online</p>
              </div>
              <button class="close-btn" id="close-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
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
                autocomplete="off"
                maxlength="500"
              />
              <button id="send-btn" class="send-btn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.9429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.01449775 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.97701575 L3.03521743,10.4180088 C3.03521743,10.5751061 3.34915502,10.5751061 3.50612381,10.5751061 L16.6915026,11.3605931 C16.6915026,11.3605931 17.1624089,11.3605931 17.1624089,11.8318852 L17.1624089,12.0034085 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
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
              `Hallo! 👋 Wie kann ich dir helfen?\n\nIch beantworte Fragen zu:\n💰 Preise\n🕐 Öffnungszeiten\n📍 Standort\n📞 Kontakt`,
              `Hallo! 👋 Wie kann ich dir helfen?\n\nIch beantworte Fragen zu:\n💰 Preise\n🕐 Öffnungszeiten\n📍 Standort\n📞 Kontakt`,
              `Hallo! 👋 Wie kann ich dir helfen?\n\nIch beantworte Fragen zu:\n💰 Preise\n🕐 Öffnungszeiten\n📍 Standort\n📞 Kontakt`
            ));
          }
        }
      };

      // Add message to chat
      const addMessage = (sender, text) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      };

      // Show reservation summary with action buttons
      const showReservationSummary = () => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.innerHTML = `
          <div class="message-content" style="max-width:90%;">
            <strong>📋 Reservierungsübersicht</strong><br><br>
            <strong>${clientData.businessName}</strong><br>
            👥 Personen: ${reservationState.people}<br>
            📅 Datum: ${formatDateForDisplay(reservationState.date)}<br>
            🕐 Uhrzeit: ${reservationState.time}<br>
            ✉️ E-Mail: ${reservationState.email}<br><br>
            <button id="res-confirm-btn" style="display:block;width:100%;padding:12px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:8px;">✅ Bestätigen</button>
            <div style="display:flex;gap:8px;">
              <button id="res-edit-btn" style="flex:1;padding:9px;background:#e9ecef;color:#333;border:none;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;">✏️ Bearbeiten</button>
              <button id="res-cancel-btn" style="flex:1;padding:9px;background:#e9ecef;color:#333;border:none;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;">❌ Abbrechen</button>
            </div>
          </div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        document.getElementById('res-confirm-btn').addEventListener('click', () => { processMessage('__confirm__'); });
        document.getElementById('res-edit-btn').addEventListener('click', () => { processMessage('__edit__'); });
        document.getElementById('res-cancel-btn').addEventListener('click', () => { processMessage('__cancel__'); });
      };

      const showTimeSlotOptions = async () => {
        const slots = await getSlotAvailabilityForCurrentReservation();

        if (slots && slots.closed) {
          reservationState.date = null;
          reservationState.step = 'date';
          addMessage('bot', t(
            'An diesem Tag haben wir leider geschlossen. Bitte wähle ein anderes Datum.',
            'An diesem Tag ist unser Restaurant geschlossen. Bitte wählen Sie ein anderes Datum.',
            'Hmm, an dem Tag sind wir zu! Wähle ein anderes Datum. 😊'
          ));
          return;
        }

        if (!slots || slots.length === 0) {
          addMessage('bot', t('Für welche Uhrzeit möchtest du reservieren?', 'Zu welcher Uhrzeit möchten Sie reservieren?', 'Wann soll es losgehen?'));
          return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';

        const buttonsHtml = slots.map((slot, index) => {
          if (slot.isFree) {
            return `<button type="button" data-slot-time="${slot.time}" data-slot-index="${index}" style="padding:8px 10px;border:none;border-radius:10px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;font-size:13px;cursor:pointer;">${slot.time}</button>`;
          }
          return `<button type="button" disabled data-slot-index="${index}" style="padding:8px 10px;border:none;border-radius:10px;background:#dee2e6;color:#6c757d;font-size:13px;cursor:not-allowed;">${slot.time} Voll</button>`;
        }).join('');

        messageDiv.innerHTML = `
          <div class="message-content" style="max-width:90%;">
            ${t('Diese Zeiten sind verfügbar:', 'Folgende Zeiten sind verfügbar:', 'Diese Zeiten sind frei:')}<br><br>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">${buttonsHtml}</div>
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
      };

      // Central message processor (shared by sendMessage and button handlers)
      const processMessage = async (text) => {
        if (reservationState.active) {
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

  // Public theming API — demo page calls this to sync widget color with theme
  window.ChatbotWidget = {
    setAccentColor: function(hex) {
      const w = document.getElementById('chatbot-widget');
      if (w) {
        w.style.setProperty('--cw-a', hex);
        w.style.setProperty('--cw-b', hex);
      }
    }
  };

  startWidget();
})();
