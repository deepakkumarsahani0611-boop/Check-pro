// api/check.js - V12.1 PRO FINAL - 100% LIVE ONLY - 0% DUMMY - LOCKED
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  const START = Date.now();

  async function fetchWithTimeout(url, opts = {}, timeout = 7000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    try { const r = await fetch(url, { ...opts, signal: ctrl.signal }); clearTimeout(t); return r; } catch (e) { clearTimeout(t); throw e; }
  }
  async function raceFirst(promises) {
    try { return await Promise.any(promises); } catch { return null; }
  }

  const DOUBLE_SUFFIX = new Set(['co.uk','org.uk','ac.uk','co.in','org.in','ac.in','net.in','com.au','net.au','org.au','co.nz','com.br','com.cn','co.jp','co.kr','com.mx','com.sg','com.hk','com.tw','co.za','com.tr','com.in','gov.in','com.pl','com.ar']);
  function getRootDomain(d) {
    const parts = d.toLowerCase().trim().split('.').filter(Boolean);
    if (parts.length <= 2) return d.toLowerCase().trim();
    const last2 = parts.slice(-2).join('.');
    if (DOUBLE_SUFFIX.has(last2)) return parts.slice(-3).join('.');
    return last2;
  }

  function levenshtein(a,b){
    const m=a.length,n=b.length; const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
    for(let i=0;i<=m;i++) dp[i][0]=i; for(let j=0;j<=n;j++) dp[0][j]=j;
    for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){ const c=a[i-1]===b[j-1]?0:1; dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+c); if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1]) dp[i][j]=Math.min(dp[i][j],dp[i-2][j-2]+1); }
    return dp[m][n];
  }

  function normalizeHomoglyph(s){
    return s.toLowerCase()
      .replace(/а/g,'a').replace(/е/g,'e').replace(/о/g,'o').replace(/р/g,'p').replace(/с/g,'c').replace(/х/g,'x').replace(/у/g,'y')
      .replace(/0/g,'o').replace(/1/g,'l').replace(/rn/g,'m').replace(/cl/g,'d').replace(/vv/g,'w');
  }

  const REAL_DOMAINS = { sbi:"sbi.co.in", irctc:"irctc.co.in", phonepe:"phonepe.com", paytm:"paytm.com", hdfcbank:"hdfcbank.com", icicibank:"icicibank.com", axisbank:"axisbank.com", zerodha:"zerodha.com", flipkart:"flipkart.com", makemytrip:"makemytrip.com", swiggy:"swiggy.com", zomato:"zomato.com", jio:"jio.com", reliance:"ril.com" };
  const BRANDS = Object.keys(REAL_DOMAINS).concat(['google','microsoft','apple','amazon','meta','facebook','instagram','netflix','tesla','paypal','visa','mastercard','stripe','binance','coinbase','linkedin','github','infosys','ola','naukri','vercel','openai','chatgpt','adobe','oracle','samsung','toyota','airbnb','boat']);
  const UNIQUE = [...new Set(BRANDS)];

  function checkTypo(domain){
    const name = domain.split('.')[0].toLowerCase();
    const norm = normalizeHomoglyph(name);
    for(const brand of UNIQUE){
      if(name === brand) return { isTypo:false, realBrand:null };
      const dist = levenshtein(norm, brand);
      // V20 RULE: Distance == 1 pe hi Typo. Distance 2 / Prefix = False Positive, isliye BANNED.
      if(dist === 1) return { isTypo:true, realBrand: REAL_DOMAINS[brand] || brand + '.com' };
    }
    return { isTypo:false, realBrand:null };
  }

  let rawDomain = (req.query.domain || '').toString().trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0].split('?')[0].split(':')[0];
  try{ rawDomain = decodeURIComponent(rawDomain); }catch{}
  if(!rawDomain || rawDomain.length > 253 || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(rawDomain)) return res.status(400).json({ error:'invalid domain', domain: rawDomain });
  const domain = getRootDomain(rawDomain);
  const typoCheck = checkTypo(domain);
  const tld = domain.split('.').pop();

  // ===== A) SSL - LIVE TLS FIRST =====
  let ssl = null, sslExpiry = null, sslIssuer = null, sslSource = null;
  try{
    const tls = await import('tls');
    await new Promise((resolve)=>{
      let done = false; const finish = ()=>{ if(!done){ done=true; resolve(true); } };
      const socket = tls.connect(443, domain, { servername: domain, timeout: 7000, rejectUnauthorized: false }, ()=>{
        try{
          const cert = socket.getPeerCertificate(true);
          if(cert?.valid_to){ ssl = new Date(cert.valid_to) > new Date(); sslExpiry = cert.valid_to; sslIssuer = cert.issuer?.O || cert.issuer?.CN || null; sslSource = 'live-tls-handshake'; }
        }catch{}
        try{ socket.end(); }catch{} finish();
      });
      socket.setTimeout(7000, ()=>{ try{ socket.destroy(); }catch{} finish(); });
      socket.on('error', ()=>finish());
    });
  }catch{}
  if(ssl === null){
    const sslJobs = [
      (async()=>{ const r = await fetchWithTimeout(`https://crt.sh/?q=%25.${encodeURIComponent(domain)}&output=json&exclude=expired`, { headers:{ 'User-Agent':'JobCheck-pro/12.1' } }, 6000); if(!r.ok) throw new Error('crt fail'); const j = await r.json(); if(!Array.isArray(j) || !j.length) throw new Error('empty'); const l = j.sort((a,b)=>new Date(b.not_after)-new Date(a.not_after))[0]; if(!l?.not_after) throw new Error('no cert'); return { ssl: new Date(l.not_after) > new Date(), expiry: l.not_after, issuer: l.issuer_name, src: 'crt.sh' }; })(),
      (async()=>{ const r = await fetchWithTimeout(`https://api.certspotter.com/v1/issuances?domain=${encodeURIComponent(domain)}&include_subdomains=false&expand=cert`, {}, 6000); if(!r.ok) throw new Error('certspotter fail'); const j = await r.json(); if(!Array.isArray(j) || !j.length) throw new Error('empty'); const c = j[0]?.cert; if(!c?.not_after) throw new Error('no cert'); return { ssl: new Date(c.not_after) > new Date(), expiry: c.not_after, issuer: c.issuer?.organization || null, src: 'certspotter' }; })(),
    ];
    const win = await raceFirst(sslJobs);
    if(win){ ssl = win.ssl; sslExpiry = win.expiry; sslIssuer = win.issuer; sslSource = win.src; }
  }

  // ===== B) IP - LIVE DNS ONLY =====
  let ip = null, ipSource = null;
  const ipJobs = [
    (async()=>{ const dns = await import('dns/promises'); const a = await dns.resolve4(domain); if(!a?.[0]) throw new Error('dns fail'); return { ip: a[0], src: 'dns.resolve4' }; })(),
    (async()=>{ const r = await fetchWithTimeout(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {}, 5000); const j = await r.json(); if(!j?.Answer?.[0]?.data) throw new Error('google dns fail'); return { ip: j.Answer[0].data, src: 'dns.google' }; })(),
    (async()=>{ const r = await fetchWithTimeout(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`, { headers:{ accept:'application/dns-json' } }, 5000); const j = await r.json(); if(!j?.Answer?.[0]?.data) throw new Error('cf fail'); return { ip: j.Answer[0].data, src: 'cloudflare-dns' }; })(),
  ];
  const ipWin = await raceFirst(ipJobs);
  if(ipWin){ ip = ipWin.ip; ipSource = ipWin.src; }

  // ===== C) GEO - LIVE ONLY =====
  let country = null, countryCode = null, city = null, isp = null, geoSource = null;
  if(ip){
    const geoJobs = [
      (async()=>{ const r = await fetchWithTimeout(`https://ipwho.is/${ip}`, {}, 5000); const j = await r.json(); if(!j?.country) throw new Error('fail'); return { country: j.country, code: j.country_code, city: j.city, isp: j.connection?.isp, src: 'ipwho.is' }; })(),
      (async()=>{ const r = await fetchWithTimeout(`https://ipapi.co/${ip}/json/`, {}, 5000); const j = await r.json(); if(!j?.country_name) throw new Error('fail'); return { country: j.country_name, code: j.country_code, city: j.city, isp: j.org, src: 'ipapi.co' }; })(),
      (async()=>{ const r = await fetchWithTimeout(`http://ip-api.com/json/${ip}?fields=country,countryCode,city,isp`, {}, 5000); const j = await r.json(); if(!j?.country) throw new Error('fail'); return { country: j.country, code: j.countryCode, city: j.city, isp: j.isp, src: 'ip-api.com' }; })(),
      (async()=>{ const r = await fetchWithTimeout(`https://freeipapi.com/api/json/${ip}`, {}, 5000); const j = await r.json(); if(!j?.countryName) throw new Error('fail'); return { country: j.countryName, code: j.countryCode, city: j.cityName, isp: j.isp, src: 'freeipapi.com' }; })(),
    ];
    const gWin = await raceFirst(geoJobs);
    if(gWin){ country = gWin.country; countryCode = gWin.code || null; city = gWin.city || null; isp = gWin.isp || null; geoSource = gWin.src; }
  }

  // ===== D) RDAP - IANA BOOTSTRAP =====
  let created = null, registrar = null, rdapSource = null;
  let rdapBaseUrls = [];
  try{
    const r = await fetchWithTimeout(`https://data.iana.org/rdap/dns.json`, {}, 6000);
    if(r.ok){
      const j = await r.json();
      const svc = j?.services?.find(s => s[0]?.includes(tld));
      if(svc?.[1]?.length) rdapBaseUrls = svc[1];
    }
  }catch{}
  const rdapJobs = [];
  for(const base of rdapBaseUrls){
    try{ rdapJobs.push({ name: `iana-rdap-${new URL(base).hostname}`, url: `${base.replace(/\/$/,'')}/domain/${domain}` }); }catch{}
  }
  rdapJobs.push(
    { name:'rdap.org', url:`https://rdap.org/domain/${domain}` },
    { name:'who-dat.net', url:`https://who-dat.net/api/v1/${domain}` }
  );
  for(const u of rdapJobs){
    try{
      const r = await fetchWithTimeout(u.url, { headers:{ accept:'application/json' } }, 6000);
      if(!r.ok) continue;
      const j = await r.json();
      const ev = j?.events?.find((x)=>x.eventAction==='registration');
      if(ev?.eventDate) created = ev.eventDate;
      if(j?.created) created = j.created;
      if(j?.creation_date) created = j.creation_date;
      if(Array.isArray(j?.creation_date) && j.creation_date[0]) created = j.creation_date[0];
      const ent = j?.entities?.find((e)=>e.roles?.includes('registrar'));
      if(ent?.vcardArray?.[1]?.find((v)=>v[0]==='fn')) registrar = ent.vcardArray[1].find((v)=>v[0]==='fn')[3];
      if(j?.registrar) registrar = j.registrar;
      if(typeof j?.registrar === 'object' && j.registrar?.name) registrar = j.registrar.name;
      if(created){ rdapSource = u.name; break; }
    }catch{}
  }

  const elapsedMs = Date.now() - START;
  return res.status(200).json({
    domain, rawDomain, isSubdomain: rawDomain !== domain,
    ssl, sslExpiry, sslIssuer, sslSource,
    ip, ipSource,
    country, countryCode, city, isp, geoSource,
    created, registrar, rdapSource,
    // CRITICAL FIX: object mat bhejo, null ya string bhejo. Nahi to phonepe.com bhi FAKE dikhega.
    typo: typoCheck.isTypo ? typoCheck.realBrand : null,
    checkedAt: new Date().toISOString(),
    performance: { elapsedMs },
    version: 'V12.1-PRO-FINAL-LOCKED'
  });
}
