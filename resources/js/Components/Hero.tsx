import {ArrowRight, Box, Cpu, Database, Globe, Zap} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background-dark">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] animate-float" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/50 to-background-dark" />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary-dark">
                            v2.0 Neural Engine Live
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-6xl md:text-8xl font-serif text-text-primary-dark leading-[0.9] tracking-tighter">
                        Architecting <br />
                        <span className="text-gradient">Intelligence.</span>
                    </h1>

                    {/* Description */}
                    <p className="max-w-md text-lg text-text-secondary-dark leading-relaxed">
                        Deploy advanced RAG pipelines and autonomous agents with industrial precision.
                        Zero hallucinations. Infinite scalability.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="gold-gradient text-background-dark px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(200,166,69,0.2)] group">
                            Initialise Core
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 rounded-xl font-bold text-lg glass text-text-primary-dark hover:bg-white/5 transition-colors border-white/10">
                            View Documentation
                        </button>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
                        {[
                            { label: 'Latency', value: '42ms', icon: Cpu },
                            { label: 'Accuracy', value: '99.9%', icon: Database },
                            { label: 'Nodes', value: '1.2k', icon: Globe },
                        ].map((metric, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center gap-2 text-text-secondary-dark">
                                    <metric.icon className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">{metric.label}</span>
                                </div>
                                <div className="text-2xl font-serif text-text-primary-dark">{metric.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual Core - Knowledge Sphere Simulation */}
                <div className="relative aspect-square flex items-center justify-center">
                    <div className="absolute inset-0 bg-secondary/5 rounded-full blur-3xl animate-pulse" />

                    {/* The "Sphere" */}
                    <div className="relative w-80 h-80 md:w-full md:h-full max-w-[500px] max-h-[500px]">
                        <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-10 rounded-full border border-secondary/20 animate-[spin_15s_linear_infinite_reverse]" />
                        <div className="absolute inset-20 rounded-full border border-white/10 animate-[spin_25s_linear_infinite]" />

                        {/* Floating Knowledge Nodes */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-12 h-12 glass rounded-xl flex items-center justify-center animate-float"
                                style={{
                                    top: `${20 + Math.random() * 60}%`,
                                    left: `${20 + Math.random() * 60}%`,
                                    animationDelay: `${i * 0.8}s`,
                                    animationDuration: `${5 + Math.random() * 5}s`
                                }}
                            >
                                <Box className="w-6 h-6 text-secondary" />
                            </div>
                        ))}

                        {/* Center Core */}
                        <div className="absolute inset-[30%] gold-gradient rounded-3xl rotate-45 flex items-center justify-center shadow-[0_0_100px_rgba(200,166,69,0.3)] group hover:scale-110 transition-transform duration-700">
                            <Zap className="w-16 h-16 text-background-dark fill-background-dark -rotate-45" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
