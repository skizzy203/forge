# Forge — Mental Model Catalog

The 40 models the optimize skill draws from. Each entry includes the prompt kernel applied during chain execution, the relevance scoring data the optimizer uses for adaptive selection, and the causal-chain dependencies that constrain ordering.

## How scoring works

For each model, the optimize skill computes a runtime score:

```
score = base_relevance × subtractive_weight × bcd_multiplier × market_multiplier × phase_multiplier
```

- **base_relevance** (1–3) — how universally applicable to business optimization
- **subtractive_weight** — 1.5 if model is subtractive class (its primary mechanism is removing elements), else 1.0
- **bcd_multiplier** — 1.0 baseline; boosted by 1.5× per BCD trigger detected, capped at 2.0× total
- **market_multiplier** — adjustments applied during Phase 1B based on web-sourced market signals (e.g., commoditization signal boosts Via Negativa). 1.0 when no signal applies.
- **phase_multiplier** (added v1.11.2) — boost from the operator's selected business phase (STARTUP / GROWTH / SCALING / MATURITY / EXIT_READY), read from the BCD's `Phase:` metadata line. Default 1.0 for every (model, phase) pair. Models with a `phase_boosts:` field in their catalog entry override the default for specific phases. Boosts cap at 1.5×; deprioritizations floor at 0.7×.

**Phase boosts field convention (added v1.11.2).** Models that benefit strongly from a specific business phase carry an explicit `- **Phase boosts:**` line listing per-phase multipliers in compact form, e.g., `STARTUP=1.5, MATURITY=1.3`. Unlisted (model, phase) pairs default to 1.0. Boosts cap at 1.5×; deprioritizations floor at 0.7×. Models without a `Phase boosts:` line use 1.0 across all five phases — no effect on scoring. Only the ~15 models with strong phase signal carry overrides.

Models are selected in descending score order, with five hard causal anchors enforced as ordering rules:
1. JTBD opens every chain
2. First Principles before any Design-class model
3. Diagnose-class before Opportunity-class
4. Design output before Stress-Test
5. Via Negativa + Musk's 5-Step close every chain

Chain stops when 2 consecutive picks score below the relevance threshold (typically 4.0).

---

## TIER 1 — Core Models (universal applicability)

