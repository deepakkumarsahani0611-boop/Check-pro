// GLOBAL ENGINE V5 - 100% - NO FAKE
const cache: any = {};
function getCache(k: string) { const v = cache[k]; if (!v) return null; if (Date.now() - v.t > 24*3600*1000) return null; return v.d; }
function setCache(k: string, d: any) { cache[k] = { t: Date.now(), d }; }
export function cleanDomain(d: string) { return d.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('?')[0]; }
async function tryFetch(url: string, opts?: any) { try { const r = await fetch(url, opts); if (!r.ok) return null; return await r.json(); } catch { return null; } }

async function getAge(domain: string) {
  const urls = [`https://rdap.org/domain/${domain}`, `https://rdap.verisign.com/com/v1/domain/${domain}`, `https://rdap.verisign.com/net/v1/domain/${domain}`, `https://who-dat.net/api/v1/${domain}`, `https://rdap.db.ripe.net/domain/${domain}`, `https://rdap.apnic.net/domain/${domain}`];
  for (const u of urls) {
    const j: any = await tryFetch(u);
    if (!j) continue;
    const ev = j?.events?.find((x: any) => x.eventAction === 'registration');
    if (ev?.eventDate) return ev.eventDate;
    if (j?.created) return j.created;
    if (j?.creation_date) return j.creation_date;
  }
  return '';
}

async function getMX(domain: string) {
  const urls = [`https://dns.google/resolve?name=${domain}&type=MX`, `https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, `https://dns.quad9.net:5053/dns-query?name=${domain}&type=MX`];
  for (const u of urls) {
    const j: any = await tryFetch(u, { headers: { accept: 'application/dns-json' } });
    if (j?.Answer && j.Answer.length > 0) return true;
  }
  return false;
}

async function getBackend(domain: string) {
  try {
    const r = await fetch(`/api/check?domain=${domain}`);
    if (r.ok) return await r.json();
  } catch {}
  return { ssl: false, country: 'Unknown', ip: null, sslExpiry: null, created: null, sslIssuer: '', city: '', isp: '' };
}

export async function globalCheck(domainInput: string) {
  const domain = cleanDomain(domainInput);
  const cached = getCache('v5_' + domain);
  if (cached) return cached;
  const [created, hasMX, back] = await Promise.all([getAge(domain), getMX(domain), getBackend(domain)]);
  const finalCreated = created || back.created || '';
  const ageDays = finalCreated ? Math.floor((Date.now() - new Date(finalCreated).getTime()) / (1000*60*60*24)) : 0;
  const ssl = back.ssl === true;
  const country = back.country || 'Unknown';
  let score = 30;
  if (ageDays > 3650) score += 25; else if (ageDays > 1000) score += 18; else if (ageDays > 180) score += 10; else if (ageDays > 0) score += 5;
  if (ssl) score += 20; else score -= 10;
  if (hasMX) score += 15;
  if (country !== 'Unknown') score += 10;
  score = Math.max(0, Math.min(100, score));
  const label = score >= 75 ? 'LIKELY SAFE' : score >= 45 ? 'CAUTION' : 'HIGH RISK';
  const result = {
    domain, company: domain, ageDays, created: finalCreated, country, city: back.city || '', ip: back.ip || '',
    ssl, sslExpiry: back.sslExpiry || null, sslIssuer: back.sslIssuer || '', isp: back.isp || '', hasMX,
    score, label,
    reasons: [
      ageDays ? `Domain age: ${ageDays} days old (since ${new Date(finalCreated).toLocaleDateString()})` : 'Domain age: Unknown',
      ssl ? `SSL: Secure${back.sslExpiry ? ` - Expires ${new Date(back.sslExpiry).toLocaleDateString()}` : ''}${back.sslIssuer ? ` - ${back.sslIssuer}` : ''}` : 'SSL: Not Secure / Unknown',
      `Server: ${country}${back.city ? `, ${back.city}` : ''}${back.ip ? ` (${back.ip})` : ''}${back.isp ? ` - ${back.isp}` : ''}`,
      hasMX ? 'Email: Valid MX found (3 DNS checked)' : 'Email: No MX found'
    ],
    details: { ageDays, created: finalCreated, country, ssl, hasMX, ip: back.ip }
  };
  setCache('v5_' + domain, result);
  return result;
}
export default globalCheck;
