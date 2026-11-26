/* 공통 동작: 모바일 메뉴, 견적 요구서 다이얼로그, 플로팅 상담 버튼, 스크롤 등장 효과 */
{
const $ = s => document.querySelector(s);

/* 모바일 메뉴 */
const hdr = $('header'), menu = $('#menu');
if (menu) {
  menu.addEventListener('click', () => { const o = hdr.classList.toggle('open'); menu.setAttribute('aria-expanded', o); });
  document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => { hdr.classList.remove('open'); menu.setAttribute('aria-expanded', false); }));
}

/* 견적 요구서 다이얼로그 (모든 페이지 공통) */
document.body.insertAdjacentHTML('beforeend', `
<button class="fab" data-open aria-label="견적 상담 신청"><img src="img/logo.png" alt=""><span>상담</span></button>
<dialog id="req" aria-labelledby="reqTitle">
 <div class="dlg">
  <div class="dlg-top">
   <div><h2 id="reqTitle">간단 인테리어 요구서</h2><p>상담 전 사전 파악을 위한 요구서예요. 작성 후 ‘제출’을 눌러 주세요.</p></div>
   <button class="x" id="close" aria-label="닫기">×</button>
  </div>
  <form id="reqForm" novalidate>
   <fieldset class="types">
    <legend>공간 유형</legend>
    ${['주거','사무실','매장','카페·식음','전시','기타'].map((t,i)=>`<label><input type="radio" name="type" value="${t}"${i?'':' checked'}><span>${t}</span></label>`).join('')}
   </fieldset>
   <label>이름<input id="f-name" name="name" autocomplete="name" required></label>
   <label>연락처<input id="f-tel" name="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000" required></label>
   <label>지역<input id="f-area" name="area" placeholder="예: 서울 마포구"></label>
   <label>평수<input id="f-size" name="size" inputmode="numeric" placeholder="예: 25"></label>
   <label class="full">희망 일정
    <select id="f-when" name="when"><option>1개월 이내</option><option selected>1~3개월</option><option>3개월 이후</option><option>미정</option></select>
   </label>
   <label class="full">요청사항<textarea id="f-msg" name="msg" placeholder="원하는 분위기, 예산, 참고한 포트폴리오 등을 자유롭게 적어 주세요."></textarea></label>
   <div class="form-foot"><span class="err" id="err" role="alert"></span><button class="btn solid" type="submit">제출</button></div>
  </form>
  <div class="done" role="status">
   <h3>요구서 작성이 끝났어요</h3>
   <p>지금은 시안 페이지라 실제로 전송되지는 않아요.<br>서버나 폼 서비스를 연결하면 이 단계에서 접수됩니다.</p>
   <button class="btn" id="again">닫기</button>
  </div>
 </div>
</dialog>`);

const dlg = $('#req'), form = $('#reqForm'), err = $('#err');
const open = e => { e.preventDefault(); dlg.classList.remove('sent'); err.textContent = ''; if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); };
const close = () => { dlg.close ? dlg.close() : dlg.removeAttribute('open'); };
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', open));
$('#close').addEventListener('click', close);
$('#again').addEventListener('click', close);
dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#f-name').value.trim(), tel = $('#f-tel').value.trim();
  if (!name) { err.textContent = '이름을 입력해 주세요.'; $('#f-name').focus(); return; }
  if (!/^[0-9\-\s+]{9,}$/.test(tel)) { err.textContent = '연락처를 확인해 주세요.'; $('#f-tel').focus(); return; }
  err.textContent = ''; dlg.classList.add('sent'); form.reset();
});


/* 다크 모드: 전환은 각 페이지 <head>의 스크립트가 처리, 여기서는 버튼 상태만 맞춤 */
const mb = $('#mode');
if (mb) { const d = document.documentElement.getAttribute('data-mode') === 'dark'; mb.setAttribute('aria-pressed', d); mb.setAttribute('aria-label', d ? '라이트 모드로 전환' : '다크 모드로 전환'); }

