import React from 'react';
import { Target, Users, Search, Briefcase, MapPin, Database, LineChart, FileSearch } from 'lucide-react';

export const solutionsData = {
    'sales-teams': {
        metaTitle: "Simpleads for Sales Teams: Outbound Prospecting & AI Scoring",
        metaDescription: "Give your SDRs and AEs verified contacts, hiring signals and AI-scored leads to cut research time and book more meetings.",
        hero: {
            badgeIcon: Target,
            badgeText: "For Sales Teams",
            title: "Outbound Prospecting & <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]\">AI Scoring</span>",
            description: "SDRs spend a shocking share of their day just deciding who to call, not calling them. Simpleads collapses that research step into one filtered, scored, exported list -- built for outbound teams working real pipeline quotas.",
            primaryCta: "Start Free for Sales Teams",
        },
        screenshot: {
            imageSrc: "/features_images/ai_lead_scoring/from_raw_leads_to_qualified_prospects.png",
            captions: [
                {
                    icon: Database,
                    title: "AI Scoring Sample Matches",
                    description: "Real scored leads ready to hand directly to an SDR queue, illustrating who to call first."
                }
            ]
        },
        blocks: [
            {
                icon: Users,
                iconBgClass: "bg-blue-50 text-blue-600",
                title: "Build Hyper-Targeted Prospect Lists Fast",
                content: <p>Combine People Search (title, seniority, verified contact data) with Company Intelligence (industry, size, domain) to build a list that's already ICP-fit before Scoring even ranks it -- no more manually cross-checking a spreadsheet against your ideal customer profile.</p>,
                imageSrc: "/features_images/search_settings_ui_card.png"
            },
            {
                icon: Briefcase,
                iconBgClass: "bg-purple-50 text-purple-600",
                title: "Reduce Research Time With Hiring-Signal Prioritization",
                content: <p>Enable Job Postings to surface accounts that are visibly hiring -- and therefore visibly growing -- so your reps spend their limited outreach time on the accounts most likely to have budget and urgency right now.</p>,
                imageSrc: "/features_images/active_job_signals/job_activity_filters_dashboard.png"
            },
            {
                icon: Target,
                iconBgClass: "bg-emerald-50 text-emerald-600",
                title: "AI Scoring for Sales Pipeline Prioritization",
                content: <p>AI Scoring ranks every lead against your company description and target roles, so a rep's daily list is already ordered by relevance -- not a flat alphabetical export they have to triage themselves.</p>,
                imageSrc: "/features_images/ai_lead_scoring/ai-powered_lead_qualification_dashboard.png"
            },
            {
                icon: LineChart,
                iconBgClass: "bg-amber-50 text-amber-600",
                title: "One Export, Straight Into Your Sequence Tool",
                content: <p>Push scored leads directly into HubSpot or Salesforce, or export a clean CSV for your sequencing tool of choice -- no manual reformatting between Simpleads and wherever your reps actually work.</p>,
                imageSrc: "/features_images/export.png"
            }
        ],
        ctaBand: {
            title: <>Give your reps a prioritized list, not a spreadsheet.<br/>AI-scored, hiring-signal-backed, CRM-ready.</>,
            buttonText: "Start Free for Sales Teams"
        },
        faqs: [
            { q: "What's the best lead generation tool for an SDR team doing cold outreach?", a: "Simpleads combines verified contact search, firmographic filtering, hiring signals and AI scoring in one pipeline, purpose-built for outbound prioritization." },
            { q: "How can sales teams cut prospecting research time with AI scoring?", a: "AI Scoring ranks leads by relevance to your company and target roles automatically, replacing the manual triage step reps would otherwise do themselves." },
            { q: "Is there a tool that combines contact data with hiring signals for sales?", a: "Yes -- Simpleads' Jobs step cross-references your contact list against live job postings in the same pipeline used for People and Company search." }
        ]
    },
    'recruiters': {
        metaTitle: "Simpleads for Recruiters & Staffing Agencies: Hiring Signal Leads",
        metaDescription: "Find companies actively hiring, cross-reference job data and build client outreach lists for recruiting and staffing business development.",
        hero: {
            badgeIcon: Briefcase,
            badgeText: "For Recruiters",
            title: "Hiring Signal Leads for <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]\">Business Development</span>",
            description: "Most recruiting tools help you source candidates. Simpleads helps you find your next client -- companies that are actively hiring right now and don't yet have a staffing partner.",
            primaryCta: "Start Free for Staffing Agencies",
        },
        screenshot: {
            imageSrc: "/features_images/active_job_signals/job_activity_filters_dashboard.png",
            captions: [
                {
                    icon: FileSearch,
                    title: "Job Filters as a Client-Development Tool",
                    description: "Any company with fresh open roles matching your placement specialty is a warm business-development lead."
                }
            ]
        },
        blocks: [
            {
                icon: Briefcase,
                iconBgClass: "bg-blue-50 text-blue-600",
                title: "Job Posting Data as Business Development, Not Just Sourcing",
                content: <p>Filter live job postings by title, location and recency to find companies with open roles matching your placement specialty -- a direct list of businesses who need staffing help this week, not a cold guess.</p>,
                imageSrc: "/features_images/active_job_signals/business_intent_signals_dashboard.png"
            },
            {
                icon: Search,
                iconBgClass: "bg-emerald-50 text-emerald-600",
                title: "Find Companies With Open Roles to Pitch Staffing Services",
                content: <p>Combine Job Postings with Company Intelligence (industry, size) to narrow your target list to companies in your specialty niche and size range -- then export contact details for the hiring manager or HR lead via People Search.</p>,
                imageSrc: "/features_images/ai_lead_scoring/four_signals_lead_qualification_dashboard.png"
            },
            {
                icon: Users,
                iconBgClass: "bg-purple-50 text-purple-600",
                title: "A Candidate and Client Sourcing Tool in One Pipeline",
                content: <p>The same People Search filters used for client outreach also work for candidate sourcing -- title, seniority and location filters apply whether you're finding a hiring manager to pitch or a candidate to place.</p>,
                imageSrc: "/features_images/people_search.png"
            }
        ],
        ctaBand: {
            title: <>Turn job postings into a client pipeline.<br/>Filter by role, location and recency.</>,
            buttonText: "Start Free for Staffing Agencies"
        },
        faqs: [
            { q: "What tool helps staffing agencies find companies that are hiring?", a: "Simpleads' Jobs step filters live job postings by title, location and recency, surfacing companies with open roles as business-development leads." },
            { q: "How can recruiters use job posting data to find new business leads?", a: "Filter job postings to your placement specialty and company-size range, then pull hiring-manager or HR contact details via People Search for direct outreach." },
            { q: "Is there a sales intelligence tool built for recruitment agency BD teams?", a: "Simpleads applies the same contact-search and hiring-signal pipeline used by sales teams to recruitment agency business development." }
        ]
    },
    'agencies': {
        metaTitle: "Simpleads for Agencies: Local & B2B Client Prospecting",
        metaDescription: "Marketing and growth agencies use Simpleads to find local businesses and B2B prospects, score them by fit, and export clean lists for new business outreach.",
        hero: {
            badgeIcon: MapPin,
            badgeText: "For Agencies",
            title: "Local & B2B Client <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]\">Prospecting</span>",
            description: "Whether your agency sells to local businesses or B2B accounts, Simpleads covers both prospecting motions in one platform -- Google Maps Search for hyper-local leads, the core pipeline for B2B accounts.",
            primaryCta: "Start Free for Agencies",
        },
        screenshot: {
            imageSrc: "/features_images/google_maps_search/discover_local_businesses_map.png",
            captions: [
                {
                    icon: MapPin,
                    title: "Two Prospecting Motions in One",
                    description: "The Google Maps Search workflow alongside the core Lead Gen Pipeline -- illustrating local and B2B motions."
                }
            ]
        },
        blocks: [
            {
                icon: MapPin,
                iconBgClass: "bg-blue-50 text-blue-600",
                title: "Google Maps Prospecting for Local Client Acquisition",
                content: <p>For agencies selling to local businesses, Google Maps Search builds a city- or region-specific prospect list -- a direct fit for local SEO, local ads or local social management pitches.</p>,
                imageSrc: "/features_images/google_maps_search/local_business_search_dashboard.png"
            },
            {
                icon: Database,
                iconBgClass: "bg-emerald-50 text-emerald-600",
                title: "B2B Prospecting for Agencies Targeting Companies, Not Storefronts",
                content: <p>For agencies selling to B2B accounts, the core People and Company pipeline filters by title, seniority, industry and size -- the same targeting precision a sales team would use, applied to new-business outreach instead.</p>,
                imageSrc: "/features_images/company_filter.png"
            },
            {
                icon: LineChart,
                iconBgClass: "bg-purple-50 text-purple-600",
                title: "Clean Exports for Agency Reporting",
                content: <p>Export new-business lists as CSV or push directly into your CRM -- the same Export step used across the platform, so agency BD teams aren't managing a separate tool just for their own client acquisition.</p>,
                imageSrc: "/features_images/export.png"
            }
        ],
        ctaBand: {
            title: <>Prospect local and B2B clients from one platform.<br/>Google Maps Search plus the full B2B pipeline.</>,
            buttonText: "Start Free for Agencies"
        },
        faqs: [
            { q: "What tool helps marketing agencies find new local business clients?", a: "Simpleads' Google Maps Search builds city- or region-specific business lists, suited to local SEO, ads or social management pitches." },
            { q: "How can agencies build B2B prospect lists for new business outreach?", a: "Use the core People and Company Intelligence filters -- title, seniority, industry, size -- the same way a sales team would, applied to agency new-business targets." },
            { q: "Is there a lead generation platform designed for agency new-business teams?", a: "Simpleads supports both local (Google Maps) and B2B (core pipeline) prospecting motions from a single account, covering most agency new-business use cases." }
        ]
    }
};
