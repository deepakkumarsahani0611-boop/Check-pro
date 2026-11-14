// src/lib/worldCheck.ts - V20 FINAL - 100% REAL - NO DUMMY - GLOBAL
// RULE: No data = Unknown. Never invent. Unknown != Fake. Fake only on proof.

const BRANDS: Record<string, string> = {
  google: "google.com", microsoft: "microsoft.com", amazon: "amazon.com",
  openai: "openai.com", chatgpt: "openai.com", anthropic: "anthropic.com", claude: "anthropic.com",
  groww: "groww.in", zerodha: "zerodha.com", paytm: "paytm.com", flipkart: "flipkart.com",
  swiggy: "swiggy.com", zomato: "zomato.com", infosys: "infosys.com", hdfcbank: "hdfcbank.com",
  hdfc: "hdfcbank.com", vercel: "vercel.com", facebook: "facebook.com", instagram: "instagram.com",
  apple: "apple.com", samsung: "samsung.com", tcs: "tcs.com", wipro: "wipro.com", reliance: "reliance.com",
  icici: "icicibank.com", icicibank: "icicibank.com", sbi: "sbi.co.in", axisbank: "axisbank.com",
  kotak: "kotak.com", phonepe: "phonepe.com", ola: "olacabs.com", uber: "uber.com",
  netflix: "netflix.com", adobe: "adobe.com", oracle: "oracle.com", ibm: "ibm.com",
  dell: "dell.com", hp: "hp.com", lenovo: "lenovo.com", whatsapp: "whatsapp.com",
  telegram: "telegram.org", youtube: "youtube.com", linkedin: "linkedin.com", twitter: "x.com",
  tata: "tata.com", mahindra: "mahindra.com", bajaj: "bajajfinserv.in", adani: "adani.com",
  jio: "jio.com", airtel: "airtel.in", vodafone: "vi.com", idea: "vi.com",
  hdfclife: "hdfclife.com", icicipru: "iciciprulife.com", lic: "licindia.in",
  olaelectric: "olaelectric.com", oyo: "oyorooms.com", makemytrip: "makemytrip.com",
  cleartrip: "cleartrip.com", irctc: "irctc.co.in", byjus: "byjus.com", unacademy: "unacademy.com",
  cred: "cred.club", upstox: "upstox.com", angelone: "angelone.in", payzapp: "payzapp.in",
  gpay: "pay.google.com", amazonin: "amazon.in", myntra: "myntra.com", ajio: "ajio.com",
  meesho: "meesho.com", snapdeal: "snapdeal.com", bigbasket: "bigbasket.com", blinkit: "blinkit.com",
  zepto: "zepto.com", dunzo: "dunzo.com", rapido: "rapido.bike", delhivery: "delhivery.com",
  dominos: "dominos.co.in", kfc: "kfc.co.in", mcdonalds: "mcdonaldsindia.com",
  starbucks: "starbucks.in", nike: "nike.com", adidas: "adidas.co.in", puma: "puma.com",
  sony: "sony.com", lg: "lg.com", panasonic: "panasonic.com", nokia: "nokia.com",
  xiaomi: "mi.com", oneplus: "oneplus.in", vivo: "vivo.com", oppo: "oppo.com",
  realme: "realme.com", honda: "honda.com", toyota: "toyota.com", hyundai: "hyundai.com",
  maruti: "marutisuzuki.com", suzuki: "marutisuzuki.com", hero: "heromotocorp.com",
  yesbank: "yesbank.in", pnb: "pnb.co.in", bankofbaroda: "bankofbaroda.in", canara: "canarabank.com",
  unionbank: "unionbankofindia.co.in", idfc: "idfcfirstbank.com", federal: "federalbank.co.in",
  indusind: "indusind.com", dbs: "dbs.com", hsbc: "hsbc.co.in", citi: "citibank.co.in", standard: "sc.com",
  dollarking: "dollarking.com", meta: "meta.com",
};

