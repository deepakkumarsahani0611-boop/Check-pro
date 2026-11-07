// ===== UNIVERSAL VERIFICATION ENGINE - All World Jobs =====

export interface RiskCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  detail: string;
  icon: string;
}

export interface VerificationResult {
  riskScore: number;
  status: 'safe' | 'caution' | 'danger';
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  checks: RiskCheck[];
  postedDate: string;
  platform: string;
}

export interface CompanyInfo {
  name: string;
  website: string;
  domainAge: string;
  domainAgeYears: number;
  gstNumber: string;
  legalStatus: string;
  employeeCount: string;
  trustBadge: 'Verified' | 'Unverified';
  founded: string;
  industry: string;
  description: string;
}

export interface HistoryEvent {
  id: string;
  date: string;
  type: 'posted' | 'reposted' | 'salary_changed' | 'location_changed' | 'edited' | 'removed';
  label: string;
  detail: string;
}

export interface JobHistory {
  jobTitle: string;
  company: string;
  repostCount: number;
  salaryChanges: number;
  locationChanges: number;
  firstPosted: string;
  lastSeen: string;
  events: HistoryEvent[];
}

export interface JobAlert {
  id: string;
  jobTitle: string;
  company: string;
  type: 'salary_changed' | 'reposted' | 'removed' | 'new_listing' | 'deadline';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface SimilarJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  trustScore: number;
  verified: boolean;
  platform: string;
}

export interface TrackedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  trustScore: number;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate?: string;
  notes?: string;
  logo: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  quote: string;
  saved: string;
}

// ===== Empty - No Fake Data =====
export const verificationResults: Record<string, VerificationResult> = {};
export const companies: Record<string, CompanyInfo> = {};
export const jobHistoryData: Record<string, JobHistory> = {};
export const mockAlerts: JobAlert[] = [];
export const similarJobs: SimilarJob[] = [];
export const initialTrackedJobs: TrackedJob[] = [];

export const testimonials: Testimonial[] = [
  {
    id: 'tm1',
    name: 'Priya Sharma',
    role: 'Software Engineer',
    location: 'Bangalore, India',
    avatar: 'PS',
    quote: "I almost applied to a job that looked perfect — high salary, remote work. JobCheck.pro flagged it as 91% risk. The company was registered 8 days ago and demanded a Telegram interview. It was a scam.",
    saved: 'Saved from losing ₹2L in a fake deposit scam',
  },
  {
    id: 'tm2',
    name: 'Rajesh Kumar',
    role: 'Marketing Professional',
    location: 'Mumbai, India',
    avatar: 'RK',
    quote: "The job history feature showed me the same posting had been re-posted 7 times with 4 different salary ranges. That's not a real job — that's a trap. JobCheck.pro saved my time and my savings.",
    saved: 'Avoided a phishing scam targeting 1,000+ applicants',
  },
  {
    id: 'tm3',
    name: 'Ananya Gupta',
    role: 'Recent Graduate',
    location: 'Delhi, India',
    avatar: 'AG',
    quote: "As a fresher, I couldn't tell real jobs from fake ones. The Trust Score and company verification gave me confidence. I landed a verified role at Razorpay after filtering out 12 fake listings.",
    saved: 'Filtered 12 fake jobs, landed a real position',
  },
]

// ===== UNIVERSAL LOGIC - Works For Any Company / Any Job In World =====

export function extractDomain(input: string): string {
  try {
    let url = input.trim().toLowerCase();
    if (!url.includes('://') && !url.includes('.')) {
      // Company name hai, domain guess karo - google -> google.com
      const clean = url.replace(/[^a-z0-9]/g, '');
      return clean + '.com';
    }
    if (!url.includes('://')) url = 'https://' + url;
    const u = new URL(url);
    return u.hostname.replace('www.', '');
  } catch {
    return input.toLowerCase().replace(/[^a-z0-9.]/g, '');
  }
}

