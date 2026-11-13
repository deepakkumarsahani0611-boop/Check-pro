FINAL PROMPT - V20 PRO GLOBAL - 100% REAL - 0% DUMMY - 0% SELECTED DATA - LOCKED

GOAL: Build a Global Professional Domain / Company / Job Verification System.
No dummy, no selected data, no hardcoded fake trust. Only live API data or Unknown.

GLOBAL RULES - KABHI MAT TODNA:
1. No data = null / "Unknown". Kabhi false, 0, "", "Not Disclosed", "Worldwide", "Full-time", "Remote", "Highly Trusted", "Verified" mat likhna.
2. Unknown != Fake. Fake sirf 2 proof pe:
   (A) Typo-squat proof - Levenshtein == 1 + Homoglyph check
   (B) SSL === false AND ageDays !== null AND ageDays < 90
3. Low score != Fake. Score sirf apna calculation hai, API fact nahi hai.
   label = allUnknown ? "CAUTION" : score>=70 ? "SAFE" : score>=40 ? "CAUTION" : "UNKNOWN - Insufficient Data"
   DANGER sirf Typo pe. UI me kabhi `if(score<40) FAKE` mat likhna.
4. Domain guess BANNED. Company ka domain BRANDS map me nahi hai to verdict = "UNKNOWN - Cannot Verify", score: null. Kabhi `${name}.com` mat banana.
5. Job board pe job nahi mili = INFO only, red flag nahi hai. Remotive / Arbeitnow sirf remote jobs cover karte hai, duniya ki saari jobs nahi.
6. BRANDS map sirf Typo reference ke liye hai, whitelist nahi hai. List me nahi hai to matlab Fake nahi hai, matlab Live API se verify karo.
7. Har value ke saath source dikhao: "crt.sh", "RDAP", "Live TLS", "dns.google". Source ke bina koi value mat dikhao.
8. Har API call me timeout + AbortController + Promise.allSettled / Promise.any use karo. Ek API fail ho to pura app fail nahi hona chahiye.
9. Cache max 5 min. Cache me kabhi Fake / SAFE hardcode mat karo.
10. TypeScript strict: `any` ka use minimum rakho, har function ka return type defined ho. `console.log` me user ka domain / link mat bhejo.

FILE 1 - src/lib/worldCheck.ts - V20 PRO:
- getRootDomain(): DOUBLE_SUFFIX handle karo: co.in, co.uk, com.au, com.br, co.jp, co.kr, com.mx, com.sg, org.uk, ac.in, gov.in, co.za, com.tr, com.pl, com.ar, co.nz, com.hk. Subdomain hatao, root domain nikalo.
- normalizeHomoglyph(): Cyrillic + 0->o, 1->l, rn->m, vv->w, cl->d.
- checkTypo(): distance == 1 pe hi Typo. distance == 2 ya prefix-match pe Typo mat bolna, wo false-positive deta hai.
- verifyCompanyReal(input):
  ssl = res.ssl === true ? true : res.ssl === false ? false : null
  created = res.created || null
  ageDays = created ? floor((now - created)/86400000) : null
  country = res.country || "Unknown", ip = res.ip || "Unknown", registrar = res.registrar || "Unknown"
  issuer = res.sslIssuer || "Unknown"
- searchJobsWorldwide(query): Sirf Remotive + Arbeitnow se. Jo API deta hai wahi return karo. location, salary, type null ho to null hi rakho, guess mat karo. Sort by posted date desc.
- checkLinkReal(link): verdict = isTypo ? "FAKE - TYPO-SQUAT" : score>=70 ? "SAFE - Real Company" : score>=40 ? "SUSPICIOUS" : "UNKNOWN - Insufficient Data"
- checkFakeJobReal(jobTitle, companyName): knownDomain nahi mila to { verdict: "UNKNOWN - Cannot Verify", score: null, companyCheck: null }. isFake = isTypo || (ssl===false && ageDays!==null && ageDays<90)

FILE 2 - api/check.js - V12.1 PRO:
- SSL: 1st Live TLS handshake (tls.connect 443, rejectUnauthorized:false). Fail ho to crt.sh + certspotter race. No data = ssl: null, sslIssuer: null, sslExpiry: null.
- DNS: dns.resolve4 -> dns.google -> cloudflare-dns race. No data = ip: null.
- GEO: ipwho.is -> ipapi.co -> ip-api.com -> freeipapi race. No data = country: null, city: null, isp: null.
- RDAP: IANA bootstrap https://data.iana.org/rdap/dns.json se TLD ke hisab se base URL lo, hardcoded list mat rakho. Fir rdap.org fallback. No data = created: null, registrar: null.
- CRITICAL FIX 1: Return me typo aise bhejo: typo: typoCheck.isTypo ? typoCheck.realBrand : null
  Poora object {isTypo:false...} kabhi mat bhejna, frontend me `if(res.typo)` hamesha true ho jata hai.
- CRITICAL FIX 2: realBrand = REAL_DOMAINS[brand] || brand+'.com'
  REAL_DOMAINS = { sbi:"sbi.co.in", irctc:"irctc.co.in", phonepe:"phonepe.com", paytm:"paytm.com", hdfcbank:"hdfcbank.com", icicibank:"icicibank.com", axisbank:"axisbank.com", zerodha:"zerodha.com", flipkart:"flipkart.com", makemytrip:"makemytrip.com" }
- Return sirf ye fields: { domain, ssl, sslExpiry, sslIssuer, sslSource, ip, ipSource, country, countryCode, city, isp, geoSource, created, registrar, rdapSource, typo, checkedAt, version }
- Kabhi score, ageDays, reasons, "99% Fake", "Highly Trusted" backend se mat bhejna.
- Headers: Access-Control-Allow-Origin: *, Cache-Control: no-store. Har request ka elapsedMs log karo, user ko mat dikhao.

FILE 3 - UI - Global Professional:
- Design: Clean, minimal, global standard. Har result me Domain, SSL, Age, Country, Registrar, IP, Score, Label, Source dikhao.
- Logic:
  if (isTypo) -> RED badge "FAKE - TYPO-SQUAT" + "Official site: {realBrand} - Open only that"
  else if (label==="SAFE") -> GREEN badge "SAFE - Real Company"
  else if (label==="CAUTION") -> YELLOW badge "CAUTION"
  else -> GREY badge "UNKNOWN - Insufficient Data"
- Value null ho to UI me "Unknown" dikhao, "0 days", "No SSL", "-" mat dikhao.
- Har card ke neeche likho: "Source: {source} | Checked at: {checkedAt} | If data is Unknown, it means live API gave no data, not Fake."
- Loading state, Error state, Empty state alag se banao. Error pe "FAKE" mat dikhana, "Could not verify - Try again" dikhana.

TEST CASES - SAB PASS HONE CHAHIYE, EK BHI FAIL TO 100% NAHI HAI:
- phonepe.com -> SAFE
- irctc.co.in -> SAFE
- netflix.com -> SAFE
- google.com -> SAFE
- paytmm.com -> FAKE - TYPO-SQUAT, Official: paytm.com
- googgle.com -> FAKE - TYPO-SQUAT
- paytm.com + age 10 din + SSL false (test mock) -> FAKE / HIGH RISK
- koi random domain jiska API data nahi de raha -> UNKNOWN - Insufficient Data, FAKE nahi
- koi company jo BRANDS me nahi hai, jaise "Local Sharma Store" -> UNKNOWN - Cannot Verify
- jobTitle = "Data Entry" company = "Unknown Pvt Ltd" -> UNKNOWN - Cannot Verify, job board me nahi mila to red flag nahi