const GLOBAL_SCAM_PATTERNS = [
  'watch ads','ad watching','watch ad','recharge job','mobile recharge',
  'captcha','copy paste','copy-paste','typing work','typing job','form filling',
  'telegram task','telegram job','packing job','pen packing','home packing',
  'whatsapp forward','whatsapp job','like job','youtube like',
  'survey loot','earn money by watching','pay to join','registration fee'
];

export function detectScamPattern(job: string): string | null {
  const j = (job || '').toLowerCase();
  return GLOBAL_SCAM_PATTERNS.find(p => j.includes(p)) || null;
}

const DOUBLE_SUFFIX = new Set(["co.uk","co.in","com.au","com.br","co.jp","co.kr","com.mx","com.sg","org.uk","ac.in","gov.in","co.za","com.tr","com.pl","com.ar"]);
export const getRootDomain = (input: string): string => {
  let h = input.toLowerCase().trim().replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0].split("?")[0].split("#")[0].split(":")[0].split("@").pop() || "";
  const p = h.split(".").filter(Boolean);
  if (p.length <= 2) return h;
  const last2 = p.slice(-2).join(".");
  if (DOUBLE_SUFFIX.has(last2)) return p.slice(-3).join(".");
  return last2;
};

const cleanDomain = (input: string): string => {
  try {
    const url = input.includes("://") ? input : `https://${input}`;
    return new URL(url).hostname.replace(/^www\./,"").toLowerCase();
  } catch { return input.toLowerCase().replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0].split("?")[0]; }
};

function lev(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 99;
  const dp: number[][] = Array.from({length: m+1}, () => Array(n+1).fill(0));
  for (let i=0;i<=m;i++) dp[i][0]=i;
  for (let j=0;j<=n;j++) dp[0][j]=j;
  for (let i=1;i<=m;i++) for (let j=1;j<=n;j++) {
    const cost = a[i-1]===b[j-1] ? 0 : 1;
    dp[i][j]=Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);
    if (i>1 && j>1 && a[i-1]===b[j-2] && a[i-2]===b[j-1]) dp[i][j]=Math.min(dp[i][j], dp[i-2][j-2]+1);
  }
  return dp[m][n];
}

function normalizeHomoglyph(s: string): string {
  const map: Record<string,string> = { "а":"a","е":"e","о":"o","р":"p","с":"c","х":"x","у":"y","і":"i","ј":"j","ѕ":"s","0":"o","1":"l","rn":"m","vv":"w" };
  let out = s;
  for (const [k,v] of Object.entries(map)) out = out.split(k).join(v);
  return out;
}

export function checkTypo(domain: string) {
  const root = getRootDomain(domain);
  const rawName = root.split(".")[0];
  const name = normalizeHomoglyph(rawName);
  if (BRANDS[name] && BRANDS[name] === root) return null;
  if (BRANDS[name]) return null;
  for (const b of Object.keys(BRANDS)) {
    if (b.length < 4) continue;
    if (Math.abs(name.length - b.length) > 1) continue;
    const dist = lev(name, b);
    if (dist === 1) {
      return { isTypo: true, realBrand: BRANDS[b], fakeDomain: root, message: `TYPO-SQUAT! This is a fake version of ${BRANDS[b]} - ${root} is FAKE!` };
    }
  }
  return null;
}

const cache = new Map<string, {data:any, time:number}>();
const CACHE_TTL = 5 * 60 * 1000;
const getCache = (k:string) => {
  const v = cache.get(k);
  if (!v) return null;
  if (Date.now() - v.time > CACHE_TTL) { cache.delete(k); return null; }
  return v.data;
};
const setCache = (k:string, d:any) => { cache.set(k, {data:d, time: Date.now()}); };

const fetchTimeout = async (url: string, ms = 8000): Promise<Response> => {
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), ms);
  try { const r = await fetch(url, {signal: ctrl.signal}); clearTimeout(t); return r; } catch { clearTimeout(t); throw new Error("timeout"); }
};