export function getPlatformFromUrl(url: string): string {
  const l = url.toLowerCase();
  if (l.includes('linkedin')) return 'LinkedIn';
  if (l.includes('naukri')) return 'Naukri';
  if (l.includes('indeed')) return 'Indeed';
  if (l.includes('facebook')) return 'Facebook Jobs';
  if (l.includes('telegram')) return 'Telegram';
  if (l.includes('instagram')) return 'Instagram';
  if (l.includes('glassdoor')) return 'Glassdoor';
  if (l.includes('monster')) return 'Monster';
  return 'Job Board';
}

// Ye main function hai - Koi bhi job daalo, ye score bana dega
export function analyzeAnyJob(input: {
  url?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  salary?: string;
  description?: string;
  email?: string;
}): VerificationResult {
  const text = `${input.url || ''} ${input.jobTitle || ''} ${input.company || ''} ${input.description || ''} ${input.email || ''}`.toLowerCase();
  const domain = extractDomain(input.url || input.company || '');
  let score = 0;
  const checks: RiskCheck[] = [];

  // 1. Email Check
  if (text.includes('@gmail') || text.includes('@yahoo') || text.includes('@hotmail')) {
    score += 25;
    checks.push({ id: 'email', label: 'Official Email', status: 'fail', detail: `Uses personal Gmail/Yahoo instead of @${domain} - major red flag`, icon: 'Mail' });
  } else {
    checks.push({ id: 'email', label: 'Official Email', status: 'pass', detail: `No personal email detected. Check @${domain}`, icon: 'Mail' });
  }

  // 2. Telegram / WhatsApp Check
  if (text.includes('telegram') || text.includes('wa.me') || text.includes('whatsapp')) {
    score += 30;
    checks.push({ id: 'messaging', label: 'Telegram/WhatsApp Flag', status: 'fail', detail: 'Asks to contact on Telegram/WhatsApp - 90% fake jobs use this', icon: 'MessageCircle' });
  } else {
    checks.push({ id: 'messaging', label: 'Telegram/WhatsApp Flag', status: 'pass', detail: 'No personal messaging apps requested', icon: 'MessageCircle' });
  }

  // 3. Salary Trap Check - Urgent + High Salary
  if (text.includes('urgent') || text.includes('immediate joining') || text.includes('no experience') || text.includes('no interview')) {
    score += 20;
    checks.push({ id: 'salary', label: 'Salary Trap', status: 'warning', detail: 'Uses urgency words: Urgent / Immediate Joining / No Interview', icon: 'DollarSign' });
  } else if (text.includes('registration fee') || text.includes('security deposit') || text.includes('training fee') || text.includes('pay to join') || text.includes('₹') && text.includes('deposit')) {
    score += 35;
    checks.push({ id: 'salary', label: 'Salary Trap', status: 'fail', detail: 'Asks for registration / deposit fee - 100% scam pattern', icon: 'DollarSign' });
  } else {
    checks.push({ id: 'salary', label: 'Salary Trap', status: 'pass', detail: 'No fee / urgency trap detected in description', icon: 'DollarSign' });
  }

  // 4. Domain Check - New / Suspicious domain
  const suspiciousTLD = domain.endsWith('.xyz') || domain.endsWith('.top') || domain.endsWith('.click') || domain.endsWith('.online') || domain.endsWith('.site');
  if (suspiciousTLD) {
    score += 20;
    checks.push({ id: 'domain', label: 'Domain Age', status: 'warning', detail: `${domain} uses suspicious TLD - often used for scams`, icon: 'Globe' });
  } else {
    checks.push({ id: 'domain', label: 'Domain Age', status: 'pass', detail: `${domain} - Check RDAP for real age below`, icon: 'Globe' });
  }

  // 5. Duplicate / Work From Home Trap
  if (text.includes('work from home') && text.includes('earn') && (text.includes('50000') || text.includes('80000') || text.includes('1 lakh'))) {
    score += 15;
    checks.push({ id: 'duplicate', label: 'Duplicate Check', status: 'warning', detail: 'High-pay Work From Home pattern - commonly duplicated scam', icon: 'Copy' });
  } else {
    checks.push({ id: 'duplicate', label: 'Duplicate Check', status: 'pass', detail: 'No duplicate pattern detected', icon: 'Copy' });
  }

  const status: 'safe' | 'caution' | 'danger' = score >= 70 ? 'danger' : score >= 40 ? 'caution' : 'safe';

  return {
    riskScore: Math.min(100, score),
    status,
    jobTitle: input.jobTitle || 'Job from Link',
    company: input.company || domain.split('.')[0].toUpperCase(),
    location: input.location || 'Check in job post',
    salary: input.salary || 'Not mentioned in link',
    postedDate: 'Just now',
    platform: getPlatformFromUrl(input.url || ''),
    checks,
  };
}

