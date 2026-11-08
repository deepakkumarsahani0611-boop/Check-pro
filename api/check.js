// api/check.js - V5 100% - NO FAKE
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const domain = (req.query.domain || '').toString().trim().toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0];
  if (!domain) return res.status(400).json({ error: 'no domain' });
  let ssl = null, sslExpiry = null, sslIssuer = null;
  try {
    const tls = await import('tls');
    await new Promise((resolve) => {
      const socket = tls.connect(443, domain, { servername: domain, timeout: 5000 }, () => {
        try { const cert = socket.getPeerCertificate(); if (cert?.valid_to) { ssl = new Date(cert.valid_to) > new Date(); sslExpiry = cert.valid_to; sslIssuer = cert.issuer?.O || cert.issuer?.CN || null; } } catch {}
        socket.end(); resolve(true);
      });
      socket.setTimeout(5000, () => { try{ socket.destroy(); }catch{} resolve(true); });
      socket.on('error', () => resolve(true));
    });
  } catch {}
  if (ssl === null) {
    try { const r = await fetch(`https://crt.sh/?q=${domain}&output=json`); const j = await r.json(); if (Array.isArray(j) && j.length > 0) { const l = j.sort((a,b)=> new Date(b.not_after)-new Date(a.not_after))[0]; if (l?.not_after) { ssl = new Date(l.not_after) > new Date(); sslExpiry = l.not_after; sslIssuer = l.issuer_name || sslIssuer; } } } catch {}
  }
  if (ssl === null) ssl = false;
  let ip = null;
  try {
    const dns = await import('dns/promises');
    try { const a = await dns.resolve4(domain); if (a?.[0]) ip = a[0]; } catch {}
    if (!ip) { try { const r = await fetch(`https://dns.google/resolve?name=${domain}&type=A`); const j = await r.json(); if (j?.Answer?.[0]?.data) ip = j.Answer[0].data; } catch {} }
    if (!ip) { try { const r = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, { headers: { accept: 'application/dns-json' } }); const j = await r.json(); if (j?.Answer?.[0]?.data) ip = j.Answer[0].data; } catch {} }
  } catch {}
  let country = 'Unknown', city = null, isp = null;
  if (ip) {
    const geos = [
      async () => { const r = await fetch(`https://ipwho.is/${ip}`); const j = await r.json(); return j?.country ? { country: j.country, city: j.city, isp: j.connection?.isp } : null; },
      async () => { const r = await fetch(`https://ipapi.co/${ip}/json/`); const j = await r.json(); return j?.country_name ? { country: j.country_name, city: j.city, isp: j.org } : null; },
      async () => { const r = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,isp`); const j = await r.json(); return j?.country ? { country: j.country, city: j.city, isp: j.isp } : null; },
      async () => { const r = await fetch(`https://ipinfo.io/${ip}/json`); const j = await r.json(); return j?.country ? { country: j.country, city: j.city, isp: j.org } : null; },
      async () => { const r = await fetch(`https://freeipapi.com/api/json/${ip}`); const j = await r.json(); return j?.countryName ? { country: j.countryName, city: j.cityName, isp: j.isp } : null; },
    ];
    for (const fn of geos) { try { const g = await fn(); if (g?.country) { country = g.country; city = g.city || city; isp = g.isp || isp; break; } } catch {} }
  }
  let created = null;
  const rdaps = [`https://rdap.org/domain/${domain}`, `https://rdap.verisign.com/com/v1/domain/${domain}`, `https://rdap.verisign.com/net/v1/domain/${domain}`, `https://who-dat.net/api/v1/${domain}`, `https://rdap.db.ripe.net/domain/${domain}`, `https://rdap.apnic.net/domain/${domain}`];
  for (const u of rdaps) { try { const r = await fetch(u, { headers: { accept: 'application/json' } }); if (!r.ok) continue; const j = await r.json(); const ev = j?.events?.find((x)=> x.eventAction === 'registration'); if (ev?.eventDate) { created = ev.eventDate; break; } if (j?.created) { created = j.created; break; } if (j?.creation_date) { created = j.creation_date; break; } } catch {} }
  return res.status(200).json({ domain, ssl, sslExpiry, sslIssuer, ip, country, city, isp, created, checkedAt: new Date().toISOString() });
}
