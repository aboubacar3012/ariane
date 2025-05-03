// tailwindcss gradients safelist: 
// bg-gradient-to-r from-green-600 to-green-700 from-orange-600 to-orange-700 from-blue-600 to-blue-700 from-red-600 to-red-700 from-purple-600 to-purple-700 from-pink-600 to-pink-700 from-yellow-600 to-yellow-700 from-teal-600 to-teal-700 from-indigo-600 to-indigo-700 from-gray-600 to-gray-700 from-gray-900 to-gray-800 from-gray-100 to-gray-300

export type ColorScheme = 'blue' | 'orange' | 'green' | 'dark';

export const getColorClasses = (colorScheme: ColorScheme) => {
  switch (colorScheme) {
    case 'orange':
      return {
        gradient: "from-orange-600 to-orange-700",
        badge: "bg-orange-100 text-orange-800", // improved contrast
        iconBg: "bg-orange-800/40",
        accentColorText: "text-orange-600",
        accentColorBg: "bg-orange-50",
        accentGradient: "from-orange-500 to-orange-600",
        activeItemGradient: "from-orange-50 to-orange-100",
        activeItemText: "text-orange-700",
        activeItemBg: "bg-orange-600",
        focusRing: "focus:ring-orange-400",
        bg: 'bg-orange-500 hover:bg-orange-600',
        link: 'text-orange-600',
        blockquote: 'bg-orange-50 border-orange-500',
        text: "text-orange-600",
        bgHover: "hover:bg-orange-300",
        bgAlt: "bg-orange-200"
      };
    case 'green':
      return {
        gradient: "from-green-600 to-green-700",
        badge: "bg-green-100 text-green-800", // improved contrast
        iconBg: "bg-green-800/40",
        accentColorText: "text-green-600",
        accentColorBg: "bg-green-50",
        accentGradient: "from-green-500 to-green-600",
        activeItemGradient: "from-green-50 to-green-100",
        activeItemText: "text-green-700",
        activeItemBg: "bg-green-600",
        focusRing: "focus:ring-green-400",
        bg: 'bg-green-500 hover:bg-green-600',
        link: 'text-green-600',
        blockquote: 'bg-green-50 border-green-500',
        text: "text-green-600",
        bgHover: "hover:bg-green-300",
        bgAlt: "bg-green-200"
      };
    case 'dark':
      return {
        gradient: "from-gray-900 to-gray-800",
        badge: "bg-gray-900 text-white", // improved contrast
        iconBg: "bg-black/40",
        accentColorText: "text-black",
        accentColorBg: "bg-gray-100",
        accentGradient: "from-gray-800 to-black",
        activeItemGradient: "from-gray-100 to-gray-200",
        activeItemText: "text-black",
        activeItemBg: "bg-black",
        focusRing: "focus:ring-gray-700",
        bg: 'bg-black hover:bg-gray-800',
        link: 'text-black',
        blockquote: 'bg-gray-100 border-black',
        text: "text-black",
        bgHover: "hover:bg-gray-700",
        bgAlt: "bg-gray-800"
      };
    case 'blue':
    default:
      return {
        gradient: "from-blue-600 to-blue-700",
        badge: "bg-blue-100 text-blue-800", // improved contrast
        iconBg: "bg-blue-800/40",
        accentColorText: "text-blue-600",
        accentColorBg: "bg-blue-50",
        accentGradient: "from-blue-500 to-blue-600",
        activeItemGradient: "from-blue-50 to-blue-100",
        activeItemText: "text-blue-700",
        activeItemBg: "bg-blue-600",
        focusRing: "focus:ring-blue-400",
        bg: 'bg-blue-500 hover:bg-blue-600',
        link: 'text-blue-600',
        blockquote: 'bg-blue-50 border-blue-500',
        text: "text-blue-600",
        bgHover: "hover:bg-blue-300",
        bgAlt: "bg-blue-200"
      };
  }
};

// Get progress bar color based on color scheme
export const getProgressBarColor = (colorScheme: ColorScheme) => {
  switch (colorScheme) {
    case 'orange':
      return 'bg-orange-500';
    case 'green':
      return 'bg-green-500';
    case 'dark':
      return 'bg-black';
    case 'blue':
    default:
      return 'bg-blue-500';
  }
};

// Color schemes
export const colorSets: Record<ColorScheme, string[]> = {
  blue:    ['#3B82F6', '#2563EB', '#1D4ED8', '#60A5FA', '#93C5FD'],
  orange:  ['#F97316', '#EA580C', '#C2410C', '#FB923C', '#FDBA74'],
  green:   ['#22C55E', '#16A34A', '#15803D', '#4ADE80', '#86EFAC'],
  dark:    ['#000000', '#1F2937', '#111827', '#374151', '#6B7280'],
};