import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Heart, Music, VolumeX, Mail, Sparkles, Camera, Sparkle,
  Gift, RefreshCw, Compass, HeartHandshake, Eye, Star,
  Feather, Award, Lock, Unlock, Play, Pause
} from 'lucide-react';

// =========================================================================
// 🌷 CONFIGURATION SECTION 🌷
// Customize your names, dates, memories, photos, and personal notes here!
// =========================================================================
const CONFIG = {
  herName: "[HER NAME]",
  myName: "[MY NAME]",
  anniversaryDate: "[ANNIVERSARY DATE, e.g., October 25, 2026]",
  
  // Custom Audio Link (Optional fallback if user toggles off synthesized ambient music)
  customSongUrl: "", 
  
  // Secret Easter Egg Note unlocked by clicking the golden floating tulip
  hiddenEasterEggNote: "You found my secret! I fell for you long before I even admitted it to myself... ♡",

  // Envelopes / Letters (Section 4)
  reasons: [
    { title: "01. Your Smile", text: "Because somehow it can turn any ordinary day into something completely magical." },
    { title: "02. Your Habits", text: "The tiny quirks you probably don't even notice are the exact things I love most." },
    { title: "03. How You Make Me Feel", text: "With you, even quiet silence feels comforting and warm." },
    { title: "04. Your Laugh", text: "I don't think I'll ever get tired of hearing it. It's my favorite sound." },
    { title: "05. Our Talks", text: "We can talk about the smallest nonsense and I still never want the conversation to end." },
    { title: "06. Your Kindness", text: "You have a subtle way of making everyone around you feel valued and brighter." },
    { title: "07. The Little Moments", text: "It's the quick looks and inside jokes that I already know I'll remember forever." },
    { title: "08. Us", text: "Two months may not sound like a lifetime, but you've already become immensely special to me." }
  ],

  // Tulip Pick Game Messages
  tulipMessages: {
    pink: "You make my world softer and infinitely warmer.",
    red: "Still falling for you more and more every single day.",
    white: "My favorite kind of peace and safe haven.",
    purple: "You make ordinary days feel deeply magical.",
    yellow: "Your presence brings sunshine into every corner."
  },

  // Scatter Photo Gallery
  photos: [
    { id: 1, url: "https://images.unsplash.com/photo-1606240724602-5b21f896eae8?q=80&w=600&auto=format&fit=crop", caption: "Our first real adventure together.", date: "Memory #1" },
    { id: 2, url: "https://images.unsplash.com/photo-1520698188165-27a1a44e5bc7?q=80&w=600&auto=format&fit=crop", caption: "That time we couldn't stop laughing.", date: "Memory #2" },
    { id: 3, url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop", caption: "A quiet, perfect afternoon with you.", date: "Memory #3" },
    { id: 4, url: "https://images.unsplash.com/photo-1523450001550-93a9fa93e221?q=80&w=600&auto=format&fit=crop", caption: "Just you being wonderfully you.", date: "Memory #4" },
    { id: 5, url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop", caption: "My absolute favorite view in the world.", date: "Memory #5" }
  ],

  // Personal Love Letter
  loveLetter: `Happy 2nd Month Anniversary, my love.

I know two months might just seem like a brief slice of time to the outside world, but to me, it has been 60 beautiful days of discovering someone truly extraordinary. 

Before we started this, I didn't realize how quickly someone could become such an integral, comforting part of my everyday life. But then you came along, and suddenly my mornings felt warmer, my smiles came easier, and my days gained a gentle, lovely rhythm.

I love the way we talk. I love the way we laugh together. I love the simple fact that no matter how tired or stressed I might be, just hearing from you makes everything feel grounded again.

I crafted this experience for you to show you that I pay attention. I notice the little things you do, the way your mind works, and how effortlessly genuine you are. You mean so much to me—far more than I can capture in words alone.

Thank you for these first two months. Thank you for being yourself.

Two months down.
And I can't wait for all the memories still waiting for us.`
};

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25]; // C Major / E minor warm scale
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(freq = 523.25, duration = 1.2) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playSparkle() {
    if (!this.ctx) return;
    const baseFreqs = [523.25, 659.25, 783.99, 1046.50];
    baseFreqs.forEach((f, index) => {
      setTimeout(() => this.playChime(f, 0.8), index * 90);
    });
  }

  playSealBreak() {
    if (!this.ctx) return;
    this.playChime(220, 0.6);
    setTimeout(() => this.playChime(440, 0.9), 100);
    setTimeout(() => this.playSparkle(), 250);
  }

  startAmbientSynth() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    // Play gentle piano/celeste-like chord arpeggios
    const playArpeggio = () => {
      if (!this.isPlaying) return;
      const root = [130.81, 146.83, 164.81, 174.61][Math.floor(Math.random() * 4)];
      
      // Pad synth
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(root * 2, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 4.5);
      } catch(e) {}

      // Gentle high arpeggio
      for(let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (!this.isPlaying) return;
          const note = this.notes[Math.floor(Math.random() * this.notes.length)];
          this.playChime(note, 2.0);
        }, i * 400 + Math.random() * 200);
      }

      this.timer = setTimeout(playArpeggio, 3500 + Math.random() * 2000);
    };

    playArpeggio();
  }

  stopAmbientSynth() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }
}

