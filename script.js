const icons = {
  clear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M4.4 4.4l1.8 1.8M17.8 17.8l1.8 1.8M2.5 12H5M19 12h2.5M4.4 19.6l1.8-1.8M17.8 6.2l1.8-1.8" stroke-linecap="round"/></svg>`,
  clouds: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6.5 17h11a3.5 3.5 0 0 0 .3-6.98A5 5 0 0 0 8 9.1 4 4 0 0 0 6.5 17z"/></svg>`,
  rain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6.5 14h11a3.5 3.5 0 0 0 .3-6.98A5 5 0 0 0 8 6.1 4 4 0 0 0 6.5 14z"/><path d="M8 18v2M12 18v2M16 18v2" stroke-linecap="round"/></svg>`,
  snow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6.5 12h11a3.5 3.5 0 0 0 .3-6.98A5 5 0 0 0 8 4.1 4 4 0 0 0 6.5 12z"/><path d="M9 17v4M12 17v4M15 17v4M8 19h2M11 19h2M14 19h2" stroke-linecap="round"/></svg>`
};

const clothingIcons = {
  thermal: `<circle cx="12" cy="12" r="9"/>`,
  coat: `<path d="M8 3l4 2 4-2 3 5-2 2v9H5v-9L3 8z"/>`,
  sweater: `<path d="M7 4l5 2 5-2 3 4-2.5 2V20H6.5V10L4 8z"/>`,
  jacket: `<path d="M6 4l6 2 6-2 2 4-2 2v11H6V10L4 8z"/>`,
  hoodie: `<path d="M6 5c0-1.5 2.5-2.5 6-2.5S18 3.5 18 5l2 4-2 1.5V20H6V10.5L4 9z"/>`,
  tshirt: `<path d="M7 4l5 1.5L17 4l3 3-2 2.5V20H6V9.5L4 7z"/>`,
  light: `<path d="M8 4l4 1 4-1 2 3-1.5 2V20H7.5V9L6 7z"/>`,
  windbreaker: `<path d="M7 4l5 2 5-2 2 4-2 2v10H5V10L3 8z" stroke-dasharray="2 2"/>`,
  umbrella: `<path d="M4 12a8 8 0 0 1 16 0z"/><path d="M12 12v7a2 2 0 0 1-2 2" stroke-linecap="round"/>`,
  boots: `<path d="M8 3v10l-4 3v3h13v-4l-5-2V3z"/>`,
  gloves: `<path d="M6 12V6a2 2 0 0 1 4 0v4M10 10V5a2 2 0 0 1 4 0v5M14 10V6a2 2 0 0 1 4 0v6a5 5 0 0 1-5 5H9a3 3 0 0 1-3-3v-3z"/>`,
  fabric: `<path d="M4 6c2 2 4-2 6 0s4-2 6 0 4-2 4-2M4 12c2 2 4-2 6 0s4-2 6 0 4-2 4-2M4 18c2 2 4-2 6 0s4-2 6 0 4-2 4-2" stroke-linecap="round"/>`
};

function svgFor(key, size=30){
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5">${clothingIcons[key]}</svg>`;
}

function recommend(temp, condition, wind){
  const items = [];
  let headline, base;

  if (temp < 0){ items.push(['thermal','Thermal base layer']); items.push(['coat','Heavy coat']); base='freezing'; }
  else if (temp < 8){ items.push(['sweater','Sweater']); items.push(['jacket','Warm jacket']); base='cold'; }
  else if (temp < 15){ items.push(['hoodie','Hoodie or light jacket']); base='cool'; }
  else if (temp < 22){ items.push(['tshirt','T-shirt, layer optional']); base='mild'; }
  else { items.push(['light','Breathable, light fabric']); base='warm'; }

  if (wind === 'gusty' && temp < 20) items.push(['windbreaker','Windbreaker on top']);
  if (condition === 'rain') items.push(['umbrella','Umbrella'], ['boots','Waterproof shoes']);
  if (condition === 'snow'){ items.push(['boots','Waterproof boots'], ['gloves','Gloves']); }
  if (temp > 27 && condition!=='rain') items.push(['fabric','Skip heavy fabrics, go loose']);

  const lines = {
    freezing: "Layer up like it's non-negotiable — this cold doesn't compromise.",
    cold: "A real jacket weather, not a maybe-jacket weather.",
    cool: "Comfortable if you dress for it, chilly if you don't.",
    mild: "Easy weather — dress for the afternoon, not the morning.",
    warm: "Loose and light does the work today."
  };
  headline = lines[base];

  if (wind === 'gusty') headline += " Wind's got opinions too.";
  if (condition === 'rain') headline = "Bring the umbrella — " + headline.charAt(0).toLowerCase() + headline.slice(1);
  if (condition === 'snow') headline = "Snow's falling — " + headline.charAt(0).toLowerCase() + headline.slice(1);

  return { headline, items };
}

const tempEl = document.getElementById('temp');
const tempLabel = document.getElementById('tempLabel');
const conditionEl = document.getElementById('condition');
const windEl = document.getElementById('wind');
const headlineEl = document.getElementById('headline');
const readingEl = document.getElementById('reading');
const itemsEl = document.getElementById('items');
const iconEl = document.getElementById('conditionIcon');

function render(){
  const temp = parseInt(tempEl.value, 10);
  const condition = conditionEl.value;
  const wind = windEl.value;

  tempLabel.textContent = temp + '°C';
  iconEl.innerHTML = icons[condition];

  const { headline, items } = recommend(temp, condition, wind);
  headlineEl.textContent = headline;
  readingEl.textContent = `${temp}°C · ${condition} · wind: ${wind}`;

  itemsEl.innerHTML = items.map(([key, label], i) =>
    `<div class="item" style="animation-delay:${i*60}ms">${svgFor(key)}<span>${label}</span></div>`
  ).join('');
}

[tempEl, conditionEl, windEl].forEach(el => el.addEventListener('input', render));
render();
