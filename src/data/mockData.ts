// ===== Types =====

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

// ===== Mock Data =====

export const verificationResults: Record<string, VerificationResult> = {
  safe: {
    riskScore: 12,
    status: 'safe',
    jobTitle: 'Senior Frontend Engineer',
    company: 'Vercel Inc.',
    location: 'Remote (Global)',
    salary: '$140k - $180k',
    postedDate: '2 days ago',
    platform: 'LinkedIn',
    checks: [
      { id: 'domain', label: 'Domain Age', status: 'pass', detail: 'vercel.com registered 11 years ago', icon: 'Globe' },
      { id: 'email', label: 'Official Email', status: 'pass', detail: 'Careers@vercel.com matches domain', icon: 'Mail' },
      { id: 'salary', label: 'Salary Trap', status: 'pass', detail: 'Salary range matches industry standard', icon: 'DollarSign' },
      { id: 'duplicate', label: 'Duplicate Check', status: 'pass', detail: 'No duplicate listings found', icon: 'Copy' },
      { id: 'messaging', label: 'Telegram/WhatsApp Flag', status: 'pass', detail: 'No personal messaging apps requested', icon: 'MessageCircle' },
    ],
  },
  caution: {
    riskScore: 58,
    status: 'caution',
    jobTitle: 'Data Entry Specialist',
    company: 'QuickHire Solutions',
    location: 'Work from Home',
    salary: '$45k - $60k',
    postedDate: '5 hours ago',
    platform: 'Naukri',
    checks: [
      { id: 'domain', label: 'Domain Age', status: 'warning', detail: 'Domain registered 4 months ago', icon: 'Globe' },
      { id: 'email', label: 'Official Email', status: 'fail', detail: 'Uses Gmail address instead of company domain', icon: 'Mail' },
      { id: 'salary', label: 'Salary Trap', status: 'warning', detail: 'Salary above market average for this role', icon: 'DollarSign' },
      { id: 'duplicate', label: 'Duplicate Check', status: 'pass', detail: 'No duplicates found', icon: 'Copy' },
      { id: 'messaging', label: 'Telegram/WhatsApp Flag', status: 'warning', detail: 'Requests WhatsApp contact in description', icon: 'MessageCircle' },
    ],
  },
  danger: {
    riskScore: 91,
    status: 'danger',
    jobTitle: 'Marketing Executive - Urgent Hiring',
    company: 'Global Digital Corp',
    location: 'Remote - High Pay',
    salary: '$80k - $120k',
    postedDate: '1 hour ago',
    platform: 'Facebook Jobs',
    checks: [
      { id: 'domain', label: 'Domain Age', status: 'fail', detail: 'Domain registered 8 days ago', icon: 'Globe' },
      { id: 'email', label: 'Official Email', status: 'fail', detail: 'No official email found — Gmail only', icon: 'Mail' },
      { id: 'salary', label: 'Salary Trap', status: 'fail', detail: 'Salary 3x above market rate — classic bait', icon: 'DollarSign' },
      { id: 'duplicate', label: 'Duplicate Check', status: 'fail', detail: 'Same posting found on 7 different boards', icon: 'Copy' },
      { id: 'messaging', label: 'Telegram/WhatsApp Flag', status: 'fail', detail: 'Requires Telegram interview — major red flag', icon: 'MessageCircle' },
    ],
  },
};

