/**
 * SentinelX AI — Input
 * Reusable text input with label/error/icon support. Used across auth forms,
 * search bars, and filter controls.
 */
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, leftIcon, rightIcon, id, ...props },
    ref
  ) => {
    const inputId = id ?? props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-sx-text-dim mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sx-text-faint">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full h-10 bg-sx-panel border rounded-lg text-sm text-sx-text placeholder:text-sx-text-faint",
              "focus:outline-none focus:ring-1 focus:ring-sx-accent focus:border-sx-accent transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon ? "pl-9" : "pl-3",
              rightIcon ? "pr-9" : "pr-3",
              error ? "border-sx-critical focus:ring-sx-critical focus:border-sx-critical" : "border-sx-border",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sx-text-faint">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <p className="text-xs text-sx-critical mt-1.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-sx-text-faint mt-1.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