export async function verifyCompanyReal(input: string) {
  const rawDomain = cleanDomain(input);
  const domain = getRootDomain(rawDomain);
  if (!domain || !domain.includes(".")) throw new Error("Invalid domain");
  const cached = getCache(`c-${domain}`);
  if (cached) return cached;
  const typo = checkTypo(domain);
  if (typo) {
    const out = { domain, company: domain.split(".")[0], ssl: false, issuer: "Unknown", created: null, ageDays: null, country: "Unknown", ip: "Unknown", registrar: "Unknown", score: 0, label: "FAKE", reasons: [typo.message], isReal: true, isTypo: true, realBrand: typo.realBrand, typo: typo.realBrand, source: "Typo Engine" };
    setCache(`c-${domain}`, out);
    return out;
  }
  try {
    const res = await fetchTimeout(`/api/check?domain=${encodeURIComponent(domain)}`, 9000).then(r => {
      if (!r.ok) throw new Error(`Backend ${r.status}`);
      return r.json();
    });
    if (res.typo) {
      const out = { domain, company: domain.split(".")[0], ssl: false, issuer: "Unknown", created: null, ageDays: null, country: "Unknown", ip: "Unknown", registrar: "Unknown", score: 0, label: "FAKE", reasons: [`TYPO-SQUAT! Fake version of ${res.typo}`], isReal: true, isTypo: true, realBrand: res.typo, typo: res.typo, source: "Backend" };
      setCache(`c-${domain}`, out);
      return out;
    }
    const ssl = res.ssl === true ? true : res.ssl === false ? false : null;
    const created = res.created || null;
    const ageDays = created ? Math.floor((Date.now() - new Date(created).getTime()) / 86400000) : null;
    let score = 0; const reasons: string[] = [];
    if (ssl === true) { score += 50; reasons.push(`SSL Certificate Valid - Secure Connection`); }
    else if (ssl === false) { reasons.push("SSL Certificate Not Valid"); }
    else { reasons.push("SSL Unknown - Could not verify"); }
    if (ageDays !== null && ageDays > 3650) { score += 50; reasons.push(`Domain is ${ageDays} days old`); }
    else if (ageDays !== null && ageDays > 1000) { score += 40; reasons.push(`Domain is ${ageDays} days old`); }
    else if (ageDays !== null && ageDays > 180) { score += 25; reasons.push(`Domain is ${ageDays} days old`); }
    else if (ageDays !== null && ageDays >= 0) { score += 5; reasons.push(`Domain is ${ageDays} days old`); }
    else { reasons.push("Domain age Unknown - Could not verify via RDAP"); }
    if (res.country) reasons.push(`Server Country: ${res.country}`);
    if (res.registrar) reasons.push(`Registrar: ${res.registrar}`);
    score = Math.max(0, Math.min(100, score));
    const allUnknown = ssl === null && ageDays === null;
    const label = allUnknown ? "UNKNOWN" : score >= 70 ? "SAFE" : score >= 40 ? "CAUTION" : "UNKNOWN";
    const out = { domain, company: domain.split(".")[0], ssl, issuer: res.sslIssuer || "Unknown", created: created || "Unknown", ageDays, country: res.country || "Unknown", ip: res.ip || "Unknown", registrar: res.registrar || "Unknown", score, label, reasons, typo: null, isReal: true, source: "Backend - Live Verified" };
    setCache(`c-${domain}`, out);
    return out;
  } catch {
    const [sslRes, rdapRes, dnsRes] = await Promise.allSettled([
      fetchTimeout(`https://crt.sh/?q=${domain}&output=json`).then(r=>r.json()),
      fetchTimeout(`https://rdap.org/domain/${domain}`).then(r=>r.json()),
      fetchTimeout(`https://dns.google/resolve?name=${domain}&type=A`).then(r=>r.json()),
    ]);
    const certs: any[] = sslRes.status==="fulfilled" && Array.isArray(sslRes.value) ? sslRes.value : [];
    const validCert = certs.filter((c:any)=>c.not_after && new Date(c.not_after) > new Date());
    const ssl = validCert.length > 0 ? true : (sslRes.status==="fulfilled" ? false : null);
    const issuer = validCert[0]?.issuer_name || "Unknown";
    const rdap: any = rdapRes.status==="fulfilled" ? rdapRes.value : null;
    const createdEv = rdap?.events?.find((e:any)=>e.eventAction==="registration");
    const created = createdEv ? String(createdEv.eventDate).split("T")[0] : null;
    const ageDays = created ? Math.floor((Date.now()-new Date(created).getTime())/86400000) : null;
    const registrar = rdap?.entities?.[0]?.vcardArray?.[1]?.find((x:any)=>x[0]==="fn")?.[3] || "Unknown";
    const ip = dnsRes.status==="fulfilled" ? (dnsRes.value as any)?.Answer?.find((a:any)=>a.type===1)?.data : null;
    let country = "Unknown";
    if (ip) {
      try { const loc = await fetchTimeout(`https://ip-api.com/json/${ip}?fields=country,city,isp`,5000).then(r=>r.json()); if (loc.country) country = `${loc.country} - ${loc.city||""} (${loc.isp||""})`; } catch {}
      if (country==="Unknown") {
        try { const loc2 = await fetchTimeout(`https://ipwho.is/${ip}`,5000).then(r=>r.json()); if (loc2.country) country = `${loc2.country} - ${loc2.city||""} (${loc2.connection?.isp||""})`; } catch {}
      }
    }
    let score = 0; const reasons: string[] = [];
    if (ssl === true) { score+=50; reasons.push("SSL Certificate Found - Verified via crt.sh"); }
    else if (ssl === false) { reasons.push("SSL Certificate Not Found - Fallback Check"); }
    else { reasons.push("SSL Unknown - Could not verify"); }
    if (ageDays !== null && ageDays > 3650) { score+=50; reasons.push(`Domain is ${ageDays} days old`); }
    else if (ageDays !== null && ageDays > 1000) { score+=40; reasons.push(`Domain is ${ageDays} days old`); }
    else if (ageDays !== null && ageDays > 180) { score+=25; reasons.push(`Domain is ${ageDays} days old`); }
    else if (ageDays !== null && ageDays >= 0) { score+=5; reasons.push(`Domain is ${ageDays} days old`); }
    else { reasons.push("Domain age Unknown - Could not verify via RDAP"); }
    if (country!=="Unknown") reasons.push(`Server Country: ${country}`); else reasons.push("Server Country: Unknown");
    if (registrar!=="Unknown") reasons.push(`Registrar: ${registrar}`);
    score = Math.max(0, Math.min(100, score));
    const label = (ssl === null && ageDays === null) ? "UNKNOWN" : score>=70 ? "SAFE" : score>=40 ? "CAUTION" : "UNKNOWN";
    const out = { domain, company: domain.split(".")[0], ssl, issuer, created: created || "Unknown", ageDays, country, ip: ip||"Unknown", registrar, score, label, reasons, typo: null, isReal: true, source: "Fallback - crt.sh + RDAP + DNS" };
    setCache(`c-${domain}`, out);
    return out;
  }
}

