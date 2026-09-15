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
    transition(`<div class="page-wrap">
      <section class="home-visual"><img src="assets/images/home-main.gif" alt="HOME MAIN IMAGE"></section>
      <div class="home-bottom">
        <section class="home-widget"><div class="counter-number" id="counter">0001</div><div class="counter-caption">since ${esc(data.openDate)}</div></section>
        <section class="home-widget"><div class="update-list">${posts.length?posts.map(p=>`<button class="update-row" data-post="${esc(p.id)}"><time>${fmt(p.date)}</time><strong>${esc(p.title)}</strong></button>`).join(''):'<div class="muted">尚無公開文章。</div>'}</div></section>
        <section class="home-widget"><div class="chibi-placeholder"><img src="assets/images/mini-character.png" alt="Q版角色圖片"></div></section>
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
    const items=data.gallery||[];
    transition(`<div class="page-wrap"><div class="page-title">GALLERY</div><section class="content-panel"><div class="gallery-grid">${items.map(item=>`<button class="gallery-item gallery-photo" data-gallery-src="${esc(item.src)}" data-gallery-credit="${esc(item.credit||'')}"><img src="${esc(item.thumb||item.src)}" alt="Gallery image"></button>`).join('')}</div></section></div>`,'gallery');
    document.querySelectorAll('[data-gallery-src]').forEach(el=>el.onclick=()=>openLightbox(el.dataset.gallerySrc, el.dataset.galleryCredit));
  }
  const characterProfiles = {
    A: {
      family:'MORIHARA', given:'AOI', jp:'森原 あおい', sub:'-', image:'assets/images/character-a-standee.png', accent:'#6b897e',
      seasons: {
        '1': {
          intro:'穏やかで物静か。自分のことはあまり語らないが、人のことはよく見ていて、少しわかりにくいユーモアのセンスも持っている。',
          rows:[['学校','羽丘女子学園'],['クラス','高校2年B組'],['誕生日','5月18日'],['好きな食べ物','うどん、お茶'],['嫌いな食べ物','甘いもの'],['趣味','音楽鑑賞']]
        },
        '2': {
          intro:'人とあまり親しくせず、表情も少ないの快楽主義。頑固で繊細なところがある、他人の目を気にしながらも。もう一度前へ進むために、当に目指したいものとの向き合い方を探している。',
          rows:[['学校','羽丘女子学園'],['クラス','高校3年C組'],['誕生日','5月18日'],['好きな食べ物','うどん、お茶'],['嫌いな食べ物','甘いもの'],['趣味','音楽鑑賞']]
        },
        '3': {
          intro:'人とあまり親しくせず、表情も少ないの快楽主義。頑固で繊細なところがある、他人の目を気にしながらも。一度は音楽を諦めたが、今は創作が好きな自分を受け入れ、その気持ちと向き合っている。',
          rows:[['学校','四ツ葉女子大學'],['クラス','大学1年生 藝術學部音楽学科作曲コース'],['誕生日','5月18日'],['好きな食べ物','うどん、お茶'],['嫌いな食べ物','甘いもの'],['趣味','音楽鑑賞、作曲']]
        }
      }
    },
    B: {
      family:'HIKAWA', given:'SAYO', jp:'氷川 紗夜', sub:'Roselia / Gt.', image:'assets/images/character-b-standee.png', accent:'#93b2c6',
      seasons: {
        '1': {
          intro:'真面目で神経質、手を抜くことを知らない性格。真面目に生きすぎて損をするタイプ。実はふわふわした動物が好き。双子の妹にコンプレックスを抱いている。',
          rows:[['学校','花咲川女子学園'],['クラス','高校2年B組'],['誕生日','3月20日'],['好きな食べ物','ジャンクフード'],['嫌いな食べ物','にんじん'],['趣味','なし']]
        },
        '2': {
          intro:'自分にも他人にも厳しい真面目な性格の持ち主。学校では風紀委員を務めている。以前は妹・日菜と距離を置いていたが、少しずつ昔の姉妹関係に戻ってきている。今は『自分の音』を摸索中。',
          rows:[['学校','花咲川女子学園'],['クラス','高校3年A組'],['誕生日','3月20日'],['好きな食べ物','ジャンクフード'],['嫌いな食べ物','にんじん'],['趣味','なし']]
        },
        '3': {
          intro:'自分にも他人にも厳しく、真面目で冷静な性格の持ち主。Roseliaのギタリストとして自分の音を磨き続け、妹の日菜と同じステージに立つことを目指している。ストイックなのは音楽だけでなく、ゲームや遊び、お菓子作りにも一切手を抜かない。',
          rows:[['学校','慶鵬女子大学'],['クラス','大学1年生 法学部'],['誕生日','3月20日'],['好きな食べ物','ジャンクフード'],['嫌いな食べ物','にんじん'],['趣味','なし']]
        }
      }
    }
  };

  function character(){
    transition(`<div class="page-wrap"><div class="page-title">CHARACTER</div>
      <section class="character-portal character-portal-v17">
        <div class="character-choice-grid character-choice-grid-v17">
          <button class="character-choice character-choice-v16" id="charA" aria-label="森原あおい">
            <div class="character-choice-image character-choice-photo"><img src="assets/images/character-a.png" alt="森原あおい"></div>
            <div class="character-choice-meta"><span>MORIHARA</span><strong>森原 あおい</strong></div>
          </button>
          <button class="character-choice character-choice-v16" id="charB" aria-label="氷川紗夜">
            <div class="character-choice-image character-choice-photo"><img src="assets/images/character-b.png" alt="氷川紗夜"></div>
            <div class="character-choice-meta"><span>HIKAWA</span><strong>氷川 紗夜</strong></div>
          </button>
        </div>
        <div class="character-more-column character-more-column-v17">
          <button class="character-more character-more-v16" id="charMore">and more</button>
        </div>
      </section></div>`,'character');
    document.getElementById('charA').onclick=()=>characterPage('A');
    document.getElementById('charB').onclick=()=>characterPage('B');
    document.getElementById('charMore').onclick=characterStory;
  }

  function characterPage(which){
    const profile = characterProfiles[which];
    let currentSeason='1';
    const renderProfileContent=()=>{
      const season=profile.seasons[currentSeason];
      const intro=document.getElementById('characterIntro');
      const list=document.getElementById('characterProfileList');
      if(intro) intro.textContent=season.intro;
      if(list) list.innerHTML=season.rows.map(r=>`<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('');
      document.querySelectorAll('[data-char-season]').forEach(btn=>btn.classList.toggle('active',btn.dataset.charSeason===currentSeason));
    };
    transition(`<div class="page-wrap">
      <section class="character-profile-v16 character-profile-v17" style="--character-accent:${profile.accent}">
        <button class="back-link character-profile-back character-profile-back-v17" id="backCharacter">← CHARACTER</button>
        <div class="character-profile-copy">
          <div class="character-name-en"><span>${profile.family}</span><strong>${profile.given}</strong></div>
          <div class="character-name-jp">${profile.jp}</div>
          <div class="character-role">${profile.sub}</div>
          <p class="character-profile-intro" id="characterIntro"></p>
          <dl class="character-profile-list" id="characterProfileList"></dl>
          <div class="character-timeline-v16">
            <span>TIME LINE</span>
            <div class="character-timeline-buttons">
              <button data-char-season="1">シーズン1</button><button data-char-season="2">シーズン2</button><button data-char-season="3">シーズン3</button>
            </div>
          </div>
        </div>
        <div class="character-profile-visual character-profile-visual-v17"><img src="${profile.image}" alt="${profile.jp}"></div>
      </section></div>`,'character');
    document.getElementById('backCharacter').onclick=character;
    document.querySelectorAll('[data-char-season]').forEach(btn=>btn.onclick=()=>{currentSeason=btn.dataset.charSeason;renderProfileContent();});
    renderProfileContent();
  }

  function characterStory(){
    transition(`<div class="page-wrap"><div class="page-title">CHARACTER</div>
      <section class="character-story-v16">
        <header class="character-story-head">
          <div><span>AND MORE</span><h1>ABOUT THEM</h1></div>
          <button class="back-link" id="backCharacter">← CHARACTER</button>
        </header>
        <div class="character-story-lead">
          <div class="story-line"></div>
          <p>森原あおいと氷川紗夜、二人の関係・時間軸・出来事をまとめるためのページです。</p>
        </div>
        <div class="character-story-layout">
          <section><span>01</span><h2>BEGINNING</h2><p>出会いや最初期の関係について、後から文章を追加できます。</p></section>
          <section><span>02</span><h2>TIMELINE</h2><p>出来事を年表形式で整理するためのスペースです。</p></section>
          <section><span>03</span><h2>STORY</h2><p>長めのストーリー設定、関係性、補足などをまとめられます。</p></section>
        </div>
      </section></div>`,'character');
    document.getElementById('backCharacter').onclick=character;
  }

  function garupa(){
    const g = data.garupa || {};
    transition(`<div class="page-wrap garupa-page">
      <div class="page-title">GARUPA ARCHIVE</div>
      <section class="garupa-intro">
        <h1>バンドリ！ ガールズバンドパーティ！</h1>
      </section>

      <section class="garupa-stats" aria-label="遊戲資料">
        <div><span>START</span><strong>${esc(g.startDate||'2017-04-14')}</strong></div>
        <div><span>SAYO COLLECTION</span><strong>${esc(g.sayoCollection||'—')}</strong></div>
        <div><span>CHARA RANK</span><strong>${esc(g.characterRank||'—')}</strong><small>${esc(g.characterRankDate||'')}</small></div>
        <div><span>ROSELIA</span><strong>${esc(g.roselia||'—')}</strong></div>
      </section>

      <section class="garupa-nav" aria-label="Garupa sections">
        ${(g.sections||[]).map(x=>`<button class="garupa-nav-item" data-garupa-section="${esc(x.key)}"><span>${esc(x.label)}</span></button>`).join('')}
      </section>

      <section class="garupa-section" id="garupaSection"></section>
    </div>`, 'garupa');
    document.querySelectorAll('[data-garupa-section]').forEach(btn=>btn.onclick=()=>garupaSection(btn.dataset.garupaSection));
    garupaSection('events');
  }

  function renderMainEvents(){
    const g=data.garupa||{};
    return `<div class="garupa-section-head"><span>MAIN EVENT</span></div>
      <div class="garupa-records">
        ${(g.mainEvents||[]).map(r=>`<button class="garupa-record garupa-record-button" data-main-event="${esc(r.id)}"><div><strong>${esc(r.title)}</strong>${r.server?`<small>${esc(r.server)}</small>`:''}</div><div class="garupa-rank">#${String(r.rank).padStart(2,'0')}</div></button>`).join('')}
      </div>`;
  }

  function garupaSection(key){
    const g=data.garupa||{};
    const box=document.getElementById('garupaSection');
    if(!box) return;
    if(key==='events'){
      box.innerHTML=renderMainEvents();
      box.querySelectorAll('[data-main-event]').forEach(btn=>btn.onclick=()=>garupaEvent(btn.dataset.mainEvent));
    }else if(key==='cards'){
      box.innerHTML=`<div class="garupa-section-head"><span>CARDS</span></div>
        <div class="sayo-card-grid">
          ${(g.sayoCards||[]).map(c=>`<button class="sayo-card-thumb ${c.hover?'has-hover':''}" data-sayo-card="${esc(c.id)}" aria-label="${esc(c.title)}">${c.thumb?`<img class="card-normal" src="${esc(c.thumb)}" alt="${esc(c.title)}">${c.hover?`<img class="card-hover" src="${esc(c.hover)}" alt="${esc(c.title)} 特訓後">`:''}`:`<span>${esc(c.title)}</span>`}</button>`).join('')}
        </div>`;
      box.querySelectorAll('[data-sayo-card]').forEach(btn=>btn.onclick=()=>garupaCard(btn.dataset.sayoCard));
    }else if(key==='logs'){
      box.innerHTML=`<div class="garupa-section-head"><span>LOG</span></div>
        <div class="garupa-log-list">
          ${(g.logs||[]).map(item=>`<article class="garupa-log"><time>${esc((item.date||'').replaceAll('-','.'))}</time><div class="garupa-log-main"><strong>${esc(item.title)}</strong>${item.url?`<a class="garupa-log-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">LINK ↗</a>`:''}<div class="garupa-log-meta">${item.type?`<span>${esc(item.type)}</span>`:''}${(item.flags||[]).map(f=>`<span>${esc(f)}</span>`).join('')}</div>${item.note?`<p>${esc(item.note)}</p>`:''}</div></article>`).join('')}
        </div>`;
    }
  }

  function garupaEvent(id){
    const g=data.garupa||{};
    const e=(g.mainEvents||[]).find(x=>x.id===id);
    if(!e){garupa();return;}
    transition(`<div class="page-wrap garupa-page"><div class="page-title">GARUPA ARCHIVE</div>
      <section class="garupa-detail">
        <header class="garupa-detail-head"><div><div class="small-label">MAIN EVENT</div><h1>${esc(e.title)}</h1>${e.server?`<div class="muted">${esc(e.server)}</div>`:''}</div><button class="back-link" id="backGarupaEvents">← MAIN EVENT</button></header>
        ${e.banner?`<img class="garupa-event-banner" src="${esc(e.banner)}" alt="${esc(e.title)}">`:''}
        <dl class="garupa-event-stats"><div><dt>FINAL RANK</dt><dd>#${esc(e.rank)}</dd></div>${e.period?`<div><dt>PERIOD</dt><dd>${esc(e.period)}</dd></div>`:''}${e.score?`<div><dt>SCORE</dt><dd>${esc(e.score)}</dd></div>`:''}</dl>
        <div class="garupa-event-note"><p>${esc(e.note||'')}</p></div>
        ${(e.screenshots||[]).length?`<div class="garupa-screenshot-grid">${e.screenshots.map((src,i)=>`<button class="garupa-shot" data-shot="${esc(src)}"><img src="${esc(src)}" alt="活動截圖 ${i+1}"></button>`).join('')}</div>`:`<div class="garupa-empty-note">SCREENSHOTS / SCORE / TEAM — 之後可在這裡加入活動截圖與詳細紀錄。</div>`}
      </section></div>`,'garupa');
    document.getElementById('backGarupaEvents').onclick=garupa;
    document.querySelectorAll('[data-shot]').forEach(btn=>btn.onclick=()=>openLightbox(btn.dataset.shot));
  }

  function garupaCard(id){
    const g=data.garupa||{};
    const c=(g.sayoCards||[]).find(x=>x.id===id);
    if(!c){garupa();return;}
    transition(`<div class="page-wrap garupa-page"><div class="page-title">GARUPA ARCHIVE</div>
      <section class="garupa-detail">
        <header class="garupa-detail-head"><div><div class="small-label">CARDS</div><h1>${esc(c.title)}</h1></div><button class="back-link" id="backSayoCards">← CARDS</button></header>
        <div class="sayo-card-detail-empty" aria-label="這張卡片的內容之後補充"></div>
      </section></div>`,'garupa');
    document.getElementById('backSayoCards').onclick=()=>{garupa(); setTimeout(()=>garupaSection('cards'),0)};
  }

  function openLightbox(src, credit=''){
    if(!lightbox || !src) return;
    const img=lightbox.querySelector('img');
    const creditEl=document.getElementById('lightboxCredit');
    img.src=src;
    if(creditEl){
      creditEl.textContent=credit||'';
      creditEl.hidden=!credit;
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  }
  function about(){transition(`<div class="page-wrap"><div class="page-title">ABOUT</div><section class="content-panel"><h2>ABOUT THIS SITE</h2><p>這裡可以放網站說明、注意事項、Link、Credit 或其他內容。</p><p class="muted">這一版是純 HTML / CSS / JavaScript，因此可以直接放到 GitHub Pages。</p></section></div>`,'about');}
  function randomDialogue(){
    if(!chat || !(data.dialogues||[]).length) return;
    const set = data.dialogues[Math.floor(Math.random()*data.dialogues.length)];
    chat.innerHTML='';
    set.forEach((item,i)=>setTimeout(()=>{const row=document.createElement('div');row.className='chat-row '+(item.side==='right'?'right':'left');const avatarSrc=item.avatar==='A'?'assets/images/icon1.jpg':'assets/images/b-avatar.png';row.innerHTML=`<div class="chat-avatar"><img src="${avatarSrc}" alt="${esc(item.avatar)}"></div><div class="chat-bubble">${esc(item.text)}</div>`;chat.appendChild(row);},180*i));
  }
  function bindPostLinks(){document.querySelectorAll('[data-post]').forEach(el=>el.onclick=()=>post(el.dataset.post));}
  function route(name){({home,posting,post:()=>post(currentPostId),gallery,character,garupa,about}[name]||home)();}
  document.querySelectorAll('[data-route]').forEach(btn=>btn.onclick=()=>route(btn.dataset.route));
  document.getElementById('homeUser').onclick=home;
  document.getElementById('year').textContent=new Date().getFullYear();
  if(lightbox){lightbox.onclick=e=>{if(e.target===lightbox||e.target.classList.contains('lightbox-close'))lightbox.classList.remove('open')}}
  home();
})();
