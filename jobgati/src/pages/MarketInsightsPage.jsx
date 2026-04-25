import React from "react";
import { Sidebar } from "../components/HelperComponents";
import { motion } from "framer-motion";
import { 
    TrendingUp, TrendingDown, Users, Briefcase, 
    AlertTriangle, CheckCircle2, ArrowUpRight, 
    ArrowDownRight, Info, Zap
} from "lucide-react";

const TRENDING_JOBS = [
    { 
        role: "Store Associate", 
        hired: 124, 
        fired: 12, 
        trend: "up", 
        growth: "+15%", 
        risk: "Low", 
        demand: "Very High",
        color: "blue"
    },
    { 
        role: "Delivery Partner", 
        hired: 450, 
        fired: 89, 
        trend: "up", 
        growth: "+24%", 
        risk: "Medium", 
        demand: "High",
        color: "orange"
    },
    { 
        role: "Data Entry", 
        hired: 45, 
        fired: 62, 
        trend: "down", 
        growth: "-8%", 
        risk: "High", 
        demand: "Decreasing",
        color: "red"
    },
    { 
        role: "BPO/Call Center", 
        hired: 210, 
        fired: 45, 
        trend: "up", 
        growth: "+12%", 
        risk: "Medium", 
        demand: "Stable",
        color: "green"
    }
];

const StatCard = ({ title, value, subtext, icon, trend }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:border-black transition-all">
        <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {trend === 'up' ? 'Hot' : 'Cooling'}
                </div>
            )}
        </div>
        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-4xl font-black text-black tracking-tight mb-2">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{subtext}</p>
    </div>
);

const MarketInsightsPage = () => {
    return (
        <div className="flex min-h-screen bg-[#F8F9FA] font-sans selection:bg-black selection:text-white">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                {/* Header */}
                <header className="p-12 rounded-[3rem] bg-white border border-gray-100 shadow-sm mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full opacity-50 -z-0" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest">Live Market Data</span>
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Updated 2h ago</span>
                        </div>
                        <h1 className="text-5xl font-black text-black tracking-tighter mb-4 leading-none">
                            Jobs <span className="text-blue-600">Market</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed">
                            Real-time hiring trends and risk analysis. Use this data to make informed decisions about your next career move.
                        </p>
                    </div>
                </header>

                {/* Overall Stats */}
                <div className="grid grid-cols-3 gap-8 mb-12">
                    <StatCard 
                        title="Monthly New Hires" 
                        value="2.4k+" 
                        subtext="Across all sectors in your city" 
                        icon={<Users size={24} />} 
                        trend="up" 
                    />
                    <StatCard 
                        title="Active Vacancies" 
                        value="840" 
                        subtext="Jobs matching your skill set" 
                        icon={<Briefcase size={24} />} 
                        trend="up" 
                    />
                    <StatCard 
                        title="Market Stability" 
                        value="82%" 
                        subtext="Percentage of low-risk roles" 
                        icon={<Zap size={24} />} 
                    />
                </div>

                {/* Trending Jobs Table */}
                <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
                    <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-tight mb-1">Trending Occupations</h2>
                            <p className="text-gray-400 text-sm font-medium">Hiring vs. Firing ratios and future outlook.</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-2xl font-bold text-xs cursor-pointer hover:bg-blue-100 transition">
                            <Info size={14} /> How we calculate risk?
                        </div>
                    </div>
                    
                    <div className="p-4">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                    <th className="px-6 py-4">Job Role</th>
                                    <th className="px-6 py-4 text-center">Monthly Hired</th>
                                    <th className="px-6 py-4 text-center">Monthly Fired</th>
                                    <th className="px-6 py-4">Growth</th>
                                    <th className="px-6 py-4">Risk Level</th>
                                    <th className="px-6 py-4">Demand</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {TRENDING_JOBS.map((job, i) => (
                                    <motion.tr 
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl bg-${job.color}-50 text-${job.color}-600 flex items-center justify-center font-black`}>
                                                    {job.role.charAt(0)}
                                                </div>
                                                <span className="font-bold text-black">{job.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-center font-bold text-gray-700">{job.hired}</td>
                                        <td className="px-6 py-8 text-center font-bold text-red-500">{job.fired}</td>
                                        <td className="px-6 py-8">
                                            <div className={`flex items-center gap-1 font-black ${job.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                {job.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                {job.growth}
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                job.risk === 'Low' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                job.risk === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                                                'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                                {job.risk} Risk
                                            </span>
                                        </td>
                                        <td className="px-6 py-8">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full bg-${job.color}-600 rounded-full`}
                                                        style={{ width: job.demand === 'Very High' ? '100%' : job.demand === 'High' ? '75%' : '40%' }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{job.demand}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Recommendations */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="bg-green-50 p-10 rounded-[3rem] border border-green-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-xl font-black text-green-900">Green Flag Roles</h3>
                        </div>
                        <p className="text-green-800/70 font-medium mb-6">These roles show high stability and consistent hiring trends. Recommended for long-term career growth.</p>
                        <div className="space-y-3">
                            {["Store Associate", "Retail Manager", "Customer Support"].map((role, i) => (
                                <div key={i} className="bg-white/50 p-4 rounded-2xl flex items-center justify-between">
                                    <span className="font-bold text-green-900">{role}</span>
                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Highly Stable</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-black text-red-900">High Risk Roles</h3>
                        </div>
                        <p className="text-red-800/70 font-medium mb-6">Proceed with caution. These sectors are currently experiencing higher firing rates or decreasing demand.</p>
                        <div className="space-y-3">
                            {["Data Entry", "Temporary Staff", "Manual Labor"].map((role, i) => (
                                <div key={i} className="bg-white/50 p-4 rounded-2xl flex items-center justify-between">
                                    <span className="font-bold text-red-900">{role}</span>
                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">High Volatility</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MarketInsightsPage;
