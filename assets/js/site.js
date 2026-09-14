(function(){
  const data = window.SITE_DATA || {};
  const app = document.getElementById('app');
  const chat = document.getElementById('chatStream');
  const lightbox = document.getElementById('lightbox');
  let currentPostId = null;

  const now = () => new Date();
  const visiblePosts = () => (data.posts || [])
    .filter(p => new Date(p.date) <= now())
    .sort((a,b) => new Date(b.date)-new Date(a.date));
  const fmt = iso => new Date(iso).toLocaleDateString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit'}).replaceAll('/','.');
  const esc = s => String(s ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function setActive(route){
    document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===route));
  }
  function transition(html, route){
    app.innerHTML = html;
    setActive(route);
    randomDialogue();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function home(){
    const posts = visiblePosts().slice(0,5);
    transition(`<div class="page-wrap"><div class="page-title">HOME</div>
      <section class="home-visual">HOME MAIN IMAGE</section>
      <div class="home-bottom">
        <section class="home-widget"><div class="widget-label">DAYS SINCE OPEN</div><div class="counter-number" id="counter">0001</div><div class="counter-caption">since ${esc(data.openDate)}</div></section>
        <section class="home-widget"><div class="widget-label">RECENT UPDATE</div><div class="update-list">${posts.length?posts.map(p=>`<button class="update-row" data-post="${esc(p.id)}"><time>${fmt(p.date)}</time><strong>${esc(p.title)}</strong></button>`).join(''):'<div class="muted">尚無公開文章。</div>'}</div></section>
        <section class="home-widget"><div class="widget-label">MINI CHARACTER</div><div class="chibi-placeholder">Q版<br>IMAGE</div></section>
      </div></div>`, 'home');
    const start = new Date(data.openDate+'T00:00:00+08:00');
    const days = Math.max(1, Math.floor((now()-start)/86400000)+1);
    document.getElementById('counter').textContent = String(days).padStart(4,'0');
    bindPostLinks();
  }
  function posting(){
    const posts = visiblePosts();
    transition(`<div class="page-wrap"><div class="page-title">POSTING</div><section class="content-panel">${posts.length?posts.map(p=>`<article class="post-card" data-post="${esc(p.id)}"><div><div class="post-date">${fmt(p.date)}</div><h2>${esc(p.title)}</h2><p>${esc(p.summary)}</p><span class="tag">${esc(p.tag||'POST')}</span></div><div class="post-thumb">${p.password?'LOCKED':'IMAGE'}</div></article>`).join(''):'<p class="muted">尚無公開文章。</p>'}</section></div>`, 'posting');
    bindPostLinks();
  }
  function post(id){
    const posts = visiblePosts();
    let p = posts.find(x=>x.id===id) || posts[0];
    if(!p){transition('<div class="page-wrap"><div class="page-title">POST</div><section class="content-panel"><p>尚無文章。</p></section></div>','post');return;}
    currentPostId = p.id;
    const body = p.password ? `<div class="password-box"><strong>🔒 PASSWORD CONTENT</strong><div class="locked" id="lockedPreview"><p>${esc(p.summary)}</p><p>████████████████</p></div><div class="password-row"><input id="passwordInput" type="password" placeholder="輸入密碼"><button id="unlockBtn">UNLOCK</button></div><div class="muted">注意：GitHub Pages 是靜態網站，這種前端密碼只能遮蔽一般訪客，無法保護真正敏感內容。</div></div>` : `<div class="single-post-body">${p.content}</div>`;
    transition(`<div class="page-wrap"><div class="page-title">POST</div><section class="content-panel"><header class="single-post-head"><div><div class="post-date">${fmt(p.date)}</div><h1>${esc(p.title)}</h1></div><button class="back-link" id="backPosting">← POSTING</button></header>${body}</section></div>`,'post');
    document.getElementById('backPosting').onclick=posting;
    if(p.password){
      document.getElementById('unlockBtn').onclick=()=>{
        if(document.getElementById('passwordInput').value===p.password){
          document.querySelector('.password-box').innerHTML=`<div class="single-post-body">${p.content}</div>`;
        } else alert('密碼不正確');
      };
    }
  }
  function gallery(){
    transition(`<div class="page-wrap"><div class="page-title">GALLERY</div><section class="content-panel"><div class="gallery-grid">${Array.from({length:9},(_,i)=>`<div class="gallery-item" data-demo="${i+1}">IMAGE ${String(i+1).padStart(2,'0')}</div>`).join('')}</div></section></div>`,'gallery');
    document.querySelectorAll('.gallery-item').forEach(el=>el.onclick=()=>alert('把圖片放進 assets/images 後，就可以改成可放大的實際圖片。'));
  }
  function character(){
    transition(`<div class="page-wrap"><div class="page-title">CHARACTER</div><section class="character-card"><div class="character-info"><div class="small-label">PROFILE</div><h1>CHARACTER NAME</h1><dl><dt>AGE</dt><dd>—</dd><dt>HEIGHT</dt><dd>—</dd><dt>ABOUT</dt><dd>人物設定內容。</dd></dl><p id="timelineText">${esc(data.characterTimeline['2026'])}</p><div class="timeline-buttons"><button data-year="2024">2024</button><button data-year="2025">2025</button><button class="active" data-year="2026">2026</button></div></div><div class="character-standee">CHARACTER<br>STANDEE</div></section></div>`,'character');
    document.querySelectorAll('[data-year]').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('[data-year]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.getElementById('timelineText').textContent=data.characterTimeline[btn.dataset.year]||'';});
  }
  function about(){transition(`<div class="page-wrap"><div class="page-title">ABOUT</div><section class="content-panel"><h2>ABOUT THIS SITE</h2><p>這裡可以放網站說明、注意事項、Link、Credit 或其他內容。</p><p class="muted">這一版是純 HTML / CSS / JavaScript，因此可以直接放到 GitHub Pages。</p></section></div>`,'about');}
  function randomDialogue(){
    if(!chat || !(data.dialogues||[]).length) return;
    const set = data.dialogues[Math.floor(Math.random()*data.dialogues.length)];
    chat.innerHTML='';
    set.forEach((item,i)=>setTimeout(()=>{const row=document.createElement('div');row.className='chat-row '+(item.side==='right'?'right':'left');row.innerHTML=`<div class="chat-avatar">${esc(item.avatar)}</div><div class="chat-bubble">${esc(item.text)}</div>`;chat.appendChild(row);},180*i));
  }
  function bindPostLinks(){document.querySelectorAll('[data-post]').forEach(el=>el.onclick=()=>post(el.dataset.post));}
  function route(name){({home,posting,post:()=>post(currentPostId),gallery,character,about}[name]||home)();}
  document.querySelectorAll('[data-route]').forEach(btn=>btn.onclick=()=>route(btn.dataset.route));
  document.getElementById('homeUser').onclick=home;
  document.getElementById('year').textContent=new Date().getFullYear();
  document.getElementById('lastUpdate').textContent=visiblePosts()[0]?fmt(visiblePosts()[0].date):'—';
  if(lightbox){lightbox.onclick=e=>{if(e.target===lightbox||e.target.classList.contains('lightbox-close'))lightbox.classList.remove('open')}}
  home();
})();
