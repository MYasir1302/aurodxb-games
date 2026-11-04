'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Game Feedback',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="p-8 sm:p-12 rounded-3xl bg-brand-card border border-brand-border shadow-2xl">
        <span className="text-xs font-mono font-bold text-brand-purple uppercase tracking-widest block mb-2">
          GET IN TOUCH
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
          Contact <span className="text-brand-cyan">AuroDXB</span>
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed mb-8">
          Have an idea for a new car game? Experiencing a bug on your device? Or interested in advertising partnerships? Send us a message and our development team will respond within 24 hours.
        </p>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-brand-darker border border-green-500/40 text-center animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
            <p className="text-xs text-gray-400 mb-6">
              Thank you for reaching out to AuroDXB Games. We have received your note and will be in touch shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', subject: 'Game Feedback', message: '' });
              }}
              className="px-6 py-2.5 rounded-xl bg-brand-border hover:bg-brand-cyan hover:text-brand-darker text-xs font-bold transition"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Miller"
                  className="w-full px-4 py-3 rounded-xl bg-brand-darker border border-brand-border focus:border-brand-cyan focus:outline-none text-sm text-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-brand-darker border border-brand-border focus:border-brand-cyan focus:outline-none text-sm text-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-brand-darker border border-brand-border focus:border-brand-cyan focus:outline-none text-sm text-gray-200"
              >
                <option value="Game Feedback">Game Feedback & Feature Request</option>
                <option value="Bug Report">Technical Bug Report</option>
                <option value="Advertising">Google AdSense / Sponsorship Inquiries</option>
                <option value="General">General Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Your Message *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Let us know how we can improve AuroDXB Games..."
                className="w-full px-4 py-3 rounded-xl bg-brand-darker border border-brand-border focus:border-brand-cyan focus:outline-none text-sm text-gray-200"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-brand-darker font-black text-sm tracking-wider hover:brightness-110 shadow-neonCyan transition"
            >
              <Send className="w-4 h-4" /> SEND MESSAGE
            </button>
          </form>
        )}

        <div className="mt-10 pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <span>Direct Email: <strong>support@aurodxb.com</strong></span>
          <span>Location: Dubai, UAE (Operating Globally)</span>
        </div>
      </div>
    </div>
  );
}
