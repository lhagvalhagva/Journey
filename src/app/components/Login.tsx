import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, LogIn, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isFirebaseConfigured } from '../../lib/firebase';

interface LoginProps {
  onClose?: () => void;
}

export function Login({ onClose }: LoginProps = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [firebaseWarning, setFirebaseWarning] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setFirebaseWarning(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Close modal after successful login
      if (onClose) {
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Нэвтрэхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          if (onClose) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md bg-[var(--journey-card-bg)] backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-[var(--journey-beige)]/20"
          onClick={(e) => e.stopPropagation()}
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-[var(--journey-beige)]" />
            </button>
          )}
          <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="inline-block p-4 rounded-full bg-gradient-to-br from-[var(--journey-rose)]/20 to-[var(--journey-gold)]/20 mb-4"
          >
            <Lock className="w-8 h-8 text-[var(--journey-gold)]" />
          </motion.div>
          <h2 className="text-2xl text-[var(--journey-beige)] mb-2">Нэвтрэх</h2>
          <p className="text-sm text-[var(--journey-beige)]/60">
            Admin Panel-г удирдахад нэвтрэх шаардлагатай
          </p>
        </div>

        {firebaseWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Firebase тохируулаагүй байна</p>
                <p className="text-xs opacity-80">
                  .env файл үүсгэж Firebase config утгуудыг оруулна уу. README.md файлд заавар байна.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}

          <div>
            <label className="block text-sm text-[var(--journey-beige)]/80 mb-2">
              Имэйл
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--journey-beige)]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[var(--journey-charcoal)]/40 border border-[var(--journey-beige)]/20 rounded-lg text-[var(--journey-beige)] placeholder:text-[var(--journey-beige)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--journey-gold)]/50 focus:border-[var(--journey-gold)]/50 transition-all"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[var(--journey-beige)]/80 mb-2">
              Нууц үг
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--journey-beige)]/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[var(--journey-charcoal)]/40 border border-[var(--journey-beige)]/20 rounded-lg text-[var(--journey-beige)] placeholder:text-[var(--journey-beige)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--journey-gold)]/50 focus:border-[var(--journey-gold)]/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--journey-rose)] to-[var(--journey-gold)] text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Нэвтэрч байна...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Нэвтрэх</span>
              </>
            )}
          </motion.button>
        </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
