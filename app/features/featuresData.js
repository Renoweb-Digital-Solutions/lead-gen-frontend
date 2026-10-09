import React from 'react';
import { 
    Building2, Search, Users, Database, FileText, Target, MapPin, 
    Briefcase, BrainCircuit, Download, ArrowRight, ShieldAlert,
    TrendingUp, AlertCircle, FileSearch, ListFilter, Zap, ShieldCheck,
    Store, Map, Globe
} from 'lucide-react';

export const companyIntelligenceData = {
    hero: {
        badgeIcon: Building2,
        badgeText: "Company Intelligence",
        title: "Build the Right <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]\">Target Accounts</span>",
        description: "Company Intelligence is the second step in the SimpLeads pipeline. Once you have identified the people you may want to reach, Company Intelligence helps you determine which companies fit your target market by filtering accounts against the firmographic criteria that matter to your ICP.\n\nSearch and refine companies by name, domain, industry, employee count, location, and business keywords before moving deeper into qualification and scoring. Build a more precise target account list.",
        primaryCta: "Try Company Intelligence Free",
        secondaryCta: null
    },
    screenshot: {
        imageSrc: "/features_images/company_filter.png",
        captions: [
            {
                icon: Database,
                title: "Company Identity",
                description: "Company Names with Exact / Phrase Match, Company Domains with Strict / Contains Match."
            },
            {
                icon: Search,
                title: "Company Filtering",
                description: "Employee Count, Industry, Location, and Company Keywords filters used together to narrow the target account list."
            }
        ]
    },
    blocks: [
        {
            icon: FileText,
            iconBgClass: "bg-blue-50 text-blue-600",
            title: "Exact or Phrase Company Matching",
            content: <p>Company Names gives you control over how closely company names should match your search.</p>,
            bullets: [
                { title: "Exact Match", desc: "Use when you want a narrower company-name result." },
                { title: "Phrase Match", desc: "Use when you want a broader search around a company-name phrase." }
            ],
            callout: <p className="text-blue-800 text-sm">This gives you more control over the difference between a highly specific account search and a broader discovery workflow.</p>,
            imageSrc: "/features_images/search_settings_ui_card.png"
        },
        {
            icon: Database,
            iconBgClass: "bg-purple-50 text-purple-600",
            title: "Domain Filtering With Strict or Contains Matching",
            content: <p>Company Domains lets you search using the company's domain. This is useful when your account research needs to be based on known company domains rather than company names alone.</p>,
            bullets: [
                { title: "Strict Match", desc: "For a more specific domain match." },
                { title: "Contains Match", desc: "For broader domain-based matching where the domain pattern is relevant." }
            ],
            imageSrc: "/features_images/company_domains_filter_card.png"
        },
        {
            icon: Users,
            iconBgClass: "bg-emerald-50 text-emerald-600",
            title: "Filter Companies by the Size That Fits Your ICP",
            content: <p>Employee count is one of the simplest ways to narrow a broad company list. SimpLeads supports multiple employee-count ranges, including: 1–10, 11–20, 21–50, and up to 10,001+.<br/><br/>Select the ranges that match your target market rather than starting with an unrestricted company list.</p>,
            bullets: [
                { title: "Company Names", desc: "Exact or Phrase matching." },
                { title: "Company Domains", desc: "Strict or Contains matching." },
                { title: "Employee Count", desc: "Select relevant company-size ranges." },
                { title: "Industry", desc: "Filter companies by industry." },
                { title: "Location", desc: "Narrow accounts geographically." },
                { title: "Company Keywords", desc: "Search for business, industry, niche, or relevant company terms." }
            ],
            imageSrc: "/features_images/employee_count_filter_card.png"
        },
        {
            icon: Target,
            iconBgClass: "bg-amber-50 text-amber-600",
            title: "Industry and Keyword Filters for ICP Precision",
            content: <p>Industry filtering helps define the broad category of companies you want to reach. Company Keywords give you another layer of control.<br/><br/>For example, you may want companies in a particular industry and companies whose business description or available company information matches a specific keyword or niche.<br/><br/>Layering these filters lets you move from: <strong>Broad Industry &rarr; Relevant Company Type &rarr; Target Accounts</strong>.</p>,
            imageSrc: "/features_images/modern_industry_and_keywords_filters.png"
        },
        {
            icon: Building2,
            iconBgClass: "bg-rose-50 text-rose-600",
            title: "Company Intelligence Is the Account Layer of the Pipeline",
            content: <p><strong>People Search answers:</strong> Who could we contact?<br/><strong>Company Intelligence answers:</strong> Which companies should those people belong to?<br/><br/>This distinction matters because a relevant job title does not automatically make someone a relevant prospect. Company Intelligence adds the company-level context needed to build a more targeted account list before moving into Active Job Signals, AI Lead Qualification & Scoring, and Export.</p>,
            imageSrc: "/features_images/talent_company_and_jobs_flow_diagram.png"
        },
        {
            icon: Briefcase,
            iconBgClass: "bg-sky-50 text-sky-600",
            title: "Company Data Is Not the Same as Lead Qualification",
            content: <p>Company Intelligence helps you find and filter accounts. It does not by itself determine whether a company is a qualified prospect. That comes later through SimpLeads' qualification and scoring workflow, where prospects can be evaluated against:<br/><br/><strong>Need &rarr; Urgency &rarr; Relevance &rarr; Authority</strong></p>,
            callout: <p className="text-sky-800 text-sm font-medium">A company matching your industry and size criteria is a potential account, not automatically a qualified lead. This keeps company discovery separate from lead qualification.</p>,
            imageSrc: "/features_images/lead_qualification_scorecard.png"
        }
    ],
    extraSections: [
        function WorkflowExample() {
            return (
                <section className="py-24 px-6 bg-slate-50">
                    <div className="max-w-4xl mx-auto text-center fade-up-item">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-8 tracking-tight">Use Company Intelligence With People Search</h2>
                        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                            The strongest workflow is not to use company filters in isolation. Start with the type of people you want to reach through People Search, then use Company Intelligence to narrow the companies those people belong to.
                        </p>
                        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { title: 'Target Role', desc: 'Marketing Director' },
                                { title: 'Industry', desc: 'B2B SaaS' },
                                { title: 'Size', desc: '51–500 employees' },
                                { title: 'Location', desc: 'Target market' },
                                { title: 'Keywords', desc: 'Relevant tech/terms' }
                            ].map((step, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="text-xs font-bold text-[#1E61ED] uppercase tracking-wider mb-2">Step {i + 1}</div>
                                    <div className="font-bold text-slate-900 mb-1">{step.title}</div>
                                    <div className="text-sm text-slate-500">{step.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )
        }
    ],
    ctaBand: {
        title: <>Build Your Target Account<br/>List With More Control</>,
        buttonText: "Try Company Intelligence Free"
    },
    faqs: [
        {
            q: 'What is Company Intelligence in SimpLeads?',
            a: 'Company Intelligence is the second step in the SimpLeads pipeline. It helps you filter and refine companies using criteria such as company name, domain, industry, employee count, location, and company keywords.'
        },
        {
            q: 'What company information can I filter by?',
            a: 'You can filter using: Company Names, Company Domains, Employee Count, Industry, Location, Company Keywords.'
        },
        {
            q: 'Can I search companies by employee count?',
            a: 'Yes. SimpLeads provides employee-count ranges so you can target companies according to the size of your ICP.'
        },
        {
            q: 'Can I search companies by industry and keywords together?',
            a: 'Yes. Industry and Company Keywords can be used together to create a more specific target account search.'
        },
        {
            q: 'Can I search companies by domain?',
            a: 'Yes. Company Domains supports Strict and Contains matching options.'
        },
        {
            q: 'What is the difference between Exact and Phrase company-name matching?',
            a: 'Exact Match is intended for more specific company-name searches.\nPhrase Match allows a broader search around the company-name phrase.'
        },
        {
            q: 'Is Company Intelligence the same as lead qualification?',
            a: 'No. Company Intelligence helps identify and filter potential target accounts. Lead qualification evaluates whether a prospect fits your defined criteria, such as Need, Urgency, Relevance, and Authority.'
        },
        {
            q: 'Is Company Intelligence one of the five SimpLeads pipeline stages?',
            a: 'Yes. It is the second stage.\nPeople → Company → Jobs → Scoring → Export\nGoogle Maps, Instagram, YouTube, B2B Directory, and Investor Data are separate discovery tools and are not additional pipeline stages.'
        },
        {
            q: 'Can I use Company Intelligence with People Search?',
            a: 'Yes. The two work together as part of the core SimpLeads workflow. People Search helps identify relevant professionals, while Company Intelligence helps narrow the companies those professionals belong to.'
        },
        {
            q: 'Does a company matching my filters automatically become a qualified lead?',
            a: 'No. Matching your company filters means the account fits the search criteria you selected. It does not guarantee buying intent, qualification, or conversion. You can use SimpLeads’ AI Lead Qualification & Scoring workflow to evaluate and prioritize prospects further.'
        },
        {
            q: 'Does SimpLeads guarantee that company information is always completely accurate?',
            a: 'No. Company information can change over time, and no data platform should present matching results as an absolute guarantee of current business conditions. SimpLeads provides structured company intelligence to support prospecting and account research.'
        }
    ]
};

export const activeJobSignalsData = {
    hero: {
        badgeIcon: Briefcase,
        badgeText: "Active Job Signals",
        title: "Sell Into Companies That Are <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]\">Actually Hiring</span>",
        description: "A company’s hiring activity can tell you something about what is happening inside the business.\n\nSimpLeads Active Job Signals lets you cross-reference your prospects and target companies with available job activity, using job title, location and recency to add another layer of context to your prospecting.\n\nUse that signal to help answer:\n“Why might this company be worth prioritizing right now?”\n\nActive Job Signals are business intelligence signals, not proof that a company is ready to buy.",
        primaryCta: "Try Active Job Signals",
        secondaryCta: "See AI Lead Qualification",
        secondaryCtaLink: "/features/ai-lead-scoring"
    },
    screenshot: {
        imageSrc: "/features_images/job_signal.png",
        captions: [
            {
                icon: FileSearch,
                title: "Active Job Signals controls",
                description: "Cross-reference prospects with relevant job activity using Include Jobs Data, Job Title, Job Location, Job Recency, and Jobs Rows limits."
            },
            {
                icon: Target,
                title: "Advanced Jobs controls",
                description: "Fail Open Jobs, Live Estimator, and Filter Breakdown showing how job activity can be layered into the prospecting workflow."
            }
        ]
    },
    blocks: [
        {
            icon: Briefcase,
            iconBgClass: "bg-blue-50 text-blue-600",
            title: "Add Job Activity to Your Prospecting Workflow",
            content: <p>You do not need to run a separate job search every time you want to understand whether a target company is hiring.<br/><br/>With Include Jobs Data, SimpLeads can incorporate available job-posting information into the workflow alongside your People and Company criteria.<br/><br/>This allows you to move from:<br/><strong>Who is the person?</strong><br/>to<br/><strong>Which company are they at?</strong><br/>to<br/><strong>What relevant business activity is happening there?</strong><br/><br/>That additional context can help your team decide which accounts deserve closer attention.</p>,
            callout: <p className="text-blue-800 text-sm font-medium"><strong>The key distinction:</strong> Active Job Signals are not a separate recruiting system. They are an additional business signal inside your prospecting and qualification workflow.</p>,
            imageSrc: "/features_images/active_job_signals/slack_hiring_dashboard_mockup.png"
        },
        {
            icon: ShieldAlert,
            iconBgClass: "bg-purple-50 text-purple-600",
            title: "Filter Job Activity by What Actually Matters",
            content: <p>Not every job posting is useful for every prospecting campaign. SimpLeads gives you controls to narrow available job activity by:</p>,
            bullets: [
                { title: "Job Title", desc: "Focus on specific roles that may be relevant to your offering. (e.g. Sales, Engineering, Marketing, Operations, Finance)" },
                { title: "Job Location", desc: "Limit the signal to the geography relevant to your campaign." },
                { title: "Job Recency", desc: "Use recency to distinguish newer activity from older job postings. A recent relevant opening may provide more useful context than an old posting that has been sitting open for an extended period." },
                { title: "Jobs Data", desc: "Choose whether job information should be included in the workflow." }
            ],
            imageSrc: "/features_images/active_job_signals/job_activity_filters_dashboard.png"
        },
        {
            icon: TrendingUp,
            iconBgClass: "bg-amber-50 text-amber-600",
            title: "Hiring Activity Is a Signal, Not a Buying-Intent Guarantee",
            content: <p>A common mistake is to treat every active job as proof that a company is ready to buy. SimpLeads does not make that assumption.<br/><br/>A company hiring for a particular role may be: Expanding a team, Entering a new market, Building a new capability, Replacing existing staff, Increasing operational capacity, or Responding to a changing business requirement.<br/><br/>But hiring activity alone cannot tell you exactly why the company is hiring or whether it has buying intent for your specific product or service.<br/><br/>That is why Active Job Signals work best when combined with <strong>People Search</strong>, <strong>Company Intelligence</strong>, and <strong>AI Lead Qualification & Scoring</strong>.</p>,
            callout: <p className="text-amber-800 text-sm font-medium">The job signal adds context. The qualification layer helps you decide what that context means for your specific ICP.</p>,
            imageSrc: "/features_images/active_job_signals/business_intent_signals_dashboard.png"
        },
        {
            icon: Users,
            iconBgClass: "bg-emerald-50 text-emerald-600",
            title: "Use Active Job Signals for Sales, Staffing & Business Development",
            content: <p><strong>Sales & GTM</strong><br/>Identify companies with relevant recent job activity and use it as one additional signal when prioritizing accounts for outreach.<br/><em>Example: Instead of targeting every SaaS company, target SaaS companies matching your ICP that also show recent job activity.</em><br/><br/><strong>Staffing & Recruitment Agencies</strong><br/>Active Job Signals can work as a business-development signal. Identify companies that are actively recruiting and may potentially need external hiring support. (Positioned for client/business development, not as an ATS.)<br/><br/><strong>Lead Generation & Marketing Agencies</strong><br/>Use relevant hiring activity as one additional criterion when building prospect lists for clients.</p>,
            imageSrc: "/features_images/active_job_signals/glassmorphic_target_company_dashboard.png"
        }
    ],
    extraSections: [
        function PipelineContext() {
            return (
                <section className="py-24 px-6 bg-[#0a1128] text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a1128] to-[#0a1128] pointer-events-none" />
                    <div className="max-w-5xl mx-auto relative z-10 text-center">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight text-white fade-up-item">Active Job Signals Feed Into Qualification</h2>
                        <p className="text-lg text-slate-400 mb-20 max-w-3xl mx-auto fade-up-item">
                            Job activity becomes more useful when it is connected to the rest of your prospecting context. This means job activity is not the final answer. It is one signal inside a broader qualification process.
                        </p>
                        <div className="relative max-w-4xl mx-auto fade-up-item">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
                                <div className="absolute top-[28px] left-0 w-full h-[2px] bg-slate-800 hidden md:block" />
                                <div className="absolute top-[28px] left-0 w-[50%] h-[2px] bg-gradient-to-r from-transparent to-[#1E61ED] hidden md:block" />
                                
                                {[
                                    { title: 'People', desc: 'Find professional', icon: Users, color: 'text-slate-500 border-slate-700 bg-[#0a1128]' },
                                    { title: 'Company', desc: 'Confirm account', icon: Building2, color: 'text-slate-500 border-slate-700 bg-[#0a1128]' },
                                    { title: 'Jobs', desc: 'Look for relevant job activity', icon: Briefcase, color: 'text-blue-400 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] bg-blue-400/10' },
                                    { title: 'Qualification', desc: 'Evaluate context', icon: BrainCircuit, color: 'text-slate-500 border-slate-700 bg-[#0a1128]' },
                                    { title: 'Export', desc: 'Take to next workflow', icon: Download, color: 'text-slate-500 border-slate-700 bg-[#0a1128]' }
                                ].map((step, i) => (
                                    <div key={i} className="relative z-10 flex flex-col items-center gap-3 w-32">
                                        <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${step.color}`}>
                                            <step.icon className="w-6 h-6" />
                                        </div>
                                        <div className={`font-bold text-sm ${i === 2 ? 'text-white' : 'text-slate-500'}`}>{step.title}</div>
                                        <div className="text-xs text-slate-500 leading-tight">{step.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )
        },
        function TechnicalDetails() {
            return (
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-4xl mx-auto text-center fade-up-item">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-8 tracking-tight">Keep the Pipeline Moving When Job Data Has an Issue</h2>
                        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                            The Jobs workflow includes a <strong>Fail Open Jobs</strong> option. This allows the broader workflow to continue when an individual job-data query encounters an issue rather than treating one failed job lookup as a reason to stop the entire process.<br/><br/>This is particularly useful when job data is being used as an additional qualification layer, rather than as the only source of prospects.
                        </p>
                        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 inline-block text-left max-w-2xl">
                            <h4 className="font-bold text-amber-900 mb-2">Important Notice</h4>
                            <p className="text-amber-800 text-sm leading-relaxed">
                                The availability and completeness of job information can vary. SimpLeads should not claim exhaustive job coverage or guarantee that every active opening is captured.
                            </p>
                        </div>
                    </div>
                </section>
            )
        }
    ],
    ctaBand: {
        title: <>Find the Companies Showing<br/>Relevant Activity</>,
        buttonText: "Try Active Job Signals"
    },
    faqs: [
        {
            q: 'What are Active Job Signals?',
            a: 'Active Job Signals are job-activity signals that can be used as additional business intelligence when researching and prioritizing potential prospects.'
        },
        {
            q: 'Are Active Job Signals the same as Hiring Signals?',
            a: 'Active Job Signals is the preferred product terminology. It describes the feature as a business signal rather than positioning SimpLeads as a hiring or recruitment management platform.'
        },
        {
            q: 'How do Active Job Signals help sales teams?',
            a: 'Sales teams can use relevant job activity as one additional signal when deciding which companies may deserve attention. Recent hiring activity can indicate business change or expansion, but it does not guarantee buying intent.'
        },
        {
            q: 'Can I filter job activity by job title?',
            a: 'Yes. The Jobs workflow includes a Job Title filter so you can focus on specific types of openings.'
        },
        {
            q: 'Can I filter job activity by location?',
            a: 'Yes. Job Location can be used to narrow available job activity to the geography relevant to your search.'
        },
        {
            q: 'Can I filter by job recency?',
            a: 'Yes. Job Recency can be used to focus on newer or more recent job activity.'
        },
        {
            q: 'Does an active job mean the company is ready to buy?',
            a: 'No. An active job is a signal, not proof of buying intent. It should be considered alongside company context, target-role relevance and other available information.'
        },
        {
            q: 'Is Active Job Signals an HR or recruitment tool?',
            a: 'No. The feature is positioned as business intelligence for prospecting and qualification. Staffing and recruitment agencies can use the signal for business development, but SimpLeads is not being positioned as an ATS or candidate-management platform.'
        },
        {
            q: 'Can recruiters use Active Job Signals?',
            a: 'Yes. Recruiters and staffing agencies can use job activity to identify companies that are actively hiring and may potentially have staffing needs.'
        },
        {
            q: 'Can Active Job Signals be combined with People Search?',
            a: 'Yes. Active Job Signals are part of the five-stage workflow and can be combined with People and Company criteria.'
        },
        {
            q: 'Does SimpLeads guarantee that it finds every active job?',
            a: 'No. SimpLeads should not claim exhaustive job coverage or guarantee that every active opening is captured.'
        },
        {
            q: 'Does SimpLeads guarantee that job data is always current?',
            a: 'The website should not make an absolute freshness or fixed-refresh guarantee until the underlying refresh mechanism is formally confirmed.'
        },
        {
            q: 'What happens if a job query fails?',
            a: 'The Jobs workflow includes a Fail Open Jobs option that can allow the broader workflow to continue when an individual job-data query encounters an issue.'
        }
    ]
};

export const aiLeadScoringData = {
    hero: {
        badgeIcon: BrainCircuit,
        badgeText: "AI Lead Scoring",
        title: "Lead Generation Finds Contacts. Lead Qualification Tells You <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]\">Who Matters.</span>",
        description: "A list of contacts is not a qualified pipeline.\n\nSimpLeads helps you move beyond contact discovery by evaluating available prospect and company context against your targeting requirements. The AI Lead Qualification workflow considers four core dimensions:\nNeed → Urgency → Relevance → Authority\n\nLead Scoring then helps turn that qualification context into a prioritized list so your team can decide who to focus on first.",
        primaryCta: "Try AI Lead Qualification",
        secondaryCta: "See How Scoring Works"
    },
    screenshot: {
        imageSrc: "/features_images/ai_lead_scoring/glassmorphism_qualification_dashboard.png",
        captions: [
            {
                icon: Target,
                title: "AI Lead Qualification Inputs",
                description: "Describe your company and target roles. Set Scoring controls and view the Live Estimator."
            },
            {
                icon: FileSearch,
                title: "Sample Matches & Filter Breakdown",
                description: "Review representative matches and see how the resulting prospect set is distributed before export."
            }
        ]
    },
    blocks: [
        {
            icon: AlertCircle,
            iconBgClass: "bg-rose-50 text-rose-600",
            title: "Lead Generation ≠ Lead Qualification",
            content: <p><strong>Lead generation answers:</strong> “Who can I potentially contact?”<br/><strong>Lead qualification answers:</strong> “Which of those contacts are actually worth my attention?”<br/><br/>These are different jobs. A prospect can match your job-title criteria and still be a poor opportunity. For example, a person may have the right title, work in the right industry, and be in the right location… but the company may have no obvious relevant need, the timing may be weak, or the person may not be relevant to the buying decision.<br/><br/>SimpLeads adds a qualification layer after discovery so your team has more context before deciding where to spend outreach time.</p>,
            imageSrc: "/features_images/ai_lead_scoring/from_raw_leads_to_qualified_prospects.png"
        },
        {
            icon: ShieldCheck,
            iconBgClass: "bg-emerald-50 text-emerald-600",
            title: "Four Signals for Better Lead Qualification",
            content: <p>Our qualification framework focuses on four core dimensions:</p>,
            bullets: [
                { title: "Need", desc: "Does the available information suggest a relevant business need? SimpLeads uses your company context to identify evidence." },
                { title: "Urgency", desc: "Is there a reason the opportunity may matter now? (e.g. Active Job Signals indicating expansion)." },
                { title: "Relevance", desc: "Does the prospect actually fit your target? Evaluates how closely the lead matches your requirements." },
                { title: "Authority", desc: "Is this person relevant to the decision-making process based on role and seniority?" }
            ],
            imageSrc: "/features_images/ai_lead_scoring/four_signals_lead_qualification_dashboard.png"
        },
        {
            icon: Target,
            iconBgClass: "bg-blue-50 text-blue-600",
            title: "Tell SimpLeads What You Sell",
            content: <p>AI qualification needs context. The Scoring workflow allows you to provide a <strong>Company Description</strong> so the system understands what your business does and what makes a prospect relevant to you.<br/><br/>Then define your <strong>Target Roles</strong> to specify the roles you want to sell to or engage. The available role-selection workflow helps compare lead roles against your target designations.<br/><br/>This means qualification is not based on a generic definition of a “good lead.” It is based on the relationship between: <strong>Your business + Your target roles + Available prospect/company info</strong></p>,
            imageSrc: "/features_images/ai_lead_scoring/saas_targeting_dashboard_ui.png"
        },
        {
            icon: TrendingUp,
            iconBgClass: "bg-amber-50 text-amber-600",
            title: "Active Job Signals Add Timing Context",
            content: <p>Job activity can provide another input into qualification. A recent relevant job opening may indicate expansion, a new initiative, or increased operational requirements.<br/><br/>But Active Job Signals are not proof of buying intent. SimpLeads treats them as one additional signal.<br/><br/><strong>Example:</strong> A company matching your ICP has a relevant industry, a target decision-maker, and recent relevant job activity. That combination may deserve more attention than an otherwise similar company with no comparable signal.</p>,
            imageSrc: "/features_images/ai_lead_scoring/microsoft_hiring_intelligence_dashboard.png"
        },
        {
            icon: ListFilter,
            iconBgClass: "bg-purple-50 text-purple-600",
            title: "See What Your Qualification Is Producing",
            content: <p>SimpLeads provides product-level visibility into the resulting search and scoring workflow.</p>,
            bullets: [
                { title: "Sample Matches", desc: "Review representative matches before committing to a larger export. See Name, Job title, Company." },
                { title: "Live Estimator", desc: "Understand how your filters affect the available result set as you refine your search." },
                { title: "Filter Breakdown", desc: "Review the composition of your resulting list by available categories such as industry." }
            ],
            imageSrc: "/features_images/ai_lead_scoring/filter_breakdown_analytics_dashboard.png"
        },
        {
            icon: Zap,
            iconBgClass: "bg-sky-50 text-sky-600",
            title: "Qualification Is Designed to Support Decisions, Not Replace Them",
            content: <p>AI qualification should make prospecting easier, not create false certainty. SimpLeads should therefore be positioned as decision support.<br/><br/>A high score does not guarantee: A purchase, a meeting, a response, budget availability, buying intent, or conversion.<br/><br/>Likewise, a lower-scored lead is not necessarily worthless. The score helps your team prioritize where to investigate and act first.</p>,
            imageSrc: "/features_images/ai_lead_scoring/ai-powered_lead_qualification_dashboard.png"
        }
    ],
    extraSections: [
        function PriorityWorkflow() {
            return (
                <section className="py-24 px-6 bg-slate-50">
                    <div className="max-w-4xl mx-auto text-center fade-up-item">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-8 tracking-tight">Scoring Turns Qualification Into Priority</h2>
                        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                            Qualification tells you what characteristics matter. Scoring helps you determine which leads should come first. Instead of receiving a flat list, the goal is to give your team a more useful priority order.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Define your company', 'Select target roles', 'Build criteria', 'Add Job Signals', 'Evaluate context', 'Prioritize leads', 'Export'].map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm font-bold text-sm text-slate-700">{step}</div>
                                    {i < 6 && <ArrowRight className="w-4 h-4 text-slate-400" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )
        },
        function BANTContext() {
            return (
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-4xl mx-auto text-center fade-up-item">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-8 tracking-tight">Moving Toward BANT-Ready Qualification</h2>
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                            SimpLeads is being developed toward broader BANT-style qualification. The current qualification framework focuses on Need, Urgency, Relevance, and Authority. Budget / financial qualification is currently in development.
                        </p>
                        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 inline-block text-left max-w-2xl">
                            <h4 className="font-bold text-blue-900 mb-2">From "More Leads" to "Better Priorities"</h4>
                            <p className="text-blue-800 text-sm leading-relaxed mb-4">
                                A traditional lead-generation workflow often looks like: <em>Search &rarr; Export &rarr; Spreadsheet &rarr; Manual Research &rarr; Decide</em>
                            </p>
                            <p className="text-blue-800 text-sm leading-relaxed font-bold">
                                SimpLeads aims to shorten that process: <em>Search &rarr; Understand &rarr; Signal &rarr; Qualify &rarr; Prioritize &rarr; Export</em>
                            </p>
                        </div>
                    </div>
                </section>
            )
        }
    ],
    ctaBand: {
        title: <>Stop Asking How Many Leads You Have.<br/>Start Asking Which Ones Matter.</>,
        buttonText: "Try AI Lead Qualification"
    },
    faqs: [
        {
            q: 'What is AI Lead Qualification?',
            a: 'AI Lead Qualification helps evaluate available prospect and company information against your targeting requirements so you can better prioritize which leads deserve attention.'
        },
        {
            q: 'What is the difference between lead generation and lead qualification?',
            a: 'Lead generation helps you find potential contacts. Lead qualification helps determine which contacts appear more relevant and worth prioritizing based on available business context.'
        },
        {
            q: 'What does SimpLeads use to qualify leads?',
            a: 'The qualification framework focuses on four dimensions: Need, Urgency, Relevance and Authority.'
        },
        {
            q: 'How does Relevance scoring work?',
            a: 'SimpLeads uses your company description and target roles as context when evaluating how closely available lead information matches your requirements.'
        },
        {
            q: 'Can I define my target roles?',
            a: 'Yes. The Scoring workflow includes Target Roles / Relevant Designations so you can specify the roles you want to reach.'
        },
        {
            q: 'Can Active Job Signals influence qualification?',
            a: 'Active Job Signals can provide additional timing and business context. They may indicate activity such as expansion or changing business requirements, but they do not guarantee buying intent.'
        },
        {
            q: 'Does a high score mean the prospect will buy?',
            a: 'No. A score is a prioritization signal, not a guarantee of purchase, conversion, response or budget.'
        },
        {
            q: 'Can I see sample leads before exporting?',
            a: 'Yes. The workflow includes Sample Matches so you can review representative results before committing to a larger export.'
        },
        {
            q: 'What is the Filter Breakdown?',
            a: 'Filter Breakdown provides a view of how the resulting leads are distributed across available categories such as industry, helping you understand the composition of your search.'
        },
        {
            q: 'What is the Live Estimator?',
            a: 'The Live Estimator helps you understand how your selected filters affect the available result volume while building your search.'
        },
        {
            q: 'Does SimpLeads provide full BANT qualification?',
            a: 'SimpLeads is being developed toward broader BANT-style qualification. Budget / financial qualification is currently in development and should not be represented as a fully live BANT feature.'
        },
        {
            q: 'Can AI qualification replace human sales judgment?',
            a: 'No. AI qualification is intended to support prioritization and research. Teams should use their own judgment before making outreach or business decisions.'
        },
        {
            q: 'Is scoring based only on job title?',
            a: 'No. The scoring workflow can use company context and target-role information, while available business signals such as Active Job Signals can provide additional context.'
        },
        {
            q: 'Can I use qualification for different ICPs?',
            a: 'Yes. Your company description and target roles can be adapted to the audience you are trying to reach, making the qualification workflow relevant to different prospecting campaigns.'
        }
    ]
};

export const googleMapsSearchData = {
    hero: {
        badgeIcon: MapPin,
        badgeText: "Google Maps Business Search",
        title: "Find Local Businesses by <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]\">Location</span>",
        description: "When your prospecting starts with where a business operates, a traditional B2B contact database is not always the right starting point.\n\nSimpLeads Google Maps Search is a separate discovery workflow for finding local businesses using business keywords and locations. Use AI-assisted keyword suggestions, define your target location, set the maximum results, and build a focused local prospect list.",
        primaryCta: "Try Google Maps Search Free",
        secondaryCta: null
    },
    screenshot: {
        imageSrc: "/features_images/google_maps_search/discover_local_businesses_map.png",
        captions: [
            {
                icon: Map,
                title: "Google Maps Search workflow",
                description: "Show the Google Maps Search tab with the business keyword, location, maximum results and Suggest Keywords functionality."
            },
            {
                icon: Globe,
                title: "Global Radar",
                description: "The location-oriented discovery capability for broader geographic business discovery."
            }
        ]
    },
    blocks: [
        {
            icon: Search,
            iconBgClass: "bg-blue-50 text-blue-600",
            title: "A Separate Discovery Workflow for Local Prospecting",
            content: <p>Google Maps Search works alongside the five-stage core pipeline, not as another stage within it.<br/><br/>Google Maps Search is a separate business discovery tool designed for cases where your starting point is a local business category, keyword or geographic market. Enter a business keyword and location to discover relevant local businesses without turning Google Maps into another pipeline stage.</p>,
            callout: <p className="text-blue-800 text-sm"><strong>AI-Assisted Keyword Discovery</strong><br/>If you are unsure which business keywords to search, use Suggest Keywords to generate keyword ideas from the business context you provide. This can help you explore different ways a local business category may be represented before running the search.</p>,
            imageSrc: "/features_images/google_maps_search/local_business_search_dashboard.png"
        },
        {
            icon: Store,
            iconBgClass: "bg-emerald-50 text-emerald-600",
            title: "Built for SMB Outreach, Franchise Sales & Local Agencies",
            content: <p>Google Maps Search is particularly useful when geography is part of your prospecting strategy.</p>,
            bullets: [
                { title: "Local & Service Businesses", desc: "Build lists of businesses within a specific location for local B2B outreach, partnerships or service-based prospecting." },
                { title: "Franchise & Multi-Location Sales", desc: "Explore businesses across defined markets when your sales strategy depends on specific cities, regions or territories." },
                { title: "Marketing & Growth Agencies", desc: "Discover potential local businesses to add to an agency prospecting workflow based on service category and location." },
                { title: "Location-Based Prospecting", desc: "Use business keywords together with location targeting when a broad professional database is too general for the market you are targeting." }
            ],
            imageSrc: "/features_images/google_maps_search/saas_prospecting_dashboard_map.png"
        }
    ],
    extraSections: [
        function DiscoveryWorkflow() {
            return (
                <section className="py-24 px-6 bg-[#0a1128] text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1E61ED]/20 via-[#0a1128] to-[#0a1128] pointer-events-none" />
                    <div className="max-w-5xl mx-auto relative z-10 text-center">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight text-white fade-up-item">Discover Locally. Qualify Separately. Export Cleanly.</h2>
                        <p className="text-lg text-slate-400 mb-20 max-w-3xl mx-auto fade-up-item">
                            Google Maps Search is designed for discovery, while SimpLeads’ core pipeline handles structured people and company prospecting, job signals, qualification and scoring. Google Maps Search complements the core pipeline rather than replacing it.
                        </p>
                        <div className="relative max-w-4xl mx-auto fade-up-item">
                            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { title: '1. Discover', desc: 'Find businesses through Google Maps Search using keyword + location.' },
                                    { title: '2. Review', desc: 'Identify the businesses relevant to your target market.' },
                                    { title: '3. Enrich', desc: 'Use SimpLeads search when you need additional people or company info.' },
                                    { title: '4. Qualify', desc: 'Use qualification and scoring capabilities where applicable.' },
                                    { title: '5. Export', desc: 'Move resulting data into available export formats for next workflow.' }
                                ].map((step, i) => (
                                    <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700 shadow-sm flex flex-col items-center justify-start text-center">
                                        <div className="font-bold text-white mb-2">{step.title}</div>
                                        <div className="text-sm text-slate-400">{step.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    ],
    ctaBand: {
        title: <>Build a Hyper-Local<br/>Prospect List</>,
        buttonText: "Try Google Maps Search Free"
    },
    faqs: [
        {
            q: 'What is Google Maps Search in SimpLeads?',
            a: 'Google Maps Search is a separate business-discovery workflow that helps you find local businesses using business keywords and location-based searches.'
        },
        {
            q: 'Is Google Maps Search part of the five-stage SimpLeads pipeline?',
            a: 'No. The core SimpLeads pipeline has five stages: People, Company, Jobs, Scoring and Export. Google Maps Search is a separate discovery tool that works alongside that pipeline.'
        },
        {
            q: 'How do I find local business leads with Google Maps Search?',
            a: 'Enter a business keyword and location, set the maximum number of results, and run the search. You can also use Suggest Keywords to generate keyword ideas before searching.'
        },
        {
            q: 'Can I search businesses in a specific city or region?',
            a: 'Yes. Location is part of the Google Maps Search workflow, allowing you to focus discovery on the geographic market relevant to your prospecting strategy.'
        },
        {
            q: 'What is Suggest Keywords?',
            a: 'Suggest Keywords is an AI-assisted capability that helps generate business keyword ideas from the business context you provide. It can help you explore alternative search terms before running a local business search.'
        },
        {
            q: 'What is Global Radar?',
            a: 'Global Radar is the location-oriented discovery capability within the Google Maps workflow, designed to support broader geographic business discovery.'
        },
        {
            q: 'Can Google Maps Search find decision-makers automatically?',
            a: 'Its primary role is local business discovery. When additional people-level information is required, use the appropriate People Search workflow where applicable.'
        },
        {
            q: 'Can I use Google Maps Search for local marketing agency prospecting?',
            a: 'Yes. Local and growth agencies can use business keywords and locations to build targeted lists of potential local business prospects.'
        },
        {
            q: 'Can I use Google Maps Search for franchise prospecting?',
            a: 'Yes. Franchise and multi-location sales teams can use geographic targeting to discover businesses across specific cities, regions or markets.'
        },
        {
            q: 'Is Google Maps Search the same as People Search?',
            a: 'No. People Search is designed for finding professional contacts using criteria such as titles, seniority, functions and location. Google Maps Search starts with local business discovery using business keywords and geographic targeting.'
        },
        {
            q: 'Can Google Maps Search replace the core SimpLeads pipeline?',
            a: 'No. It serves a different purpose. Google Maps Search helps with discovery, while the core pipeline provides People, Company, Jobs, Scoring and Export workflows.'
        },
        {
            q: 'Does SimpLeads directly push Google Maps leads into HubSpot or Salesforce?',
            a: 'No direct CRM push should be claimed here. Use the available Export capabilities to take the resulting data into your next workflow.'
        }
    ]
};