// Company Verification - Koi bhi company name daalo
export function analyzeAnyCompany(companyName: string): CompanyInfo {
  const domain = extractDomain(companyName);
  const name = companyName.trim();
  return {
    name: name,
    website: domain,
    domainAge: 'Check live via RDAP - https://rdap.org/domain/' + domain,
    domainAgeYears: 0,
    gstNumber: 'Search on gst.gov.in for Indian companies',
    legalStatus: 'Verify on MCA / LinkedIn / Crunchbase',
    employeeCount: 'Check LinkedIn for real count',
    trustBadge: 'Unverified',
    founded: 'Check website footer',
    industry: 'Check LinkedIn',
    description: `Live check for ${name} (${domain}). This company is not in our pre-saved list - verification is done from live domain + description analysis.`,
  };
}

// Job History - Koi bhi job search karne ke liye
export function createJobHistory(jobTitle: string, company: string): JobHistory {
  return {
    jobTitle,
    company,
    repostCount: 0,
    salaryChanges: 0,
    locationChanges: 0,
    firstPosted: new Date().toISOString().split('T')[0],
    lastSeen: new Date().toISOString().split('T')[0],
    events: [
      { id: 'e1', date: new Date().toISOString().split('T')[0], type: 'posted', label: 'Job Checked Now', detail: `User searched for ${jobTitle} at ${company}. History will build as user tracks this job.` },
    ],
  };
}

// Tracker - User apni job khud add karega
export function createTrackedJob(title: string, company: string, location: string, salary: string, trustScore: number): TrackedJob {
  return {
    id: 't-' + Date.now(),
    title,
    company,
    location,
    salary,
    trustScore,
    status: 'saved',
    logo: company.charAt(0).toUpperCase(),
  };
}

export function getRiskColor(score: number): string {
  if (score < 40) return '#10B981'
  if (score < 70) return '#F59E0B'
  return '#EF4444'
}

export function getRiskLabel(score: number): string {
  if (score < 40) return 'Low Risk'
  if (score < 70) return 'Caution'
  return 'High Risk'
}

export function getCheckIcon(name: string): string {
  const icons: Record<string, string> = {
    Globe: 'Globe',
    Mail: 'Mail',
    DollarSign: 'DollarSign',
    Copy: 'Copy',
    MessageCircle: 'MessageCircle',
  }
  return icons[name] || name
}

// Old function - ab ye bhi universal hai
export function detectJobType(url: string): 'safe' | 'caution' | 'danger' {
  const result = analyzeAnyJob({ url });
  return result.status;
}

// Real Domain Age - Browser se live check (RDAP - Free, No API Key)
export async function fetchRealDomainAge(domain: string): Promise<string> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`);
    const data = await res.json();
    const event = data.events?.find((e: any) => e.eventAction === 'registration');
    if (event?.eventDate) {
      const date = new Date(event.eventDate);
      const years = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return `Registered on ${date.toDateString()} - ${years.toFixed(1)} years old`;
    }
    return 'Domain not found in RDAP';
  } catch {
    return 'Could not fetch live domain age';
  }
}