export async function searchJobsWorldwide(query: string) {
  const q = query.trim();
  if (!q) return [];
  const cached = getCache(`j-${q.toLowerCase()}`);
  if (cached) return cached;
  const results: any[] = [];
  const [r1, r2] = await Promise.allSettled([
    fetchTimeout(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(q)}&limit=20`, 6000).then(r=>r.json()),
    fetchTimeout(`https://www.arbeitnow.com/api/job-board-api`, 6000).then(r=>r.json()),
  ]);
  if (r1.status==="fulfilled") (r1.value.jobs||[]).forEach((j:any)=>results.push({title:j.title, company:j.company_name, location:j.candidate_required_location || null, url:j.url, type:j.job_type || null, source:"Remotive", posted:j.publication_date, salary:j.salary || null, isReal:true}));
  if (r2.status==="fulfilled") (r2.value.data||[]).filter((j:any)=>(j.title+" "+j.company_name+" "+(j.location||"")).toLowerCase().includes(q.toLowerCase())).slice(0,20).forEach((j:any)=>results.push({title:j.title, company:j.company_name, location:j.location || null, url:j.url, type:j.job_types?.join(", ") || null, source:"Arbeitnow", posted:j.created_at, salary: null, isReal:true}));
  results.sort((a:any,b:any)=> new Date(b.posted||0).getTime() - new Date(a.posted||0).getTime());
  setCache(`j-${q.toLowerCase()}`, results);
  return results;
}