export const companies: Record<string, CompanyInfo> = {
  vercel: {
    name: 'Vercel Inc.',
    website: 'vercel.com',
    domainAge: '11 years, 3 months',
    domainAgeYears: 11,
    gstNumber: 'Not applicable (US entity)',
    legalStatus: 'Delaware C-Corporation — Active',
    employeeCount: '500-1000',
    trustBadge: 'Verified',
    founded: '2015',
    industry: 'Cloud Infrastructure / Developer Tools',
    description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
  },
  google: {
    name: 'Google LLC',
    website: 'google.com',
    domainAge: '27 years, 6 months',
    domainAgeYears: 27,
    gstNumber: 'Not applicable (US entity)',
    legalStatus: 'Delaware C-Corporation — Active',
    employeeCount: '180,000+',
    trustBadge: 'Verified',
    founded: '1998',
    industry: 'Technology / Search / Cloud',
    description: 'Google LLC is a multinational technology company specializing in internet-related services and products.',
  },
  quickhire: {
    name: 'QuickHire Solutions',
    website: 'quickhiresolutions.com',
    domainAge: '4 months, 12 days',
    domainAgeYears: 0,
    gstNumber: 'GSTIN not found',
    legalStatus: 'Unregistered — No public records',
    employeeCount: 'Unknown',
    trustBadge: 'Unverified',
    founded: '2024',
    industry: 'Unknown',
    description: 'No verifiable information found. Domain is recently registered with no public business records.',
  },
  Razorpay: {
    name: 'Razorpay Software Pvt. Ltd.',
    website: 'razorpay.com',
    domainAge: '10 years, 1 month',
    domainAgeYears: 10,
    gstNumber: '29AALCR0552P1ZJ',
    legalStatus: 'Private Limited — Active (CIN: U72200KA2014PTC073772)',
    employeeCount: '2000-5000',
    trustBadge: 'Verified',
    founded: '2014',
    industry: 'Fintech / Payment Processing',
    description: 'Razorpay is a full-stack financial solutions company offering payment processing, banking, and lending products.',
  },
};

export const jobHistoryData: Record<string, JobHistory> = {
  safe: {
    jobTitle: 'Senior Frontend Engineer',
    company: 'Vercel Inc.',
    repostCount: 0,
    salaryChanges: 1,
    locationChanges: 0,
    firstPosted: '2024-10-15',
    lastSeen: '2024-10-21',
    events: [
      { id: 'e1', date: '2024-10-15', type: 'posted', label: 'Job Posted', detail: 'Original listing on LinkedIn. Salary: $130k-$170k' },
      { id: 'e2', date: '2024-10-18', type: 'salary_changed', label: 'Salary Updated', detail: 'Salary range adjusted to $140k-$180k (market correction)' },
      { id: 'e3', date: '2024-10-21', type: 'edited', label: 'Description Updated', detail: 'Added remote work policy clarification' },
    ],
  },
  caution: {
    jobTitle: 'Data Entry Specialist',
    company: 'QuickHire Solutions',
    repostCount: 3,
    salaryChanges: 2,
    locationChanges: 1,
    firstPosted: '2024-09-28',
    lastSeen: '2024-10-21',
    events: [
      { id: 'e1', date: '2024-09-28', type: 'posted', label: 'Job Posted', detail: 'Original listing. Salary: $35k-$45k. Location: Bangalore' },
      { id: 'e2', date: '2024-10-02', type: 'reposted', label: 'Reposted (1st)', detail: 'Listing deleted and re-posted on same board' },
      { id: 'e3', date: '2024-10-05', type: 'salary_changed', label: 'Salary Increased', detail: 'Salary raised to $45k-$60k (unusual for data entry)' },
      { id: 'e4', date: '2024-10-09', type: 'reposted', label: 'Reposted (2nd)', detail: 'Re-posted on 3 different job boards simultaneously' },
      { id: 'e5', date: '2024-10-14', type: 'location_changed', label: 'Location Changed', detail: 'Changed from Bangalore to Work from Home' },
      { id: 'e6', date: '2024-10-18', type: 'reposted', label: 'Reposted (3rd)', detail: 'Re-posted again with "Urgent Hiring" tag' },
      { id: 'e7', date: '2024-10-21', type: 'edited', label: 'Description Modified', detail: 'Added WhatsApp contact requirement' },
    ],
  },
  danger: {
    jobTitle: 'Marketing Executive - Urgent Hiring',
    company: 'Global Digital Corp',
    repostCount: 7,
    salaryChanges: 4,
    locationChanges: 3,
    firstPosted: '2024-10-01',
    lastSeen: '2024-10-23',
    events: [
      { id: 'e1', date: '2024-10-01', type: 'posted', label: 'Job Posted', detail: 'Original listing on Facebook Jobs. Salary: $50k-$70k' },
      { id: 'e2', date: '2024-10-03', type: 'reposted', label: 'Reposted (1st)', detail: 'Re-posted with different company name' },
      { id: 'e3', date: '2024-10-05', type: 'salary_changed', label: 'Salary Increased', detail: 'Salary jumped to $80k-$120k — 2x original' },
      { id: 'e4', date: '2024-10-07', type: 'reposted', label: 'Reposted (2nd)', detail: 'Posted on 5 boards at once with different titles' },
      { id: 'e5', date: '2024-10-10', type: 'location_changed', label: 'Location Changed', detail: 'Changed city 3 times in one week' },
      { id: 'e6', date: '2024-10-13', type: 'reposted', label: 'Reposted (3rd)', detail: 'Re-posted with "Immediate Joining" urgency' },
      { id: 'e7', date: '2024-10-16', type: 'salary_changed', label: 'Salary Changed Again', detail: 'Salary changed for the 4th time — $90k-$150k' },
      { id: 'e8', date: '2024-10-19', type: 'reposted', label: 'Reposted (7th)', detail: 'Found on 7 different platforms with 7 different salaries' },
      { id: 'e9', date: '2024-10-23', type: 'edited', label: 'Telegram Added', detail: 'Added Telegram interview requirement' },
    ],
  },
};