### Jobs to Be Done
- **Class:** Orient (anchor — opens every chain)
- **Base relevance:** 3 | **Subtractive:** N | **Anchor:** YES
- **Causal:** none (runs first)
- **Key question:** What job is the customer actually hiring this product/service to do?
- **Prompt kernel:** Identify the functional job (what they're trying to accomplish), emotional job (how they want to feel), and social job (how they want to be perceived). Describe the full hiring context: when does the job arise, what's the trigger, what have they tried before, why did it fall short? Write a one-sentence job statement: "When [situation], I want to [motivation], so I can [expected outcome]." This becomes the constraint all Design decisions must satisfy.
- **BCD boosts:** none (always runs first regardless)
- **Phase boosts:** STARTUP=1.5 (validation core)

### First Principles Thinking
- **Class:** Diagnose + Simplify (recursive — runs in Diagnose, again post-Design)
- **Base relevance:** 3 | **Subtractive:** Y
- **Causal:** requires JTBD complete; required before any Design-class model
- **Key question:** What is actually true here if we remove all conventions, industry norms, and inherited assumptions?
- **Prompt kernel:** Break this down to irreducible truths. List every assumption baked into the current model. For each: is this a physical/logical constraint, or a convention we chose? Keep only the former. Rebuild from what survives.
- **Phase boosts:** STARTUP=1.5 (strip assumptions before commit), MATURITY=1.2
- **BCD boosts:** Any (universal); +0.3 if "inherited approach" or "industry convention" surfaces in intake

### Via Negativa (Subtraction)
- **Class:** Simplify (anchor — close, recursive)
- **Base relevance:** 3 | **Subtractive:** Y | **Anchor:** YES
- **Causal:** requires Design output exists
- **Key question:** What can we remove without losing the core function?
- **Prompt kernel:** List every element of the current model — revenue streams, processes, offers, features, obligations, relationships. For each element: what breaks if we remove it? If the answer is "nothing critical," mark for removal. Remove all marked. Re-examine the simplified model. Repeat until no further removals are safe.
- **BCD boosts:** Any (always runs in close); +0.3 if "operational complexity" or "too much" detected

### Musk's 5-Step Design Process
- **Class:** Simplify (anchor — close, validation)
- **Base relevance:** 3 | **Subtractive:** Y | **Anchor:** YES
- **Causal:** requires Via Negativa complete
- **Key question:** For every element: necessary, or just unquestioned?
- **Prompt kernel:** Apply 5 steps to the current design: (1) Question every requirement — delete what's not backed by real constraint. (2) Delete parts or processes — default assumption is they're unneeded. (3) Simplify or optimize what remains. (4) Accelerate cycle time. (5) Automate last. Name what was removed at each step.
- **BCD boosts:** Any (always runs in close)

### Pareto Principle (80/20)
- **Class:** Diagnose
- **Base relevance:** 3 | **Subtractive:** Y
- **Causal:** requires JTBD complete
- **Key question:** Which 20% of activities, customers, or inputs produce 80% of the value?
- **Prompt kernel:** Map inputs to outputs across: customers (revenue by segment), activities (time spent vs. value), products/services (margin by offering), problems (source of complaints/churn). Identify top 20% in each category. Flag anything in bottom 80% that consumes disproportionate resource — these are elimination candidates.
- **BCD boosts:** "operational complexity", "growth stall", "declining margin"
- **Phase boosts:** STARTUP=0.8 (premature without data), SCALING=1.2, MATURITY=1.2

### Theory of Constraints
- **Class:** Diagnose
- **Base relevance:** 3 | **Subtractive:** Y
- **Causal:** requires Pareto complete
- **Key question:** What single constraint, if removed, would allow the entire system to improve?
- **Prompt kernel:** Map the current business as inputs/processes/outputs. Identify throughput. Find the bottleneck — the one step or resource that limits throughput. This is the constraint. Do not optimize anything that isn't the constraint — it's waste. Propose minimum intervention to relieve only the constraint.
- **BCD boosts:** "operational complexity", "growth stall", "system performance"
- **Phase boosts:** STARTUP=0.7 (system doesn't exist yet), SCALING=1.5 (binding-constraint identification is the scaling unlock)

### Inversion
- **Class:** Diagnose (first pass) + Stress-Test (second pass)
- **Base relevance:** 3 | **Subtractive:** N
- **Causal:** First pass: requires JTBD. Second pass: requires Pre-Mortem complete.
- **Key question:** What would guarantee this fails? What are we doing that resembles those conditions?
- **Prompt kernel:** First pass — Instead of "how do we succeed," ask "how do we guarantee failure?" Generate 5–7 specific behaviors that would make this business fail with certainty. Use as a negative constraint. Second pass — After seeing the full plan, check: does any element resemble a failure condition? Flag matches.
- **BCD boosts:** Any (universal)

### Pre-Mortem Analysis
- **Class:** Stress-Test
- **Base relevance:** 3 | **Subtractive:** N
- **Causal:** requires Design output exists
- **Key question:** Assume this plan fails in 12 months. Top three reasons?
- **Prompt kernel:** It is 12 months from now. The plan failed. Generate 5–7 specific failure modes ranked by likelihood × impact. For each high-priority mode: is it detectable early, preventable by design change, or an irreducible risk to accept?
- **BCD boosts:** "high-stakes commitment", "strategic uncertainty"
- **Phase boosts:** EXIT_READY=1.5 (post-exit failure modes most consequential), MATURITY=1.3

### Value Equation (Hormozi)
- **Class:** Design
- **Base relevance:** 3 | **Subtractive:** N
- **Causal:** requires JTBD complete; requires First Principles complete
- **Key question:** Dream outcome, likelihood, time delay, effort?
- **Prompt kernel:** Apply Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort). For current offer: name the dream outcome in customer language. What makes achievement feel likely or unlikely? How fast do results show? What effort is required? For each variable: how can we improve perceived value? Produce a redesigned offer description maximizing all four.
- **BCD boosts:** "pricing problem", "offer not converting", "commoditization"
- **Phase boosts:** GROWTH=1.5 (sharpening the offer is the GROWTH unlock)

### Operator Edge
- **Class:** Opportunity
- **Base relevance:** 3 | **Subtractive:** N
- **Causal:** requires Diagnose-class complete + Layer 3 intake (operator expertise) data
- **Key question:** Where does the operator's background create a credible position competitors cannot replicate?
- **Prompt kernel:** Using operator's background data: (1) List all domains where operator has deep knowledge — industries, disciplines, hobbies, communities, roles. (2) Map against current market whitespace: what do customers want that providers don't offer or understand well? (3) Find intersections where operator expertise meets underserved need. (4) Surface 2–3 niche positions only someone with this exact background could credibly occupy. (5) Score each by defensibility and market size. Flag the highest-potential for Design phase input.
- **BCD boosts:** "operator cross-domain background", "no differentiator", "commoditized market"
- **Phase boosts:** GROWTH=1.5 (defensible niche is the GROWTH-stage move), EXIT_READY=1.2 (what survives without the operator)
- *(Replaces "Idea Sex" — same mechanism, sharper name.)*

---

## TIER 2 — High-Value Models

### Leverage Points
- **Class:** Design
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Diagnose-class complete; requires First Principles
- **Key question:** Where in the system does a small change produce the largest downstream effect?
- **Prompt kernel:** Map the business as interconnected feedback loops. Identify: parameters (low leverage), feedback loops (medium), goals and paradigms (high). Find the intervention point with highest expected leverage. Propose one change at that point.
- **BCD boosts:** "growth stall", "system not responding"
- **Phase boosts:** SCALING=1.5 (highest-leverage intervention is the scaling unlock)

### Unit Economics (LTV:CAC)
- **Class:** Diagnose
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD complete
- **Key question:** For every dollar to acquire a customer, how much do they generate over their lifetime?
- **Prompt kernel:** Compute CAC, LTV, LTV:CAC ratio. Benchmark: SaaS ≥ 3:1 healthy, <1:1 fatal. What drives CAC up? What drives LTV down? Highest-leverage intervention to improve the ratio?
- **BCD boosts:** "pricing problem", "growth constrained by economics", "scaling concern"
- **Phase boosts:** STARTUP=0.8 (no data yet), GROWTH=1.3, EXIT_READY=1.3 (LTV:CAC is a primary buyer-due-diligence metric)

### Golden Circle (Why/How/What)
- **Class:** Orient
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD complete
- **Key question:** Why beyond money? How? What?
- **Prompt kernel:** Define WHY (the belief), HOW (the approach that differentiates), WHAT (the products/services). Test: does WHAT flow naturally from WHY? If a customer understood only WHY, would they recognize WHAT?
- **BCD boosts:** "positioning fog", "brand confusion", "differentiation problem"

### Minimum Viable Experiment
- **Class:** Design
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Diagnose-class complete; requires First Principles
- **Key question:** Smallest, fastest, cheapest experiment to prove or disprove the core assumption?
- **Prompt kernel:** Identify the single riskiest assumption — the one that, if wrong, makes everything else irrelevant. Design the minimum experiment: what action, by whom, in what timeframe, at what cost, generates evidence? Define thresholds: what confirms it, what kills it.
- **BCD boosts:** "high uncertainty", "early stage", "resource constraint"
- **Phase boosts:** STARTUP=1.5 (MVE is the literal STARTUP unlock)

### 5 Whys (Root Cause)
- **Class:** Diagnose
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD complete; precedes First Principles when selected
- **Key question:** What is the actual cause, not the symptom?
- **Prompt kernel:** Starting with the stated problem, ask "why is this happening?" five times, each using the previous answer as new starting point. Test each level: is this factual or a story? Stop at the deepest verifiable cause. Propose intervention at that level — not at the symptom.
- **BCD boosts:** "recurring problem", "symptoms being treated"

### Incentives Analysis
- **Class:** Orient
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD complete
- **Key question:** What are all parties actually optimizing for?
- **Prompt kernel:** Map all stakeholders. For each: (1) formally incentivized to do what? (2) actually incentivized to do what (what behaviors does the reward structure produce)? (3) where do incentives conflict with business outcomes? Flag misalignments. These are design problems, not people problems. Propose minimum structural change that realigns critical incentives.
- **BCD boosts:** "alignment failure", "people behaving unexpectedly", "change initiatives failing"

### Second-Order Thinking
- **Class:** Stress-Test
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Design output exists
- **Key question:** If this works, what happens next? And then what?
- **Prompt kernel:** For the proposed plan: (1) list immediate first-order effects. (2) For each, ask "and then what?" — list second-order effects. (3) For the most significant, ask again — third order. Flag any second/third-order effect that undermines the plan or creates a worse problem.
- **BCD boosts:** "significant market implications", "competitive side effects"
- **Phase boosts:** MATURITY=1.5 (strategic compounding effects matter most), EXIT_READY=1.3

### Blue Ocean Strategy
- **Class:** Opportunity
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Operator Edge complete
- **Key question:** Which factors can be eliminated, reduced, raised, or created to make competition irrelevant?
- **Prompt kernel:** Apply Four Actions Framework: (1) ELIMINATE — which factors the industry competes on can be removed? (2) REDUCE — which are over-served? (3) RAISE — which are under-served? (4) CREATE — which have never been offered? Produce a Strategy Canvas showing current vs. proposed competitive curve.
- **BCD boosts:** "commoditization", "competitive saturation", "price competition"

### Moats / Competitive Advantage
- **Class:** Orient
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD complete
- **Key question:** What makes this business structurally harder to compete with over time?
- **Prompt kernel:** Assess against five moat types: (1) Network effects, (2) Switching costs, (3) Cost advantages, (4) Intangible assets — brand/patents/data, (5) Efficient scale. Rate current strength 1–5 each. Identify which moat to build and the next concrete step.
- **BCD boosts:** "competition problem", "pricing pressure", "acquisition strategy"
- **Phase boosts:** MATURITY=1.5 (moat depth determines next ceiling), EXIT_READY=1.3 (moat is a primary valuation driver)

### Comparative Advantage
- **Class:** Orient
- **Base relevance:** 2 | **Subtractive:** Y
- **Causal:** requires JTBD complete
- **Key question:** What does this business do better than anyone else relative to opportunity cost?
- **Prompt kernel:** List key activities. For each, how does performance compare to alternatives (outsourcing, partners, competitors)? Identify activities where there's highest relative advantage. All others are outsource/eliminate candidates. The business should be doing only what it does relatively best.
- **BCD boosts:** "resource allocation", "what to focus on vs. outsource", "partnership evaluation"
- **Phase boosts:** SCALING=1.3 (delegation surface), EXIT_READY=1.3 (clean separation of operator-only vs delegable reveals saleable systems)

### Asymmetric Risk (Convexity)
- **Class:** Design
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Diagnose-class complete; requires First Principles
- **Key question:** Which options have limited downside but uncapped upside?
- **Prompt kernel:** Evaluate each option through asymmetric payoff: (1) worst-case cost if fails? (2) best-case value if succeeds? (3) ratio better than 1:3? Flag asymmetric positive bets — highest expected-value even under uncertainty. Flag asymmetric negative — avoid regardless of confidence.
- **BCD boosts:** "strategic uncertainty", "high-stakes decision", "resource-constrained"
- **Phase boosts:** MATURITY=1.5 (largest strategic bets with longest time horizons)

### Occam's Razor
- **Class:** Simplify
- **Base relevance:** 2 | **Subtractive:** Y
- **Causal:** requires Design output exists
- **Key question:** Among competing explanations or designs, which requires the fewest assumptions?
- **Prompt kernel:** For competing diagnoses or plans: list assumptions each requires. Count. The one requiring fewer assumptions is more likely correct. For a design: list assumptions about customer behavior, market conditions, execution. Remove elements whose assumptions are least defensible.
- **BCD boosts:** "overcomplicated plans", "competing explanations"

### Reversibility Test
- **Class:** Decision
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Design output exists
- **Key question:** Is this decision reversible?
- **Prompt kernel:** Classify each pending decision: Type 1 (irreversible — capital, personnel, brand) or Type 2 (reversible — undone with limited cost). Type 2: act quickly with low info. Type 1: require high confidence. Flag any Type 1 being treated with Type 2 urgency.
- **BCD boosts:** "significant decision", "strategic pivot", "resource commitment"

### Ikigai (Operator Fit)
- **Class:** Orient
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD + Layer 3 intake complete; precedes Operator Edge
- **Key question:** Does this business sit at the intersection of what the operator loves, is good at, world needs, world pays for?
- **Prompt kernel:** Map operator against four dimensions. Identify which quadrants the current business covers and which are missing. Missing "love" = burnout. Missing "needed" = no mission. Missing "good at" = can't deliver. Missing "pays" = can't survive. Flag any missing quadrant and its risk.
- **BCD boosts:** "founder misalignment", "pivot decisions", "sustainability question"
- **Phase boosts:** STARTUP=1.3 (operator fit matters most when nothing is built yet)

### Amazon Working Backwards
- **Class:** Design
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD complete; requires First Principles
- **Key question:** What would the press release look like? What FAQs?
- **Prompt kernel:** Write the press release for the finished product as if announcing today. Include: headline (what it does for customer), problem solved, key features in customer language, customer quote. Then write FAQ: 5 hardest skeptic questions. Identify where current design falls short of press release. Close the gap.
- **BCD boosts:** "product design", "new offer development", "unclear value proposition"

### Pricing Strategy (Price-Value Gap)
- **Class:** Design
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Value Equation complete
- **Key question:** Is current price capturing the value being delivered?
- **Prompt kernel:** Compare price against three anchors: (1) Cost-plus (margin structure), (2) Competitive (positioning vs. survival), (3) Value-based (customer ROI at current price). Identify type: underpriced (value > price), overpriced (price > perceived value), or mismatch (right number, wrong structure). Propose minimum change that captures more of the value being delivered.
- **BCD boosts:** "pricing problem", "underpriced", "offer not converting"
- **Phase boosts:** STARTUP=0.8 (premature optimization), GROWTH=1.3 (moving off floor pricing is a primary GROWTH lever)

### Money Model Architecture (Hormozi)
- **Class:** Design
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Value Equation complete; soft-fires after Pricing Strategy
- **Key question:** Across four tiers (Front-door, Core, Premium, Subscription), what offer does each tier need to carry to move the operator from where they are to where the business could land?
- **Prompt kernel:** Given the redesigned offer description from Value Equation, the operator's Q10d pricing snapshot, Q12 revenue stream split, and Q13 acquisition channels: design a four-tier offer canvas. Front-door (entry-point offer solving an urgent pain cheaply, sub-30-day cash recovery target). Core (the foundational offer the business is built on — the highest-margin volume play). Premium (deeper-pocket upsell after the core sale — fewer customers, larger basket). Subscription (recurring revenue layer maximizing lifetime value). For each tier produce: tier_name, target_audience, price_anchor, value_promise, gross_profit_estimate, time_to_deliver, section_5_anchor (name the Section 5 Proposed-Model revenue stream this tier maps to). Close with a sequencing_note (1-2 paragraphs) telling the operator which tier to design or sharpen first given their Q4 bottleneck.
- **BCD boosts:** "pricing problem", "commoditization", "offer not converting", "low repeat rate", "cash flow tight", "revenue mix lopsided"
- **Phase boosts:** STARTUP=0.8 (premature without a proven Core tier), GROWTH=1.5 (the ladder is the GROWTH unlock), EXIT_READY=1.3 (clean revenue layers improve sale story)

### Eisenhower Matrix
- **Class:** Simplify
- **Base relevance:** 2 | **Subtractive:** Y
- **Causal:** requires Via Negativa complete (applies to remaining elements)
- **Key question:** Urgent, important, both, or neither?
- **Prompt kernel:** List all current activities, initiatives, obligations. Sort by Urgent (time-sensitive) × Important (drives primary goal). Q1 urgent+important: do now. Q2 important not urgent: schedule. Q3 urgent not important: delegate or eliminate. Q4 neither: eliminate. Q3/Q4 items are the complexity to remove.
- **BCD boosts:** "operational complexity", "too many priorities", "resource overextension"
- **Phase boosts:** SCALING=1.3 (delegate/eliminate is the founder-time leverage point)

### Network Effects
- **Class:** Orient
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD complete
- **Key question:** Does this business get more valuable as more people use it?
- **Prompt kernel:** Identify if network effect exists (direct: value from other users; indirect: value from complementary products). If yes: which side drives value for the other? Critical mass threshold? Current state vs. threshold? Strategy to cross quickly? If no: should the business be redesigned to create one?
- **BCD boosts:** "platform business", "marketplace", "community product"

### Feedback Loops
- **Class:** Diagnose
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires JTBD complete; precedes Leverage Points
- **Key question:** What loops are compounding problems vs. could compound growth?
- **Prompt kernel:** Map as a system of feedback loops. Identify: reinforcing loops (compounding — amplifies growth or decline), balancing loops (stabilizing). For current problem: which reinforcing loop drives it? For desired outcome: which loop could be activated? Propose how to activate growth loop and interrupt decline loop.
- **BCD boosts:** "growth stall", "declining performance", "compounding problems"

---

## TIER 3 — Situational

### Chesterton's Fence
- **Class:** Diagnose
- **Base relevance:** 1 | **Subtractive:** N
- **Causal:** requires JTBD complete
- **Key question:** Why does this long-standing element exist? What breaks if removed?
- **Prompt kernel:** For each element the operator proposes to remove that has been in place for years: identify why it was originally built. What problem did it solve? Does that problem still exist? Only remove if you can articulate the original purpose AND confirm it no longer applies.
- **BCD boosts:** "operator wants to remove long-standing element"

### BATNA/ZOPA
- **Class:** Decision
- **Base relevance:** 1 | **Subtractive:** N
- **Causal:** requires Design output exists
- **Key question:** Best alternative to a negotiated agreement? Zone of possible agreement?
- **Prompt kernel:** Define your BATNA (best outcome if no deal). Define their BATNA. ZOPA = overlap of both parties' acceptable ranges. If no overlap: no deal is possible at current terms. Propose minimum concessions to create overlap, or alternative deal structures.
- **BCD boosts:** "negotiation", "partnership terms", "deal structure"

### Opportunity Cost
- **Class:** Decision
- **Base relevance:** 1 | **Subtractive:** Y
- **Causal:** requires Design output exists
- **Key question:** What are we giving up by choosing this?
- **Prompt kernel:** For each option being considered: list what cannot be pursued if this is chosen. Quantify if possible (revenue forgone, time spent elsewhere, attention diluted). The true cost of any choice is the value of the next-best alternative not chosen.
- **BCD boosts:** "resource allocation", "competing options"

### Survivorship Bias
- **Class:** Diagnose
- **Base relevance:** 1 | **Subtractive:** N
- **Causal:** requires JTBD complete
- **Key question:** What invisible failures lurk behind the visible successes being benchmarked?
- **Prompt kernel:** For each business or strategy being held up as a model: how many others tried the same approach and failed? Are we observing a winning strategy or a winning lottery ticket? Identify the conditions present in the successes that may not be present here.
- **BCD boosts:** "benchmarking against industry winners"

### Scenario Planning
- **Class:** Stress-Test
- **Base relevance:** 1 | **Subtractive:** N
- **Causal:** requires Design output exists
- **Key question:** How does this plan hold up across multiple plausible futures?
- **Prompt kernel:** Construct 3 scenarios: optimistic, baseline, pessimistic. For each: how does the proposed model perform? Where does it break? Identify the assumptions whose change would force a strategic pivot. These are the variables to monitor.
- **BCD boosts:** "very high strategic uncertainty", "plan depends on external conditions"

### Switching Costs / Lock-in
- **Class:** Design
- **Base relevance:** 1 | **Subtractive:** N
- **Causal:** requires JTBD + First Principles
- **Key question:** What would a customer have to lose or rebuild to switch away?
- **Prompt kernel:** Audit current switching cost: data, integrations, learned workflows, relationships, sunk financial cost. If "nothing" — that's the retention problem. Propose minimum structural change that creates a non-coercive switching cost (value lost on leaving, not punishment for leaving).
- **BCD boosts:** "retention central concern", "competitive moat design"

### Porter's Five Forces
- **Class:** Orient
- **Base relevance:** 1 | **Subtractive:** N
- **Causal:** requires JTBD complete
- **Key question:** What industry structure forces shape profitability here?
- **Prompt kernel:** Assess: (1) supplier power, (2) buyer power, (3) threat of new entrants, (4) threat of substitutes, (5) competitive rivalry intensity. Where is the industry profitability captured? Where is it leaked? Position the business against the dominant force.
- **BCD boosts:** "full industry structure analysis needed"

### Expected Value
- **Class:** Decision
- **Base relevance:** 1 | **Subtractive:** N
- **Causal:** requires Design output exists
- **Key question:** Numerically, which option has the highest probability-weighted value?
- **Prompt kernel:** For each option: list possible outcomes, assign probability to each, assign value (positive or negative) to each, compute EV = Σ(p × v). Compare EVs. Note: EV is necessary but not sufficient — variance and ruin-risk also matter.
- **BCD boosts:** "multiple options with quantifiable probabilities"

### Barbell Strategy
- **Class:** Design
- **Base relevance:** 1 | **Subtractive:** N
- **Causal:** requires Diagnose-class + First Principles complete
- **Key question:** Can we structure as 80% safe + 20% asymmetric upside, avoiding the lethal middle?
- **Prompt kernel:** Audit current resource allocation. Categorize as: defensive (low risk, low return — preserves capital), speculative (high risk, high upside — asymmetric bet), or middle (medium risk, medium return). Middle is the trap. Propose reallocation: most resources to defensive, small portion to high-upside, eliminate the middle.
- **BCD boosts:** "risk portfolio design"

### Cash Conversion Check (30-day rule)
- **Class:** Stress-Test
- **Base relevance:** 2 | **Subtractive:** N
- **Causal:** requires Money Model Architecture complete; consumes Phase 1B `CAC_BENCHMARK`
- **Key question:** Does the offer architecture recoup customer-acquisition cost within ~30 days, or does the business need external capital to scale?
- **Prompt kernel:** Estimate first-30-day cash recovered per new customer using: front-door tier price and gross profit estimate (from Money Model Architecture output), Q10b margin (BCD), and the typical share of customers who buy the front-door only vs. attach a premium upsell at first sale. Estimate CAC using Phase 1B `CAC_BENCHMARK` for the operator's top channel from Q13. Compare estimated_first_30d_cash against estimated_cac to produce a verdict: likely_passing (cash > CAC), likely_failing (cash < CAC), or indeterminate (confidence too low to call). Confidence is high when Phase 1B CAC band is tight AND Q10b margin is a number AND Q10d pricing is concrete; drops one tier per loose/missing input; verdict forced to indeterminate when confidence is low. Surface 2-4 recommended levers (reduce CAC by switching channels, raise front-door price, add a first-call premium upsell, accelerate cash collection, etc.). Voice precedent matches Section 2 CAC sub-block: probabilistic verdict, pilot-to-measure fallback.
- **BCD boosts:** "cash flow tight", "can't afford to scale", "runway concern", "acquisition cost high"
- **Phase boosts:** STARTUP=0.7 (no real channels yet), GROWTH=1.3 (capital efficiency matters most), SCALING=1.3

---

## BCD Trigger → Multiplier Reference

Triggers detected in BCD content boost specific models' scores by 1.5× (capped at 2.0× total per model).

| BCD Signal | Models Boosted |
|---|---|
| Pricing problem | Pricing Strategy, Value Equation, Unit Economics, Money Model Architecture |
| Operational complexity | Pareto, ToC, Eisenhower, Via Negativa |
| Growth stall, cause unclear | Feedback Loops, Leverage Points, Unit Economics, ToC |
| Commoditized market | Blue Ocean, Operator Edge, Moats |
| No differentiator found | Operator Edge, Blue Ocean, Moats |
| Operator has cross-domain background | Operator Edge, Ikigai |
| Positioning fog | Golden Circle, JTBD (deep pass), Amazon Working Backwards |
| Recurring operational problem | 5 Whys, ToC, First Principles |
| Alignment / incentives failure | Incentives Analysis, Second-Order Thinking |
| High-stakes irreversible commitment | Reversibility Test, Pre-Mortem, Asymmetric Risk |
| Strategic uncertainty | Asymmetric Risk, Scenario Planning, MVE |
| Offer not converting | Value Equation, Amazon Working Backwards, JTBD (deep), Money Model Architecture |
| Cash flow tight / runway concern | Cash Conversion Check, Unit Economics, Money Model Architecture |
| Low repeat rate | Money Model Architecture, Switching Costs, Value Equation |
| Revenue mix lopsided (one stream dominates) | Money Model Architecture, Pareto, Via Negativa |
| Acquisition cost high vs. price | Cash Conversion Check, Unit Economics, Pricing Strategy |
| Resource allocation / outsource decision | Comparative Advantage, Opportunity Cost |
| Platform / marketplace | Network Effects, Moats |
| Operator wants to remove long-standing element | Chesterton's Fence |
| Benchmarking against industry winners | Survivorship Bias |
| Negotiation in scope | BATNA/ZOPA |
| Retention central concern | Switching Costs |

When the market research phase surfaces additional signals (e.g., "rapidly growing TAM", "heavy commoditization", "regulatory tailwind"), the optimize skill may add similar boosts on top of the BCD-derived ones.

---

## Causal Anchors (Hard Ordering Rules)

These five anchors are enforced as hard constraints during chain construction. Violating them produces incoherent output, so the optimizer disqualifies any candidate that would violate an anchor.

1. **JTBD opens.** Always the first model. Establishes the job statement that all downstream models optimize for.
2. **First Principles before Design.** Cannot design from fundamentals not yet uncovered. Affects: Value Equation, Leverage Points, MVE, Amazon Working Backwards, Pricing Strategy, Asymmetric Risk, Barbell Strategy, Switching Costs.
3. **Diagnose before Opportunity.** Find the constraint before finding the path around it. Affects: Operator Edge, Blue Ocean.
4. **Design before Stress-Test.** Cannot attack a plan that doesn't exist. Affects: Pre-Mortem, Inversion (2nd pass), Second-Order Thinking, Scenario Planning.
5. **Close with Via Negativa → Musk's 5-Step.** Strip recursively, then validate. These run unconditionally at chain end.

Soft conventions (not enforced as hard rules, but score ordering naturally produces them):
- Pareto before ToC (Pareto surfaces candidates; ToC identifies the binding one)
- Ikigai before Operator Edge (Ikigai maps the operator; Operator Edge finds the market match)
- Feedback Loops before Leverage Points (loops reveal where leverage lives)
- 5 Whys before First Principles (root cause before stripping conventions)
- Value Equation before Pricing Strategy (define value before pricing it)
- Money Model Architecture between Value Equation and Pricing Strategy (Value Equation defines the value; Money Model Architecture maps the tiers; Pricing Strategy refines each tier's price)
- Cash Conversion Check after Money Model Architecture (stress-tests the tier architecture's cash mechanics, must run after the architecture exists)
