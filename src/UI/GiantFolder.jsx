import { useEffect, useRef, useState } from 'react';
import Folder from './Folder';

const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map(c => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

/**
 * GiantFolder: A large folder that opens and fans out smaller folders.
 * Props:
 * - color: string (primary color)
 * - size: number (scale of the giant folder)
 * - subfolders: ReactNode[] (array of Folder nodes to display when open)
 * - title: string (optional label under the giant folder)
 * - className: string
 */
const GiantFolder = ({
  color = '#5227FF',
  size = 2,
  subfolders = [],
  title = 'Skills',
  className = ''
}) => {
  const [open, setOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const fanRef = useRef(null);
  const bigRef = useRef(null);
  const unlockScrollRef = useRef(null);

  // auto open on scroll into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            setOpen(true);
          } else if (!entry.isIntersecting) {
            setOpen(false);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.65, 0.85, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Utility: lock and unlock page scroll
  const lockScroll = () => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prevent = (e) => { e.preventDefault(); };
    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });
    unlockScrollRef.current = () => {
      document.body.style.overflow = prevOverflow || '';
      window.removeEventListener('wheel', prevent);
      window.removeEventListener('touchmove', prevent);
    };
  };

  const unlockScroll = () => {
    if (unlockScrollRef.current) {
      unlockScrollRef.current();
      unlockScrollRef.current = null;
    }
  };

  // When opening, animate subfolders from the mouth position into their target grid cells sequentially
  useEffect(() => {
    const fan = fanRef.current;
    const big = bigRef.current;
    if (!fan || !big) return;

    const children = Array.from(fan.children);

    if (open && !hasAnimated) {
      // compute mouth (bottom-center of big folder)
      const bigRect = big.getBoundingClientRect();
      const mouth = {
        x: bigRect.left + bigRect.width / 2,
        y: bigRect.top + bigRect.height - 8
      };

      // Prepare children for animation from mouth to target
      children.forEach((child) => {
        const targetRect = child.getBoundingClientRect();
        const dx = mouth.x - (targetRect.left + targetRect.width / 2);
        const dy = mouth.y - (targetRect.top + targetRect.height / 2);
        child.style.willChange = 'transform, opacity';
        child.style.opacity = '0';
        child.style.transform = `translate(${dx}px, ${dy}px) scale(0.8)`;
      });

      // Lock scroll during sequence (slightly delayed so it doesn't feel early)
      const lockT = setTimeout(() => lockScroll(), 200);

      // Stagger to final positions
      const perDelay = 140; // ms between each folder
      children.forEach((child, i) => {
        setTimeout(() => {
          child.style.transition = 'transform 500ms cubic-bezier(0.2,0.8,0.2,1), opacity 500ms ease';
          child.style.opacity = '1';
          child.style.transform = 'translate(0px, 0px) scale(1)';
        }, perDelay * i);
      });

      // Unlock scroll after sequence completes
      const total = perDelay * children.length + 700;
      const t = setTimeout(() => {
        unlockScroll();
        setHasAnimated(true);
      }, total);
      return () => { clearTimeout(t); clearTimeout(lockT); };
    }

    if (!open) {
      // reset animated state for future re-entry if needed
      setHasAnimated(false);
    }
  }, [open, hasAnimated]);

  const back = darkenColor(color, 0.08);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {/* Fan-out area for small folders ON TOP */}
      <div
        ref={fanRef}
        className={`relative mx-auto mb-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 transition-all duration-500 ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        style={{ maxWidth: 1200 }}
      >
        {subfolders.map((node, i) => (
          <div key={i} className="flex justify-center">{node}</div>
        ))}
      </div>

      {/* Giant Folder visual BELOW */}
      <div className="w-full flex flex-col items-center">
        <div
          className={`group relative transition-all duration-200 ease-in cursor-pointer ${
            !open ? 'hover:-translate-y-2' : ''
          }`}
          style={{ transform: open ? 'translateY(-8px)' : undefined }}
          onClick={() => setOpen(o => !o)}
        >
          <div
            ref={bigRef}
            className="relative w-[220px] h-[160px] rounded-tl-0 rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px]"
            style={{ backgroundColor: back, transform: `scale(${size})` }}
          >
            <span
              className="absolute z-0 bottom-[98%] left-0 w-[70px] h-[22px] rounded-tl-[8px] rounded-tr-[8px] rounded-bl-0 rounded-br-0"
              style={{ backgroundColor: back }}
            />
            {/* front flaps */}
            <div
              className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
                !open ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
              }`}
              style={{ backgroundColor: color, borderRadius: '8px 14px 14px 14px', ...(open && { transform: 'skew(15deg) scaleY(0.6)' }) }}
            />
            <div
              className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
                !open ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
              }`}
              style={{ backgroundColor: color, borderRadius: '8px 14px 14px 14px', ...(open && { transform: 'skew(-15deg) scaleY(0.6)' }) }}
            />
          </div>
        </div>
        <p className="mt-3 text-base text-white/90">{title}</p>
      </div>
    </div>
  );
};

export default GiantFolder;
