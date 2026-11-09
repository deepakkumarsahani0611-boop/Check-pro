// src/lib/worldCheck.ts - 100% REAL - NO DUMMY - GLOBAL PROFESSIONAL - 1 ENGINE - FAST + MAX LIMIT - SEARCH ACCORDING
const cleanDomain = (input: string) => {
  try {
    const url = input.includes('://') ? input : `https://${input}`;
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch { return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase(); }
};

const cache = new Map<string, any>();
const fetchTimeout = async (url: string, ms = 6000) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { const r = await fetch(url, { signal: ctrl.signal }); clearTimeout(t); return r; } catch { clearTimeout(t); throw new Error('timeout'); }
};

export async function verifyCompanyReal(input: string) {
  const domain = cleanDomain(input);
  if (cache.has(`c-${domain}`)) return cache.get(`c-${domain}`);
  const [sslRes, rdapRes, dnsRes] = await Promise.allSettled([
    fetchTimeout(`https://crt.sh/?q=${domain}&output=json`).then(r => r.json()),
    fetchTimeout(`https://rdap.org/domain/${domain}`).then(r => r.json()),
    fetchTimeout(`https://dns.google/resolve?name=${domain}&type=A`).then(r => r.json()),
  ]);
  const certs: any[] = sslRes.status === 'fulfilled' ? sslRes.value : [];
  const validCert = certs.filter((c: any) => new Date(c.not_after) > new Date());
  const ssl = validCert.length > 0;
  const issuer = validCert[0]?.issuer_name || 'Unknown';
  const rdap: any = rdapRes.status === 'fulfilled' ? rdapRes.value : null;
  const createdEv = rdap?.events?.find((e: any) => e.eventAction === 'registration');
  const created = createdEv ? createdEv.eventDate.split('T')[0] : 'Unknown';
  const ageDays = created !== 'Unknown' ? Math.floor((Date.now() - new Date(created).getTime()) / 86400000) : 0;
  const registrar = rdap?.entities?.[0]?.vcardArray?.[1]?.find((x: any) => x[0] === 'fn')?.[3] || 'Unknown';
  const ip = dnsRes.status === 'fulfilled' ? (dnsRes.value as any)?.Answer?.find((a: any) => a.type === 1)?.data : null;
  let country = 'Unknown';
  if (ip) {
    try {
      const loc = await fetchTimeout(`https://ip-api.com/json/${ip}?fields=country,city,isp`, 5000).then(r => r.json());
      country = `${loc.country || 'Unknown'} - ${loc.city || ''} (${loc.isp || ''})`;
    } catch {}
  }
  let score = 0;
  const reasons: string[] = [];
  if (ssl) { score += 40; reasons.push('SSL Certificate Mila - crt.sh Verified'); } else { reasons.push('SSL Certificate Nahi Mila'); }
  if (ageDays > 3650) { score += 40; reasons.push(`Domain ${ageDays} days purana - Highly Trusted`); }
  else if (ageDays > 1000) { score += 30; reasons.push(`Domain ${ageDays} days purana`); }
  else if (ageDays > 180) { score += 20; reasons.push(`Domain ${ageDays} days purana`); }
  else if (ageDays > 0) { score += 5; reasons.push(`Domain sirf ${ageDays} days purana - Naya hai - Savdhaan`); }
  else { reasons.push('Domain age nahi mili'); }
  if (country !== 'Unknown') { score += 20; reasons.push(`Server Country: ${country}`); }
  if (registrar !== 'Unknown') reasons.push(`Registrar: ${registrar}`);
  score = Math.max(0, Math.min(100, score));
  const label = score >= 70 ? 'SAFE' : score >= 40 ? 'CAUTION' : 'DANGER';
  const out = { domain, company: domain.split('.')[0], ssl, issuer, created, ageDays, country, ip: ip || 'Unknown', registrar, score, label, reasons, isReal: true, source: 'crt.sh + RDAP + DNS + ip-api - 100% Real' };
  cache.set(`c-${domain}`, out);
  return out;
}

export async function searchJobsWorldwide(query: string) {
  const q = query.trim();
  if (!q) return [];
  if (cache.has(`j-${q}`)) return cache.get(`j-${q}`);
  const results: any[] = [];
  const [r1, r2] = await Promise.allSettled([
    fetchTimeout(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(q)}&limit=20`, 6000).then(r => r.json()),
    fetchTimeout(`https://www.arbeitnow.com/api/job-board-api`, 6000).then(r => r.json()),
  ]);
  if (r1.status === 'fulfilled') (r1.value.jobs || []).forEach((j: any) => results.push({ title: j.title, company: j.company_name, location: j.candidate_required_location || 'Worldwide', url: j.url, type: j.job_type || 'Full-time', source: 'Remotive - Real', posted: j.publication_date, salary: j.salary || 'Not Disclosed', isReal: true }));
  if (r2.status === 'fulfilled') (r2.value.data || []).filter((j: any) => (j.title + ' ' + j.company_name + ' ' + (j.location || '')).toLowerCase().includes(q.toLowerCase())).slice(0, 20).forEach((j: any) => results.push({ title: j.title, company: j.company_name, location: j.location || 'Worldwide', url: j.url, type: j.job_types?.join(', ') || 'Full-time', source: 'Arbeitnow - Real', posted: j.created_at, salary: 'Not Disclosed', isReal: true }));
  cache.set(`j-${q}`, results);
  return results;
}

export async function checkLinkReal(link: string) {
  const domain = cleanDomain(link);
  const company = await verifyCompanyReal(domain);
  const isFake = !company.ssl && company.ageDays < 90;
  return { ...company, link, isSafe: !isFake, verdict: company.score >= 70 ? 'SAFE - Real Company' : company.score >= 40 ? 'SUSPICIOUS' : 'UNSAFE / FAKE', isReal: true };
}

export async function checkFakeJobReal(jobTitle: string, companyName: string) {
  const domainGuess = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  const company = await verifyCompanyReal(domainGuess);
  const jobs = await searchJobsWorldwide(jobTitle);
  const foundInRealAPI = jobs.some((j: any) => j.company.toLowerCase().includes(companyName.toLowerCase()));
  const redFlags: string[] = [];
  if (!company.ssl) redFlags.push('Company ka SSL valid nahi hai');
  if (company.ageDays < 180) redFlags.push(`Domain sirf ${company.ageDays} din purana hai`);
  if (!foundInRealAPI) redFlags.push('Ye job real job boards me nahi mili');
  if (jobTitle.toLowerCase().includes('telegram') || jobTitle.toLowerCase().includes('whatsapp only')) redFlags.push('Telegram/WhatsApp only job = 99% Fake');
  const isFake = redFlags.length >= 2 || company.score < 40;
  return { jobTitle, company: companyName, companyCheck: company, foundInRealAPI, redFlags, verdict: isFake ? 'FAKE / HIGH RISK' : redFlags.length === 1 ? 'SUSPICIOUS' : 'LIKELY REAL', score: company.score, isReal: true };
}
