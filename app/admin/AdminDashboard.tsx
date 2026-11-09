'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  DEFAULT_PROJECTS,
  DEFAULT_CERTIFICATES,
  DEFAULT_EXPERIENCE,
  DEFAULT_BLOGS,
  DEFAULT_GALLERY,
  DEFAULT_STORIES,
  ProjectDoc,
  CertificateDoc,
  ExperienceDoc,
  BlogDoc,
  GalleryDoc,
  StoryDoc,
  ContactDoc,
} from '@/lib/portfolio-db';
import {
  Lock,
  Mail,
  FolderGit2,
  Award,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Instagram,
  Database,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

// Helper to strip undefined values so Firestore addDoc never throws
function cleanFirestoreData(data: Record<string, any>) {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form state
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('sayandeep0212@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'contacts' | 'projects' | 'certificates' | 'experience' | 'blogs' | 'gallery' | 'stories' | 'seed'
  >('contacts');

  // Real-time Data collections
  const [contacts, setContacts] = useState<ContactDoc[]>([]);
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [certificates, setCertificates] = useState<CertificateDoc[]>([]);
  const [experiences, setExperiences] = useState<ExperienceDoc[]>([]);
  const [blogs, setBlogs] = useState<BlogDoc[]>([]);
  const [gallery, setGallery] = useState<GalleryDoc[]>([]);
  const [stories, setStories] = useState<StoryDoc[]>([]);

  // Seed status message
  const [seedStatus, setSeedStatus] = useState<string>('');
  const [seeding, setSeeding] = useState(false);

  // Uploading state for media
  const [uploading, setUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string>('');

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listeners when user is authenticated
  useEffect(() => {
    if (!user) return;

    // Contacts
    const unsubContacts = onSnapshot(
      collection(db, 'contacts'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ContactDoc[];
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setContacts(list);
      },
      (err) => console.warn('Contacts listener warning:', err.message)
    );

    // Projects
    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ProjectDoc[];
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(list);
      },
      (err) => console.warn('Projects listener warning:', err.message)
    );

    // Certificates
    const unsubCerts = onSnapshot(
      collection(db, 'certificates'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as CertificateDoc[];
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCertificates(list);
      },
      (err) => console.warn('Certificates listener warning:', err.message)
    );

    // Experience
    const unsubExp = onSnapshot(
      collection(db, 'experience'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ExperienceDoc[];
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setExperiences(list);
      },
      (err) => console.warn('Experience listener warning:', err.message)
    );

    // Blogs
    const unsubBlogs = onSnapshot(
      collection(db, 'blogs'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as BlogDoc[];
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setBlogs(list);
      },
      (err) => console.warn('Blogs listener warning:', err.message)
    );

    // Gallery
    const unsubGallery = onSnapshot(
      collection(db, 'gallery'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as GalleryDoc[];
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setGallery(list);
      },
      (err) => console.warn('Gallery listener warning:', err.message)
    );

    // Stories
    const unsubStories = onSnapshot(
      collection(db, 'stories'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as StoryDoc[];
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setStories(list);
      },
      (err) => console.warn('Stories listener warning:', err.message)
    );

    return () => {
      unsubContacts();
      unsubProjects();
      unsubCerts();
      unsubExp();
      unsubBlogs();
      unsubGallery();
      unsubStories();
    };
  }, [user]);

  // Automatic one-time sync of all hardcoded portfolio data to Firestore
  const hasAutoSyncedRef = useRef(false);
  useEffect(() => {
    if (!user || hasAutoSyncedRef.current) return;
    hasAutoSyncedRef.current = true;

    const autoSyncAll = async () => {
      const seedCollectionIfEmpty = async (colName: string, items: any[]) => {
        try {
          const snap = await getDocs(collection(db, colName));
          if (snap.empty) {
            console.log(`Auto-seeding ${colName} (${items.length} items)...`);
            for (const item of items) {
              await addDoc(collection(db, colName), cleanFirestoreData(item));
            }
            console.log(`✅ ${colName} auto-seeded successfully!`);
          }
        } catch (e: any) {
          console.warn(`Auto-sync error on ${colName}:`, e.message);
        }
      };

      try {
        await seedCollectionIfEmpty('projects', DEFAULT_PROJECTS);
        await seedCollectionIfEmpty('certificates', DEFAULT_CERTIFICATES);
        await seedCollectionIfEmpty('experience', DEFAULT_EXPERIENCE);
        await seedCollectionIfEmpty('blogs', DEFAULT_BLOGS);
        await seedCollectionIfEmpty('stories', DEFAULT_STORIES);
        await seedCollectionIfEmpty('gallery', DEFAULT_GALLERY);
      } catch (err: any) {
        console.warn('AutoSync caught error:', err);
      }
    };

    autoSyncAll();
  }, [user]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoginSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setLoginError('Invalid email or password. Please verify your credentials.');
      } else if (err.code === 'auth/user-not-found') {
        setLoginError('No admin account found with this email. Click "First-time Admin Setup" below to create it.');
      } else if (err.code === 'auth/too-many-requests') {
        setLoginError('Access temporarily disabled due to many failed attempts. Try again later.');
      } else {
        setLoginError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle First-Time Admin Account Creation
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (password.length < 6) {
      setLoginError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLoginError('Passwords do not match. Please re-enter.');
      return;
    }

    // Security passcode protection: check passcode if configured
    const requiredPasscode = process.env.NEXT_PUBLIC_ADMIN_SETUP_KEY || 'Sayandeep2026';
    if (setupKey.trim() !== requiredPasscode) {
      setLoginError('Invalid Admin Setup Passcode. Enter the administrator passcode (Sayandeep2026).');
      return;
    }

    setLoginSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setLoginSuccess('Admin account created successfully! Signing in...');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setLoginError('This email is already registered. Please switch to "Sign In".');
      } else if (err.code === 'auth/weak-password') {
        setLoginError('Password is too weak. Please use a stronger combination.');
      } else {
        setLoginError(err.message || 'Failed to create admin account.');
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!email.trim()) {
      setLoginError('Please enter your admin email address.');
      return;
    }

    setLoginSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setLoginSuccess(`Password reset email sent to ${email.trim()}! Please check your inbox.`);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setLoginError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setLoginError('');
    setLoginSuccess('');
    setLoginSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setLoginError(err.message || 'Google authentication failed.');
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Media file upload handler (Cloudflare R2 or local fallback)
  const handleFileUpload = async (file: File): Promise<string | null> => {
    if (!file) return null;
    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds the 25MB maximum limit.');
      return null;
    }

    setUploading(true);
    setUploadFeedback('Uploading media...');

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setUploadFeedback(`Uploaded successfully! (${data.storage === 'cloudflare-r2' ? 'Cloudflare R2' : 'Local Storage'})`);
        return data.url;
      } else {
        alert(data.error || 'Failed to upload media file.');
        setUploadFeedback('');
        return null;
      }
    } catch (err: any) {
      console.error('Upload exception:', err);
      alert('Network error while uploading.');
      setUploadFeedback('');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Generic Reorder helper
  const handleReorder = async (
    collectionName: string,
    list: any[],
    index: number,
    direction: 'up' | 'down'
  ) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const currentItem = list[index];
    const targetItem = list[targetIndex];

    const currentOrder = currentItem.order ?? index + 1;
    const targetOrder = targetItem.order ?? targetIndex + 1;

    try {
      await updateDoc(doc(db, collectionName, currentItem.id), { order: targetOrder });
      await updateDoc(doc(db, collectionName, targetItem.id), { order: currentOrder });
    } catch (err: any) {
      alert(`Error updating sequence: ${err.message}`);
    }
  };

  // Generic Delete helper
  const handleDelete = async (collectionName: string, id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // Contacts: Toggle Read
  const handleToggleContactRead = async (contact: ContactDoc) => {
    try {
      await updateDoc(doc(db, 'contacts', contact.id), { read: !contact.read });
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // One-Click Seed All Data
  const handleSeedAll = async () => {
    setSeeding(true);
    setSeedStatus('Uploading all default portfolio data to Firestore collections...');
    const log: string[] = [];
    try {
      const seedOne = async (colName: string, defaults: any[]) => {
        try {
          const snap = await getDocs(collection(db, colName));
          if (snap.empty) {
            for (const item of defaults) {
              await addDoc(collection(db, colName), cleanFirestoreData(item));
            }
            return `${colName}: ${defaults.length} uploaded`;
          }
          return `${colName}: already has ${snap.size}`;
        } catch (err: any) {
          console.error(`Error uploading ${colName}:`, err);
          return `${colName}: ${err.message}`;
        }
      };

      log.push(await seedOne('projects', DEFAULT_PROJECTS));
      log.push(await seedOne('certificates', DEFAULT_CERTIFICATES));
      log.push(await seedOne('experience', DEFAULT_EXPERIENCE));
      log.push(await seedOne('blogs', DEFAULT_BLOGS));
      log.push(await seedOne('stories', DEFAULT_STORIES));
      try {
        log.push(await seedOne('gallery', DEFAULT_GALLERY));
      } catch (gErr: any) {
        log.push(`gallery: rules needed`);
      }

      setSeedStatus(`Initial sync complete: ${log.join(' | ')}`);
    } catch (err: any) {
      setSeedStatus(`Error seeding: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  // Seed single collection
  const handleSeedCollection = async (colName: string, items: any[]) => {
    setSeeding(true);
    setSeedStatus(`Uploading default ${colName} to database...`);
    try {
      let count = 0;
      for (const item of items) {
        await addDoc(collection(db, colName), cleanFirestoreData(item));
        count++;
      }
      setSeedStatus(`Successfully uploaded ${count} ${colName} to Firestore database!`);
    } catch (err: any) {
      console.error(`Error uploading ${colName}:`, err);
      setSeedStatus(`Error uploading ${colName}: ${err.message}`);
      alert(`Error uploading ${colName}: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  // -------------------------------------------------------------
  // Render: Loading Screen
  // -------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0d11] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#00c0e8] mb-3" />
        <p className="font-mono text-sm text-gray-400">Verifying administrator session...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Secure Login Screen
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0d11] text-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#131720] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#00c0e8]/10 border border-[#00c0e8]/30 flex items-center justify-center mx-auto text-[#00c0e8]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Admin Authentication</h1>
            <p className="text-xs text-gray-400">
              Sign in to manage projects, experience, certificates, blogs, gallery & messages.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#0d1017] border border-gray-800 rounded-xl text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setLoginError('');
                setLoginSuccess('');
              }}
              className={`py-2 rounded-lg font-medium transition-all ${
                authMode === 'login'
                  ? 'bg-[#00c0e8] text-gray-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setLoginError('');
                setLoginSuccess('');
              }}
              className={`py-2 rounded-lg font-medium transition-all ${
                authMode === 'register'
                  ? 'bg-[#00c0e8] text-gray-950 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              First-Time Setup
            </button>
          </div>

          {/* Quick 1-Click Google Sign In */}
          <button
            type="button"
            disabled={loginSubmitting}
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-800 w-full" />
            <span className="bg-[#131720] px-2.5 text-[11px] font-mono text-gray-500 uppercase tracking-wider shrink-0">
              or with password
            </span>
            <div className="border-t border-gray-800 w-full" />
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{loginSuccess}</span>
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sayandeep0212@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1c2230] border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00c0e8] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-gray-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] text-[#00c0e8] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#1c2230] border border-gray-700 text-sm text-white pr-10 focus:outline-none focus:border-[#00c0e8] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-2.5 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In as Admin</span>
                  </>
                )}
              </button>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sayandeep0212@gmail.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1c2230] border border-gray-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Create Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#1c2230] border border-gray-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#1c2230] border border-gray-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  Admin Setup Passcode (Default: <code className="text-[#00c0e8]">Sayandeep2026</code>)
                </label>
                <input
                  type="text"
                  required
                  value={setupKey}
                  onChange={(e) => setSetupKey(e.target.value)}
                  placeholder="Sayandeep2026"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1c2230] border border-gray-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-2.5 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loginSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Admin Account...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Create Admin Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">Your Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sayandeep0212@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1c2230] border border-gray-700 text-sm text-white focus:outline-none focus:border-[#00c0e8] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-2.5 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Password Reset Link</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-[#00c0e8] hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-gray-400 hover:text-white hover:underline transition-colors">
              ← Return to Portfolio Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Admin Dashboard
  // -------------------------------------------------------------
  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="min-h-screen bg-[#0b0d11] text-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#10141d]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00c0e8]/10 border border-[#00c0e8]/40 flex items-center justify-center text-[#00c0e8]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-semibold text-sm sm:text-base text-white">Portfolio Admin Console</h1>
              <p className="text-[11px] text-gray-400 hidden sm:block">Logged in as {user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(projects.length === 0 || certificates.length === 0 || experiences.length === 0 || blogs.length === 0) && (
              <button
                onClick={handleSeedAll}
                disabled={seeding}
                className="text-xs px-3 py-1.5 rounded-md bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                title="Upload all default portfolio data into Firestore DB"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                <span>{seeding ? 'Uploading...' : '⚡ Sync Data to DB'}</span>
              </button>
            )}
            <Link
              href="/"
              target="_blank"
              className="text-xs px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-gray-800/60 py-2 scrollbar-none">
          <TabButton
            active={activeTab === 'contacts'}
            onClick={() => setActiveTab('contacts')}
            icon={<MessageSquare className="w-4 h-4" />}
            label="Messages"
            badge={unreadCount > 0 ? unreadCount : undefined}
          />
          <TabButton
            active={activeTab === 'projects'}
            onClick={() => setActiveTab('projects')}
            icon={<FolderGit2 className="w-4 h-4" />}
            label={`Projects (${projects.length})`}
          />
          <TabButton
            active={activeTab === 'certificates'}
            onClick={() => setActiveTab('certificates')}
            icon={<Award className="w-4 h-4" />}
            label={`Certificates (${certificates.length})`}
          />
          <TabButton
            active={activeTab === 'experience'}
            onClick={() => setActiveTab('experience')}
            icon={<Briefcase className="w-4 h-4" />}
            label={`Experience (${experiences.length})`}
          />
          <TabButton
            active={activeTab === 'blogs'}
            onClick={() => setActiveTab('blogs')}
            icon={<BookOpen className="w-4 h-4" />}
            label={`Blogs (${blogs.length})`}
          />
          <TabButton
            active={activeTab === 'gallery'}
            onClick={() => setActiveTab('gallery')}
            icon={<ImageIcon className="w-4 h-4" />}
            label={`Gallery (${gallery.length})`}
          />
          <TabButton
            active={activeTab === 'stories'}
            onClick={() => setActiveTab('stories')}
            icon={<Instagram className="w-4 h-4" />}
            label={`Stories (${stories.length})`}
          />
          <TabButton
            active={activeTab === 'seed'}
            onClick={() => setActiveTab('seed')}
            icon={<Database className="w-4 h-4" />}
            label="Database / Seed"
          />
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Global Initial DB Sync Banner when any collection is empty */}
        {(projects.length === 0 || certificates.length === 0 || experiences.length === 0 || blogs.length === 0) && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#00c0e8]/15 via-[#00c0e8]/5 to-[#11141c] border border-[#00c0e8]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00c0e8]/20 text-[#00c0e8] border border-[#00c0e8]/40 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>Initial Database Sync Ready</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00c0e8]/20 text-[#00c0e8] border border-[#00c0e8]/30 font-mono">
                    Action Needed
                  </span>
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  Your Firestore DB currently has 0 items in some sections. Upload all 5 Projects, 6 Certificates, 3 Experience roles, and 1 Blog from your hardcoded portfolio directly into Firestore with one click.
                </p>
              </div>
            </div>
            <button
              onClick={handleSeedAll}
              disabled={seeding}
              className="px-4 py-2.5 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Uploading Data to DB...' : '⚡ Upload All Hardcoded Data to DB Now'}</span>
            </button>
          </div>
        )}

        {/* Real-time Status notification toast */}
        {seedStatus && (
          <div className="mb-6 p-3 rounded-xl bg-[#11141c] border border-[#00c0e8]/40 text-xs font-mono text-[#00c0e8] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{seedStatus}</span>
            </div>
            <button onClick={() => setSeedStatus('')} className="text-gray-400 hover:text-white text-xs ml-4">✕</button>
          </div>
        )}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Contact Submissions</h2>
                <p className="text-xs text-gray-400">
                  Messages submitted by visitors via the "Let's connect" contact form.
                </p>
              </div>
            </div>

            {contacts.length === 0 ? (
              <div className="p-12 text-center border border-gray-800 rounded-xl bg-[#11151f]">
                <Mail className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No contact messages received yet.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {contacts.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      msg.read
                        ? 'bg-[#11141c] border-gray-800/80 text-gray-300'
                        : 'bg-[#151c29] border-[#00c0e8]/40 shadow-sm text-white'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-[#00c0e8] hover:underline"
                        >
                          ({msg.email})
                        </a>
                        {!msg.read && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00c0e8]/20 text-[#00c0e8] border border-[#00c0e8]/30 font-mono">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-gray-400">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })
                          : 'Just now'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 whitespace-pre-wrap mb-3 bg-[#0d1017] p-3 rounded-lg border border-gray-800/60 font-sans">
                      {msg.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => handleToggleContactRead(msg)}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5"
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${msg.read ? 'text-gray-500' : 'text-[#00c0e8]'}`} />
                        <span>{msg.read ? 'Mark Unread' : 'Mark as Read'}</span>
                      </button>
                      <button
                        onClick={() => handleDelete('contacts', msg.id, `message from ${msg.name}`)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <ProjectsManager
            projects={projects}
            onReorder={(idx, dir) => handleReorder('projects', projects, idx, dir)}
            onDelete={(id, title) => handleDelete('projects', id, title)}
            onFileUpload={handleFileUpload}
            uploading={uploading}
            uploadFeedback={uploadFeedback}
            onSeedDefaults={() => handleSeedCollection('projects', DEFAULT_PROJECTS)}
            seeding={seeding}
          />
        )}

        {activeTab === 'certificates' && (
          <CertificatesManager
            certificates={certificates}
            onReorder={(idx, dir) => handleReorder('certificates', certificates, idx, dir)}
            onDelete={(id, title) => handleDelete('certificates', id, title)}
            onFileUpload={handleFileUpload}
            uploading={uploading}
            uploadFeedback={uploadFeedback}
            onSeedDefaults={() => handleSeedCollection('certificates', DEFAULT_CERTIFICATES)}
            seeding={seeding}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceManager
            experiences={experiences}
            onReorder={(idx, dir) => handleReorder('experience', experiences, idx, dir)}
            onDelete={(id, title) => handleDelete('experience', id, title)}
            onFileUpload={handleFileUpload}
            uploading={uploading}
            uploadFeedback={uploadFeedback}
            onSeedDefaults={() => handleSeedCollection('experience', DEFAULT_EXPERIENCE)}
            seeding={seeding}
          />
        )}

        {activeTab === 'blogs' && (
          <BlogsManager
            blogs={blogs}
            onReorder={(idx, dir) => handleReorder('blogs', blogs, idx, dir)}
            onDelete={(id, title) => handleDelete('blogs', id, title)}
            onSeedDefaults={() => handleSeedCollection('blogs', DEFAULT_BLOGS)}
            seeding={seeding}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryManager
            gallery={gallery}
            onReorder={(idx, dir) => handleReorder('gallery', gallery, idx, dir)}
            onDelete={(id, title) => handleDelete('gallery', id, title)}
            onFileUpload={handleFileUpload}
            uploading={uploading}
            uploadFeedback={uploadFeedback}
            onSeedDefaults={() => handleSeedCollection('gallery', DEFAULT_GALLERY)}
            seeding={seeding}
          />
        )}

        {activeTab === 'stories' && (
          <StoriesManager
            stories={stories}
            onReorder={(idx, dir) => handleReorder('stories', stories, idx, dir)}
            onDelete={(id, title) => handleDelete('stories', id, title)}
            onFileUpload={handleFileUpload}
            uploading={uploading}
            uploadFeedback={uploadFeedback}
            onSeedDefaults={() => handleSeedCollection('stories', DEFAULT_STORIES)}
            seeding={seeding}
          />
        )}

        {activeTab === 'seed' && (
          <div className="max-w-3xl bg-[#11151f] border border-gray-800 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Database Migration & One-Click Seeder</h2>
              <p className="text-xs text-gray-400 mt-1">
                Populate your Firestore collections with your hardcoded portfolio items. You can upload all collections at once or sync each section individually.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#151a26] rounded-lg border border-gray-800">
                <span className="text-gray-400 block">Projects:</span>
                <span className="text-sm font-bold text-white">{projects.length} docs in DB</span>
                <button
                  onClick={() => handleSeedCollection('projects', DEFAULT_PROJECTS)}
                  disabled={seeding}
                  className="mt-2 w-full py-1 rounded bg-[#00c0e8]/20 hover:bg-[#00c0e8]/30 text-[#00c0e8] text-[11px] font-sans font-medium transition-colors"
                >
                  Upload Projects (5)
                </button>
              </div>

              <div className="p-3 bg-[#151a26] rounded-lg border border-gray-800">
                <span className="text-gray-400 block">Certificates:</span>
                <span className="text-sm font-bold text-white">{certificates.length} docs in DB</span>
                <button
                  onClick={() => handleSeedCollection('certificates', DEFAULT_CERTIFICATES)}
                  disabled={seeding}
                  className="mt-2 w-full py-1 rounded bg-[#00c0e8]/20 hover:bg-[#00c0e8]/30 text-[#00c0e8] text-[11px] font-sans font-medium transition-colors"
                >
                  Upload Certs (6)
                </button>
              </div>

              <div className="p-3 bg-[#151a26] rounded-lg border border-gray-800">
                <span className="text-gray-400 block">Experience:</span>
                <span className="text-sm font-bold text-white">{experiences.length} docs in DB</span>
                <button
                  onClick={() => handleSeedCollection('experience', DEFAULT_EXPERIENCE)}
                  disabled={seeding}
                  className="mt-2 w-full py-1 rounded bg-[#00c0e8]/20 hover:bg-[#00c0e8]/30 text-[#00c0e8] text-[11px] font-sans font-medium transition-colors"
                >
                  Upload Experience (3)
                </button>
              </div>

              <div className="p-3 bg-[#151a26] rounded-lg border border-gray-800">
                <span className="text-gray-400 block">Blogs:</span>
                <span className="text-sm font-bold text-white">{blogs.length} docs in DB</span>
                <button
                  onClick={() => handleSeedCollection('blogs', DEFAULT_BLOGS)}
                  disabled={seeding}
                  className="mt-2 w-full py-1 rounded bg-[#00c0e8]/20 hover:bg-[#00c0e8]/30 text-[#00c0e8] text-[11px] font-sans font-medium transition-colors"
                >
                  Upload Blogs (1)
                </button>
              </div>

              <div className="p-3 bg-[#151a26] rounded-lg border border-gray-800">
                <span className="text-gray-400 block">Gallery:</span>
                <span className="text-sm font-bold text-white">{gallery.length} docs in DB</span>
                <button
                  onClick={() => handleSeedCollection('gallery', DEFAULT_GALLERY)}
                  disabled={seeding}
                  className="mt-2 w-full py-1 rounded bg-[#00c0e8]/20 hover:bg-[#00c0e8]/30 text-[#00c0e8] text-[11px] font-sans font-medium transition-colors"
                >
                  Upload Gallery (4)
                </button>
              </div>

              <div className="p-3 bg-[#151a26] rounded-lg border border-gray-800">
                <span className="text-gray-400 block">Stories:</span>
                <span className="text-sm font-bold text-white">{stories.length} docs in DB</span>
                <button
                  onClick={() => handleSeedCollection('stories', DEFAULT_STORIES)}
                  disabled={seeding}
                  className="mt-2 w-full py-1 rounded bg-[#00c0e8]/20 hover:bg-[#00c0e8]/30 text-[#00c0e8] text-[11px] font-sans font-medium transition-colors"
                >
                  Upload Stories (3)
                </button>
              </div>
            </div>

            {seedStatus && (
              <div className="p-3 rounded-lg bg-[#00c0e8]/10 border border-[#00c0e8]/30 text-[#00c0e8] text-xs font-mono">
                {seedStatus}
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleSeedAll}
                disabled={seeding}
                className="px-5 py-2.5 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md"
              >
                {seeding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Everything to Firestore...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>⚡ Upload All Hardcoded Data to DB Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
        active
          ? 'bg-[#00c0e8]/15 text-[#00c0e8] border border-[#00c0e8]/30'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && (
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#00c0e8] text-gray-950">
          {badge}
        </span>
      )}
    </button>
  );
}

function MediaInput({
  label,
  value,
  onChange,
  onFileUpload,
  uploading,
  uploadFeedback,
  accept = 'image/*,video/*',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onFileUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
  uploadFeedback?: string;
  accept?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await onFileUpload(file);
      if (url) onChange(url);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-mono text-gray-300">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or upload file (Cloudflare R2)"
          className="flex-1 px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-200 border border-gray-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00c0e8]" />
          ) : (
            <UploadCloud className="w-3.5 h-3.5 text-[#00c0e8]" />
          )}
          <span>Upload</span>
        </button>
      </div>
      {uploadFeedback && (
        <p className="text-[11px] text-[#00c0e8] font-mono">{uploadFeedback}</p>
      )}
      {value && (
        <div className="mt-2 p-2 rounded-lg bg-[#0d1017] border border-gray-800 max-w-xs">
          {/\.(mp4|webm|ogg)$/i.test(value) ? (
            <video src={value} controls className="w-full h-32 object-cover rounded" />
          ) : (
            <img src={value} alt="Preview" className="w-full h-32 object-contain rounded bg-black/40" />
          )}
        </div>
      )}
    </div>
  );
}

function ProjectsManager({
  projects,
  onReorder,
  onDelete,
  onFileUpload,
  uploading,
  uploadFeedback,
  onSeedDefaults,
  seeding,
}: {
  projects: ProjectDoc[];
  onReorder: (idx: number, dir: 'up' | 'down') => void;
  onDelete: (id: string, title: string) => void;
  onFileUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
  uploadFeedback: string;
  onSeedDefaults?: () => void;
  seeding?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ProjectDoc>>({
    title: '',
    desc: '',
    tech: '',
    developersName: '',
    status: 'In Production',
    period: '',
    tags: [],
    github: '',
    href: '',
    context: '',
    order: projects.length + 1,
  });

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({
      title: '',
      desc: '',
      tech: '',
      developersName: 'Sayandeep Pradhan',
      status: 'Active',
      period: new Date().getFullYear().toString(),
      tags: [],
      github: '',
      href: '',
      context: '',
      order: projects.length + 1,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (p: ProjectDoc) => {
    setEditId(p.id || null);
    setForm({ ...p });
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.desc) return alert('Title and description are required.');

    const data: any = {
      title: form.title,
      desc: form.desc,
      tech: form.tech || '',
      developersName: form.developersName || '',
      status: form.status || 'Active',
      period: form.period || '',
      tags: Array.isArray(form.tags) ? form.tags : (form.tags as any || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      github: form.github || '',
      href: form.href || '',
      context: form.context || '',
      order: Number(form.order) || projects.length + 1,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, 'projects', editId), data);
      } else {
        await addDoc(collection(db, 'projects'), data);
      }
      setIsOpen(false);
    } catch (err: any) {
      alert(`Error saving project: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Projects Management</h2>
          <p className="text-xs text-gray-400">Add, edit, and reorder projects dynamically displayed across your portfolio.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-[#11141c]/60 flex flex-col items-center justify-center space-y-3">
          <FolderGit2 className="w-12 h-12 text-[#00c0e8]/50" />
          <div>
            <h3 className="text-base font-semibold text-white">No projects found in Firestore database</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Your portfolio has 5 projects currently hardcoded in code ready to be uploaded to your live Firestore database.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onSeedDefaults}
              disabled={seeding}
              className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Uploading...' : '⚡ Upload 5 Hardcoded Projects to Database'}</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Project</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((p, idx) => (
          <div
            key={p.id || idx}
            className="p-4 rounded-xl bg-[#11141c] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#00c0e8]">#{p.order ?? idx + 1}</span>
                <h3 className="font-semibold text-sm text-white">{p.title}</h3>
                {p.status && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                    {p.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{p.desc}</p>
              <div className="flex flex-wrap gap-2 text-[11px] text-gray-400 font-mono pt-1">
                {p.period && <span>🗓 {p.period}</span>}
                {p.tech && <span>💻 {p.tech}</span>}
                {p.developersName && <span>👤 {p.developersName}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onReorder(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onReorder(idx, 'down')}
                disabled={idx === projects.length - 1}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleOpenEdit(p)}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-blue-400"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(p.id!, p.title)}
                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141923] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-semibold text-white">
              {editId ? 'Edit Project' : 'Add New Project'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Project Name / Title *</label>
                <input
                  type="text"
                  required
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.desc || ''}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Tech Stacks</label>
                  <input
                    type="text"
                    value={form.tech || ''}
                    onChange={(e) => setForm({ ...form, tech: e.target.value })}
                    placeholder="Next.js · React · TypeScript · Tailwind CSS"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Developer's Name</label>
                  <input
                    type="text"
                    value={form.developersName || ''}
                    onChange={(e) => setForm({ ...form, developersName: e.target.value })}
                    placeholder="Sayandeep Pradhan"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Status</label>
                  <input
                    type="text"
                    value={form.status || ''}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    placeholder="Active / In Production / Completed"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Date / Month / Year</label>
                  <input
                    type="text"
                    value={form.period || ''}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="Feb 2026 – Present"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Sequence (Order)</label>
                  <input
                    type="number"
                    value={form.order || 1}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Website URL (optional)</label>
                  <input
                    type="url"
                    value={form.href || ''}
                    onChange={(e) => setForm({ ...form, href: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">GitHub Repo Link (optional)</label>
                  <input
                    type="url"
                    value={form.github || ''}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')}
                  onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()) })}
                  placeholder="Next.js, FinTech, Razorpay"
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs"
                >
                  {editId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CertificatesManager({
  certificates,
  onReorder,
  onDelete,
  onFileUpload,
  uploading,
  uploadFeedback,
  onSeedDefaults,
  seeding,
}: {
  certificates: CertificateDoc[];
  onReorder: (idx: number, dir: 'up' | 'down') => void;
  onDelete: (id: string, title: string) => void;
  onFileUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
  uploadFeedback: string;
  onSeedDefaults?: () => void;
  seeding?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<CertificateDoc>>({
    title: '',
    issuer: '',
    description: '',
    year: '',
    credentialId: '',
    logo: '',
    isDarkBox: false,
    order: certificates.length + 1,
  });

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({
      title: '',
      issuer: '',
      description: '',
      year: new Date().getFullYear().toString(),
      credentialId: '',
      logo: '',
      isDarkBox: false,
      order: certificates.length + 1,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (c: CertificateDoc) => {
    setEditId(c.id || null);
    setForm({ ...c });
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.issuer) return alert('Certificate name and company name are required.');

    const data: any = {
      title: form.title,
      issuer: form.issuer,
      description: form.description || '',
      year: form.year || '',
      credentialId: form.credentialId || '',
      logo: form.logo || '',
      isDarkBox: Boolean(form.isDarkBox),
      order: Number(form.order) || certificates.length + 1,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, 'certificates', editId), data);
      } else {
        await addDoc(collection(db, 'certificates'), data);
      }
      setIsOpen(false);
    } catch (err: any) {
      alert(`Error saving certificate: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Certificates Management</h2>
          <p className="text-xs text-gray-400">Add credentials, upload company logos, and customize certificate display sequence.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-[#11141c]/60 flex flex-col items-center justify-center space-y-3">
          <Award className="w-12 h-12 text-[#00c0e8]/50" />
          <div>
            <h3 className="text-base font-semibold text-white">No certificates found in Firestore database</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Your portfolio has 6 credentials and certifications hardcoded in code ready to be saved into your database.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onSeedDefaults}
              disabled={seeding}
              className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Uploading...' : '⚡ Upload 6 Hardcoded Certificates to Database'}</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Certificate</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {certificates.map((c, idx) => (
          <div
            key={c.id || idx}
            className="p-4 rounded-xl bg-[#11141c] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              {c.logo ? (
                <div className="w-10 h-10 rounded-lg bg-[#181d28] border border-gray-700 p-1.5 flex items-center justify-center flex-shrink-0">
                  <img src={c.logo} alt={c.issuer} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#181d28] border border-gray-700 flex items-center justify-center flex-shrink-0 text-gray-400">
                  <Award className="w-5 h-5" />
                </div>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#00c0e8]">#{c.order ?? idx + 1}</span>
                  <h3 className="font-semibold text-sm text-white">{c.title}</h3>
                </div>
                <p className="text-xs text-gray-400">{c.issuer} {c.year ? `· ${c.year}` : ''}</p>
                {c.credentialId && <p className="text-[11px] font-mono text-gray-500">ID: {c.credentialId}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onReorder(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onReorder(idx, 'down')}
                disabled={idx === certificates.length - 1}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleOpenEdit(c)}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-blue-400"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(c.id!, c.title)}
                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141923] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-semibold text-white">
              {editId ? 'Edit Certificate' : 'Add New Certificate'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Certificate Name *</label>
                <input
                  type="text"
                  required
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Company / Issuer Name *</label>
                  <input
                    type="text"
                    required
                    value={form.issuer || ''}
                    onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                    placeholder="Oracle, IBM, Google"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Year</label>
                  <input
                    type="text"
                    value={form.year || ''}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="2025 / 2026"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Credential / Certificate ID (optional)</label>
                  <input
                    type="text"
                    value={form.credentialId || ''}
                    onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                    placeholder="ORCL-AI-948192"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Sequence (Order)</label>
                  <input
                    type="number"
                    value={form.order || 1}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Short Description (optional)</label>
                <textarea
                  rows={2}
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Key concepts learned and verified..."
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <MediaInput
                label="Company Logo (Image URL or Upload)"
                value={form.logo || ''}
                onChange={(val) => setForm({ ...form, logo: val })}
                onFileUpload={onFileUpload}
                uploading={uploading}
                uploadFeedback={uploadFeedback}
                accept="image/*"
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs"
                >
                  {editId ? 'Save Changes' : 'Create Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ExperienceManager({
  experiences,
  onReorder,
  onDelete,
  onFileUpload,
  uploading,
  uploadFeedback,
  onSeedDefaults,
  seeding,
}: {
  experiences: ExperienceDoc[];
  onReorder: (idx: number, dir: 'up' | 'down') => void;
  onDelete: (id: string, title: string) => void;
  onFileUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
  uploadFeedback: string;
  onSeedDefaults?: () => void;
  seeding?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ExperienceDoc>>({
    role: '',
    org: '',
    location: '',
    period: '',
    bullets: [''],
    skills: [],
    logo: '',
    order: experiences.length + 1,
  });

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({
      role: '',
      org: '',
      location: 'Kolkata, India',
      period: 'Present',
      bullets: [''],
      skills: [],
      logo: '',
      order: experiences.length + 1,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (exp: ExperienceDoc) => {
    setEditId(exp.id || null);
    setForm({ ...exp });
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role || !form.org) return alert('Role and organization/company are required.');

    const cleanBullets = (form.bullets || []).filter((b) => b && b.trim().length > 0);

    const data: any = {
      role: form.role,
      org: form.org,
      location: form.location || '',
      period: form.period || '',
      bullets: cleanBullets.length > 0 ? cleanBullets : ['Contributor'],
      skills: Array.isArray(form.skills) ? form.skills : (form.skills as any || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      logo: form.logo || '',
      order: Number(form.order) || experiences.length + 1,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, 'experience', editId), data);
      } else {
        await addDoc(collection(db, 'experience'), data);
      }
      setIsOpen(false);
    } catch (err: any) {
      alert(`Error saving experience: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Experience Management</h2>
          <p className="text-xs text-gray-400">Manage your career history, pointwise impact descriptions, tech stacks, and sequence.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-[#11141c]/60 flex flex-col items-center justify-center space-y-3">
          <Briefcase className="w-12 h-12 text-[#00c0e8]/50" />
          <div>
            <h3 className="text-base font-semibold text-white">No experience found in Firestore database</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Your portfolio has 3 career positions hardcoded in code ready to be saved into your database.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onSeedDefaults}
              disabled={seeding}
              className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Uploading...' : '⚡ Upload 3 Hardcoded Positions to Database'}</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Experience</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {experiences.map((exp, idx) => (
          <div
            key={exp.id || idx}
            className="p-4 rounded-xl bg-[#11141c] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#00c0e8]">#{exp.order ?? idx + 1}</span>
                <h3 className="font-semibold text-sm text-white">{exp.role}</h3>
                <span className="text-xs text-gray-400">@ {exp.org}</span>
              </div>
              <p className="text-xs text-gray-500 font-mono">{exp.period} {exp.location ? `· ${exp.location}` : ''}</p>
              <ul className="text-xs text-gray-300 list-disc list-inside space-y-0.5 pt-1">
                {(exp.bullets || []).slice(0, 2).map((b, i) => (
                  <li key={i} className="line-clamp-1">{b}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onReorder(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onReorder(idx, 'down')}
                disabled={idx === experiences.length - 1}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-blue-400"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(exp.id!, `${exp.role} @ ${exp.org}`)}
                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141923] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-semibold text-white">
              {editId ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Post / Role *</label>
                  <input
                    type="text"
                    required
                    value={form.role || ''}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="Tech Lead & Full Stack Developer"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={form.org || ''}
                    onChange={(e) => setForm({ ...form, org: e.target.value })}
                    placeholder="GameLiminals / Google / eDC IIT Delhi"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location || ''}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Kolkata, IN"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Date & Year</label>
                  <input
                    type="text"
                    value={form.period || ''}
                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                    placeholder="Dec 2025 - Present"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Sequence (Order)</label>
                  <input
                    type="number"
                    value={form.order || 1}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Point-wise Description</label>
                {(form.bullets || []).map((bullet, bIdx) => (
                  <div key={bIdx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => {
                        const next = [...(form.bullets || [])];
                        next[bIdx] = e.target.value;
                        setForm({ ...form, bullets: next });
                      }}
                      placeholder={`Point #${bIdx + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (form.bullets || []).filter((_, i) => i !== bIdx);
                        setForm({ ...form, bullets: next });
                      }}
                      className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, bullets: [...(form.bullets || []), ''] })}
                  className="text-xs text-[#00c0e8] hover:underline flex items-center gap-1 mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add another bullet point</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Tech Stacks (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(form.skills) ? form.skills.join(', ') : (form.skills || '')}
                  onChange={(e) => setForm({ ...form, skills: e.target.value.split(',').map((s) => s.trim()) })}
                  placeholder="NextJS, TypeScript, NodeJS, TailwindCSS"
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <MediaInput
                label="Company Logo (Image URL or Upload)"
                value={form.logo || ''}
                onChange={(val) => setForm({ ...form, logo: val })}
                onFileUpload={onFileUpload}
                uploading={uploading}
                uploadFeedback={uploadFeedback}
                accept="image/*"
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs"
                >
                  {editId ? 'Save Changes' : 'Create Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogsManager({
  blogs,
  onReorder,
  onDelete,
  onSeedDefaults,
  seeding,
}: {
  blogs: BlogDoc[];
  onReorder: (idx: number, dir: 'up' | 'down') => void;
  onDelete: (id: string, title: string) => void;
  onSeedDefaults?: () => void;
  seeding?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<BlogDoc>>({
    title: '',
    summary: '',
    tags: [],
    readTime: '5 min read',
    href: '',
    platform: 'Medium',
    date: '',
    order: blogs.length + 1,
  });

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({
      title: '',
      summary: '',
      tags: [],
      readTime: '10 min read',
      href: '',
      platform: 'Medium',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      order: blogs.length + 1,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (b: BlogDoc) => {
    setEditId(b.id || null);
    setForm({ ...b });
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.href) return alert('Title and blog link are required.');

    const data: any = {
      title: form.title,
      summary: form.summary || '',
      tags: Array.isArray(form.tags) ? form.tags : (form.tags as any || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      readTime: form.readTime || '5 min read',
      href: form.href,
      platform: form.platform || 'Medium',
      date: form.date || '',
      order: Number(form.order) || blogs.length + 1,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, 'blogs', editId), data);
      } else {
        await addDoc(collection(db, 'blogs'), data);
      }
      setIsOpen(false);
    } catch (err: any) {
      alert(`Error saving blog: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Blogs Management</h2>
          <p className="text-xs text-gray-400">Manage published articles, reading times, tags, external links, and sequence.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Blog</span>
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-[#11141c]/60 flex flex-col items-center justify-center space-y-3">
          <BookOpen className="w-12 h-12 text-[#00c0e8]/50" />
          <div>
            <h3 className="text-base font-semibold text-white">No blogs found in Firestore database</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Your portfolio has a published guide on Git & GitHub hardcoded in code ready to be saved into your database.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onSeedDefaults}
              disabled={seeding}
              className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Uploading...' : '⚡ Upload Hardcoded Blog to Database'}</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Blog</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {blogs.map((b, idx) => (
          <div
            key={b.id || idx}
            className="p-4 rounded-xl bg-[#11141c] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#00c0e8]">#{b.order ?? idx + 1}</span>
                <h3 className="font-semibold text-sm text-white">{b.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                  {b.platform}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{b.summary}</p>
              <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 font-mono pt-1">
                <span>🗓 {b.date}</span>
                <span>⏱ {b.readTime}</span>
                <a href={b.href} target="_blank" rel="noreferrer" className="text-[#00c0e8] hover:underline flex items-center gap-1">
                  <span>Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onReorder(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onReorder(idx, 'down')}
                disabled={idx === blogs.length - 1}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleOpenEdit(b)}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-blue-400"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(b.id!, b.title)}
                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141923] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-semibold text-white">
              {editId ? 'Edit Blog' : 'Add New Blog'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Blog Title *</label>
                <input
                  type="text"
                  required
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Summary / Description</label>
                <textarea
                  rows={3}
                  value={form.summary || ''}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Platform Name</label>
                  <input
                    type="text"
                    value={form.platform || ''}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    placeholder="Medium, Dev.to, Hashnode"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={form.readTime || ''}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="15 min read"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Sequence (Order)</label>
                  <input
                    type="number"
                    value={form.order || 1}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Blog URL *</label>
                  <input
                    type="url"
                    required
                    value={form.href || ''}
                    onChange={(e) => setForm({ ...form, href: e.target.value })}
                    placeholder="https://medium.com/@..."
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Date of Blog</label>
                  <input
                    type="text"
                    value={form.date || ''}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="Jun 19, 2024"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')}
                  onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()) })}
                  placeholder="Git, GitHub, CI/CD, DevOps"
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs"
                >
                  {editId ? 'Save Changes' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryManager({
  gallery,
  onReorder,
  onDelete,
  onFileUpload,
  uploading,
  uploadFeedback,
  onSeedDefaults,
  seeding,
}: {
  gallery: GalleryDoc[];
  onReorder: (idx: number, dir: 'up' | 'down') => void;
  onDelete: (id: string, title: string) => void;
  onFileUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
  uploadFeedback: string;
  onSeedDefaults?: () => void;
  seeding?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<GalleryDoc>>({
    title: '',
    desc: '',
    date: '',
    location: '',
    tag: '',
    image: '',
    order: gallery.length + 1,
  });

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({
      title: '',
      desc: '',
      date: new Date().getFullYear().toString(),
      location: 'Kolkata, India',
      tag: 'Hackathon',
      image: '',
      order: gallery.length + 1,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (g: GalleryDoc) => {
    setEditId(g.id || null);
    setForm({ ...g });
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) return alert('Name/Title and image are required.');

    const data: any = {
      title: form.title,
      desc: form.desc || '',
      date: form.date || '',
      location: form.location || '',
      tag: form.tag || 'Moment',
      image: form.image,
      order: Number(form.order) || gallery.length + 1,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, 'gallery', editId), data);
      } else {
        await addDoc(collection(db, 'gallery'), data);
      }
      setIsOpen(false);
    } catch (err: any) {
      alert(`Error saving gallery item: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Gallery Management</h2>
          <p className="text-xs text-gray-400">Manage event moments, hackathons, awards, photos, and sequence.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Moment</span>
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-[#11141c]/60 flex flex-col items-center justify-center space-y-3">
          <ImageIcon className="w-12 h-12 text-[#00c0e8]/50" />
          <div>
            <h3 className="text-base font-semibold text-white">No gallery moments found in Firestore database</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Your portfolio has 4 moment cards hardcoded in code ready to be saved into your database.
            </p>
            <p className="text-[11px] text-amber-400/80 mt-1">
              (Note: Requires `match /gallery/&#123;document&#125;` rule in Firebase Console)
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onSeedDefaults}
              disabled={seeding}
              className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Uploading...' : '⚡ Upload 4 Hardcoded Moments to Database'}</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Moment</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {gallery.map((g, idx) => (
          <div
            key={g.id || idx}
            className="p-4 rounded-xl bg-[#11141c] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              {g.image && (
                <div className="w-16 h-12 rounded-lg bg-[#181d28] border border-gray-700 overflow-hidden flex-shrink-0">
                  <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#00c0e8]">#{g.order ?? idx + 1}</span>
                  <h3 className="font-semibold text-sm text-white">{g.title}</h3>
                  {g.tag && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                      {g.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{g.desc}</p>
                <div className="flex gap-2 text-[11px] text-gray-500 font-mono">
                  {g.location && <span>📍 {g.location}</span>}
                  {g.date && <span>🗓 {g.date}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onReorder(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onReorder(idx, 'down')}
                disabled={idx === gallery.length - 1}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleOpenEdit(g)}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-blue-400"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(g.id!, g.title)}
                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141923] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-semibold text-white">
              {editId ? 'Edit Gallery Moment' : 'Add New Gallery Moment'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Moment Name / Title *</label>
                <input
                  type="text"
                  required
                  value={form.title || ''}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="AU Gamedev Nova 2k25 — 1st Place Victory"
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={form.desc || ''}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Key highlights and achievements..."
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Year / Date</label>
                  <input
                    type="text"
                    value={form.date || ''}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="2025 / 2026"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location || ''}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Adamas University"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Tag</label>
                  <input
                    type="text"
                    value={form.tag || ''}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="Hackathon Win / Community"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Sequence (Order)</label>
                <input
                  type="number"
                  value={form.order || 1}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <MediaInput
                label="Moment Image (Image URL or Upload)"
                value={form.image || ''}
                onChange={(val) => setForm({ ...form, image: val })}
                onFileUpload={onFileUpload}
                uploading={uploading}
                uploadFeedback={uploadFeedback}
                accept="image/*"
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs"
                >
                  {editId ? 'Save Changes' : 'Create Gallery Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StoriesManager({
  stories,
  onReorder,
  onDelete,
  onFileUpload,
  uploading,
  uploadFeedback,
  onSeedDefaults,
  seeding,
}: {
  stories: StoryDoc[];
  onReorder: (idx: number, dir: 'up' | 'down') => void;
  onDelete: (id: string, title: string) => void;
  onFileUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
  uploadFeedback: string;
  onSeedDefaults?: () => void;
  seeding?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<StoryDoc>>({
    storyName: '',
    caption: '',
    platform: 'instagram',
    mediaUrl: '',
    linkUrl: '',
    duration: 6,
    order: stories.length + 1,
  });

  const handleOpenAdd = () => {
    setEditId(null);
    setForm({
      storyName: '',
      caption: '',
      platform: 'instagram',
      mediaUrl: '',
      linkUrl: '',
      duration: 6,
      order: stories.length + 1,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (s: StoryDoc) => {
    setEditId(s.id || null);
    setForm({ ...s });
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mediaUrl) return alert('Media file (Image or Video) is required.');

    const data: any = {
      storyName: form.storyName || form.caption || 'Story',
      caption: form.caption || form.storyName || '',
      platform: form.platform || 'instagram',
      mediaUrl: form.mediaUrl,
      linkUrl: form.linkUrl || '',
      duration: Number(form.duration) || 6,
      order: Number(form.order) || stories.length + 1,
    };

    try {
      if (editId) {
        await updateDoc(doc(db, 'stories', editId), data);
      } else {
        await addDoc(collection(db, 'stories'), data);
      }
      setIsOpen(false);
    } catch (err: any) {
      alert(`Error saving story: ${err.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Instagram-Style Stories Management</h2>
          <p className="text-xs text-gray-400">
            Control the interactive stories displayed when clicking the avatar logo in the navbar.
            Supports photos and videos (up to 25MB) with custom swipe-up/visit links.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-3 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Story</span>
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="p-8 sm:p-12 text-center border border-dashed border-gray-800 rounded-2xl bg-[#11141c]/60 flex flex-col items-center justify-center space-y-3">
          <Instagram className="w-12 h-12 text-[#00c0e8]/50" />
          <div>
            <h3 className="text-base font-semibold text-white">No stories created yet in Firestore</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
              Add photos or videos with custom links to display in your interactive Instagram-style avatar stories, or upload the 3 default stories.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onSeedDefaults}
              disabled={seeding}
              className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Uploading...' : '⚡ Upload 3 Default Stories to Database'}</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Story</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {stories.map((s, idx) => (
          <div
            key={s.id || idx}
            className="p-4 rounded-xl bg-[#11141c] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-16 rounded-lg bg-[#181d28] border border-gray-700 overflow-hidden flex-shrink-0 relative">
                {/\.(mp4|webm|ogg)$/i.test(s.mediaUrl) ? (
                  <video src={s.mediaUrl} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={s.mediaUrl} alt={s.storyName || 'Story'} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#00c0e8]">#{s.order ?? idx + 1}</span>
                  <h3 className="font-semibold text-sm text-white">{s.storyName || s.caption || 'Story'}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono capitalize">
                    {s.platform}
                  </span>
                </div>
                {s.caption && <p className="text-xs text-gray-400 line-clamp-1">{s.caption}</p>}
                <div className="flex gap-2 text-[11px] text-gray-500 font-mono">
                  <span>⏱ {s.duration || 6}s</span>
                  {s.linkUrl && (
                    <a href={s.linkUrl} target="_blank" rel="noreferrer" className="text-[#00c0e8] hover:underline flex items-center gap-1">
                      <span>Action Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onReorder(idx, 'up')}
                disabled={idx === 0}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onReorder(idx, 'down')}
                disabled={idx === stories.length - 1}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleOpenEdit(s)}
                className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-blue-400"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(s.id!, s.storyName || 'Story')}
                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141923] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-semibold text-white">
              {editId ? 'Edit Story' : 'Add New Story'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Story Name *</label>
                <input
                  type="text"
                  required
                  value={form.storyName || ''}
                  onChange={(e) => setForm({ ...form, storyName: e.target.value })}
                  placeholder="VibeForge 1.0 Hackathon"
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Story Caption / Details</label>
                <textarea
                  rows={2}
                  value={form.caption || ''}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Empowering next-generation developer hackathons..."
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Social Media Platform</label>
                  <select
                    value={form.platform || 'instagram'}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={form.duration || 6}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">Sequence (Order)</label>
                  <input
                    type="number"
                    value={form.order || 1}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Story Action Link (Visit Link)</label>
                <input
                  type="url"
                  value={form.linkUrl || ''}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="https://vibeforge-1-0.tech"
                  className="w-full px-3 py-2 rounded-lg bg-[#1a202c] border border-gray-700 text-xs text-white focus:outline-none focus:border-[#00c0e8]"
                />
              </div>

              <MediaInput
                label="Story Media File (Image or Video max 25MB - URL or R2 Upload) *"
                value={form.mediaUrl || ''}
                onChange={(val) => setForm({ ...form, mediaUrl: val })}
                onFileUpload={onFileUpload}
                uploading={uploading}
                uploadFeedback={uploadFeedback}
                accept="image/*,video/*"
              />

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00c0e8] hover:bg-[#009bbd] text-gray-950 font-medium text-xs"
                >
                  {editId ? 'Save Changes' : 'Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

