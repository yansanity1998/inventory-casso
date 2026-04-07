import Login from './login';
import logoUrl from '../assets/casso.png';
import bgImage from '../assets/casso1.jpg';

export default function LandingPage() {
    return (
        <div className="flex h-screen w-full overflow-hidden">

            {/* Left side: Full edge-to-edge solid color gradient from the Maroon/Red palette */}
            <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative bg-gradient-to-br from-[#166534] to-[#14532d] selection:bg-white selection:text-[#166534]">
                {/* Background Image Overlay */}
                <img 
                    src={bgImage}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                />

                {/* Dark overlay to ensure red background shows through */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#166534] to-[#14532d] opacity-80"></div>

                {/* Subtle background dark wash to make it feel premium */}
                <div className="absolute inset-0 bg-black/15 pointer-events-none mix-blend-multiply"></div>

                {/* Centered Main Content with Big Logo */}
                <div className="flex flex-col items-center text-center z-10 px-12">

                    {/* BIG Logo on the left side - showing its natural colors */}
                    <div className="w-72 h-72 rounded-full overflow-hidden mb-8 drop-shadow-2xl transition-transform hover:scale-105 duration-700 flex items-center justify-center bg-white/10">
                        <img
                            src={logoUrl}
                            alt="City Assessor Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest mb-4 uppercase drop-shadow-md">
                        ILIGAN CITY
                    </h1>
                    <p className="text-white/80 tracking-[0.15em] text-[13px] md:text-sm font-semibold uppercase font-[var(--sans)] leading-relaxed">
                        Assessor's Office Digital Portal
                    </p>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white relative px-6 md:px-12">

                {/* Form Container (No card container, directly on background) */}
                <div className="w-full max-w-[360px]">
                    <Login />
                </div>

                {/* Footer text pinned to bottom */}
                <div className="absolute bottom-10 w-full text-center left-0">
                    <p className="text-[10px] tracking-[0.2em] text-[var(--text)]/40 uppercase font-bold">
                        Created for Iligan City Assessor's Office 2026
                    </p>
                </div>
            </div>

        </div>
    );
}