export async function checkLinkReal(link: string) {
  const domain = getRootDomain(cleanDomain(link));
  const company = await verifyCompanyReal(domain);
  const isFake = company.ssl === false && company.ageDays !== null && company.ageDays < 90;
  return { ...company, link, isSafe: !isFake && !company.isTypo, verdict: company.isTypo ? "FAKE - TYPO-SQUAT" : company.score>=70 ? "SAFE - Real Company" : company.score>=40 ? "CAUTION" : "UNKNOWN - Insufficient Data", isReal: true };
}

export async function checkFakeJobReal(jobTitle: string, companyName: string) {
  const cleanName = companyName.trim().toLowerCase();
  const key = cleanName.replace(/[^a-z0-9]/g,"");
  const firstWord = cleanName.split(" ")[0] || key;
  let knownDomain = BRANDS[key] || BRANDS[firstWord] || BRANDS[cleanName];
  if (!knownDomain) {
    if (cleanName.includes(".")) knownDomain = getRootDomain(cleanName);
    else knownDomain = `${key}.com`;
  }
  const jobs = await searchJobsWorldwide(jobTitle);
  const foundInRealAPI = jobs.some((j:any)=>(j.company||"").toLowerCase().includes(firstWord));
  const scamPattern = detectScamPattern(jobTitle);
  let company: any;
  try {
    company = await verifyCompanyReal(knownDomain);
  } catch {
    company = { domain: knownDomain, company: companyName, ssl: null, issuer: "Unknown", created: "Unknown", ageDays: null, country: "Unknown", ip: "Unknown", registrar: "Unknown", score: null, label: "UNKNOWN", reasons: ["Live data not available for this domain"], typo: null, isReal: true, source: "Unknown" };
  }
  const redFlags: string[] = [];
  if (scamPattern) {
    redFlags.push(`FAKE LOOP DETECTED - Job title "${scamPattern}" is a global scam pattern. Real companies do not offer this job.`);
    redFlags.push('Domain age does not make this job real.');
  }
  if (company.isTypo) redFlags.push(`TYPO-SQUAT! Official: ${company.realBrand}`);
  if (company.ssl === false) redFlags.push("Company SSL is not valid");
  if (company.ssl === null) redFlags.push("Company SSL Unknown - Could not verify");
  if (company.ageDays !== null && company.ageDays < 180) redFlags.push(`Domain is ${company.ageDays} days old - New domain, be careful`);
  if (jobTitle.toLowerCase().includes("telegram") || jobTitle.toLowerCase().includes("whatsapp only")) redFlags.push("Telegram/WhatsApp only contact - High Risk - No official website / email found");
  const isFake = !!scamPattern || Boolean(company.isTypo);
  let finalScore: number | null = company.score;
  if (scamPattern) finalScore = typeof company.score === 'number' ? Math.min(company.score, 10) : 10;
  return {
    jobTitle, company: companyName,
    companyCheck: { ...company, label: isFake ? 'FAKE' : company.label, typo: company.typo || null },
    foundInRealAPI, redFlags,
    verdict: isFake ? "FAKE / HIGH RISK" : company.label === 'SAFE' ? "SAFE - Real Company" : company.label === 'CAUTION' ? "CAUTION" : "UNKNOWN - Insufficient Data",
    score: finalScore, isReal: true
  };
  }
