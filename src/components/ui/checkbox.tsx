"use client";

import * as React from "react";
import { Check } from "lucide-react";

// Define the props the component will accept
interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox = ({ id, checked, onCheckedChange, className }: CheckboxProps) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      id={id}
      onClick={() => onCheckedChange(!checked)}
      className={`
        h-4 w-4 shrink-0 rounded-sm border border-slate-900 
        ring-offset-white focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-slate-950 focus-visible:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50
        flex items-center justify-center
        transition-colors
        ${checked ? 'bg-slate-900 text-white' : 'bg-white'}
        ${className || ''}
      `}
    >
      {/* The check icon is only visible when the state is 'checked' */}
      <div className={`transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}>
        <Check className="h-4 w-4" />
      </div>
    </button>
  );
};

export { Checkbox };