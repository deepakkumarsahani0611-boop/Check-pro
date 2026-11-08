// src/lib/worldCheck.ts - 100% REAL, NO DUMMY
const cleanDomain = (input: string) => {
  try {
    const url = input.includes('://') ? input : `https://${input}`;
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch { return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase(); }
};

export async function verifyCompanyReal(input: string) {
  const domain = cleanDomain(input);
  const [sslRes, rdapRes, dnsRes] = await Promise.allSettled([
    fetch(`https://crt.sh/?q=${domain}&output=json`).then(r => r.json()),
    fetch(`https://rdap.org/domain/${domain}`).then(r => r.json()),
    fetch(`https://dns.google/resolve?name=${domain}&type=A`).then(r => r.json()),
  ]);
  const certs: any[] = sslRes.status === 'fulfilled' ? sslRes.value : [];
  const validCert = certs.filter((c: any) => new Date(c.not_after) > new Date());
  const ssl = validCert.length > 0;
  const issuer = validCert[0]?.issuer_name || 'Unknown';
  const rdap: any = rdapRes.status === 'fulfilled' ? rdapRes.value : null;
  const createdEv = rdap?.events?.find((e: any) => e.eventAction === 'registration');
  const created = createdEv ? createdEv.eventDate.split('T')[0] : null;
  const ageDays = created ? Math.floor((Date.now() - new Date(created).getTime()) / 86400000) : null;
  const ip = dnsRes.status === 'fulfilled' ? (dnsRes.value as any)?.Answer?.find((a: any) => a.type === 1)?.data : null;
  let country = 'Unknown';
  if (ip) {
    try {
      const loc = await fetch(`https://ip-api.com/json/${ip}?fields=country,city,isp`).then(r => r.json());
      country = `${loc.country || 'Unknown'} - ${loc.city || ''} (${loc.isp || ''})`;
    } catch {}
  }
  let score = 0;
  if (ssl) score += 40;
  if (ageDays !== null) score += ageDays > 3650 ? 40 : ageDays > 1000 ? 30 : ageDays > 180 ? 20 : 5;
  if (country !== 'Unknown') score += 20;
  return { domain, company: domain.split('.')[0], ssl, issuer, created, ageDays, country, ip: ip || 'Unknown', score, label: score >= 75 ? 'Verified' : score >= 40 ? 'Suspicious' : 'Not Verified', isReal: true };
}

export async function searchJobsWorldwide(query: string) {
  const results: any[] = [];
  try {
    const r = await fetch(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=20`).then(r => r.json());
    (r.jobs || []).forEach((j: any) => results.push({ title: j.title, company: j.company_name, location: j.candidate_required_location || 'Worldwide', url: j.url, type: j.job_type || 'Full-time', source: 'Remotive - Real', posted: j.publication_date, salary: j.salary || 'Not Disclosed', isReal: true }));
  } catch {}
  try {
    const r = await fetch(`https://www.arbeitnow.com/api/job-board-api`).then(r => r.json());
    (r.data || []).filter((j: any) => (j.title + j.company_name).toLowerCase().includes(query.toLowerCase())).slice(0, 20).forEach((j: any) => results.push({ title: j.title, company: j.company_name, location: j.location || 'Worldwide', url: j.url, type: j.job_types?.join(', ') || 'Full-time', source: 'Arbeitnow - Real', posted: j.created_at, salary: 'Not Disclosed', isReal: true }));
  } catch {}
  return results;
}

export async function checkLinkReal(link: string) {
  const domain = cleanDomain(link);
  const company = await verifyCompanyReal(domain);
  const isFake = !company.ssl && (company.ageDays !== null && company.ageDays < 90);
  return { ...company, link, isSafe: !isFake, verdict: company.score >= 75 ? 'SAFE - Real Company' : company.score >= 40 ? 'SUSPICIOUS' : 'UNSAFE / FAKE', isReal: true };
}

export async function checkFakeJobReal(jobTitle: string, companyName: string) {
  const domainGuess = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  const company = await verifyCompanyReal(domainGuess);
  const jobs = await searchJobsWorldwide(jobTitle);
  const foundInRealAPI = jobs.some((j: any) => j.company.toLowerCase().includes(companyName.toLowerCase()));
  const redFlags: string[] = [];
  if (!company.ssl) redFlags.push('Company ka SSL valid nahi hai');
  if (company.ageDays !== null && company.ageDays < 180) redFlags.push(`Domain sirf ${company.ageDays} din purana hai`);
  if (!foundInRealAPI) redFlags.push('Ye job real job boards me nahi mili');
  if (jobTitle.toLowerCase().includes('telegram') || jobTitle.toLowerCase().includes('whatsapp only')) redFlags.push('Telegram/WhatsApp only job = 99% Fake');
  const isFake = redFlags.length >= 2 || company.score < 40;
  return { jobTitle, company: companyName, companyCheck: company, foundInRealAPI, redFlags, verdict: isFake ? 'FAKE / HIGH RISK' : redFlags.length === 1 ? 'SUSPICIOUS' : 'LIKELY REAL', score: company.score, isReal: true };
}
