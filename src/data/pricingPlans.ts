Update pricingPlans in this file to final global pricing:

1. PRO PLAN:
- monthly: { USD: '$4.99', INR: '₹149' }
- annual: { USD: '$3.99', INR: '₹99' }
- Keep all other Pro fields same - name, tagline, features, cta, highlighted, accent

2. ENTERPRISE PLAN:
- monthly: { USD: '$29', INR: '₹999' }
- Fix bug: INR was '$49' before, change it to '₹999'
- Keep annual: null, keep all other Enterprise fields same

3. FREE PLAN:
- Do NOT change anything - keep $0 / ₹0

4. Do NOT change:
- PlanId, PlanPrice, PricingPlan interfaces
- priceFor() function
- imports, features list, icons, accents

Reason: $4.99 is premium but affordable for foreign users, not too cheap to look low-quality. ₹149 / ₹99 is affordable for India. $29 / ₹999 is correct for Enterprise.

Return full updated file.