const audioSynth = new RomanticAudioEngine();

const InjectGlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Inter:wght@200;300;400;500&display=swap');

    body {
      margin: 0;
      padding: 0;
      background-color: #0d090a;
      color: #fffdf9;
      overflow-x: hidden;
      font-family: 'Inter', sans-serif;
      user-select: none;
    }

    .serif { font-family: 'Playfair Display', serif; }
    .handwriting { font-family: 'Great Vibes', cursive; }

    .polaroid-shadow {
      box-shadow: 0 15px 35px rgba(0,0,0,0.25), 0 5px 15px rgba(0,0,0,0.15);
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0d090a;
    }
    ::-webkit-scrollbar-thumb {
      background: #4a1525;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #e69ab0;
    }
  `}} />
);

const CustomTulipIcon = ({ 
  color = "#f472b6", 
  stemColor = "#4ade80", 
  className = "w-12 h-12",
  sway = false 
}) => (
  <svg 
    viewBox="0 0 100 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`${className} ${sway ? 'animate-bounce' : ''}`}
    style={{ filter: `drop-shadow(0px 4px 10px ${color}40)` }}
  >
    {/* Stem */}
    <path d="M50 115 C50 85, 42 70, 48 45" stroke={stemColor} strokeWidth="5" strokeLinecap="round"/>
    {/* Leaves */}
    <path d="M48 90 C30 80, 20 60, 35 50 C40 65, 45 80, 48 90 Z" fill={stemColor} opacity="0.85"/>
    <path d="M49 80 C65 70, 75 55, 60 45 C55 60, 50 72, 49 80 Z" fill={stemColor} opacity="0.7"/>
    
    {/* Flower Petals */}
    <path d="M48 45 C25 40, 15 20, 30 10 C45 25, 48 38, 48 45 Z" fill={color}/>
    <path d="M48 45 C71 40, 81 20, 66 10 C51 25, 48 38, 48 45 Z" fill={color}/>
    <path d="M32 15 C32 30, 40 42, 48 45 C56 42, 64 30, 64 15 C52 5, 44 5, 32 15 Z" fill={color} opacity="0.95"/>
    {/* Center Glow Accent */}
    <path d="M44 25 C44 35, 46 40, 48 42 C50 40, 52 35, 52 25 C48 20, 48 20, 44 25 Z" fill="#fffdf9" opacity="0.6"/>
  </svg>
);

const GlobalCanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles array: fireflies & petals
    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      color: Math.random() > 0.4 ? 'rgba(253, 242, 248, ' : 'rgba(251, 191, 36, ',
      alpha: Math.random() * 0.7 + 0.2,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: -Math.random() * 0.5 - 0.2,
      pulse: Math.random() * 0.05,
      isPetal: Math.random() > 0.6,
      angle: Math.random() * Math.PI * 2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += 0.02;

        if (p.y < -20) p.y = height + 20;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.beginPath();

        if (p.isPetal) {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(244, 114, 182, ${p.alpha * 0.5})`;
          ctx.ellipse(0, 0, p.radius * 2, p.radius * 4, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#fbbf24';
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
};

