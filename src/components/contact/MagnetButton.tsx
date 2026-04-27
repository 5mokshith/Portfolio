"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "motion/react";

type Props = {
  children: ReactNode;
  href: string;
  /** open in new tab (no rel="noopener" required, Next adds it) */
  external?: boolean;
  /** force download instead of navigate */
  download?: boolean | string;
  /** max translation in px in either axis */
  strength?: number;
  className?: string;
  /** emit hover events for parent easter-eggs */
  onHoverChange?: (hovering: boolean) => void;
  /** accessible label override */
  ariaLabel?: string;
};

/**
 * Cursor-magnet pull on a link/button. The element translates toward the
 * cursor as it nears, snaps back on leave. Touch devices: no-op (just a
 * regular link).
 */
export function MagnetButton({
  children,
  href,
  external,
  download,
  strength = 10,
  className,
  onHoverChange,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setPos({ x: dx * strength, y: dy * strength });
  };

  const reset = () => {
    setPos({ x: 0, y: 0 });
    onHoverChange?.(false);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={download}
      aria-label={ariaLabel}
      className={className}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
      onMouseMove={handleMove}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={reset}
    >
      {children}
    </motion.a>
  );
}
