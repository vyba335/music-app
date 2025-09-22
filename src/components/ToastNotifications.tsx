"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

interface Toast {
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
}

interface ToastContextType {
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = Date.now().toString();
        const newToast = { ...toast, id };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after duration
        setTimeout(() => {
           removeToast(id); 
        }, toast.duration || 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer: React.FC<{
    toasts: Toast[];
    onRemove: (id: string) => void;
}> = ({ toasts, onRemove}) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{
    toast: Toast;
    onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
    const getIcon = () => {
        switch (toast.type) {
            case "success": return <CheckCircle className="w-5 h-5" />;
            case "error": return <XCircle className="w-5 h-5" />;
            case "warning": return <AlertCircle className="w-5 h-5" />;
            case "info": return <Info className="w-5 h-5" />;
        }
    };

    const getStyles = () => {
        switch (toast.type) {
            case "success": return "bg-green-100 border-green-500 text-green-700";
            case "error": return "bg-red-100 border-red-500 text-red-700";
            case "warning": return "bg-yellow-100 border-yellow-500 text-yellow-700";
            case "info": return "bg-blue-100 border-blue-500 text-blue-700";
        }
    };

    return (
        <div className={`flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg min-w-[300px] ${getStyles()}`}>
            {getIcon()}
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                className="hover:opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};