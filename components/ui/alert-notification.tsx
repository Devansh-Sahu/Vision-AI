import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

type AlertType = 'hazard' | 'drowsiness' | null;

interface AlertNotificationProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

export function AlertNotification({ type, message, onClose }: AlertNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!type) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-start space-x-3"
      >
        <AlertTriangle className="h-6 w-6 text-white flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium">
            {type === 'hazard' ? 'Hazard Detected!' : 'Drowsiness Detected!'}
          </h3>
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
