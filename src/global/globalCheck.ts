// GLOBAL ENGINE v2 - 100% GLOBAL - NO GST - NO INDIA - NO MOCK
const cache: any = {};
function getCache(k: string) { const v = cache[k]; if (!v) return null; if (Date.now() - v.t > 24*3600*1000) return null; return v.d; }
function setCache(k: string, d: any) { cache[k] = { t: Date.now(), d }; }
export function cleanDomain(d: string) { return d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0]; }
async function fetchJSON(url: string, opts?: any) { const r = await fetch(url, opts); if (!r.ok) throw new Error('fail'); return await r.json(); }

// API 1 + 2 - DOMAIN AGE - GLOBAL
async function getDomainAge(domain: string) {
  let c = getCache('age_' + domain); if (c) return c;
  try { const data = await fetchJSON('https://rdap.org/domain/' + domain); let e = data.events?.find((x: any) => x.eventAction === 'registration'); let res = { source: 'RDAP Global', created: e?.eventDate || '' }; setCache('age_' + domain, res); return res; }
  catch { try { const d2 = await fetchJSON('https://who-dat.net/api/v1/' + domain); let res = { source: 'WHOIS Global Backup', created: d2.created || '' }; setCache('age_' + domain, res); return res; } catch { return { source: 'Not Found', created: '' }; } }
}
// API 3 + 4 - SERVER LOCATION - GLOBAL
async function getLocation(domain: string) {
  let c = getCache('loc_' + domain); if (c) return c;
  try { const dns = await fetchJSON('https://dns.google/resolve?name=' + domain + '&type=A'); let ip = dns.Answer?.[0]?.data || '8.8.8.8'; const loc = await fetchJSON(`https://ip-api.com/json/${ip}?fields=status,country,city,isp,query`); if (loc.status === 'success') { let res = { source: 'IP-API Global', country: loc.country, city: loc.city, isp: loc.isp, ip: loc.query }; setCache('loc_' + domain, res); return res; } throw new Error('x'); }
  catch { try { const loc = await fetchJSON('https://ipwho.is/' + domain); let res = { source: 'IPWho.is Global Backup', country: loc.country || '', city: loc.city || '', isp: loc.connection?.isp || '', ip: loc.ip || '' }; setCache('loc_' + domain, res); return res; } catch { return { source: 'Unknown', country: '', city: '', isp: '', ip: '' }; } }
}
// API 5 + 6 - EMAIL / MX - GLOBAL
async function getEmailCheck(email: string) {
  let dom = email.split('@')[1]; if (!dom) return { valid: false, source: 'Invalid', hasMX: false };
  let c = getCache('mail_' + dom); if (c) return c;
  try { const dns = await fetchJSON('https://dns.google/resolve?name=' + dom + '&type=MX'); let res = { valid: !!dns.Answer?.length, source: 'Google DNS Global', hasMX: !!dns.Answer?.length }; setCache('mail_' + dom, res); return res; }
  catch { try { const dns = await fetchJSON(`https://cloudflare-dns.com/dns-query?name=${dom}&type=MX`, { headers: { accept: 'application/dns-json' } }); let res = { valid: !!dns.Answer?.length, source: 'Cloudflare DNS Global', hasMX: !!dns.Answer?.length }; setCache('mail_' + dom, res); return res; } catch { return { valid: true, source: 'Fallback', hasMX: true }; } }
}
// API 7 - SSL / HTTPS - GLOBAL ADVANCED
async function getSSLCheck(domain: string) {
  try { const r = await fetch('https://' + domain, { method: 'HEAD' }); return { secure: r.ok, source: 'Live HTTPS Check' }; } catch { return { secure: false, source: 'Live HTTPS Check' }; }
}

export async function globalCheck(input: string) {
  let domain = '', email = '', company = input;
  if (input.includes('@')) { email = input; domain = email.split('@')[1] || ''; company = domain; }
  else if (input.includes('.')) { domain = cleanDomain(input); company = domain; }
  else { domain = input.toLowerCase().replace(/\s+/g, '') + '.com'; company = input; }
  let score = 100; let reasons: string[] = []; let details: string[] = [];
  let age = await getDomainAge(domain); let ageDays = age.created ? Math.floor((Date.now() - new Date(age.created).getTime()) / 86400000) : null;
  if (ageDays !== null) { details.push(`🌍 Domain Created: ${new Date(age.created).toDateString()} (${ageDays} days ago) - ${age.source}`); if (ageDays < 30) { score -= 40; reasons.push('Domain < 30 days - Very New - Global Risk'); } else if (ageDays < 180) { score -= 20; reasons.push('Domain < 6 months - New Company'); } else reasons.push('Domain Old - Global Trust +'); }
  else { details.push(`🌍 Domain Age: Not Found - Hidden / New`); score -= 15; }
  let loc: any = await getLocation(domain);
  if (loc.country) details.push(`🌍 Server Location: ${loc.city}, ${loc.country} | ISP: ${loc.isp} | IP: ${loc.ip} - ${loc.source}`); else details.push(`🌍 Server Location: Not Found`);
  let mail: any = email ? await getEmailCheck(email) : await getEmailCheck('info@' + domain);
  if (mail.valid) details.push(`🌍 Official Email: Valid - ${mail.source}`); else { score -= 25; reasons.push('No Official Email MX - Fake Company'); details.push(`🌍 Official Email: No MX Found`); }
  let ssl = await getSSLCheck(domain);
  if (ssl.secure) details.push(`🔒 SSL / HTTPS: Secure - ${ssl.source}`); else { score -= 10; details.push(`🔒 SSL / HTTPS: Not Secure / No HTTPS`); }
  let low = input.toLowerCase(); let scamWords = ['telegram only','whatsapp only','pay for job','registration fee','crypto payment','no interview','urgent join','gift card','send money','pay to join','upfront fee','processing fee'];
  let found = scamWords.filter(w => low.includes(w)); if (found.length) { score -= 30; reasons.push('Global Scam Pattern: ' + found.join(', ')); }
  if (email && (email.includes('gmail.com')||email.includes('yahoo.com')||email.includes('hotmail.com'))) { score -= 15; reasons.push('Free Email for Company - Global Red Flag'); }
  if (score < 0) score = 0;
  return { score, label: score >= 75 ? '✅ LIKELY SAFE - GLOBAL' : score >= 45 ? '⚠️ BE CAREFUL - GLOBAL RISK' : '🚨 HIGH RISK - LIKELY SCAM - GLOBAL', reasons, details, domain, company, ageDays, country: loc.country || 'Unknown', ssl: ssl.secure };
}
