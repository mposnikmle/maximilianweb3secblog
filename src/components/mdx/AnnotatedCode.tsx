"use client";

import React, {
  useState,
  useRef,
  useEffect,
  Children,
  isValidElement,
} from "react";
import { highlight } from "sugar-high";
import { X, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import classes from "./AnnotatedCode.module.css";

interface AnnotationData {
  id: string;
  lines: string; // e.g., "1-4" or "10-15"
  title: string;
  content: React.ReactNode;
}

interface AnnotationProps {
  id: string;
  lines: string;
  title: string;
  children: React.ReactNode;
}

// Helper component - user writes these inside AnnotatedCode
export function Annotation({ children }: AnnotationProps) {
  // This component doesn't render anything directly
  // It's parsed by AnnotatedCode to extract metadata
  return null;
}

interface AnnotatedCodeProps {
  code: string;
  language?: string;
  children: React.ReactNode;
  startLine?: number; // Allow starting from a different line number
}

export function AnnotatedCode({
  code,
  language = "typescript",
  children,
  startLine = 1,
}: AnnotatedCodeProps) {
  const [activeAnnotation, setActiveAnnotation] =
    useState<AnnotationData | null>(null);
  const [lineHeight, setLineHeight] = useState<number>(24);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  // Extract annotations from children
  const annotations: AnnotationData[] = [];
  
  Children.forEach(children, (child) => {
    // Check if it's a valid element with annotation props
    // (MDX wraps components in React.lazy, so we can't check type directly)
    if (isValidElement(child) && child.props) {
      const props = child.props as any;
      // Check if it has the annotation props (id, lines, title)
      if (props.id && props.lines && props.title) {
        annotations.push({
          id: props.id,
          lines: props.lines,
          title: props.title,
          content: props.children,
        });
      }
    }
  });

  // Calculate line height on mount and when window resizes
  useEffect(() => {
    const calculateLineHeight = () => {
      if (codeRef.current) {
        const firstLine = codeRef.current.querySelector(
          `.${classes.codeLine}`
        ) as HTMLElement | null;
        if (firstLine) {
          setLineHeight(firstLine.offsetHeight);
        }
      }
    };

    // Calculate immediately
    calculateLineHeight();

    // Recalculate on window resize (debounced)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateLineHeight, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Also recalculate after a short delay to ensure CSS has applied
    const initialTimeout = setTimeout(calculateLineHeight, 150);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      clearTimeout(initialTimeout);
    };
  }, [code]);

  // Parse line range (e.g., "1-4" -> {start: 1, end: 4})
  const parseLineRange = (range: string): { start: number; end: number } => {
    const [start, end] = range.split("-").map(Number);
    return { start, end: end || start };
  };

  // Split code into lines and apply syntax highlighting
  const lines = code.split("\n");
  const highlightedLines = lines.map((line) => highlight(line || " "));

  // Handle clicking on an annotation
  const handleAnnotationClick = (annotation: AnnotationData) => {
    setActiveAnnotation(
      activeAnnotation?.id === annotation.id ? null : annotation
    );
  };

  // Close panel
  const closePanel = () => {
    setActiveAnnotation(null);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (activeAnnotation) {
          closePanel();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isFullscreen, activeAnnotation]);

  // Copy to clipboard function with fallback
  const copyToClipboard = async () => {
    // Try modern API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("navigator.clipboard failed, trying fallback", err);
      }
    }

    // Fallback for non-secure contexts or incompatible browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      textArea.setAttribute("aria-hidden", "true");
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
  };

  return (
    <div className={`${classes.container} ${isFullscreen ? classes.fullscreen : ''}`}>
      {/* Backdrop when fullscreen */}
      {isFullscreen && (
        <div 
          className={classes.fullscreenBackdrop} 
          onClick={() => setIsFullscreen(false)}
        />
      )}
      
      <div className={classes.codeWrapper}>
        {/* Copy button */}
        <button
          className={classes.copyButton}
          onClick={copyToClipboard}
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>

        {/* Fullscreen button */}
        <button
          className={classes.fullscreenButton}
          onClick={() => setIsFullscreen(!isFullscreen)}
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        
        <div className={classes.codeContainer} ref={codeRef}>
          {/* Line numbers */}
          <div className={classes.lineNumbers}>
            {lines.map((_, index) => (
              <div 
                key={index} 
                className={classes.lineNumber}
              >
                {startLine + index}
              </div>
            ))}
          </div>

          {/* Code content */}
          <div className={classes.codeContent}>
            {highlightedLines.map((lineHTML, index) => (
              <div
                key={index}
                className={classes.codeLine}
                dangerouslySetInnerHTML={{ __html: lineHTML }}
              />
            ))}
          </div>

          {/* Annotation overlays */}
          <div className={classes.annotationOverlays}>
            {annotations.map((annotation) => {
              const { start, end } = parseLineRange(annotation.lines);
              const top = (start - startLine) * lineHeight;
              const height = (end - start + 1) * lineHeight;
              const isActive = activeAnnotation?.id === annotation.id;

              return (
                <button
                  key={annotation.id}
                  className={`${classes.annotationOverlay} ${
                    isActive ? classes.active : ""
                  }`}
                  style={{ top: `${top}px`, height: `${height}px` }}
                  onClick={() => handleAnnotationClick(annotation)}
                  aria-label={`View annotation: ${annotation.title}`}
                  title={annotation.title}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Annotation panel */}
      {activeAnnotation && (
        <>
          {/* Backdrop for mobile */}
          <div className={classes.backdrop} onClick={closePanel} />

          {/* Side panel */}
          <div className={classes.panel}>
            <div className={classes.panelHeader}>
              <h3 className={classes.panelTitle}>{activeAnnotation.title}</h3>
              <button
                className={classes.closeButton}
                onClick={closePanel}
                aria-label="Close annotation"
              >
                <X size={20} />
              </button>
            </div>
            <div className={classes.panelContent}>
              {activeAnnotation.content}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