const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 메인 히어로 슬라이드 */
const slides = [...document.querySelectorAll('#slides .slide')], dots = $('#dots'), tag = $('#slideTag');
if (slides.length) {
  const meta = [['DOOSIL BUILDERS', 'project.html'], ['[강남구] ESC · 카페 32평', 'project.html#p-esc'], ['[부평구] 모래비치 · 카페 37평', 'project.html#p-moraebeach'], ['[강남구] 스페이스몬스터 · 사무실 116평', 'project.html#p-spacemonster']];
  let at = 0, timer;
  dots.innerHTML = slides.map((_, i) => `<button role="tab" aria-label="${i + 1}번째 슬라이드" aria-selected="${!i}"><i></i></button>`).join('');
  const go = i => {
    at = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('on', k === at));
    dots.querySelectorAll('button').forEach((b, k) => { b.setAttribute('aria-selected', k === at); b.classList.remove('run'); if (k === at && !still) { void b.offsetWidth; b.classList.add('run'); } });
    tag.textContent = meta[at][0]; tag.href = meta[at][1];
  };
  const play = () => { clearInterval(timer); if (!still) timer = setInterval(() => go(at + 1), 5200); };
  dots.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; go([...dots.children].indexOf(b)); play(); });
  const hr = $('.hero-r'); hr.addEventListener('mouseenter', () => clearInterval(timer)); hr.addEventListener('mouseleave', play);
  go(0); play();
}

/* 프로젝트명 흐르는 띠 */
const mq = $('#mq');
if (mq) {
  const names = ['ESC', 'EQC', 'DDP HISEOUL SHOWROOM', '모래비치', 'ENDOT', '스페이스몬스터', '143 BAKERY & CAFE', '보글하우스', 'DINT', 'EEN', 'BASURE', '카페홈즈', '홈스밀', 'ROYAL ROASTARY', 'ID'];
  const row = names.map(n => `<span>${n}</span>`).join('<i aria-hidden="true">/</i>');
  mq.innerHTML = `<div>${row}<i aria-hidden="true">/</i></div><div aria-hidden="true">${row}<i>/</i></div>`;
}

/* 숫자 카운트업 */
const countUp = el => {
  const to = +el.dataset.to; if (still) { el.textContent = to; return; }
  const t0 = performance.now(), d = 1400;
  const step = t => { const k = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};
const cio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.querySelectorAll('[data-to]').forEach(countUp); cio.unobserve(en.target); } }), { threshold: .4 });
document.querySelectorAll('.stats').forEach(el => cio.observe(el));

/* 가로 스크롤 쇼케이스 */
const track = $('#pfList.show-track');
if (track) {
  const by = d => track.scrollBy({ left: d * Math.min(track.clientWidth * .8, 520), behavior: still ? 'auto' : 'smooth' });
  $('#shPrev').onclick = () => by(-1); $('#shNext').onclick = () => by(1);
}

/* 사진 리빌 + 배너 줌 */
const pio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); pio.unobserve(en.target); } }), { threshold: .15 });
const watch = el => { if (!el.closest('.pj-grid,.slides,.show-track')) { el.classList.add('reveal'); pio.observe(el); } };
document.querySelectorAll('.plate,.cta,.partner').forEach(watch);


/* 이용방법: 단계 등장 + 스크롤 위치에 따라 현재 단계 강조 */
const sl = $('#useList');
if (sl) {
  const items = [...sl.querySelectorAll('.st')], no = $('#howNo'), bar = $('#howBar');
  const sio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); sio.unobserve(en.target); } }), { threshold: .35 });
  items.forEach((li, i) => { li.style.transitionDelay = ''; sio.observe(li); });
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { sl.classList.add('on'); o.disconnect(); } }, { threshold: .05 }).observe(sl);
  let raf = 0;
  const spy = () => {
    raf = 0;
    const mid = innerHeight * .5, r = sl.getBoundingClientRect();
    const inView = r.top < innerHeight * .8 && r.bottom > innerHeight * .2;
    sl.classList.toggle('track', inView && !still);
    let cur = 0, best = 1e9;
    items.forEach((li, i) => { const b = li.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - mid); if (d < best) { best = d; cur = i; } });
    items.forEach((li, i) => li.classList.toggle('cur', i === cur));
    if (no) no.textContent = String(cur + 1).padStart(2, '0');
    if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (mid - r.top) / r.height))})`;
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(spy); }, { passive: true });
  addEventListener('resize', spy); spy();
}

/* 스크롤 등장 효과 */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));
}