export const mockAlerts: JobAlert[] = [
  { id: 'a1', jobTitle: 'Data Entry Specialist', company: 'QuickHire Solutions', type: 'salary_changed', message: 'Salary changed from $45k to $60k — 33% increase is suspicious', timestamp: '12 min ago', severity: 'warning' },
  { id: 'a2', jobTitle: 'Frontend Developer', company: 'TechStart Inc.', type: 'reposted', message: 'Job reposted after only 2 days — typical fake pattern', timestamp: '1 hour ago', severity: 'danger' },
  { id: 'a3', jobTitle: 'Product Manager', company: 'Stripe', type: 'new_listing', message: 'New matching job found on LinkedIn', timestamp: '3 hours ago', severity: 'info' },
  { id: 'a4', jobTitle: 'Marketing Executive', company: 'Global Digital Corp', type: 'removed', message: 'Listing removed after being flagged by 15 users', timestamp: '5 hours ago', severity: 'danger' },
  { id: 'a5', jobTitle: 'Senior Backend Engineer', company: 'Razorpay', type: 'deadline', message: 'Application deadline approaching in 2 days', timestamp: '1 day ago', severity: 'info' },
];

export const similarJobs: SimilarJob[] = [
  { id: 'sj1', title: 'Frontend Engineer', company: 'Razorpay', location: 'Bangalore, India', salary: '$35k-$50k', trustScore: 94, verified: true, platform: 'LinkedIn' },
  { id: 'sj2', title: 'React Developer', company: 'Vercel Inc.', location: 'Remote (Global)', salary: '$130k-$170k', trustScore: 97, verified: true, platform: 'Company Site' },
  { id: 'sj3', title: 'UI Engineer', company: 'Google', location: 'Hyderabad, India', salary: '$45k-$70k', trustScore: 96, verified: true, platform: 'LinkedIn' },
]

export const initialTrackedJobs: TrackedJob[] = [
  { id: 't1', title: 'Senior Frontend Engineer', company: 'Vercel Inc.', location: 'Remote', salary: '$140k-$180k', trustScore: 88, status: 'saved', logo: 'V' },
  { id: 't2', title: 'Product Designer', company: 'Stripe', location: 'San Francisco', salary: '$120k-$160k', trustScore: 92, status: 'applied', appliedDate: 'Oct 18', logo: 'S' },
  { id: 't3', title: 'Backend Engineer', company: 'Razorpay', location: 'Bangalore', salary: '$30k-$45k', trustScore: 90, status: 'interview', appliedDate: 'Oct 10', notes: 'Technical round on Oct 25', logo: 'R' },
  { id: 't4', title: 'Full Stack Developer', company: 'Google', location: 'Hyderabad', salary: '$50k-$75k', trustScore: 95, status: 'offer', appliedDate: 'Sep 28', notes: 'Offer received! Negotiating', logo: 'G' },
  { id: 't5', title: 'Data Analyst', company: 'QuickHire Solutions', location: 'Remote', salary: '$45k-$60k', trustScore: 42, status: 'rejected', logo: 'Q' },
]

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

// ===== Utilities =====

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

export function detectJobType(url: string): 'safe' | 'caution' | 'danger' {
  const lower = url.toLowerCase()
  if (lower.includes('telegram') || lower.includes('wa.me') || lower.includes('facebook') || lower.includes('urgent')) {
    return 'danger'
  }
  if (lower.includes('naukri') || lower.includes('quickhire') || lower.includes('workfromhome') || lower.includes('data-entry')) {
    return 'caution'
  }
  return 'safe'
}