const OpeningScreen = ({ onOpen }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleStart = () => {
    audioSynth.playSparkle();
    audioSynth.startAmbientSynth();
    setIsUnlocking(true);
    setTimeout(() => {
      onOpen();
    }, 2200);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d090a] px-6 text-center"
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 1.5 } }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="flex flex-col items-center max-w-lg"
      >
        <span className="text-pink-300 text-sm uppercase tracking-[0.3em] mb-4 font-light">An Interactive Gift</span>
        <h1 className="text-4xl md:text-6xl serif text-[#fffdf9] font-light leading-tight mb-8">
          I made something for you...
        </h1>
        
        <div 
          onClick={handleStart}
          className="relative my-8 cursor-pointer group flex items-center justify-center"
        >
          {/* Outer Pulsing Glow */}
          <motion.div 
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-900/30 blur-2xl pointer-events-none"
          />

          <motion.div
            animate={isUnlocking ? { scale: 1.8, rotate: 180, opacity: 0 } : { scale: 1 }}
            transition={{ duration: 1.8 }}
            className="relative z-10 p-6 rounded-full bg-[#1c0d13] border border-pink-500/30 group-hover:border-pink-400/80 transition-colors shadow-2xl"
          >
            <CustomTulipIcon color="#f472b6" className="w-16 h-16 md:w-20 md:h-20" />
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-sm font-light italic mb-10"
        >
          (Tap the tulip bud to bloom your gift)
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="px-10 py-4 bg-gradient-to-r from-[#4a1525] to-[#881337] text-pink-100 rounded-full border border-pink-400/30 shadow-lg tracking-widest text-xs uppercase hover:brightness-125 transition-all flex items-center gap-3"
        >
          <Sparkles className="w-4 h-4 text-pink-300" />
          Open Your Gift
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const TwoMonthsSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6 py-32 bg-gradient-to-b from-[#0d090a] via-[#1c0d13] to-[#0d090a]">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-12 z-20">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
        >
          <span className="text-pink-400/80 uppercase tracking-[0.4em] text-xs font-semibold block mb-2">Our First Milestone</span>
          <h2 className="text-6xl md:text-8xl serif font-light text-[#fffdf9]">2 Months.</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-2xl md:text-4xl handwriting text-pink-200/90"
        >
          60+ days of us.
        </motion.p>

        <div className="w-16 h-[1px] bg-pink-500/30 my-4" />

        <div className="flex flex-col gap-6 text-lg md:text-xl font-light text-gray-300">
          {[
            "Countless conversations late into the night",
            "Countless laughs that made my chest warm",
            "Countless little memories captured quietly",
            "Countless unexpected moments together",
            "And one person I still choose every single day."
          ].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.25 }}
              className="hover:text-pink-200 transition-colors cursor-default"
            >
              {text}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-12 p-8 rounded-2xl bg-[#2a101b]/50 border border-pink-500/20 backdrop-blur-md shadow-2xl"
        >
          <p className="text-2xl md:text-3xl serif italic text-pink-100 leading-relaxed">
            "And somehow, I'd still choose you all over again."
          </p>
        </motion.div>

      </div>
    </section>
  );
};

