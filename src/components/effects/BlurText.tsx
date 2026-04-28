"use client";

import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
  children: ReactNode;
  /** ms to wait before this element starts revealing */
  delay?: number;
  /** ms the reveal takes */
  duration?: number;
  /** ratio of element visible before triggering (0-1) */
  amount?: number;
  className?: string;
  /** inline styles forwarded to the underlying motion element */
  style?: CSSProperties;
  /** rendered as motion.div by default; switch to motion.p for paragraphs */
  as?: "div" | "p" | "span" | "li";
};

const components = {
  div: motion.div,
  p: motion.p,
  span: motion.span,
  li: motion.li,
};

/**
 * Reveal-on-scroll: starts blurred + slightly translated + transparent,
 * settles to clear when the element enters the viewport.
 *
 * Use directly on paragraphs or wrap any block. Stagger sibling reveals
 * by passing increasing `delay` values from the parent.
 *
 * Forwards `ref` to the underlying motion element. Ref is typed as
 * `HTMLElement` (the union of div/p/span/li); cast at the call site if
 * a more specific element type is required.
 */
export const BlurText = forwardRef<HTMLElement, Props>(function BlurText(
  { children, delay = 0, duration = 0.95, amount = 0.4, className, style, as = "div" },
  ref,
) {
  const Comp = components[as];
  return (
    <Comp
      // forwardRef's HTMLElement union doesn't perfectly match each variant;
      // motion accepts a callback ref, but a typed cast is the cleanest path.
      ref={ref as React.Ref<HTMLDivElement & HTMLParagraphElement & HTMLSpanElement & HTMLLIElement>}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Comp>
  );
});
