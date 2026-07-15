/* =========================================================
   EngiCore marketing site — interaction layer
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initScrollReveal();
  initCountUp();
  initConsole();
  initNavSpy();
});

/* ---------- Hero typewriter ---------- */
function initTypewriter(){
  const target = document.getElementById('heroType');
  if (!target) return;
  const phrases = [
    'Every module, one tab.',
    'Built for EPC & fabrication teams.',
    'From drawing register to shop floor.'
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function tick(){
    const current = phrases[phraseIndex];
    if (!deleting){
      charIndex++;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        return setTimeout(tick, 1600);
      }
    } else {
      charIndex--;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 28 : 46);
  }
  tick();
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal(){
  const targets = document.querySelectorAll('[data-reveal], .stat');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => io.observe(el));
}

/* ---------- Stat count-up ---------- */
function initCountUp(){
  const nums = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const duration = 1200;
      const start = performance.now();

      function frame(now){
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString()) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach(el => io.observe(el));
}

/* ---------- Module console ---------- */
const MODULES = {
  docs: {
    tag: 'Core',
    title: 'Document Management',
    desc: 'The indexed system of record for the drawing set — spools, isometrics, and supporting documents searchable in seconds instead of folders deep.',
    meta: [['Indexed files', '80,000+'], ['Search', 'Full-text + metadata'], ['Status', 'Live']],
    list: ['Structured retrieval across the full drawing register', 'Version history tracked per file', 'Permission-aware results by designation']
  },
  dwg: {
    tag: 'Automation',
    title: 'DWG Batch Editor',
    desc: 'Runs bulk edits across AutoCAD LT 2024 drawing files — title block updates, layer cleanup, revision stamping — without opening each file by hand.',
    meta: [['Handles', 'AutoCAD LT 2024'], ['Mode', 'Batch'], ['Status', 'Live']],
    list: ['Queue hundreds of DWGs for one operation', 'Background worker keeps the UI responsive during runs', 'Every batch writes a completion entry to the activity log']
  },
  pdf: {
    tag: 'Utility',
    title: 'PDF Merger',
    desc: 'Combines spool and isometric PDF sets into single issue-ready packages, built on the same tab pattern as every other module.',
    meta: [['Input', 'Multi-file PDF'], ['Output', 'Merged package'], ['Status', 'Live']],
    list: ['Drag-in ordering before merge', 'Refactored from a standalone tool into the shared module pattern', 'Consistent with the platform\u2019s shared UI components']
  },
  dpr: {
    tag: 'Reporting',
    title: 'Support DPR',
    desc: 'Daily progress reporting for support fabrication — logging what shipped, what\u2019s in queue, and what\u2019s blocked, by named support tag.',
    meta: [['Cadence', 'Daily'], ['Scope', 'Support fabrication'], ['Status', 'Live']],
    list: ['Tag-based tracking that tolerates real-world naming, periods included', 'Rolls up into a shop-level daily snapshot', 'Feeds the same activity log as every other module']
  },
  jde: {
    tag: 'Integration',
    title: 'JDE Integration',
    desc: 'Keeps EngiCore\u2019s view of jobs and materials aligned with JD Edwards, so shop-floor data doesn\u2019t drift from the ERP of record.',
    meta: [['System', 'JD Edwards'], ['Direction', 'Sync'], ['Status', 'In rollout']],
    list: ['Reduces duplicate manual entry between systems', 'Reconciles job and material references on a schedule', 'Errors surface in-app rather than failing silently']
  },
  sync: {
    tag: 'Integration',
    title: 'SharePoint Sync',
    desc: 'Mirrors designated document libraries between EngiCore and SharePoint, so teams working from either side stay current.',
    meta: [['System', 'SharePoint'], ['Direction', 'Two-way'], ['Status', 'In rollout']],
    list: ['Conflict handling on simultaneous edits', 'Selective folder sync by project', 'Same permission model as Document Management']
  },
  log: {
    tag: 'Platform',
    title: 'Activity Log',
    desc: 'A running, Supabase-backed record of who did what, across every module — the audit trail the rest of the platform is built on top of.',
    meta: [['Backend', 'Supabase'], ['Auth', 'Daily login'], ['Status', 'Live']],
    list: ['Every module writes to this log on completion', 'Session tied to a named, authenticated user each day', 'Queryable by user, module, or date range']
  }
};

function initConsole(){
  const tabs = document.querySelectorAll('.ctab');
  const panel = document.getElementById('consolePanel');
  if (!tabs.length || !panel) return;

  function render(key){
    const m = MODULES[key];
    if (!m) return;
    panel.innerHTML = `
      <div class="panel-fade">
        <div class="panel-head">
          <h3>${m.title}</h3>
          <span class="panel-tag">${m.tag}</span>
        </div>
        <p class="panel-desc">${m.desc}</p>
        <div class="panel-meta">
          ${m.meta.map(([k,v]) => `<div class="meta-item"><span class="meta-k">${k}</span><span class="meta-v">${v}</span></div>`).join('')}
        </div>
        <ul class="panel-list">
          ${m.list.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected','true');
      render(tab.dataset.mod);
    });
  });

  render('docs');
}

/* ---------- Nav scroll-spy ---------- */
function initNavSpy(){
  const sections = ['overview','modules','architecture','access','roadmap']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const tabs = document.querySelectorAll('.sheet-tab');
  if (!sections.length || !tabs.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.id;
        tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
}
