import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Unlock, Save, Settings } from "lucide-react";

interface GreetingData {
  day: number;
  emoji: string;
  title: string;
  greeting: string;
  message: string;
  decorativeEmojis: string[];
}

interface AdminPanelProps {
  onClose: () => void;
  onSave: (greetings: GreetingData[], unlockedDays: number) => void;
  initialGreetings: GreetingData[];
  initialUnlockedDays: number;
}

export function AdminPanel({
  onClose,
  onSave,
  initialGreetings,
  initialUnlockedDays,
}: AdminPanelProps) {
  const [greetings, setGreetings] = useState<GreetingData[]>(initialGreetings);
  const [unlockedDays, setUnlockedDays] = useState(initialUnlockedDays);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await onSave(greetings, unlockedDays);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Хадгалахад алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };

  const handleGreetingChange = (day: number, field: keyof GreetingData, value: string) => {
    setGreetings((prev) =>
      prev.map((g) => (g.day === day ? { ...g, [field]: value } : g))
    );
  };

  const toggleDayUnlock = (day: number) => {
    if (day <= unlockedDays) {
      // Unlocking backwards - unlock all days up to the selected one
      setUnlockedDays(day - 1);
    } else {
      // Unlocking forward - unlock all days up to the selected one
      setUnlockedDays(day);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <h2 className="text-2xl">Admin Panel</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
            {/* Unlock Control Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <Unlock className="w-5 h-5" />
                Unlock Days
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Control which days are accessible to users. Click to unlock/lock days.
              </p>
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4].map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDayUnlock(day)}
                    className={`
                      px-6 py-3 rounded-lg transition-all flex items-center gap-2
                      ${
                        day <= unlockedDays
                          ? "bg-green-500 text-white hover:bg-green-600 shadow-lg"
                          : "bg-gray-300 text-gray-600 hover:bg-gray-400"
                      }
                    `}
                  >
                    {day <= unlockedDays ? (
                      <Unlock className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Day {day}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Currently unlocked: Day 1 - Day {unlockedDays}
              </p>
            </div>

            {/* Edit Greetings Section */}
            <div>
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <Save className="w-5 h-5" />
                Edit Daily Greetings
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Customize the greeting message shown when users open each day.
              </p>

              <div className="space-y-4">
                {greetings.map((greeting) => (
                  <div
                    key={greeting.day}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() =>
                        setEditingDay(editingDay === greeting.day ? null : greeting.day)
                      }
                      className="w-full p-4 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between hover:from-gray-100 hover:to-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{greeting.emoji}</span>
                        <div className="text-left">
                          <h4 className="font-medium">{greeting.title}</h4>
                          <p className="text-sm text-gray-600">{greeting.greeting}</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: editingDay === greeting.day ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {editingDay === greeting.day && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-white space-y-4 border-t border-gray-200">
                            <div>
                              <label className="block text-sm mb-2 text-gray-700">
                                Emoji
                              </label>
                              <input
                                type="text"
                                value={greeting.emoji}
                                onChange={(e) =>
                                  handleGreetingChange(greeting.day, "emoji", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-2xl"
                                placeholder="💛"
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-2 text-gray-700">
                                Title
                              </label>
                              <input
                                type="text"
                                value={greeting.title}
                                onChange={(e) =>
                                  handleGreetingChange(greeting.day, "title", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Day 1"
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-2 text-gray-700">
                                Greeting Message
                              </label>
                              <input
                                type="text"
                                value={greeting.greeting}
                                onChange={(e) =>
                                  handleGreetingChange(greeting.day, "greeting", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Good morning, sunshine!"
                              />
                            </div>

                            <div>
                              <label className="block text-sm mb-2 text-gray-700">
                                Full Message
                              </label>
                              <textarea
                                value={greeting.message}
                                onChange={(e) =>
                                  handleGreetingChange(greeting.day, "message", e.target.value)
                                }
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                placeholder="Write your heartfelt message here..."
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Changes are saved to Firestore database
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSave}
                  disabled={saving}
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                  className={`
                    px-6 py-2 rounded-lg transition-all flex items-center gap-2
                    ${
                      saved
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                    }
                    ${saving ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Хадгалж байна..." : saved ? "Хадгалагдлаа!" : "Хадгалах"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
