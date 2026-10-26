// 직접 그린 24px 선 아이콘 세트 (모두 같은 선 굵기)
const PATHS = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>,
  bag: <><path d="M5 8.5h14l-1.1 11.2a1.5 1.5 0 0 1-1.5 1.3H7.6a1.5 1.5 0 0 1-1.5-1.3L5 8.5z" /><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" /></>,
  user: <><circle cx="12" cy="8" r="3.75" /><path d="M4.5 20.5c.6-3.6 3.7-5.5 7.5-5.5s6.9 1.9 7.5 5.5" /></>,
  chevronLeft: <path d="M14.5 6l-6 6 6 6" />,
  chevronRight: <path d="M9.5 6l6 6-6 6" />,
  trophy: <><path d="M8 4h8v5.5a4 4 0 0 1-8 0V4z" /><path d="M8 6H5.5a2.5 2.5 0 0 0 3 3.6M16 6h2.5a2.5 2.5 0 0 1-3 3.6" /><path d="M12 13.5V17M8.5 20h7M9.5 17h5" /></>,
  sparkle: <><path d="M11 3.5l1.7 4.8 4.8 1.7-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7L11 3.5z" /><path d="M18 15v5M15.5 17.5h5" /></>,
  scissors: <><circle cx="6.5" cy="7" r="2.5" /><circle cx="6.5" cy="17" r="2.5" /><path d="M8.6 8.4L19.5 17.5M8.6 15.6L19.5 6.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="M8 14h3" /></>,
  gift: <><rect x="3.5" y="8" width="17" height="4.5" rx="1" /><path d="M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5M12 8v12.5" /><path d="M12 8c-1.6-3.4-5.5-3.8-5.5-1.4C6.5 8 9 8 12 8zM12 8c1.6-3.4 5.5-3.8 5.5-1.4C17.5 8 15 8 12 8z" /></>,
  pen: <><path d="M4.5 19.5l1-4.3L16 4.7a2 2 0 0 1 2.8 0l.5.5a2 2 0 0 1 0 2.8L8.8 18.5l-4.3 1z" /><path d="M14 6.7l3.3 3.3" /></>,
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
