// figure-eight / n-body orbit: build the SVG from data (js/orbits-data.js)
// and pick one at random, so adding more solutions later just means adding
// entries to that file, not touching this logic.
(function(){
  const mount = document.getElementById('orbit-mount');
  if(!mount || typeof ORBITS === 'undefined' || !ORBITS.length) return;

  const orbit = ORBITS[Math.floor(Math.random() * ORBITS.length)];
  const pathId = 'orbit-path-' + orbit.id;
  const L = orbit.totalLength;
  const TRAIL_ECHOES = 6; // segments making up each fading comet tail

  const keyTimesStr = orbit.keyTimes.join(';');
  const dashValues = orbit.keyPoints.map(p => (-(p * L)).toFixed(5)).join(';');
  const dashLen = (L * 0.045).toFixed(4);

  // glow halos: one radial gradient per color, referenced by id from
  // colorClass (e.g. "body-a" -> "glow-a")
  const glowDefs = ['a','b','c'].map(letter => {
    const varName = letter === 'a' ? '--flare' : letter === 'b' ? '--teal' : '--nebula';
    return `
      <radialGradient id="glow-${letter}">
        <stop offset="0%" style="stop-color:var(${varName})" stop-opacity="0.9"/>
        <stop offset="45%" style="stop-color:var(${varName})" stop-opacity="0.35"/>
        <stop offset="100%" style="stop-color:var(${varName})" stop-opacity="0"/>
      </radialGradient>`;
  }).join('');

  let dotsHTML = '';
  let trailsHTML = '';
  let extraPaths = '';

  orbit.bodies.forEach((b, i) => {
    const bKeyTimes = b.keyTimes ? b.keyTimes.join(';') : keyTimesStr;
    const bKeyPoints = (b.keyPoints || orbit.keyPoints).join(';');
    const begin = (b.begin != null ? b.begin : 0);
    // clean, unstyled geometry copy -- used by BOTH the mpath motion
    // reference and the trail's <use>, so nothing ever inherits the visible
    // background curve's pale stroke color.
    const geomId = `${pathId}-geom-${i}`;
    extraPaths += `<path id="${geomId}" d="${b.path || orbit.path}" style="display:none" />`;

    const glowId = 'glow-' + b.colorClass.split('-')[1];

    dotsHTML += `
      <g>
        <animateMotion dur="${orbit.dur}s" begin="${begin}s" repeatCount="indefinite" rotate="0"
          calcMode="linear" keyTimes="${bKeyTimes}" keyPoints="${bKeyPoints}">
          <mpath href="#${geomId}" />
        </animateMotion>
        <circle r="0.06" fill="url(#${glowId})" />
        <circle r="0.01" class="orbit-body ${b.colorClass}" />
      </g>`;

    const trailSpan = orbit.dur / 3;
    for(let e = 1; e <= TRAIL_ECHOES; e++){
      const frac = e / TRAIL_ECHOES;
      const echoBegin = begin + frac * trailSpan;
      const opacity = (0.5 * Math.pow(1 - frac, 1.6)).toFixed(3);
      const width = (0.05 * (1 - frac) + 0.008).toFixed(4);
      trailsHTML += `
        <use href="#${geomId}" class="orbit-trail ${b.colorClass}"
          style="stroke-width:${width}; stroke-opacity:${opacity};"
          stroke-dasharray="${dashLen} ${L}">
          <animate attributeName="stroke-dashoffset" dur="${orbit.dur}s" begin="${echoBegin}s"
            repeatCount="indefinite" calcMode="linear" keyTimes="${keyTimesStr}" values="${dashValues}" />
        </use>`;
    }
  });

  mount.innerHTML = `
    <svg class="orbit-svg" viewBox="${orbit.viewBox}" aria-hidden="true">
      <defs>${glowDefs}</defs>
      <path d="${orbit.path}" class="orbit-path" />
      ${extraPaths}
      ${trailsHTML}
      ${dotsHTML}
    </svg>`;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    const svg = mount.querySelector('.orbit-svg');
    if(svg && svg.pauseAnimations) svg.pauseAnimations();
  }
})();

// starfield
  (function(){
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize(){
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.floor((w*h)/9000);
      stars = Array.from({length: count}, () => ({
        x: Math.random()*w,
        y: Math.random()*h,
        r: Math.random()*1.3 + 0.3,
        phase: Math.random()*Math.PI*2,
        speed: 0.4 + Math.random()*0.8
      }));
    }
    function draw(t){
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = '#f2eee3';
      stars.forEach(s=>{
        const twinkle = reduced ? 0.6 : 0.4 + 0.6*Math.abs(Math.sin(s.phase + t*0.0005*s.speed));
        ctx.globalAlpha = twinkle * 0.85;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if(!reduced) requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  })();

  // scroll reveal
  (function(){
    const els = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(el=>io.observe(el));
  })();

  document.getElementById('year').textContent = new Date().getFullYear();
