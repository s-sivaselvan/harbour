import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19.5V4.5L18 12z" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight">HarbourOS</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <div className="max-w-xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-6">
              Port Management Platform
            </span>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Run your harbour operations <span className="text-blue-600">efficiently</span>
            </h1>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              A reliable system for managing ships, berths, cargo, and billing -
              built for modern port authorities and operators.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-10 pt-8 border-t border-slate-200">
              <div>
                <p className="text-3xl font-bold text-blue-600">450+</p>
                <p className="text-sm text-slate-500 mt-1">Ports using</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">99.9%</p>
                <p className="text-sm text-slate-500 mt-1">Uptime SLA</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">24/7</p>
                <p className="text-sm text-slate-500 mt-1">Support</p>
              </div>
            </div>
          </div>

          {/* Right - Features */}
          <div className="grid sm:grid-cols-2 gap-6">

            {[
              {
                title: "Ship Management",
                desc: "Track vessel arrivals, departures, and ETAs with real-time visibility."
              },
              {
                title: "Berth Allocation",
                desc: "Smart dock scheduling to reduce wait times and maximize throughput."
              },
              {
                title: "Cargo Tracking",
                desc: "Monitor shipments with live status updates and inventory control."
              },
              {
                title: "Billing System",
                desc: "Automated invoicing with transparent pricing and service tracking."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm
                           hover:shadow-md hover:border-blue-200 transition-all"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-sm text-slate-500 text-center">
            Trusted by ports in 23+ countries · SOC 2 compliant · ISO 27001 certified
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
