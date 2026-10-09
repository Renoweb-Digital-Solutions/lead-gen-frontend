import React from 'react';
import { Target } from 'lucide-react';

export default function BottomCTA({
    title = (
        <>
            Find More Than Contacts.<br />
            Find Your Priorities.
        </>
    ),
    buttonText = "Start Exploring SimpLeads",
    onButtonClick,
    desktopImage = "/features_images/CTA_desktop.png",
    mobileImage = "/features_images/CTA_mobile.png",
    icon: Icon = Target,
}) {
    return (
        <section className="py-16 md:py-24 px-4 sm:px-6 max-w-[1350px] mx-auto fade-up-item">
            {/* Outer Rounded Gradient Card */}
            <div className="relative w-full rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[3.2rem] overflow-hidden bg-gradient-to-b from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] pt-12 sm:pt-16 md:pt-20 px-0 flex flex-col items-center text-center shadow-[0_25px_60px_rgba(37,99,235,0.35)] border border-white/20 group">

                {/* Background Ambient Lighting */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-60">
                    <div className="absolute -top-[20%] left-[20%] w-[60%] h-[50%] bg-[#60efff] blur-[110px] rounded-full animate-pulse [animation-duration:6s]" />
                    <div className="absolute top-[30%] -right-[10%] w-[50%] h-[60%] bg-[#93c5fd] blur-[120px] rounded-full" />
                </div>

                {/* Text & Icon Wrapper */}
                <div className="w-full px-4 sm:px-8 flex flex-col items-center">
                    {/* Top Squircle Icon Badge */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] flex items-center justify-center mb-6 sm:mb-8 relative z-10 hover:scale-105 transition-transform duration-300">
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#2563EB]" />
                    </div>

                    {/* Main Headline */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold text-white max-w-3xl mx-auto leading-[1.12] mb-8 tracking-tight relative z-10 drop-shadow-sm">
                        {title}
                    </h2>

                    {/* Action Button */}
                    <button
                        onClick={onButtonClick}
                        className="bg-white text-[#2563EB] font-bold text-base sm:text-lg px-8 py-3.5 sm:px-10 sm:py-4 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.28)] hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-300 relative z-10 mb-12 sm:mb-16 cursor-pointer"
                    >
                        {buttonText}
                    </button>
                </div>

                {/* Bottom Mockups Container - Much Wider! */}
                <div className="absolute top-10 -bottom-40 w-full max-w-[1250px] mx-auto relative z-10 flex justify-center items-end px-2 sm:px-6 md:px-8">
                    <div className="relative w-full flex justify-center items-end">

                        {/* Desktop Browser Window Mockup */}
                        <div className="w-full md:w-[94%] rounded-t-2xl sm:rounded-t-3xl border-t border-x border-slate-700/60 shadow-[0_-15px_45px_rgba(0,0,0,0.45)] bg-[#1c2438] overflow-hidden transform-gpu group-hover:-translate-y-1.5 transition-transform duration-500 ease-out translate-y-0.5">
                            {/* Browser Top Bar */}
                            <div className="flex items-center gap-1.5 px-4 py-2.5 sm:py-3 bg-[#1c2438] border-b border-white/10">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-500/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-500/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-500/70" />
                            </div>

                            {/* Image Container */}
                            <div className="w-full h-[260px] sm:h-[380px] md:h-[460px] lg:h-[540px] overflow-hidden bg-slate-900">
                                <img
                                    src={desktopImage}
                                    alt="Desktop View"
                                    className="w-full h-auto block object-top"
                                />
                            </div>
                        </div>

                        {/* Mobile Phone Mockup */}
                        <div className="absolute right-0 sm:right-[1%] md:right-[2%] lg:right-[1%] bottom-0 w-[42%] sm:w-[32%] md:w-[26%] max-w-[280px] min-w-[150px] rounded-t-[2.2rem] sm:rounded-t-[3rem] border-[6px] sm:border-[10px] border-b-0 border-[#0f172a] shadow-[0_-12px_40px_rgba(0,0,0,0.65)] bg-[#0f172a] overflow-hidden z-20 transform-gpu group-hover:-translate-y-3 transition-transform duration-500 ease-out delay-75">
                            {/* iPhone Dynamic Island */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-4 sm:h-5 bg-black rounded-full z-30 flex items-center justify-center gap-1.5 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-[#1c2438]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                            </div>

                            {/* Mobile Image Container */}
                            <div className="w-full h-[270px] sm:h-[380px] md:h-[480px] lg:h-[560px] overflow-hidden bg-slate-950 pt-5 sm:pt-7">
                                <img
                                    src={mobileImage}
                                    alt="Mobile View"
                                    className="w-full h-auto block object-top"
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

