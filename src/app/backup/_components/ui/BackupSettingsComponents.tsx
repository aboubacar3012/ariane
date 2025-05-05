"use client";

import { ReactNode } from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}

export const ToggleSwitch = ({ enabled, onChange, label, description }: ToggleSwitchProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <label className="text-sm font-medium text-gray-400">{label}</label>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
      <div 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
          ${enabled ? 'bg-blue-600' : 'bg-gray-600'}`}
        onClick={onChange}
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
            ${enabled ? 'translate-x-6' : 'translate-x-1'}`} 
        />
      </div>
    </div>
  );
};

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  options: { value: string; label: string }[];
}

export const SelectInput = ({ value, onChange, label, description, options }: SelectInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-700 p-2 pl-4 pr-10 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );
};

interface TextInputProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  description?: string;
}

export const TextInput = ({ 
  type = "text", 
  value, 
  onChange, 
  label, 
  placeholder = "", 
  description 
}: TextInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-700 p-2 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );
};

interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  description?: string;
}

export const TextAreaInput = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "", 
  description 
}: TextAreaInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-700 p-2 rounded-lg text-white w-full border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-[80px]"
      />
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );
};

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
}

export const Checkbox = ({ id, checked, onChange, label, subtitle, icon }: CheckboxProps) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-600 last:border-0">
      <div className="flex items-center space-x-3">
        <input 
          type="checkbox" 
          id={id}
          checked={checked}
          onChange={onChange}
          className="rounded text-blue-600 focus:ring-blue-500 bg-gray-600 border-gray-500"
        />
        <div>
          <label htmlFor={id} className="text-sm text-white cursor-pointer">
            {label}
          </label>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {icon && icon}
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}

export const TabButton = ({ isActive, onClick, icon, label }: TabButtonProps) => {
  return (
    <button
      className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
        isActive ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
};

interface SectionContainerProps {
  children: ReactNode;
}

export const SectionContainer = ({ children }: SectionContainerProps) => {
  return (
    <div className="space-y-5">
      {children}
    </div>
  );
};

interface AlertBoxProps {
  title: string;
  message: string;
  icon?: ReactNode;
  variant?: 'warning' | 'info' | 'error';
}

export const AlertBox = ({ title, message, icon, variant = 'warning' }: AlertBoxProps) => {
  const variantClasses = {
    warning: {
      bg: 'bg-red-900/20',
      border: 'border-red-700/50',
      titleColor: 'text-red-500',
      textColor: 'text-red-400/80',
    },
    info: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-700/50',
      titleColor: 'text-blue-500',
      textColor: 'text-blue-400/80',
    },
    error: {
      bg: 'bg-orange-900/20',
      border: 'border-orange-700/50',
      titleColor: 'text-orange-500',
      textColor: 'text-orange-400/80',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={`mt-4 p-3 ${styles.bg} border ${styles.border} rounded-lg`}>
      <div className="flex items-start gap-3">
        {icon && <div className={styles.titleColor}>{icon}</div>}
        <div>
          <h4 className={`text-sm font-medium ${styles.titleColor}`}>{title}</h4>
          <p className={`text-xs ${styles.textColor} mt-1`}>{message}</p>
        </div>
      </div>
    </div>
  );
};