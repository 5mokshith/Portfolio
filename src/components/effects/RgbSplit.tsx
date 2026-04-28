"use client";

import * as React from "react";
import { motion, type MotionValue } from "motion/react";
import { type ReactNode, type ElementType, type CSSProperties } from "react";

type RgbSplitProps = {
  children: ReactNode;
  /** static offset in px when no MotionValue is provided */
  offset?: number;
  /** if provided, overrides `offset` and drives the CSS var dynamically */
  motionOffset?: MotionValue<number>;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders three layered copies of children:
 *   - red layer (translateX(-offset))
 *   - white foreground layer (translateX(0)) — the only one screen readers see
 *   - cyan layer (translateX(+offset))
 *
 * Layers offsets are driven by the `--rgb-offset` CSS var so motion lives on
 * the GPU. Pass a MotionValue via `motionOffset` for scroll/cursor-driven splits.
 *
 * IMPORTANT: red and cyan layers are aria-hidden. Only the foreground white
 * layer carries the accessible text.
 */
export function RgbSplit({
  children,
  offset = 0,
  motionOffset,
  as: Tag = "span",
  className,
  style,
}: RgbSplitProps) {
  const Outer = motion.create(Tag) as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & {
      style?: CSSProperties;
    }
  >;

  const baseStyle: CSSProperties & { ["--rgb-offset"]?: string | number } = {
    "--rgb-offset": motionOffset ? undefined : `${offset}px`,
    ...style,
  };

  return (
    <Outer
      className={`rgb-split ${className ?? ""}`}
      // motion-driven CSS var — Motion supports CSS custom properties via style
      style={
        motionOffset
          ? ({
              ...baseStyle,
              "--rgb-offset": motionOffset,
            } as unknown as CSSProperties)
          : baseStyle
      }
    >
      <span aria-hidden className="rgb-layer rgb-layer-red">
        {children}
      </span>
      <span className="rgb-layer-fg">{children}</span>
      <span aria-hidden className="rgb-layer rgb-layer-cyan">
        {children}
      </span>
    </Outer>
  );
}
