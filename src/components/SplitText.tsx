import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // in milliseconds
  duration?: number; // in seconds
  ease?: string | gsap.EaseFunction;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars; // Initial animation state
  to?: gsap.TweenVars; // Target animation state
  threshold?: number; // 0-1 scroll trigger threshold
  rootMargin?: string; // CSS-like margin for scroll trigger
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompletedRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !text) return;

    const el = ref.current;
    animationCompletedRef.current = false;

    // Setup split text
    const absoluteLines = splitType === "lines";
    if (absoluteLines) el.style.position = "relative";

    let splitter: GSAPSplitText;
    try {
      splitter = new GSAPSplitText(el, {
        type: splitType,
        absolute: absoluteLines,
        linesClass: "split-line",
      });
    } catch (error) {
      console.error("SplitText initialization failed:", error);
      return;
    }

    // Get targets based on split type
    const targets = getSplitTargets(splitter, splitType);
    if (!targets?.length) {
      console.warn("No animation targets found");
      splitter.revert();
      return;
    }

    // Prepare elements for animation
    targets.forEach((t: HTMLElement) => {
      t.style.willChange = "transform, opacity";
    });

    // Create animation timeline
    const tl = gsap.timeline({
      scrollTrigger: getScrollTriggerConfig(el, threshold, rootMargin),
      onComplete: () =>
        handleAnimationComplete(targets, to, onLetterAnimationComplete),
    });

    tl.set(targets, { ...from, immediateRender: false }).to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
    });

    return () =>
      cleanupAnimation(tl, targets, splitter, scrollTriggerRef.current);
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
    >
      {text}
    </p>
  );
};

// Helper functions
function getSplitTargets(
  splitter: GSAPSplitText,
  splitType: string
): HTMLElement[] {
  switch (splitType) {
    case "lines":
      return splitter.lines as HTMLElement[];
    case "words":
      return splitter.words as HTMLElement[];
    case "chars":
      return splitter.chars as HTMLElement[];
    default:
      return splitter.chars as HTMLElement[];
  }
}

function getScrollTriggerConfig(
  el: HTMLElement,
  threshold: number,
  rootMargin: string
) {
  const startPct = (1 - threshold) * 100;
  const marginMatch = rootMargin.match(/^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/);
  const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
  const marginUnit = marginMatch?.[2] || "px";
  const sign =
    marginValue < 0
      ? `-=${Math.abs(marginValue)}${marginUnit}`
      : `+=${marginValue}${marginUnit}`;

  return {
    trigger: el,
    start: `top ${startPct}%${sign}`,
    toggleActions: "play none none none",
    once: true,
  };
}

function handleAnimationComplete(
  targets: HTMLElement[],
  to: gsap.TweenVars,
  callback?: () => void
) {
  gsap.set(targets, {
    ...to,
    clearProps: "willChange",
    immediateRender: true,
  });
  callback?.();
}

function cleanupAnimation(
  tl: gsap.core.Timeline,
  targets: HTMLElement[],
  splitter?: GSAPSplitText,
  scrollTrigger?: ScrollTrigger | null
) {
  tl?.kill();
  scrollTrigger?.kill();
  gsap.killTweensOf(targets);
  splitter?.revert();
}

export default SplitText;
