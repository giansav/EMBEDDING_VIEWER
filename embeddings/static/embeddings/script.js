/* il codice JS media tra le funzioni in python e il rendering della pagina HTML
  
nel grafico:
  - la lunghezza dei vettori è proporzionale alla norma del vettore originale
  - il colore dei vettori riflette la loro cosine similarity
  - l'angolo tra i vettori è derivato correttamente dalla proiezione PCA */


// invia i testi delle caselle di input alla funzione python che genera gli embeddings 
function submitTexts() {
  const text1 = document.getElementById('inputText1').value;
  const text2 = document.getElementById('inputText2').value;

  fetch('/embeddings/generate/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text1, text2 })
  })
  .then(response => response.json())
  .then(data => {
    if (!data.embedding_2d_1 || !data.embedding_2d_2) {
      document.getElementById('graph').innerHTML = '<p style="color:red;">Errore: embedding non validi.</p>';
      return;
    }

    displayGraph(
      data.embedding_2d_1,
      data.embedding_2d_2,
      data.norm_1,
      data.norm_2,
      data.cosine_similarity,
      data.distance
    );
  })
  .catch(error => {
    console.error('Errore:', error);
    document.getElementById('graph').innerHTML = '<p style="color:red;">Errore nella richiesta.</p>';
  });
}


// genera la rappresnetazione grafica dei vettori di embedding
function displayGraph(vec1, vec2, norm1, norm2, cosine, distance) {
  const graph = document.getElementById('graph');
  const centerX = 200;
  const centerY = 200;
  const baseScale = 180;  // aumentare per maggiore visibilità

  const maxNorm = Math.max(norm1, norm2);
  const scale1 = (norm1 / maxNorm) * baseScale;
  const scale2 = (norm2 / maxNorm) * baseScale;

  const x1 = centerX + vec1[0] * scale1;
  const y1 = centerY - vec1[1] * scale1;
  const x2 = centerX + vec2[0] * scale2;
  const y2 = centerY - vec2[1] * scale2;

  const dot = vec1[0]*vec2[0] + vec1[1]*vec2[1];
  const mag1 = Math.sqrt(vec1[0]**2 + vec1[1]**2);
  const mag2 = Math.sqrt(vec2[0]**2 + vec2[1]**2);
  const angleDeg = (Math.acos(dot / (mag1 * mag2)) * 180 / Math.PI).toFixed(2);

  const hue = (1 - cosine) * 120;
  const color1 = `hsl(${hue}, 100%, 45%)`;
  const color2 = `hsl(${240 - hue}, 100%, 45%)`;

  // generazione dinamica del codice HTML
  graph.innerHTML = `
    <svg width="400" height="400" style="border:1px solid #ccc; background:white">
      <line x1="0" y1="${centerY}" x2="400" y2="${centerY}" stroke="#eee"/>
      <line x1="${centerX}" y1="0" x2="${centerX}" y2="400" stroke="#eee"/>

      <!-- Linea tratteggiata tra le punte -->
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#999" stroke-dasharray="5,5" />

      <!-- Vettore 1 -->
      <line x1="${centerX}" y1="${centerY}" x2="${x1}" y2="${y1}"
            stroke="${color1}" stroke-width="2" marker-end="url(#arrowhead)" />
      <circle cx="${x1}" cy="${y1}" r="4" fill="${color1}" />

      <!-- Vettore 2 -->
      <line x1="${centerX}" y1="${centerY}" x2="${x2}" y2="${y2}"
            stroke="${color2}" stroke-width="2" marker-end="url(#arrowhead)" />
      <circle cx="${x2}" cy="${y2}" r="4" fill="${color2}" />

      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
    </svg>

    <div style="margin-top:16px; font-size:18px;">
      <p><strong>Distanza euclidea:</strong> ${distance.toFixed(4)}</p>
      <p><strong>Cosine similarity:</strong> ${cosine.toFixed(4)}</p>
      <p><strong>Angolo tra i vettori:</strong> ${angleDeg}°</p>
    </div>
  `;
}

