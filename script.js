// ====== DEMO SITE SWITCHER ======
// Widget-Loading entfernt (2026-04-22) — Demos sind statische Mocks.
// Statt echtem Widget rendert ein .dcm-Chat-Mock pro Branche eine Fake-Konversation.

let currentDemo = 'pizzeria';

const DEMO_TITLES = {
  pizzeria:    'Pizzeria Da Mario',
  coiffeur:    'The Cut Zürich',
  cafe:        'Café Odeon',
  blumenladen: 'Blumen Zürich',
  zahnarzt:    'Zahnarzt am See'
};

const DEMO_CONVOS = {
  pizzeria: [
    { from: 'bot',  text: 'Grüezi! Wie kann ich helfen?' },
    { from: 'user', text: 'Tisch für 4 Personen Freitag 19 Uhr' },
    { from: 'bot',  text: 'Gerne! Auf welche E-Mail soll die Bestätigung?' },
    { from: 'user', text: 'mario@example.ch' },
    { from: 'bot',  text: '✓ Reserviert: 4 Personen, Fr. 19:00' }
  ],
  cafe: [
    { from: 'bot',  text: 'Hoi! Was darf\'s sein?' },
    { from: 'user', text: 'Öffnungszeiten Sonntag?' },
    { from: 'bot',  text: 'Sonntags 9–18 Uhr.' },
    { from: 'user', text: 'Habt ihr Hafermilch?' },
    { from: 'bot',  text: 'Ja — Hafer-, Soja- und Mandelmilch gegen +0.60 CHF.' }
  ],
  zahnarzt: [
    { from: 'bot',  text: 'Guten Tag, wie kann ich helfen?' },
    { from: 'user', text: 'Termin für Kontrolle' },
    { from: 'bot',  text: 'Welcher Wochentag passt Ihnen?' },
    { from: 'user', text: 'Dienstag Vormittag' },
    { from: 'bot',  text: 'Mittwoch 10:15 Uhr frei — passt das?' }
  ],
  coiffeur: [
    { from: 'bot',  text: 'Hallo! Termin oder Frage?' },
    { from: 'user', text: 'Damen — waschen, schneiden, föhnen' },
    { from: 'bot',  text: 'Welcher Tag passt dir?' },
    { from: 'user', text: 'Mittwoch Nachmittag' },
    { from: 'bot',  text: '✓ Gebucht: Mi. 14:30 Uhr' }
  ],
  blumenladen: [
    { from: 'bot',  text: 'Grüezi, worum geht\'s?' },
    { from: 'user', text: 'Strauss zum Geburtstag, Budget 60.–' },
    { from: 'bot',  text: 'Unsere Pfingstrosen-Sträusse ab CHF 55.' },
    { from: 'user', text: 'Perfekt, heute abholen?' },
    { from: 'bot',  text: 'Ja gerne, ab 14 Uhr bereit.' }
  ]
};

function renderDemoConvo(key) {
  const title = document.getElementById('dcm-title');
  const body = document.getElementById('dcm-body');
  if (!title || !body) return;
  title.textContent = DEMO_TITLES[key] || 'BotSwiss';
  body.innerHTML = '';
  const msgs = DEMO_CONVOS[key] || [];
  msgs.forEach(function (m) {
    const el = document.createElement('div');
    el.className = 'dcm-msg ' + m.from;
    el.textContent = m.text;
    body.appendChild(el);
  });
}

function switchDemo(key) {
  if (key === currentDemo) return;
  currentDemo = key;

  document.querySelectorAll('.biz-card').forEach(card => {
    card.classList.toggle('active', card.dataset.demo === key);
  });

  document.querySelectorAll('.demo-site').forEach(site => {
    site.style.display = site.id === 'demo-' + key ? '' : 'none';
  });

  renderDemoConvo(key);
  window.scrollTo(0, 0);
}

// Initial render on page load
if (document.readyState !== 'loading') {
  renderDemoConvo(currentDemo);
} else {
  document.addEventListener('DOMContentLoaded', () => renderDemoConvo(currentDemo));
}
