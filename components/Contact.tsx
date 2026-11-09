'use client';

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send, CheckCircle2, AlertCircle, Loader2, MailCheck } from 'lucide-react';
import {
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
  FaInstagram,
  FaMedium,
  FaFacebookF,
  FaYoutube,
} from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { FadeIn } from './MotionWrapper';
import { LinkPreview } from './link-preview';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Client-side EmailJS backup if server didn't already send it and client keys are present
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        if (!data.emailSent && serviceId && templateId && publicKey) {
          try {
            await emailjs.send(
              serviceId,
              templateId,
              {
                to_name: formData.name,
                to_email: formData.email,
                user_name: formData.name,
                user_email: formData.email,
                reply_to: 'sayandeep0212@gmail.com',
                message: formData.message,
                auto_reply_message:
                  'Thank you for reaching out! I have received your message and will check it and get back to you as soon as possible.',
              },
              publicKey
            );
          } catch (clientErr) {
            console.warn('Client-side EmailJS dispatch notification:', clientErr);
          }
        }

        setStatus('success');
        setFeedback(
          data.message ||
            'Your message has been sent successfully! A confirmation email has been dispatched to your inbox. Sayandeep will get back to you as soon as possible.'
        );
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setStatus('error');
      setFeedback('Network error. Please try again later.');
    }
  };

  const connectLinks = [
    {
      name: 'GitHub',
      icon: FaGithub,
      href: 'https://github.com/sayandeep0212',
      color: 'hover:bg-[#333]/40 hover:border-[#333]/50 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      href: 'https://www.linkedin.com/in/sayandeep0212/',
      color: 'hover:bg-[#0077b5]/20 hover:border-[#0077b5]/50 hover:text-[#0077b5]',
    },
    {
      name: 'Twitter/X',
      icon: FaXTwitter,
      href: 'https://x.com/sayandeep0212',
      color: 'hover:bg-[#1da1f2]/20 hover:border-[#1da1f2]/50 hover:text-[#1da1f2]',
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      href: 'https://www.instagram.com/sayandeep0212/',
      color: 'hover:bg-[#e1306c]/20 hover:border-[#e1306c]/50 hover:text-[#e1306c]',
    },
    {
      name: 'YouTube',
      icon: FaYoutube,
      href: 'https://www.youtube.com/@SayandeepPradhan',
      color: 'hover:bg-[#ff0000]/10 hover:border-[#ff0000]/30 hover:text-[#ff0000]',
    },
    {
      name: 'Medium',
      icon: FaMedium,
      href: 'https://medium.com/@sayandeep0212',
      color: 'hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500',
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      href: 'https://www.facebook.com/PradhanSayandeep',
      color: 'hover:bg-[#1877F2]/15 hover:border-[#1877F2]/40 hover:text-[#1877F2]',
      title: 'Facebook',
    },
    {
      name: 'Email',
      icon: MdEmail,
      href: 'mailto:sayandeep0212@gmail.com',
      color: 'hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400',
    },
  ];

  return (
    <section id="contact" className="pt-10 pb-16">
      <FadeIn>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 dark:text-white mb-2">
          Let’s Talk
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-sans mb-8 max-w-xl leading-relaxed">
          Have a project in mind, want to collaborate, or just want to chat? Send a message through the form, or reach out directly on social media.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="md:col-span-8 space-y-3.5 font-sans">
            <div>
              <label htmlFor="name" className="block text-[11px] font-normal text-gray-500 dark:text-gray-400 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00c0e8] transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[11px] font-normal text-gray-500 dark:text-gray-400 mb-1">
                Email ID
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00c0e8] transition-all"
                placeholder="name@domain.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-[11px] font-normal text-gray-500 dark:text-gray-400 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#13171f] border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00c0e8] transition-all resize-y"
                placeholder="Share your thoughts or project details..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-normal text-xs sm:text-sm transition-all active:scale-95 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs border border-emerald-200/60 dark:border-emerald-800/60">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs border border-red-200/60 dark:border-red-800/60">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}
          </form>

          {/* Right Column: Connect card & Availability */}
          <div className="md:col-span-4 space-y-4">
            <div className="text-xs font-sans text-gray-400 dark:text-gray-500">
              Available for freelance &amp; remote
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#13171f] border border-gray-100 dark:border-gray-800">
              <div className="text-[10px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase mb-2.5 font-sans">
                CONNECT
              </div>
              <div className="grid grid-cols-4 gap-2">
                {connectLinks.map((item) => {
                  const Icon = item.icon;
                  const isHttp = item.href.startsWith('http') && item.href !== '#';
                  const baseClass =
                    'w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all hover:scale-105';

                  return isHttp ? (
                    <LinkPreview
                      key={item.name}
                      url={item.href}
                      title={(item as any).title || item.name}
                      dottedUnderline={false}
                      className={cn(baseClass, item.color)}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </LinkPreview>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      title={(item as any).title || item.name}
                      target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className={cn(baseClass, item.color)}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
