import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, LogOut, Settings, Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Github, Linkedin, Twitter, Save, RefreshCw, FileText, Globe, Smartphone, Cpu, Cloud, LayoutDashboard } from 'lucide-react';
import { auth, db, loginWithGoogle, logout, onAuthStateChanged, type User, collection, doc, onSnapshot, setDoc, addDoc, serverTimestamp, query, orderBy, limit, type DocumentData, OperationType, handleFirestoreError } from './firebase';
import { type WebsiteContent, type ContactMessage, type UserProfile, type AdminConfig } from './types';
import { cn } from './lib/utils';
import { ErrorBoundary } from './components/ErrorBoundary';

// --- Navbar Component ---
const Navbar = ({ user, isAdmin, onLogin, onLogout, onAdminClick }: { user: User | null, isAdmin: boolean, onLogin: () => void, onLogout: () => void, onAdminClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-ink/5 bg-paper/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full animate-pulse" />
            <span className="text-2xl font-display font-black tracking-tighter uppercase">NEXORA</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            {['home', 'services', 'about', 'contact'].map((item) => (
              <a 
                key={item}
                href={`#${item}`} 
                className="text-xs font-black uppercase tracking-widest text-ink/40 hover:text-accent transition-all hover:scale-110"
              >
                {item}
              </a>
            ))}
            
            <div className="h-4 w-px bg-ink/10" />

            {isAdmin && (
              <button 
                onClick={onAdminClick}
                className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-accent hover:opacity-70 transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-6">
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-ink/10 grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                <button onClick={onLogout} className="text-xs font-black uppercase tracking-widest text-red-500 hover:opacity-70 transition-all">
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="px-6 py-2 bg-ink text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent transition-all"
              >
                Join Us
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-ink">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-paper border-b border-ink/5 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-6">
              {['home', 'services', 'about', 'contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  onClick={() => setIsOpen(false)} 
                  className="block text-xl font-display font-bold uppercase tracking-tight"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-ink/5">
                {isAdmin && (
                  <button onClick={() => { onAdminClick(); setIsOpen(false); }} className="block text-lg font-bold text-accent mb-4">Admin Panel</button>
                )}
                {user ? (
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="block text-lg font-bold text-red-500">Sign Out</button>
                ) : (
                  <button onClick={() => { onLogin(); setIsOpen(false); }} className="block text-lg font-bold text-accent">Join Us</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Hero Component ---
const Hero = ({ content }: { content: WebsiteContent }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 grid-lines">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">Est. 2026</span>
                <div className="h-px w-20 bg-accent/30" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-ink/40">Innovation First</span>
              </div>
              
              <h1 className="text-[12vw] lg:text-[10vw] font-display font-black leading-[0.85] tracking-tighter mb-12 uppercase">
                {content.heroTitle.split(' ').map((word, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <div className="flex flex-col md:flex-row md:items-end space-y-8 md:space-y-0 md:space-x-12">
                <p className="max-w-md text-lg font-medium text-ink/60 leading-relaxed">
                  {content.heroTagline}
                </p>
                <div className="flex space-x-4">
                  <a href="#contact" className="group relative px-8 py-4 bg-ink text-white rounded-full overflow-hidden transition-all">
                    <span className="relative z-10 font-black uppercase tracking-widest text-xs">Start Project</span>
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </a>
                  <a href="#services" className="px-8 py-4 border border-ink/10 rounded-full font-black uppercase tracking-widest text-xs hover:bg-ink hover:text-white transition-all">
                    Explore
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative aspect-[3/4] bg-ink rounded-[40px] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://picsum.photos/seed/nexora-hero/800/1200" 
                alt="Creative Tech" 
                className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="p-6 glass rounded-2xl">
                  <p className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-widest mb-2">Current Project</p>
                  <p className="text-white font-display font-bold text-xl">Smart Infrastructure v2.0</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- About Component ---
const About = ({ content }: { content: WebsiteContent }) => {
  return (
    <section id="about" className="py-32 bg-paper relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[4/5] bg-ink rounded-[60px] overflow-hidden shadow-2xl">
               <img 
                src="https://picsum.photos/seed/nexora-about/800/1000" 
                alt="Our Mission" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-accent rounded-full blur-3xl opacity-20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">Our Story</span>
              <div className="h-px w-20 bg-accent/30" />
            </div>
            
            <h2 className="text-6xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85] mb-12">
              Building the<br />Next Era
            </h2>
            
            <p className="text-xl text-ink/60 mb-16 leading-relaxed max-w-xl">
              {content.aboutDescription}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <span className="block text-[10px] font-mono font-bold text-accent uppercase tracking-widest">Founder</span>
                <p className="text-2xl font-display font-bold text-ink uppercase">{content.founder}</p>
              </div>
              <div className="space-y-4">
                <span className="block text-[10px] font-mono font-bold text-accent uppercase tracking-widest">Co-founder</span>
                <p className="text-2xl font-display font-bold text-ink uppercase">{content.coFounder}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Contact Component ---
const Contact = ({ content }: { content: WebsiteContent }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-32 bg-paper grid-lines">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent">Contact</span>
              <div className="h-px w-20 bg-accent/30" />
            </div>
            
            <h2 className="text-6xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85] mb-12">
              Let's<br />Connect
            </h2>
            
            <p className="text-xl text-ink/60 mb-16 leading-relaxed">
              Have a project in mind or want to learn more about our solutions? We're here to help.
            </p>
            
            <div className="space-y-12">
              {[
                { label: 'Email', value: content.contactEmail, icon: Mail, href: `mailto:${content.contactEmail}` },
                { label: 'Phone', value: content.contactPhone, icon: Phone },
                { label: 'Location', value: content.contactLocation, icon: MapPin }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-6">
                  <div className="p-4 bg-ink text-white rounded-2xl">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest mb-2">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-2xl font-display font-bold text-ink hover:text-accent transition-colors uppercase">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-2xl font-display font-bold text-ink uppercase">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-ink p-12 rounded-[40px] shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-0 py-4 bg-transparent border-b border-white/10 text-white font-display font-bold text-xl outline-none focus:border-accent transition-all"
                    placeholder="JOHN DOE"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Your Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-0 py-4 bg-transparent border-b border-white/10 text-white font-display font-bold text-xl outline-none focus:border-accent transition-all"
                    placeholder="HELLO@EXAMPLE.COM"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Your Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-b border-white/10 text-white font-display font-bold text-xl outline-none focus:border-accent transition-all resize-none"
                  placeholder="TELL US ABOUT YOUR PROJECT..."
                />
              </div>
              
              <button 
                type="submit" 
                disabled={status === 'sending'}
                className={cn(
                  "w-full py-6 rounded-full font-display font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center space-x-4",
                  status === 'success' ? "bg-green-500 text-white" : 
                  status === 'error' ? "bg-red-500 text-white" : 
                  "bg-accent text-white hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {status === 'sending' ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : status === 'success' ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Message Sent</span>
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle className="w-6 h-6" />
                    <span>Error Sending</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Services Component ---
const Services = ({ content }: { content: WebsiteContent }) => {
  const services = [
    { title: 'Web Development', icon: Globe, desc: 'Custom, high-performance websites built with the latest technologies.' },
    { title: 'Mobile Solutions', icon: Smartphone, desc: 'Native and cross-platform mobile apps that deliver exceptional user experiences.' },
    { title: 'AI & Smart Systems', icon: Cpu, desc: 'Intelligent automation and AI-driven solutions to optimize your business.' },
    { title: 'Cloud Services', icon: Cloud, desc: 'Scalable and secure cloud infrastructure to power your digital growth.' }
  ];

  return (
    <section id="services" className="py-32 bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 grid-lines invert" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-6">
            <h2 className="text-6xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-[0.85]">
              Core<br />Capabilities
            </h2>
          </div>
          <div className="lg:col-span-6 flex items-end">
            <p className="text-xl text-white/60 leading-relaxed max-w-md">
              {content.servicesDescription}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-12 bg-ink hover:bg-accent transition-all duration-500 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-12">
                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/20 transition-colors">
                  <service.icon className="w-8 h-8 text-accent group-hover:text-white" />
                </div>
                <span className="text-4xl font-display font-black text-white/10 group-hover:text-white/20">0{idx + 1}</span>
              </div>
              <h3 className="text-3xl font-display font-bold uppercase mb-6 group-hover:translate-x-2 transition-transform">{service.title}</h3>
              <p className="text-lg text-white/50 group-hover:text-white/80 transition-colors leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Custom Cursor ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent pointer-events-none z-[100] hidden lg:block mix-blend-difference"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? 'var(--color-accent)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
};

// --- Admin Panel Component ---
const AdminPanel = ({ content, onClose }: { content: WebsiteContent, onClose: () => void }) => {
  const [editContent, setEditContent] = useState<WebsiteContent>(content);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({});
  const [activeTab, setActiveTab] = useState<'content' | 'messages' | 'github' | 'social' | 'settings'>('content');
  const [saving, setSaving] = useState(false);
  
  // GitHub State
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [repoFiles, setRepoFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [githubLoading, setGithubLoading] = useState(false);

  // Social State
  const [socialPost, setSocialPost] = useState('');
  const [socialStatus, setSocialStatus] = useState<'idle' | 'posting' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Listen to messages
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
      setMessages(msgs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'messages'));

    // Listen to admin config
    const unsubscribeConfig = onSnapshot(doc(db, 'adminConfig', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        setAdminConfig(snapshot.data() as AdminConfig);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'adminConfig/settings'));

    return () => {
      unsubscribeMessages();
      unsubscribeConfig();
    };
  }, []);

  // GitHub Handlers
  const fetchRepos = async () => {
    if (!adminConfig.githubToken || !adminConfig.githubUsername) return;
    setGithubLoading(true);
    try {
      const response = await fetch(`https://api.github.com/users/${adminConfig.githubUsername}/repos`, {
        headers: { Authorization: `token ${adminConfig.githubToken}` }
      });
      const data = await response.json();
      setRepos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setGithubLoading(false);
    }
  };

  const fetchRepoFiles = async (repoName: string) => {
    if (!adminConfig.githubToken || !adminConfig.githubUsername) return;
    setGithubLoading(true);
    setSelectedRepo(repoName);
    try {
      const response = await fetch(`https://api.github.com/repos/${adminConfig.githubUsername}/${repoName}/contents`, {
        headers: { Authorization: `token ${adminConfig.githubToken}` }
      });
      const data = await response.json();
      setRepoFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setGithubLoading(false);
    }
  };

  const fetchFileContent = async (path: string) => {
    if (!adminConfig.githubToken || !adminConfig.githubUsername || !selectedRepo) return;
    setGithubLoading(true);
    setSelectedFile(path);
    try {
      const response = await fetch(`https://api.github.com/repos/${adminConfig.githubUsername}/${selectedRepo}/contents/${path}`, {
        headers: { Authorization: `token ${adminConfig.githubToken}` }
      });
      const data = await response.json();
      if (data.content) {
        setFileContent(atob(data.content));
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
    } finally {
      setGithubLoading(false);
    }
  };

  const updateGithubFile = async () => {
    if (!adminConfig.githubToken || !adminConfig.githubUsername || !selectedRepo || !selectedFile) return;
    setGithubLoading(true);
    try {
      const getRes = await fetch(`https://api.github.com/repos/${adminConfig.githubUsername}/${selectedRepo}/contents/${selectedFile}`, {
        headers: { Authorization: `token ${adminConfig.githubToken}` }
      });
      const getData = await getRes.json();
      
      const putRes = await fetch(`https://api.github.com/repos/${adminConfig.githubUsername}/${selectedRepo}/contents/${selectedFile}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${adminConfig.githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update ${selectedFile} via NEXORA Admin`,
          content: btoa(fileContent),
          sha: getData.sha
        })
      });
      
      if (putRes.ok) {
        alert('File updated successfully!');
      } else {
        throw new Error('Failed to update file');
      }
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Error updating file');
    } finally {
      setGithubLoading(false);
    }
  };

  const postToLinkedIn = async () => {
    if (!adminConfig.linkedinToken || !adminConfig.linkedinPageId) {
      alert('LinkedIn API not configured');
      return;
    }
    setSocialStatus('posting');
    try {
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminConfig.linkedinToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify({
          author: `urn:li:organization:${adminConfig.linkedinPageId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: socialPost },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
        })
      });
      if (response.ok) {
        setSocialStatus('success');
        setSocialPost('');
        setTimeout(() => setSocialStatus('idle'), 3000);
      } else {
        throw new Error('LinkedIn post failed');
      }
    } catch (error) {
      console.error(error);
      setSocialStatus('error');
      setTimeout(() => setSocialStatus('idle'), 3000);
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'main'), editContent);
      setSaving(false);
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      setSaving(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'adminConfig', 'settings'), adminConfig);
      setSaving(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-ink w-full max-w-6xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />

        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'content', label: 'Editor', icon: FileText },
              { id: 'messages', label: `Inbox (${messages.length})`, icon: Mail },
              { id: 'github', label: 'GitHub', icon: Github },
              { id: 'social', label: 'Social', icon: Linkedin },
              { id: 'settings', label: 'API', icon: Settings },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-mono transition-all", 
                  activeTab === tab.id ? "bg-accent text-ink font-bold" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
            <X className="w-6 h-6 text-white/40 group-hover:text-accent" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          {activeTab === 'content' && (
            <div className="space-y-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">Hero Title</label>
                  <input 
                    type="text" 
                    value={editContent.heroTitle}
                    onChange={(e) => setEditContent({ ...editContent, heroTitle: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white font-display text-xl outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">Hero Tagline</label>
                  <input 
                    type="text" 
                    value={editContent.heroTagline}
                    onChange={(e) => setEditContent({ ...editContent, heroTagline: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white font-display text-xl outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">About Description</label>
                <textarea 
                  rows={4}
                  value={editContent.aboutDescription}
                  onChange={(e) => setEditContent({ ...editContent, aboutDescription: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white/80 text-sm outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">Services Description</label>
                <textarea 
                  rows={4}
                  value={editContent.servicesDescription}
                  onChange={(e) => setEditContent({ ...editContent, servicesDescription: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white/80 text-sm outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">Founder</label>
                  <input 
                    type="text" 
                    value={editContent.founder}
                    onChange={(e) => setEditContent({ ...editContent, founder: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white font-display text-lg outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">Co-founder</label>
                  <input 
                    type="text" 
                    value={editContent.coFounder}
                    onChange={(e) => setEditContent({ ...editContent, coFounder: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white font-display text-lg outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">Email</label>
                  <input 
                    type="text" 
                    value={editContent.contactEmail}
                    onChange={(e) => setEditContent({ ...editContent, contactEmail: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white/60 text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">Phone</label>
                  <input 
                    type="text" 
                    value={editContent.contactPhone}
                    onChange={(e) => setEditContent({ ...editContent, contactPhone: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white/60 text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono text-accent uppercase tracking-[0.2em]">Location</label>
                  <input 
                    type="text" 
                    value={editContent.contactLocation}
                    onChange={(e) => setEditContent({ ...editContent, contactLocation: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-white/60 text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveContent}
                disabled={saving}
                className="w-full bg-accent text-ink py-4 rounded-full font-mono font-bold hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>UPDATE_CORE_CONTENT</span>
              </button>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center py-32 glass rounded-3xl">
                  <Mail className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40 font-mono text-xs uppercase tracking-widest">No incoming data</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 rounded-3xl border border-white/5 hover:border-accent/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent font-mono text-xl">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-display text-lg text-white group-hover:text-accent transition-colors">{msg.name}</h4>
                          <p className="text-xs font-mono text-white/40">{msg.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                        {msg.createdAt?.toDate().toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-ink/50 p-6 rounded-2xl border border-white/5">
                      <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-8 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display text-white">Repository_Control</h3>
                <button 
                  onClick={fetchRepos}
                  className="flex items-center space-x-2 text-accent font-mono text-xs hover:opacity-80 transition-opacity"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", githubLoading && "animate-spin")} />
                  <span>SYNC_REPOS</span>
                </button>
              </div>

              {!adminConfig.githubToken && (
                <div className="p-6 glass border-accent/20 rounded-2xl flex items-center space-x-4">
                  <AlertCircle className="w-6 h-6 text-accent" />
                  <p className="text-white/60 text-xs font-mono">CRITICAL: GitHub Token missing. Configure in API tab.</p>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-8 flex-1 min-h-0">
                <div className="space-y-4 flex flex-col">
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Repositories</label>
                  <div className="glass rounded-2xl border border-white/5 overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                    {repos.map(repo => (
                      <button
                        key={repo.id}
                        onClick={() => fetchRepoFiles(repo.name)}
                        className={cn(
                          "w-full text-left px-6 py-4 text-xs font-mono transition-all border-b border-white/5",
                          selectedRepo === repo.name ? "bg-accent/10 text-accent" : "text-white/60 hover:bg-white/5"
                        )}
                      >
                        {repo.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 flex flex-col">
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">File_Tree: {selectedRepo || '...'}</label>
                  <div className="glass rounded-2xl border border-white/5 overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                    {repoFiles.map(file => (
                      <button
                        key={file.path}
                        onClick={() => fetchFileContent(file.path)}
                        className={cn(
                          "w-full text-left px-6 py-4 text-xs font-mono transition-all border-b border-white/5",
                          selectedFile === file.path ? "bg-accent/10 text-accent" : "text-white/60 hover:bg-white/5"
                        )}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 flex flex-col">
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Source_Editor: {selectedFile || '...'}</label>
                  <div className="flex flex-col flex-1 min-h-0">
                    <textarea
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="flex-1 p-6 bg-black/40 text-accent font-mono text-xs rounded-2xl outline-none resize-none border border-white/5 focus:border-accent/30 custom-scrollbar"
                      placeholder="// Select a file to view source..."
                    />
                    {selectedFile && (
                      <button
                        onClick={updateGithubFile}
                        disabled={githubLoading}
                        className="mt-6 bg-accent text-ink py-4 rounded-full font-mono font-bold hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                      >
                        {githubLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>PUSH_TO_MAIN</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-3xl border border-white/5">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center">
                      <Linkedin className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-display text-white">LinkedIn_Post</h3>
                  </div>
                  <textarea
                    rows={8}
                    value={socialPost}
                    onChange={(e) => setSocialPost(e.target.value)}
                    className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-white/80 text-sm outline-none focus:border-accent transition-colors resize-none mb-8"
                    placeholder="Broadcast to Nexora network..."
                  />
                  <button
                    onClick={postToLinkedIn}
                    disabled={socialStatus === 'posting' || !socialPost}
                    className={cn(
                      "w-full py-4 rounded-full font-mono font-bold flex items-center justify-center space-x-2 transition-all",
                      socialStatus === 'success' ? "bg-green-500 text-white" : "bg-accent text-ink hover:scale-[1.02]"
                    )}
                  >
                    {socialStatus === 'posting' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span>{socialStatus === 'success' ? 'BROADCAST_COMPLETE' : 'EXECUTE_POST'}</span>
                  </button>
                </div>

                <div className="glass p-10 rounded-3xl border border-white/5 opacity-50 grayscale">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Twitter className="w-6 h-6 text-white/40" />
                    </div>
                    <h3 className="text-xl font-display text-white">X_Integration</h3>
                  </div>
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 text-xs font-mono leading-relaxed">
                      SYSTEM_ERROR: Twitter API requires secure backend proxy. Integration pending.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-lg font-display text-white flex items-center space-x-3">
                    <Github className="w-5 h-5 text-accent" />
                    <span>GitHub_Auth</span>
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Username</label>
                      <input 
                        type="text" 
                        value={adminConfig.githubUsername || ''}
                        onChange={(e) => setAdminConfig({ ...adminConfig, githubUsername: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white font-mono text-sm outline-none focus:border-accent transition-colors"
                        placeholder="user_id"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Access_Token</label>
                      <input 
                        type="password" 
                        value={adminConfig.githubToken || ''}
                        onChange={(e) => setAdminConfig({ ...adminConfig, githubToken: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white font-mono text-sm outline-none focus:border-accent transition-colors"
                        placeholder="ghp_****************"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-lg font-display text-white flex items-center space-x-3">
                    <Linkedin className="w-5 h-5 text-accent" />
                    <span>LinkedIn_Auth</span>
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Organization_URN</label>
                      <input 
                        type="text" 
                        value={adminConfig.linkedinPageId || ''}
                        onChange={(e) => setAdminConfig({ ...adminConfig, linkedinPageId: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white font-mono text-sm outline-none focus:border-accent transition-colors"
                        placeholder="urn_id"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest">Bearer_Token</label>
                      <input 
                        type="password" 
                        value={adminConfig.linkedinToken || ''}
                        onChange={(e) => setAdminConfig({ ...adminConfig, linkedinToken: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 py-2 text-white font-mono text-sm outline-none focus:border-accent transition-colors"
                        placeholder="AQX_****************"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-white/10">
                <button 
                  onClick={handleSaveConfig}
                  disabled={saving}
                  className="w-full bg-white/5 text-white border border-white/10 py-4 rounded-full font-mono font-bold hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                >
                  {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span>COMMIT_API_CONFIG</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin (founder)
        const isAdminEmail = currentUser.email === 'nexora.official029@gmail.com';
        setIsAdmin(isAdminEmail);
      } else {
        setIsAdmin(false);
      }
    });

    const unsubscribeContent = onSnapshot(doc(db, 'content', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.data() as WebsiteContent);
      } else {
        // Initial default content
        const defaultContent: WebsiteContent = {
          heroTitle: "NEXORA – Next Era of Smart Solutions",
          heroTagline: "Innovative IT solutions for businesses and educational institutions",
          aboutDescription: "NEXORA is an innovative IT startup creating smart, efficient, and user-friendly digital solutions. Our mission is to simplify real-world problems using technology.",
          servicesDescription: "We provide a wide range of cutting-edge IT services designed to help your business thrive in the digital age. From custom software to AI integration, we've got you covered.",
          founder: "SIVA SAKTHI MURUGAN.S",
          coFounder: "T. HARI HARAN",
          contactEmail: "nexora.official029@gmail.com",
          contactPhone: "[Your Number]",
          contactLocation: "[City, State, India]"
        };
        setContent(defaultContent);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'content/main'));

    return () => {
      unsubscribeAuth();
      unsubscribeContent();
    };
  }, []);

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-paper font-sans selection:bg-accent selection:text-white">
        <CustomCursor />
        <Navbar 
          user={user} 
          isAdmin={isAdmin} 
          onLogin={loginWithGoogle} 
          onLogout={logout} 
          onAdminClick={() => setShowAdmin(true)} 
        />
        
        <main>
          <Hero content={content} />
          <Services content={content} />
          <About content={content} />
          <Contact content={content} />
        </main>

        <footer className="bg-ink text-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-12 gap-16 mb-24">
              <div className="md:col-span-6">
                <span className="text-6xl font-display font-black tracking-tighter uppercase mb-8 block">NEXORA</span>
                <p className="text-white/40 max-w-sm leading-relaxed text-lg">
                  Empowering businesses and educational institutions with smart, efficient, and user-friendly digital solutions.
                </p>
              </div>
              <div className="md:col-span-3">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent mb-8">Quick Links</h4>
                <ul className="space-y-4 text-white/60 font-display font-bold uppercase text-sm">
                  <li><a href="#home" className="hover:text-accent transition-colors">Home</a></li>
                  <li><a href="#services" className="hover:text-accent transition-colors">Services</a></li>
                  <li><a href="#about" className="hover:text-accent transition-colors">About Us</a></li>
                  <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
                </ul>
              </div>
              <div className="md:col-span-3">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-accent mb-8">Connect</h4>
                <ul className="space-y-4 text-white/60 font-display font-bold uppercase text-sm">
                  <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-white/20 text-[10px] font-mono font-bold uppercase tracking-widest space-y-4 md:space-y-0">
              <p>&copy; {new Date().getFullYear()} NEXORA. All rights reserved.</p>
              <div className="flex space-x-8">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {showAdmin && isAdmin && (
            <AdminPanel content={content} onClose={() => setShowAdmin(false)} />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

