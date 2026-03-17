"use client";

import { ComponentPropsWithoutRef, useState, useRef } from "react";
import { Check, Copy } from "lucide-react";
import classes from "../../mdx-components.module.css";

type PreProps = ComponentPropsWithoutRef<"pre">;

export function Pre({ children, ...props }: PreProps) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const copyToClipboard = async (text: string) => {
        // Try modern API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.warn("navigator.clipboard failed, trying fallback", err);
            }
        }

        // Fallback for non-secure contexts or incompatible browsers
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;

            // Ensure it's not visible viewport-wise but part of the DOM
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            textArea.setAttribute("aria-hidden", "true");
            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            const successful = document.execCommand("copy");
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            console.error("Fallback copy failed", err);
            return false;
        }
    };

    const onCopy = async () => {
        if (!preRef.current) return;

        const codeElement = preRef.current.querySelector("code");
        const code = codeElement?.getAttribute("data-code") || preRef.current.innerText;

        if (code) {
            const success = await copyToClipboard(code);
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    return (
        <div className={classes.preContainer}>
            <button
                onClick={onCopy}
                className={classes.copyButton}
                aria-label="Copy code"
                title="Copy code"
            >
                {copied ? (
                    <Check className={classes.copyIcon} />
                ) : (
                    <Copy className={classes.copyIcon} />
                )}
            </button>
            <pre ref={preRef} className={classes.pre} {...props}>
                {children}
            </pre>
        </div>
    );
}
