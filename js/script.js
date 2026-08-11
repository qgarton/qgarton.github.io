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
