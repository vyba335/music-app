"use client";
import React, { useState, useEffect } from "react";
import { Activity, Clock, Database, Cpu, Wifi } from "lucide-react";

interface PerformanceMetrics {
    apiResponseTime: number;
    cacheHitRate: number;
    activeConnections: number;
    memoryUsage: number;
    lastUpdated: string;
}

const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simulate performance monitoring
        const updateMetrics = () => {
            setMetrics({
                apiResponseTime: Math.random() * 200 + 100,
                cacheHitRate: Math.random() * 40 + 60,
                activeConnections: Math.floor(Math.random() * 50) + 10,
                memoryUsage: Math.random() * 30 + 40,
                lastUpdated: new Date().toLocaleTimeString()
            });
        };

        updateMetrics();
        const interval = setInterval(updateMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    // Show only in development for admins
    useEffect(() => {
        const isDev = process.env.NODE_ENV === "development";
        setIsVisible(isDev);
    }, []);

    if (!isVisible || !metrics) return null;

    const getHealthColor = (value: number, thresholds: { good: number, warning: number}) => {
        if (value <= thresholds.good) return "text-green-500";
        if (value <= thresholds.warning) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="fixed bottom-16 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg text-xs border border-gray-700 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-[#95c623]" />
                <span className="font-semibold">Performace Monitor</span>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        API Response
                    </span>
                    <span className={getHealthColor(metrics.apiResponseTime, { good: 150, warning: 250 })}>
                        {metrics.apiResponseTime.toFixed(0)}ms
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        Cache Hit Rate
                    </span>
                    <span className={getHealthColor(100 - metrics.cacheHitRate, { good: 20, warning: 40 })}>
                        {metrics.cacheHitRate.toFixed(1)}%
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3" />
                        Connections
                    </span>
                    <span className="text-blue-400">{metrics.activeConnections}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        Memory
                    </span>
                    <span className={getHealthColor(metrics.memoryUsage, { good: 50, warning: 75 })}>
                        {metrics.memoryUsage.toFixed(1)}%
                    </span>
                </div>

                <div className="text-gray-400 text-center pt-2 border-t border-gray-700">
                    Updated: {metrics.lastUpdated}
                </div>
            </div>
        </div>
    );
};

export default PerformanceMonitor;