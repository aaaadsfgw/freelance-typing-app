import { categoryTone } from "../shared/category";

type Props = {
  category: string;
};

function Icon({ kind }: { kind: string }) {
  const common = {
    width: 12,
    height: 12,
    viewBox: "0 0 12 12",
    fill: "none",
    "aria-hidden": true,
  } as const;
  if (kind === "BUG" || kind === "URGENT") {
    return (
      <svg {...common}>
        <path d="M6 1.5 11 10H1L6 1.5Z" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "API" || kind === "DB") {
    return (
      <svg {...common}>
        <rect x="1.5" y="2" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 5h4M4 7.5h3" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }
  if (kind === "PR" || kind === "RELEASE") {
    return (
      <svg {...common}>
        <circle cx="3.5" cy="3" r="1.4" fill="currentColor" />
        <circle cx="8.5" cy="9" r="1.4" fill="currentColor" />
        <path d="M3.5 4.4v2.2c0 1.4 1.4 2.4 2.8 2.4H7" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }
  if (kind === "DESIGN" || kind === "UI") {
    return (
      <svg {...common}>
        <rect x="2" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "MEETING") {
    return (
      <svg {...common}>
        <circle cx="4" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="8" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="6" cy="6" r="3.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CategoryChip({ category }: Props) {
  const tone = categoryTone(category);
  return (
    <span className="cat-chip" style={{ background: tone.bg, color: tone.fg }}>
      <Icon kind={tone.key} />
      {tone.label}
    </span>
  );
}