const InteractiveTulipMeadow = () => {
  const canvasRef = useRef(null);
  const [plantedCount, setPlantedCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let flowers = [];

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const colors = ['#f472b6', '#fb7185', '#f43f5e', '#e879f9', '#fde047', '#ffffff'];

    const drawFlower = (f) => {
      ctx.save();
      ctx.translate(f.x, f.y);

      // Growth animation factor
      const scale = Math.min(f.age / f.maxAge, 1);
      ctx.scale(scale, scale);

      // Stem
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(f.curve, -f.height / 2, 0, -f.height);
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Flower Head
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(0, -f.height - 10, 14, 0, Math.PI * 2);
      ctx.fill();

      // Left petal
      ctx.beginPath();
      ctx.ellipse(-10, -f.height - 8, 8, 16, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      // Right petal
      ctx.beginPath();
      ctx.ellipse(10, -f.height - 8, 8, 16, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    let animationId;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw horizon ground line
      ctx.fillStyle = '#180a11';
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

      flowers.forEach(f => {
        if (f.age < f.maxAge) f.age += 1;
        drawFlower(f);
      });

      animationId = requestAnimationFrame(loop);
    };
    loop();

    const handlePlant = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      // Only plant on lower screen area
      if (y > canvas.height * 0.3) {
        audioSynth.playChime(400 + Math.random() * 400, 0.5);
        flowers.push({
          x,
          y,
          height: Math.random() * 60 + 50,
          curve: (Math.random() - 0.5) * 30,
          color: colors[Math.floor(Math.random() * colors.length)],
          age: 0,
          maxAge: 25
        });
        setPlantedCount(prev => prev + 1);
      }
    };

    canvas.addEventListener('click', handlePlant);

    return () => {
      canvas.removeEventListener('click', handlePlant);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="min-h-screen bg-[#0d090a] relative flex flex-col items-center justify-between py-20 px-6 overflow-hidden">
      <div className="z-20 text-center max-w-xl">
        <span className="text-pink-400 text-xs tracking-widest uppercase mb-2 block">Interactive Garden</span>
        <h2 className="text-4xl md:text-5xl serif text-[#fffdf9] mb-4">Plant Our Memories</h2>
        <p className="text-gray-400 text-sm font-light">
          Tap or click anywhere on the ground below to bloom a fresh tulip! 🌷
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-950/40 border border-pink-500/20 text-pink-300 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{plantedCount} Tulips Planted</span>
        </div>
      </div>

      <div className="w-full h-[65vh] relative z-10 rounded-3xl overflow-hidden border border-pink-900/30 bg-gradient-to-b from-[#180a11] to-[#0d090a]">
        <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
        <div className="absolute top-4 left-4 pointer-events-none text-xs text-gray-500 italic">
          ✦ Interactive Canvas Area
        </div>
      </div>
    </section>
  );
};

const ReasonsSection = () => {
  const [openedReason, setOpenedReason] = useState(null);

  const handleOpen = (reason) => {
    audioSynth.playChime(700, 0.8);
    setOpenedReason(reason);
  };

  return (
    <section className="py-32 bg-[#0d090a] px-6">
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-pink-400 text-xs tracking-widest uppercase mb-2 block">Reasons Why</span>
        <h2 className="text-4xl md:text-5xl serif text-[#fffdf9] mb-16">I Could Probably Write Forever...</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {CONFIG.reasons.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleOpen(item)}
              className="bg-[#1a0c13] p-6 rounded-2xl border border-pink-500/20 hover:border-pink-400/60 cursor-pointer flex flex-col items-center justify-between min-h-[180px] shadow-lg group relative overflow-hidden"
            >
              <div className="absolute top-3 left-3 text-xs text-pink-500/40 font-mono">
                {(idx + 1).toString().padStart(2, '0')}
              </div>
              <Mail className="w-8 h-8 text-pink-400/60 group-hover:text-pink-300 transition-colors mt-4" />
              <h3 className="serif text-lg text-pink-100 mt-4 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <span className="text-[10px] text-gray-500 tracking-wider uppercase mt-2">Tap to Unfold</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Letter Modal */}
      <AnimatePresence>
        {openedReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenedReason(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -3 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 3 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#fdf2f8] text-[#4a1525] p-8 md:p-12 rounded-3xl max-w-md w-full relative shadow-2xl border-4 border-[#fbcfe8]"
            >
              <button 
                onClick={() => setOpenedReason(null)}
                className="absolute top-4 right-4 text-pink-900/60 hover:text-pink-900 font-bold"
              >
                ✕
              </button>
              <span className="text-xs font-bold tracking-widest text-pink-700 uppercase block mb-2">
                A Little Note For You
              </span>
              <h3 className="text-3xl serif mb-6 border-b border-pink-200 pb-3">{openedReason.title}</h3>
              <p className="text-lg font-light leading-relaxed italic">
                "{openedReason.text}"
              </p>
              <div className="mt-8 text-right">
                <CustomTulipIcon color="#f472b6" className="w-8 h-8 inline-block" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const PickTulipColorGame = () => {
  const [unlocked, setUnlocked] = useState({});

  const tulips = [
    { id: 'pink', color: '#f472b6', title: 'Pink Tulip', msg: CONFIG.tulipMessages.pink },
    { id: 'red', color: '#f43f5e', title: 'Red Tulip', msg: CONFIG.tulipMessages.red },
    { id: 'white', color: '#fffdf9', title: 'White Tulip', msg: CONFIG.tulipMessages.white },
    { id: 'purple', color: '#c084fc', title: 'Purple Tulip', msg: CONFIG.tulipMessages.purple },
    { id: 'yellow', color: '#fde047', title: 'Yellow Tulip', msg: CONFIG.tulipMessages.yellow }
  ];

  const handlePick = (t) => {
    audioSynth.playSparkle();
    setUnlocked(prev => ({ ...prev, [t.id]: true }));
  };

  const isAllUnlocked = Object.keys(unlocked).length === tulips.length;

  return (
    <section className="py-32 bg-[#120a0e] px-6 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto z-20 relative">
        <span className="text-pink-400 text-xs tracking-widest uppercase block mb-2">Interactive Mini-Game</span>
        <h2 className="text-4xl md:text-5xl serif text-[#fffdf9] mb-4">Pick A Color</h2>
        <p className="text-gray-400 text-sm mb-16 font-light">Each color holds a hidden thought. Unlock them all!</p>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {tulips.map((t) => {
            const isOpened = unlocked[t.id];
            return (
              <div key={t.id} className="flex flex-col items-center w-36">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePick(t)}
                  className="cursor-pointer mb-4 p-4 rounded-2xl bg-[#1c0d13] border border-pink-500/20 hover:border-pink-400 transition-all shadow-xl"
                >
                  <CustomTulipIcon color={t.color} className="w-16 h-16" sway={isOpened} />
                </motion.div>
                <span className="text-xs text-gray-400 mb-2">{t.title}</span>

                <AnimatePresence>
                  {isOpened && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-light text-pink-200 leading-snug"
                    >
                      "{t.msg}"
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {isAllUnlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-pink-950/60 to-rose-950/60 border border-pink-400/40 inline-block shadow-2xl"
            >
              <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-3 animate-spin" />
              <h3 className="text-2xl serif text-yellow-200 mb-2">Looks like you found them all! ♡</h3>
              <p className="text-sm text-gray-300 font-light">
                Just like these tulips, every single side of you makes my world brighter.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const PolaroidGallery = () => {
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <section className="py-32 bg-[#0d090a] min-h-screen px-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-center mb-16 z-20">
        <span className="text-pink-400 text-xs tracking-widest uppercase block mb-2">Memory Table</span>
        <h2 className="text-4xl md:text-5xl serif text-[#fffdf9]">Scattered Polaroids</h2>
        <p className="text-gray-400 text-sm mt-2 font-light">Drag them around or tap to view closer</p>
      </div>

      <div className="w-full max-w-5xl h-[65vh] relative rounded-3xl bg-[#160b10] border border-pink-900/30 p-6 overflow-hidden">
        {CONFIG.photos.map((photo, i) => {
          const rotations = [-8, 5, -12, 10, -4];
          const tops = ['10%', '25%', '45%', '15%', '40%'];
          const lefts = ['10%', '35%', '15%', '65%', '50%'];

          return (
            <motion.div
              key={photo.id}
              drag
              dragConstraints={{ left: -100, right: 300, top: -100, bottom: 200 }}
              initial={{ rotate: rotations[i % rotations.length], top: tops[i % tops.length], left: lefts[i % lefts.length] }}
              whileHover={{ scale: 1.08, zIndex: 40 }}
              whileDrag={{ scale: 1.15, zIndex: 50 }}
              onClick={() => {
                audioSynth.playChime(650, 0.6);
                setActivePhoto(photo);
              }}
              className="absolute w-44 md:w-56 bg-white p-3 pb-10 polaroid-shadow cursor-grab active:cursor-grabbing rounded-sm border border-gray-200"
            >
              <div className="w-full aspect-square bg-gray-100 overflow-hidden mb-3">
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover pointer-events-none" />
              </div>
              <p className="text-center font-serif text-gray-800 text-xs italic pointer-events-none">
                {photo.date}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              className="bg-white p-5 pb-16 rounded-xl max-w-lg w-full polaroid-shadow relative"
            >
              <button 
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold"
              >
                ✕
              </button>
              <img src={activePhoto.url} alt="Enlarged" className="w-full h-80 object-cover rounded-md mb-6" />
              <p className="text-center text-2xl serif text-gray-900 italic">
                "{activePhoto.caption}"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const LoveLetterSection = () => {
  const [isUnsealed, setIsUnsealed] = useState(false);

  const handleUnseal = () => {
    audioSynth.playSealBreak();
    setIsUnsealed(true);
  };

  return (
    <section className="py-32 bg-[#120a0e] px-6 flex justify-center items-center min-h-screen relative z-20">
      <div className="max-w-2xl w-full">
        {!isUnsealed ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={handleUnseal}
            className="bg-[#1c0d13] border-2 border-pink-500/30 p-12 rounded-3xl text-center cursor-pointer shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full pointer-events-none" />
            
            {/* Wax Seal */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#881337] to-[#4a1525] border-2 border-pink-400/50 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-pink-200 fill-pink-200 animate-pulse" />
            </div>

            <h3 className="text-2xl serif text-[#fffdf9] mb-2">For the girl who stole my heart ♡</h3>
            <p className="text-xs text-pink-400 tracking-widest uppercase">Tap to break wax seal & open</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="bg-[#fdf2f8] text-[#37101c] p-8 md:p-14 rounded-3xl shadow-2xl relative border-t-8 border-pink-400"
          >
            <div className="flex justify-between items-center mb-8 border-b border-pink-200 pb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-pink-700">
                2-Month Anniversary Letter
              </span>
              <CustomTulipIcon color="#f472b6" className="w-6 h-6" />
            </div>

            <div className="whitespace-pre-wrap font-serif text-base md:text-lg leading-relaxed space-y-4">
              {CONFIG.loveLetter}
            </div>

            <div className="mt-12 text-right border-t border-pink-200 pt-6">
              <span className="handwriting text-3xl text-pink-900 block">With all my love,</span>
              <span className="serif font-semibold text-lg text-[#37101c]">{CONFIG.myName}</span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const FinalSunsetField = () => {
  const [surpriseRevealed, setSurpriseRevealed] = useState(false);

  const handleRevealSurprise = () => {
    audioSynth.playSparkle();
    setSurpriseRevealed(true);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#120a0e] via-[#3b1120] to-[#0d090a] relative flex flex-col items-center justify-center px-6 py-32 text-center overflow-hidden">
      
      {/* Sunset Glow */}
      <div className="absolute top-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 blur-3xl pointer-events-none" />

      <div className="z-20 max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <CustomTulipIcon color="#fb7185" className="w-20 h-20 mb-6 mx-auto" />
          <h1 className="text-4xl md:text-6xl serif text-[#fffdf9] font-light leading-tight mb-6">
            Happy 2nd Month Anniversary, {CONFIG.herName} ♡
          </h1>
          <p className="text-xl text-pink-200/80 font-light mb-12">
            Thank you for making these last two months so deeply special.
          </p>
        </motion.div>

        {!surpriseRevealed ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRevealSurprise}
            className="px-10 py-4 bg-gradient-to-r from-pink-600 to-rose-700 text-white rounded-full shadow-2xl tracking-widest text-xs uppercase font-semibold hover:brightness-125 transition-all flex items-center gap-3"
          >
            <Sparkles className="w-4 h-4" />
            One Last Surprise...
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="p-8 rounded-3xl bg-[#1c0d13]/80 border border-pink-400/40 backdrop-blur-md shadow-2xl"
          >
            <p className="text-2xl md:text-3xl serif italic text-pink-100 mb-6">
              "If I had to do these two months all over again..."
            </p>
            <p className="text-4xl md:text-5xl serif font-bold text-yellow-300 drop-shadow-md">
              "I'd still choose you."
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const FloatingGoldenEasterEgg = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => {
          audioSynth.playSparkle();
          setUnlocked(true);
        }}
        className="p-3 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 backdrop-blur-md hover:bg-yellow-500/40 transition-colors shadow-lg"
        title="Secret Egg"
      >
        <Sparkles className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 bg-[#1c0d13] border border-yellow-400/60 p-6 rounded-2xl w-72 shadow-2xl text-left"
          >
            <button 
              onClick={() => setUnlocked(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold uppercase mb-2">
              <Star className="w-3.5 h-3.5 fill-yellow-300" />
              <span>You Found My Secret!</span>
            </div>
            <p className="text-xs text-pink-100 font-light leading-relaxed">
              {CONFIG.hiddenEasterEggNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const toggleAudio = () => {
    if (isAudioMuted) {
      audioSynth.startAmbientSynth();
      setIsAudioMuted(false);
    } else {
      audioSynth.stopAmbientSynth();
      setIsAudioMuted(true);
    }
  };

  return (
    <div className="bg-[#0d090a] min-h-screen text-[#fffdf9] relative selection:bg-pink-500 selection:text-white">
      <InjectGlobalStyles />
      <GlobalCanvasBackground />

      {/* Persistent Audio Controls */}
      {isOpened && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleAudio}
          className="fixed top-6 right-6 z-50 p-3 rounded-full bg-[#1c0d13]/80 border border-pink-500/30 text-pink-200 backdrop-blur-md hover:bg-pink-900/40 transition-colors shadow-lg"
        >
          {isAudioMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Music className="w-5 h-5 text-pink-300 animate-pulse" />}
        </motion.button>
      )}

      {/* Navigation / Flow */}
      {!isOpened ? (
        <OpeningScreen onOpen={() => setIsOpened(true)} />
      ) : (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <TwoMonthsSection />
          <InteractiveTulipMeadow />
          <ReasonsSection />
          <PickTulipColorGame />
          <PolaroidGallery />
          <LoveLetterSection />
          <FinalSunsetField />
          <FloatingGoldenEasterEgg />
        </motion.main>
      )}
    </div>
  );
}