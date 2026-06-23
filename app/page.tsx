"use client";

import { useEffect, useState } from "react";

const setupItems = [
  { id: "subject", label: "ক্লাস ও বিষয়", chip: "৬" },
  { id: "chapter", label: "অধ্যায়" },
  { id: "topic", label: "টপিক", pill: true },
];

const classItems = [
  { id: "duration", label: "ক্লাসের সময়সীমা" },
  { id: "classType", label: "ক্লাসের ধরন" },
];

const subjectGroups = [
  {
    title: "ক্লাস ৬",
    options: ["বাংলা", "বিজ্ঞান"],
  },
  {
    title: "ক্লাস ৭",
    options: ["বাংলা", "বিজ্ঞান"],
  },
];

const chapterOptions = [
  "আধিক",
  "কার্বন ডাই অক্সাইড",
  "জ্বালানি সেল",
  "জীববিজ্ঞান",
  "জীবাশ্ম ইন্ধন",
  "পরিবেশ বিজ্ঞান",
  "পৃথিবী বিজ্ঞান",
  "উৎপাদনশীলতা",
  "পারমাণবিক শক্তি",
  "আবহাওয়া পরিবর্তন",
  "ইলেকট্রন",
];

const topicOptions = [
  "আধিক",
  "কার্বন ডাই অক্সাইড",
  "জ্বালানি সেল",
  "জীববিজ্ঞান",
  "জীবাশ্ম ইন্ধন",
  "পরিবেশ বিজ্ঞান",
  "পৃথিবী বিজ্ঞান",
  "উৎপাদনশীলতা",
  "পারমাণবিক শক্তি",
  "আবহাওয়া পরিবর্তন",
  "ইলেকট্রন",
];

const durationOptions = ["৩০ মিনিট", "৪০ মিনিট", "৬০ মিনিট"];

const classTypeOptions = [
  "সাধারণ ক্লাস",
  "শিক্ষার্থী সংখ্যা বেশি",
  "সব মেধার সমন্বয়",
  "অংশগ্রহণমূলক",
];

type SidebarPanel = "subject" | "chapter" | "topic" | "duration" | "classType";
type JourneyScreen = "prepare" | "setup" | "generating" | "lesson";
type SetupStep = "subject" | "chapter" | "topic";
type AiInteractionState = "idle" | "composer" | "typing" | "response";

const lessonSections = [
  {
    title: "১. শিখনফল (৫ মিনিট)",
    bullets: [
      "শিক্ষার্থীরা বিদ্যুতের বিভিন্ন উৎস (যেমন: ব্যাটারি, জেনারেটর, সৌর প্যানেল) চিহ্নিত করতে পারবে।",
      "দৈনন্দিন জীবনে বিদ্যুতের ব্যবহার ও গুরুত্ব ব্যাখ্যা করতে পারবে।",
      "বিদ্যুৎ অপচয় রোধে সচেতন হবে।",
    ],
  },
  {
    title: "২. ক্লাসের প্রস্তুতি (৫ মিনিট)",
    bullets: [
      'সহজ উদাহরণ: ক্লাস শুরু করার আগে শিক্ষক ক্লাসের লাইট বা ফ্যান অন-অফ করে শিক্ষার্থীদের জিজ্ঞেস করবেন, "বলতো এগুলো কিসের সাহায্যে চলছে?"',
      'প্রশ্নোত্তর: "তোমাদের বাসায় ফ্রিজ বা টিভি চালানোর জন্য বিদ্যুৎ কোথা থেকে আসে?"',
    ],
  },
  {
    title: "৩. মূল শিক্ষণ পদ্ধতি (২০ মিনিট)",
    bullets: [
      "রাসায়নিক উৎস (ব্যাটারি): ছোট টর্চলাইট বা রিমোট কন্ট্রোল গাড়িতে আমরা যে ব্যাটারি ব্যবহার করি।",
      "যান্ত্রিক উৎস (জেনারেটর): বিদ্যুৎ চলে গেলে বড় বড় ভবনে বা অনুষ্ঠানে জেনারেটর দিয়ে কিভাবে বিদ্যুৎ তৈরি হয়।",
      "প্রাকৃতিক উৎস (সৌর শক্তি ও জলবিদ্যুৎ): সূর্যের আলো থেকে সৌর প্যানেল বা পানির স্রোত কাজে লাগিয়ে বিদ্যুৎ তৈরির প্রক্রিয়া।",
    ],
  },
  {
    title: "৪. দলীয় কাজ ও সক্রিয়তা (১০ মিনিট)",
    body: "শিক্ষার্থীদের কয়েকটি দলে ভাগ করে নিচের কাজটি দেওয়া যেতে পারে:",
    bullets: [
      '"উৎস খোঁজো" গেম: প্রতিটি দল ৫টি করে এমন যন্ত্রের নাম লিখবে যা বিদ্যুৎ দিয়ে চলে এবং সেগুলোর শক্তির উৎস কী হতে পারে তা আলোচনা করবে।',
    ],
  },
  {
    title: "৫. মূল্যায়ন ও সারাংশ (৫ মিনিট)",
    body: 'ঝটপট কুইজ: "সৌর প্যানেলে কোন শক্তি ব্যবহার করা হয়?"\nসামারি: আজকের ক্লাসের মূল পয়েন্টগুলো একনজরে ঝালিয়ে নেওয়া।',
  },
];

const promptSuggestions = [
  "৫টি সৃজনশীল প্রশ্ন তৈরি করুন।",
  "কঠিন শব্দগুলো বাদ দিয়ে সহজ ভাষায় বুঝিয়ে লিখুন।",
  "৫টি সৃজনশীল প্রশ্ন তৈরি করুন।",
];

const notebookImage = "/prepare-book.png";

const prepareCards = [
  {
    title: "লেসন প্ল্যান",
    description: "AI-এর সাহায্যে দ্রুত ও সহজে আপনার ক্লাসের লেসন প্ল্যান তৈরি করুন",
    icon: "lesson",
    enabled: true,
  },
  {
    title: "স্মার্ট ভিডিও",
    description: "বিষয়গুলো আরও সহজভাবে উপস্থাপনের জন্য প্রাসঙ্গিক ভিডিও দেখুন",
    icon: "video",
  },
  {
    title: "স্মার্ট বুক",
    description: "বিষয়বস্তু পরিষ্কারভাবে বুঝতে ডিজিটাল বই ব্রাউজ করুন",
    icon: "smart-book",
  },
  {
    title: "কুইজ",
    description: "AI-এর সাহায্যে সহজেই কুইজ তৈরি করে শিক্ষার্থীদের মূল্যায়ন করুন",
    icon: "quiz",
  },
] as const;

const firstTimeChapterOptions = [
  "পরমাণু",
  "গতি",
  "চুম্বক",
  "বিদ্যুৎ",
  "শব্দ",
  "তরঙ্গ",
  "আলো",
  "বল",
  "শক্তি",
  "কাজ",
];

type IconName =
  | "arrow-left"
  | "arrow-curve"
  | "bookmark"
  | "book"
  | "chevron-right"
  | "chevron-up"
  | "check"
  | "close"
  | "download"
  | "info"
  | "lesson"
  | "mic"
  | "plus"
  | "science"
  | "send"
  | "smart-book"
  | "print"
  | "quiz"
  | "sparkle"
  | "video";

function Icon({
  name,
  className = "size-6",
}: {
  name: IconName;
  className?: string;
}) {
  const stroke = "currentColor";
  const common = {
    "aria-hidden": true,
    className,
    fill: "none",
    stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );
    case "arrow-curve":
      return (
        <svg {...common}>
          <path d="M4 12h12.5a3.5 3.5 0 0 0 0-7H14" />
          <path d="m8 8-4 4 4 4" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...common}>
          <path d="M6 4.8A2.8 2.8 0 0 1 8.8 2h6.4A2.8 2.8 0 0 1 18 4.8V22l-6-3.8L6 22V4.8Z" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M6 4h9a3 3 0 0 1 3 3v13H9a3 3 0 0 0-3 3V4Z" />
          <path d="M6 4v19" />
          <path d="M10 8h4" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      );
    case "chevron-up":
      return (
        <svg {...common}>
          <path d="m6 15 6-6 6 6" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      );
    case "lesson":
      return (
        <svg {...common} className={className} viewBox="0 0 48 48">
          <rect fill="#c99a55" height="40" rx="9" stroke="none" width="34" x="7" y="4" />
          <path d="M16 15h12M16 22h10M16 29h8" stroke="#7a5221" />
          <path d="m31 34 7-7 3 3-7 7-5 2 2-5Z" fill="#2f80ed" stroke="#1f4f93" />
          <path d="m35 25 2-2 3 3-2 2" stroke="#1f4f93" />
        </svg>
      );
    case "mic":
      return (
        <svg {...common}>
          <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
          <path d="M19 11a7 7 0 0 1-14 0" />
          <path d="M12 18v3" />
          <path d="M8 21h8" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "print":
      return (
        <svg {...common}>
          <path d="M7 8V3h10v5" />
          <path d="M7 17H5a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-2" />
          <path d="M7 14h10v7H7z" />
        </svg>
      );
    case "science":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
        </svg>
      );
    case "send":
      return (
        <svg {...common}>
          <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "smart-book":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" fill="#75c4f2" stroke="#0e6fb9" />
          <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v17h5.5A2.5 2.5 0 0 1 20 22V5.5Z" fill="#9bd9ff" stroke="#0e6fb9" />
          <path d="M7 8h2.5M7 12h2.5M14.5 8H17M14.5 12H17" />
        </svg>
      );
    case "quiz":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" fill="#fbe7b8" stroke="#00a9e8" />
          <path d="M9.6 9.2a2.7 2.7 0 0 1 4.9 1.5c0 2.4-2.7 2.2-2.7 4.2" stroke="#d77a00" />
          <path d="M12 18h.01" stroke="#d77a00" />
          <path d="M8 3.8 5.5 2M16 3.8 18.5 2" />
        </svg>
      );
    case "video":
      return (
        <svg {...common}>
          <rect fill="#ec4899" height="16" rx="3" stroke="#be185d" width="18" x="3" y="4" />
          <path d="m10 8 5 4-5 4V8Z" fill="white" stroke="white" />
          <path d="M6 4v16M18 4v16M3 8h3M3 16h3M18 8h3M18 16h3" stroke="white" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 2.5 14.7 9l6.8 3-6.8 3L12 21.5 9.3 15l-6.8-3 6.8-3L12 2.5Z" />
          <path d="M19 3v4M21 5h-4" />
        </svg>
      );
  }
}

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="ui-soft-press grid size-12 cursor-pointer place-items-center rounded-full text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function TopBar({ onBack }: { onBack: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex min-h-20 items-center justify-between gap-6 border-b-2 border-white/30 bg-primary-950 px-6 py-3 text-white xl:px-[50px]">
      <div className="flex min-w-0 items-center gap-4 xl:gap-5">
        <IconButton label="পেছনে যান" onClick={onBack}>
          <Icon className="size-10" name="arrow-left" />
        </IconButton>
        <h1 className="truncate text-2xl font-bold leading-none">লেসন প্ল্যান</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <button className="ui-soft-press flex h-[51px] w-[120px] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-b-[3px] border-grayui-700 bg-primary-950 px-4 text-lg font-bold text-grayui-100 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <Icon className="size-5" name="print" />
          প্রিন্ট
        </button>
        <button className="ui-soft-press flex h-[51px] w-[166px] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-b-[3px] border-grayui-700 bg-primary-950 px-4 text-lg font-bold text-grayui-100 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <Icon className="size-5" name="download" />
          ডাউনলোড
        </button>
        <button className="ui-soft-press flex h-[46px] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-b-4 border-primary-400 bg-primary-500 px-4 text-lg font-bold text-white hover:bg-[#087252] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          সেভ করুন
          <Icon className="size-5" name="bookmark" />
        </button>
      </div>
    </header>
  );
}

function DropdownCard({
  active,
  label,
  onClick,
  value,
  chip,
  pill,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  value: string;
  chip?: string;
  pill?: boolean;
}) {
  return (
    <button
      aria-expanded={active}
      className={`ui-soft-press flex min-h-[58px] w-full cursor-pointer items-center rounded-[15px] border-2 border-b-[5px] py-3 pl-5 pr-4 text-left hover:border-grayui-300 hover:bg-[#49505c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        active
          ? "border-grayui-300 bg-grayui-800"
          : "border-grayui-700 bg-grayui-800"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] font-medium leading-[1.4] text-grayui-300">
          {label}
        </span>
        <span className="flex items-center gap-2.5">
          {chip ? (
            <span className="grid size-[22px] place-items-center rounded-full bg-primary-500 text-xs font-bold text-white shadow-glow">
              {chip}
            </span>
          ) : null}
          {pill ? (
            <span className="rounded-full bg-primary-500 px-4 py-0.5 text-base leading-[1.48] text-white">
              {value}
            </span>
          ) : (
            <span className="truncate text-lg font-bold leading-[1.48] text-white">
              {value}
            </span>
          )}
        </span>
      </span>
      <Icon className="ml-3 size-6 text-white" name="chevron-right" />
    </button>
  );
}

function SelectionIndicator({
  checked,
  multiple,
}: {
  checked: boolean;
  multiple?: boolean;
}) {
  if (multiple) {
    return (
      <span
        aria-hidden="true"
        className={`grid size-[18px] place-items-center rounded-[4px] border-2 ${
          checked
            ? "border-[#19bf55] bg-[#19bf55] text-white"
            : "border-[#c7d0da] bg-[#e7fff7]"
        }`}
      >
        {checked ? <Icon className="size-3" name="check" /> : null}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`grid size-[22px] place-items-center rounded-full border-2 ${
        checked
          ? "border-[#25b11d] bg-[#25b11d] text-white"
          : "border-white bg-transparent"
      }`}
    >
      {checked ? <Icon className="size-3.5" name="check" /> : null}
    </span>
  );
}

function OptionIcon({ type }: { type: "book" | "science" | "class" }) {
  if (type === "class") {
    return (
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#f05252] text-sm font-bold leading-none text-white">
        অ আ
      </span>
    );
  }

  return (
    <span
      className={`grid size-10 shrink-0 place-items-center rounded-lg ${
        type === "science" ? "bg-[#287f5f] text-[#7dd3fc]" : "bg-[#007f5f] text-[#f87171]"
      }`}
    >
      <Icon className="size-6" name={type === "science" ? "science" : "book"} />
    </span>
  );
}

function PanelOption({
  checked,
  children,
  icon,
  multiple,
  onClick,
}: {
  checked: boolean;
  children: React.ReactNode;
  icon?: "book" | "science" | "class";
  multiple?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={checked}
      className="ui-soft-press flex min-h-[60px] w-full cursor-pointer items-center gap-4 rounded-[16px] border-2 border-b-[5px] border-grayui-700 bg-grayui-800 px-4 text-left text-xl font-bold text-white hover:border-grayui-300 hover:bg-[#49505c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      onClick={onClick}
      type="button"
    >
      {icon ? <OptionIcon type={icon} /> : null}
      <span className="min-w-0 flex-1 text-pretty">{children}</span>
      <SelectionIndicator checked={checked} multiple={multiple} />
    </button>
  );
}

function ExtendedPanel({
  activePanel,
  onClose,
  onContinueFromTopic,
  onSelectChapter,
  onSelectClassType,
  onSelectDuration,
  onSelectSubject,
  onToggleTopic,
  selectedChapter,
  selectedClass,
  selectedClassType,
  selectedDuration,
  selectedSubject,
  selectedTopics,
}: {
  activePanel: SidebarPanel;
  onClose: () => void;
  onContinueFromTopic: () => void;
  onSelectChapter: (value: string) => void;
  onSelectClassType: (value: string) => void;
  onSelectDuration: (value: string) => void;
  onSelectSubject: (className: string, subject: string) => void;
  onToggleTopic: (value: string) => void;
  selectedChapter: string;
  selectedClass: string;
  selectedClassType: string;
  selectedDuration: string;
  selectedSubject: string;
  selectedTopics: string[];
}) {
  const titleByPanel: Record<SidebarPanel, string> = {
    subject: "ক্লাস ও বিষয়",
    chapter: "অধ্যায়",
    topic: "টপিক",
    duration: "ক্লাসের সময়সীমা",
    classType: "ক্লাসের ধরন",
  };

  return (
    <aside
      aria-label={`${titleByPanel[activePanel]} অপশন`}
      className="ui-slide-panel absolute left-full top-0 z-30 flex h-[calc(100dvh-82px)] w-[320px] flex-col overflow-hidden rounded-r-[10px] border-l border-white/15 bg-primary-950 p-[15px]"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold leading-[1.48] text-grayui-100">
          {titleByPanel[activePanel]}
        </h3>
        <button
          aria-label="এক্সটেন্ডেড সাইডবার বন্ধ করুন"
          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-white transition duration-200 hover:bg-white/10 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={onClose}
          type="button"
        >
          <Icon className="size-6" name="close" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto pr-0.5">
        {activePanel === "subject" ? (
          <div className="flex flex-col gap-8">
          {subjectGroups.map((group) => (
            <section className="flex flex-col gap-4" key={group.title}>
              <h4 className="text-[22px] font-bold leading-[1.48] text-[#0994ff]">
                {group.title}
              </h4>
              {group.options.map((option) => (
                <PanelOption
                  checked={selectedClass === group.title && selectedSubject === option}
                  icon={option === "বিজ্ঞান" ? "science" : "class"}
                  key={`${group.title}-${option}`}
                  onClick={() => onSelectSubject(group.title, option)}
                >
                  {option}
                </PanelOption>
              ))}
            </section>
          ))}
          </div>
        ) : null}

        {activePanel === "chapter" ? (
          <div className="flex flex-col gap-3.5">
          {chapterOptions.map((option) => (
            <PanelOption
              checked={selectedChapter === option}
              icon="book"
              key={option}
              onClick={() => onSelectChapter(option)}
            >
              {option}
            </PanelOption>
          ))}
          </div>
        ) : null}

        {activePanel === "topic" ? (
          <div className="flex min-h-full flex-col">
            <div className="flex flex-col gap-3.5 pb-24">
              {topicOptions.map((option) => (
                <PanelOption
                  checked={selectedTopics.includes(option)}
                  key={option}
                  multiple
                  onClick={() => onToggleTopic(option)}
                >
                  {option}
                </PanelOption>
              ))}
            </div>
            <button
              className="sticky bottom-0 mt-auto flex min-h-[64px] w-full cursor-pointer items-center justify-center gap-3 rounded-[18px] border border-b-4 border-primary-400 bg-primary-500 px-5 text-xl font-bold text-white shadow-[0_-18px_28px_rgba(0,14,10,0.95)] transition duration-200 hover:bg-[#087252] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={selectedTopics.length === 0}
              onClick={onContinueFromTopic}
              type="button"
            >
              এগিয়ে যান
              <Icon className="size-6" name="arrow-curve" />
            </button>
          </div>
        ) : null}

        {activePanel === "duration" ? (
          <div className="flex flex-col gap-3.5">
          {durationOptions.map((option) => (
            <PanelOption
              checked={selectedDuration === option}
              key={option}
              onClick={() => onSelectDuration(option)}
            >
              {option}
            </PanelOption>
          ))}
          </div>
        ) : null}

        {activePanel === "classType" ? (
          <div className="flex flex-col gap-3.5">
          {classTypeOptions.map((option) => (
            <PanelOption
              checked={selectedClassType === option}
              key={option}
              onClick={() => onSelectClassType(option)}
            >
              {option}
            </PanelOption>
          ))}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function LessonSetup({
  activePanel,
  onClosePanel,
  onSelectChapter,
  onSelectClassType,
  onSelectDuration,
  onSelectSubject,
  onToggleTopic,
  selectedChapter,
  selectedClass,
  selectedClassType,
  selectedDuration,
  selectedSubject,
  selectedTopics,
  setActivePanel,
}: {
  activePanel: SidebarPanel | null;
  onClosePanel: () => void;
  onSelectChapter: (value: string) => void;
  onSelectClassType: (value: string) => void;
  onSelectDuration: (value: string) => void;
  onSelectSubject: (className: string, subject: string) => void;
  onToggleTopic: (value: string) => void;
  selectedChapter: string;
  selectedClass: string;
  selectedClassType: string;
  selectedDuration: string;
  selectedSubject: string;
  selectedTopics: string[];
  setActivePanel: (panel: SidebarPanel) => void;
}) {
  const valuesByPanel: Record<SidebarPanel, string> = {
    subject: selectedSubject,
    chapter: selectedChapter || "নির্বাচন করুন",
    topic: selectedTopics.length ? `${selectedTopics.length}টি টপিক` : "০টি টপিক",
    duration: selectedDuration || "নির্বাচন করুন",
    classType: selectedClassType || "নির্বাচন করুন",
  };

  return (
    <div className="fixed left-0 top-[82px] z-20 w-[280px] shrink-0 xl:w-[320px]">
      <aside className="h-[calc(100dvh-82px)] overflow-hidden bg-primary-950 p-[15px]">
        <h2 className="mb-[30px] text-lg font-bold leading-[1.48] text-grayui-100">
          লেসন সেটআপ
        </h2>
        <div className="flex flex-col gap-5">
          {setupItems.map((item) => (
            <DropdownCard
              active={activePanel === item.id}
              chip={item.id === "subject" ? selectedClass.replace("ক্লাস ", "") : item.chip}
              key={item.label}
              label={item.label}
              onClick={() => setActivePanel(item.id as SidebarPanel)}
              pill={item.pill}
              value={valuesByPanel[item.id as SidebarPanel]}
            />
          ))}
        </div>
        <div className="my-5 h-px bg-grayui-700" />
        <div className="flex flex-col gap-5">
          {classItems.map((item) => (
            <DropdownCard
              active={activePanel === item.id}
              key={item.label}
              label={item.label}
              onClick={() => setActivePanel(item.id as SidebarPanel)}
              value={valuesByPanel[item.id as SidebarPanel]}
            />
          ))}
        </div>
      </aside>

      {activePanel ? (
        <ExtendedPanel
          activePanel={activePanel}
          onClose={onClosePanel}
          onContinueFromTopic={() => setActivePanel("duration")}
          onSelectChapter={onSelectChapter}
          onSelectClassType={onSelectClassType}
          onSelectDuration={onSelectDuration}
          onSelectSubject={onSelectSubject}
          onToggleTopic={onToggleTopic}
          selectedChapter={selectedChapter}
          selectedClass={selectedClass}
          selectedClassType={selectedClassType}
          selectedDuration={selectedDuration}
          selectedSubject={selectedSubject}
          selectedTopics={selectedTopics}
        />
      ) : null}
    </div>
  );
}

function LessonSection({
  section,
}: {
  section: (typeof lessonSections)[number];
}) {
  return (
    <article>
      <h3 className="mb-3 font-bold text-grayui-900">{section.title}</h3>
      {section.body ? (
        <div className="whitespace-pre-line text-grayui-800">
          {section.body}
        </div>
      ) : null}
      {section.bullets ? (
        <ul className="list-disc space-y-0 pl-[30px] text-grayui-800">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function LessonPlanCard() {
  const [expanded, setExpanded] = useState(true);
  const previewSection = lessonSections[0];

  return (
    <section className="w-full rounded-[24px] bg-white px-6 pb-8 pt-8 text-grayui-800 xl:px-8">
      <div
        className={`flex items-start justify-between border-b border-grayui-300 pb-5 ${
          expanded ? "mb-7" : "mb-6"
        }`}
      >
        <div className="flex min-w-0 items-start gap-4">
          <Icon className="size-[54px] shrink-0" name="lesson" />
          <div className="min-w-0">
            <h2 className="text-pretty text-[26px] font-bold leading-[1.35] text-grayui-900">
              বিদ্যুতের উৎস
            </h2>
            <p className="text-base leading-[1.48] text-ink-700">৪০ মিনিট</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 pt-1 text-xl font-medium text-ink-800">
          <span>বিজ্ঞান</span>
          <span className="size-1 rounded-full bg-ink-800" />
          <span>গতি</span>
        </div>
      </div>

      {expanded ? (
        <div
          className="ui-fade-up flex flex-col gap-[30px] text-xl leading-[1.48]"
          id="lesson-plan-details"
        >
          {lessonSections.map((section) => (
            <LessonSection key={section.title} section={section} />
          ))}
        </div>
      ) : (
        <div
          className="ui-fade-up max-h-[170px] overflow-hidden text-xl leading-[1.48]"
          id="lesson-plan-details"
        >
          <LessonSection section={previewSection} />
        </div>
      )}

      <button
        aria-controls="lesson-plan-details"
        aria-expanded={expanded}
        className={`ui-soft-press flex h-[58px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-b-4 border-primary-500 bg-primary-50 px-4 text-lg font-bold text-primary-500 hover:bg-[#dcebe7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
          expanded ? "mt-[72px]" : "mt-6"
        }`}
        onClick={() => setExpanded((current) => !current)}
        type="button"
      >
        {expanded ? "হাইড করুন" : "আরও দেখুন"}
        <Icon
          className={`size-5 transition-transform duration-200 ${
            expanded ? "" : "rotate-180"
          }`}
          name="chevron-up"
        />
      </button>
    </section>
  );
}

function ThumbIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      className={direction === "down" ? "size-8 rotate-180" : "size-8"}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 10v10M7 10l4.5-7c.8-1.2 2.7-.6 2.7.9V8h4.6c1.4 0 2.5 1.3 2.2 2.7l-1.3 6.7A3.2 3.2 0 0 1 16.6 20H4.8A1.8 1.8 0 0 1 3 18.2v-6.4A1.8 1.8 0 0 1 4.8 10H7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PromptStack({
  onAskAi,
  onPromptSelect,
}: {
  onAskAi: () => void;
  onPromptSelect: (prompt: string) => void;
}) {
  return (
    <div className="mt-7 flex w-full flex-col items-start gap-6">
      <div className="flex h-8 items-center gap-6 text-4xl text-white">
        <button
          aria-label="লাইক"
          className="ui-soft-press grid size-11 cursor-pointer place-items-center rounded-full hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ThumbIcon direction="up" />
        </button>
        <button
          aria-label="ডিসলাইক"
          className="ui-soft-press grid size-11 cursor-pointer place-items-center rounded-full hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ThumbIcon direction="down" />
        </button>
      </div>
      <div className="flex flex-col gap-3.5">
        {promptSuggestions.map((prompt, index) => (
          <button
            className="ui-soft-press ui-fade-up flex min-h-12 max-w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white/20 px-5 py-2 text-left text-lg font-bold text-white hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            key={`${prompt}-${index}`}
            onClick={() => onPromptSelect(prompt)}
            style={{ animationDelay: `${index * 45}ms` }}
            type="button"
          >
            <Icon className="size-5 shrink-0" name="arrow-curve" />
            <span className="min-w-0 text-pretty">{prompt}</span>
          </button>
        ))}
        <button
          className="ui-soft-press ui-fade-up flex min-h-12 max-w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff37df] to-[#6e00ff] px-5 py-2 text-lg font-bold text-white hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={onAskAi}
          style={{ animationDelay: "150ms" }}
          type="button"
        >
          <Icon className="size-5 shrink-0" name="sparkle" />
          AI - কে জিজ্ঞাসা করুন
        </button>
      </div>
    </div>
  );
}

function LessonStatusHeader({
  label = "৪০ মিনিটের লেসন প্ল্যান জেনারেট করা হয়েছে",
  onInfo,
}: {
  label?: string;
  onInfo: () => void;
}) {
  return (
    <div
      className="mb-7 flex min-h-[58px] w-full items-center justify-between gap-6 text-white"
      id="lesson-content"
    >
      <div className="flex min-w-0 items-center gap-4 text-lg font-bold">
        <div className="grid size-[58px] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ffe56a] via-[#008f67] to-[#111a6e] text-white shadow-glow">
          <Icon className="size-8" name="sparkle" />
        </div>
        <span className="min-w-0 text-pretty">{label}</span>
      </div>
      <button
        aria-label="লেসন প্ল্যান তথ্য দেখুন"
        className="ui-soft-press grid size-11 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={onInfo}
        type="button"
      >
        <Icon className="size-8" name="info" />
      </button>
    </div>
  );
}

function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`ai-shimmer h-4 rounded-full bg-[#e2e0ff] ${className}`}
    />
  );
}

function AiTypingPanel({ onInfo }: { onInfo: () => void }) {
  return (
    <div className="ui-fade-up">
      <LessonStatusHeader
        label="একটি আদর্শ পাঠ পরিকল্পনা সাজাচ্ছি..."
        onInfo={onInfo}
      />
      <section className="rounded-[24px] bg-white px-8 py-9 shadow-[0_18px_42px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-11">
          {[0, 1].map((section) => (
            <div className="flex flex-col gap-4" key={section}>
              <SkeletonLine className="mb-1 w-[42%]" />
              <SkeletonLine className="w-[78%]" />
              <SkeletonLine className="w-[91%]" />
              <SkeletonLine className="w-[84%]" />
              <SkeletonLine className="w-[64%]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function AiComposer({
  input,
  onChange,
  onClose,
  onSubmit,
}: {
  input: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <form
      className="ui-fade-up fixed bottom-2.5 left-[300px] right-5 z-40 rounded-[30px] bg-[#070b34]/95 p-5 shadow-[0_0_38px_rgba(124,101,255,0.34)] backdrop-blur xl:left-[340px] xl:right-[50px]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex h-[59px] items-center gap-5">
        <button
          aria-label="AI ইনপুট বন্ধ করুন"
          className="ui-soft-press grid size-[59px] shrink-0 cursor-pointer place-items-center rounded-full bg-[#4b5362] text-white hover:bg-[#596273] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={onClose}
          type="button"
        >
          <Icon className="size-7" name={input.trim() ? "close" : "plus"} />
        </button>
        <input
          aria-label="AI-কে জিজ্ঞাসা করুন"
          className="h-[59px] min-w-0 flex-1 rounded-full border border-[#7d8298] bg-[#34364a] px-7 text-lg font-semibold text-white outline-none transition placeholder:text-white/55 focus:border-white"
          onChange={(event) => onChange(event.target.value)}
          placeholder="AI-কে জিজ্ঞাসা করুন..."
          value={input}
        />
        <button
          aria-label={input.trim() ? "প্রশ্ন পাঠান" : "ভয়েস ইনপুট"}
          className="ui-soft-press grid size-[59px] shrink-0 cursor-pointer place-items-center rounded-full bg-primary-500 text-white shadow-glow hover:bg-[#087252] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          type="submit"
        >
          <Icon className="size-7" name={input.trim() ? "send" : "mic"} />
        </button>
      </div>
    </form>
  );
}

function AiResponseCard({ prompt }: { prompt: string }) {
  return (
    <section className="ui-fade-up mt-7 rounded-[24px] bg-white px-8 py-7 text-grayui-900 shadow-[0_18px_42px_rgba(0,0,0,0.08)]">
      <div className="mb-5 flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ffe56a] via-[#008f67] to-[#111a6e] text-white shadow-glow">
          <Icon className="size-7" name="sparkle" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary-500">
            AI উত্তর
          </p>
          <h3 className="mt-1 text-2xl font-bold leading-[1.35]">
            {prompt || "এই লেসন প্ল্যান আরও সহজভাবে সাজান।"}
          </h3>
        </div>
      </div>
      <div className="space-y-4 text-xl leading-[1.55] text-grayui-800">
        <p>
          ক্লাসটি আরও অংশগ্রহণমূলক করতে শুরুতে বাস্তব উদাহরণ, মাঝখানে দলীয় কাজ,
          এবং শেষে দ্রুত কুইজ রাখুন। এতে শিক্ষার্থীরা ধারণা বুঝবে এবং নিজেরা
          প্রয়োগও করতে পারবে।
        </p>
        <ul className="list-disc space-y-2 pl-7">
          <li>বোর্ডে বিদ্যুতের উৎসের তিনটি ভাগ লিখে উদাহরণ নিতে পারেন।</li>
          <li>প্রতিটি দলকে একটি উৎস দিয়ে ব্যবহার ও সুবিধা ব্যাখ্যা করতে বলুন।</li>
          <li>শেষে দুই মিনিটের ঝটপট প্রশ্ন দিয়ে শেখা যাচাই করুন।</li>
        </ul>
      </div>
    </section>
  );
}

function LessonInfoPopover({ onClose }: { onClose: () => void }) {
  return (
    <div className="ui-modal-in fixed right-8 top-[112px] z-40 w-[440px] rounded-[24px] bg-white p-6 text-grayui-900 shadow-2xl xl:right-[50px]">
      <div className="mb-5 flex items-start justify-between gap-5">
        <div className="flex min-w-0 items-center gap-3">
          <Icon className="size-11 shrink-0" name="lesson" />
          <div>
            <h2 className="text-2xl font-bold leading-[1.35]">বিদ্যুতের উৎস</h2>
            <p className="text-base font-medium text-grayui-600">
              বিজ্ঞান · গতি
            </p>
          </div>
        </div>
        <button
          aria-label="তথ্য বন্ধ করুন"
          className="ui-soft-press grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-grayui-100 text-grayui-700 hover:bg-grayui-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          onClick={onClose}
          type="button"
        >
          <Icon className="size-5" name="close" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 text-base font-semibold">
        <div className="rounded-2xl bg-grayui-100 p-4">
          <p className="text-grayui-600">সময়</p>
          <p className="mt-1 text-xl text-grayui-900">৪০ মিনিট</p>
        </div>
        <div className="rounded-2xl bg-grayui-100 p-4">
          <p className="text-grayui-600">টপিক</p>
          <p className="mt-1 text-xl text-grayui-900">৮টি নির্বাচিত</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-primary-50 p-4 text-primary-600">
          এই তথ্য অনুযায়ী AI লেসন প্ল্যান এবং পরবর্তী উত্তর সাজাচ্ছে।
        </div>
      </div>
    </div>
  );
}

function ToastMessage({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 2200);

    return () => window.clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="ui-fade-up fixed left-1/2 top-24 z-[60] -translate-x-1/2 rounded-2xl border border-white/20 bg-[#2f3544] px-5 py-3 text-base font-bold text-white shadow-2xl">
      {message}
    </div>
  );
}

function PrepareLanding({
  modalOpen,
  onBack,
  onStartLessonPlan,
}: {
  modalOpen?: boolean;
  onBack: () => void;
  onStartLessonPlan: () => void;
}) {
  return (
    <main className="relative min-h-dvh bg-[linear-gradient(161deg,#e3dbd9_14%,#c7dae0_94%)] font-bengali text-grayui-950">
      <div className="relative z-0 h-[227px] w-full overflow-visible bg-[#abaef0]">
        <div className="absolute left-[92px] top-[68px] md:left-[124px] xl:left-[145px]">
          <button
            aria-label="পেছনে যান"
            className="grid size-14 cursor-pointer place-items-center rounded-full bg-white text-grayui-900 transition duration-200 hover:bg-grayui-100 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grayui-900"
            onClick={onBack}
            type="button"
          >
            <Icon className="size-9" name="arrow-left" />
          </button>
        </div>
        <div className="absolute left-[178px] top-10 max-w-2xl md:left-[250px] xl:left-[272px]">
          <h1 className="text-[40px] font-bold leading-[1.2] md:text-5xl">
            প্রস্তুতি
          </h1>
          <p className="mt-2 text-lg font-medium leading-[1.48] text-grayui-900 md:text-xl">
            পরবর্তী ক্লাস পরিচালনার জন্য নিজেকে সম্পূর্ণভাবে প্রস্তুত করুন
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute right-6 top-0 z-30 hidden h-[257px] w-[282px] overflow-visible lg:block xl:right-[116px]">
        <img
          alt=""
          className="absolute -left-[31px] -top-[19px] h-[287px] w-[287px] rotate-[-8.53deg] object-contain"
          src={notebookImage}
        />
      </div>

      <section className="relative z-10 -mt-[34px] min-h-[calc(100dvh-193px)] w-full overflow-hidden rounded-t-[40px] bg-[linear-gradient(161deg,#e3dbd9_14%,#c7dae0_94%)]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap justify-center gap-5 px-6 pb-16 pt-[236px] md:px-[70px] xl:px-[100px]">
          {prepareCards.map((card, index) => {
            const content = (
              <>
                <div className="grid size-[55px] place-items-center">
                  <Icon className="size-[55px]" name={card.icon} />
                </div>
                <div className="mt-10 text-left">
                  <h2 className="text-2xl font-bold leading-[1.48] text-grayui-950">
                    {card.title}
                  </h2>
                  <p className="mt-1.5 text-base leading-[1.48] text-grayui-900">
                    {card.description}
                  </p>
                </div>
              </>
            );

            if ("enabled" in card && card.enabled) {
              return (
                <button
                  className="ui-fade-up ui-soft-press h-[278px] w-[295px] cursor-pointer rounded-[32px] border-2 border-b-[5px] border-white bg-[linear-gradient(115deg,#e1f1fe_9%,#f6f5fa_93%)] px-[25px] py-[30px] text-left hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                  key={card.title}
                  onClick={onStartLessonPlan}
                  style={{ animationDelay: `${index * 45}ms` }}
                  type="button"
                >
                  {content}
                </button>
              );
            }

            return (
              <article
                className="ui-fade-up h-[278px] w-[295px] rounded-[32px] border-2 border-b-[5px] border-white bg-[linear-gradient(115deg,#e1f1fe_9%,#f6f5fa_93%)] px-[25px] py-[30px] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                key={card.title}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>
      {modalOpen ? null : null}
    </main>
  );
}

function ModalShell({
  children,
  onBack,
  onClose,
  scrollable,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  onClose: () => void;
  scrollable?: boolean;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="ui-fade-in fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 py-6">
      <section className="ui-modal-in flex max-h-[calc(100dvh-48px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[32px] bg-white text-grayui-950 shadow-2xl">
        <div className="flex items-start justify-between gap-5 border-b border-grayui-200 p-6">
          <div className="min-w-0 flex-1">
            {onBack ? (
              <button
                aria-label="আগের ধাপে যান"
                className="ui-soft-press mb-5 grid size-12 cursor-pointer place-items-center rounded-xl bg-grayui-200 text-grayui-700 hover:bg-grayui-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                onClick={onBack}
                type="button"
              >
                <Icon className="size-7" name="arrow-left" />
              </button>
            ) : (
              <div className="mb-6 flex items-center gap-5">
                <Icon className="size-10" name="lesson" />
                <p className="text-xl font-bold leading-[1.48] text-grayui-900">
                  লেসন প্ল্যান
                </p>
              </div>
            )}
            <h2 className="text-[28px] font-bold leading-[1.48]">{title}</h2>
            <p className="mt-1 text-xl font-medium leading-[1.48] text-grayui-600">
              {subtitle}
            </p>
          </div>
          <button
            aria-label="বন্ধ করুন"
            className="ui-soft-press grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-grayui-200 text-grayui-700 hover:bg-grayui-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            onClick={onClose}
            type="button"
          >
            <Icon className="size-7" name="close" />
          </button>
        </div>
        <div
          className={`min-h-0 flex-1 px-6 pb-6 pt-5 ${
            scrollable ? "overflow-y-auto" : "overflow-visible"
          }`}
        >
          {children}
        </div>
      </section>
    </div>
  );
}

function LightOption({
  checked,
  children,
  icon,
  multiple,
  onClick,
}: {
  checked?: boolean;
  children: React.ReactNode;
  icon?: "book" | "science" | "class";
  multiple?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={checked}
      className={`ui-soft-press flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-4 rounded-[15px] border border-b-4 px-[15px] py-2 text-left text-xl font-medium leading-[1.48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
        checked
          ? "border-[#1ca63e] bg-[#e8f6ec]"
          : "border-grayui-300 bg-grayui-100 hover:border-grayui-400"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex min-w-0 items-center gap-5">
        {icon ? <OptionIcon type={icon} /> : null}
        <span className="truncate">{children}</span>
      </span>
      {multiple ? (
        <SelectionIndicator checked={Boolean(checked)} multiple />
      ) : (
        <Icon className="size-6 shrink-0 text-grayui-600" name="chevron-right" />
      )}
    </button>
  );
}

function FirstTimeSetupModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<SetupStep>("subject");
  const [selectedClass, setSelectedClass] = useState("ক্লাস ৬");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const selectSubject = (className: string, subject: string) => {
    setSelectedClass(className);
    setSelectedSubject(subject);
    setSelectedChapter("");
    setSelectedTopics([]);
    setStep("chapter");
  };

  const selectChapter = (chapter: string) => {
    setSelectedChapter(chapter);
    setSelectedTopics([]);
    setStep("topic");
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  };

  if (step === "subject") {
    return (
      <ModalShell
        onClose={onClose}
        subtitle="পরবর্তী ধাপে এগোতে একটি বিষয় নির্ধারণ করুন"
        title="বিষয় নির্বাচন করুন"
      >
        <div className="flex flex-col gap-8">
          {subjectGroups.map((group) => (
            <section className="flex flex-col gap-5" key={group.title}>
              <h3 className="text-2xl font-medium leading-[1.48] text-[#0e6fb9]">
                {group.title}
              </h3>
              <div className="flex flex-col gap-5">
                {group.options.map((option) => (
                  <LightOption
                    checked={selectedClass === group.title && selectedSubject === option}
                    icon={option === "বিজ্ঞান" ? "science" : "class"}
                    key={`${group.title}-${option}`}
                    onClick={() => selectSubject(group.title, option)}
                  >
                    {option}
                  </LightOption>
                ))}
              </div>
            </section>
          ))}
        </div>
      </ModalShell>
    );
  }

  if (step === "chapter") {
    return (
      <ModalShell
        onBack={() => setStep("subject")}
        onClose={onClose}
        scrollable
        subtitle="পরবর্তী ধাপে এগোতে একটি অধ্যায় নির্ধারণ করুন"
        title="অধ্যায় নির্বাচন করুন"
      >
        <div className="flex flex-col gap-4">
          {firstTimeChapterOptions.map((option) => (
            <LightOption
              checked={selectedChapter === option}
              icon="book"
              key={option}
              onClick={() => selectChapter(option)}
            >
              {option}
            </LightOption>
          ))}
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      onBack={() => setStep("chapter")}
      onClose={onClose}
      scrollable
      subtitle="এক বা একাধিক টপিক নির্বাচন করে লেসন প্ল্যান তৈরি করুন"
      title="টপিক নির্বাচন করুন"
    >
      <div className="relative flex min-h-[490px] flex-col">
        <div className="flex flex-col gap-4 pb-24">
          {topicOptions.map((option) => (
            <LightOption
              checked={selectedTopics.includes(option)}
              key={option}
              multiple
              onClick={() => toggleTopic(option)}
            >
              {option}
            </LightOption>
          ))}
        </div>
        <button
          className="sticky bottom-0 mt-auto flex min-h-[58px] w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-b-4 border-primary-400 bg-primary-500 px-5 text-xl font-bold text-white shadow-[0_-18px_28px_rgba(255,255,255,0.95)] transition duration-200 hover:bg-[#087252] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={selectedTopics.length === 0}
          onClick={onDone}
          type="button"
        >
          লেসন প্ল্যান তৈরি করুন
          <Icon className="size-6" name="arrow-curve" />
        </button>
      </div>
    </ModalShell>
  );
}

function LoadingTopBar({ onBack }: { onBack: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex min-h-20 items-center border-b-2 border-white/30 bg-primary-950 px-6 py-3 text-white xl:px-[50px]">
      <div className="flex min-w-0 items-center gap-2.5">
        <IconButton label="পেছনে যান" onClick={onBack}>
          <Icon className="size-10" name="arrow-left" />
        </IconButton>
        <h1 className="truncate text-2xl font-bold leading-[1.48]">
          লেসন প্ল্যান
        </h1>
      </div>
    </header>
  );
}

function LoaderSetupSidebar() {
  return (
    <LessonSetup
      activePanel={null}
      onClosePanel={() => undefined}
      onSelectChapter={() => undefined}
      onSelectClassType={() => undefined}
      onSelectDuration={() => undefined}
      onSelectSubject={() => undefined}
      onToggleTopic={() => undefined}
      selectedChapter="বিদ্যুৎ"
      selectedClass="ক্লাস ৬"
      selectedClassType="শিক্ষার্থী সংখ্যা বেশি"
      selectedDuration="৪০ মিনিট"
      selectedSubject="বিজ্ঞান"
      selectedTopics={[
        "আধিক",
        "জীববিজ্ঞান",
        "পৃথিবী বিজ্ঞান",
        "উৎপাদনশীলতা",
        "পারমাণবিক শক্তি",
        "আবহাওয়া পরিবর্তন",
        "ইলেকট্রন",
        "পরিবেশ বিজ্ঞান",
      ]}
      setActivePanel={() => undefined}
    />
  );
}

function GeneratingScreen({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 2200);

    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_at_11%_7%,#535353_0%,#343c4a_26%,#162542_51%,#0a0f3b_100%)] font-bengali text-white">
      <LoadingTopBar onBack={onBack} />
      <LoaderSetupSidebar />

      <section className="flex min-h-dvh items-center justify-center pl-[280px] pt-20 xl:pl-[320px]">
        <div className="ui-fade-up flex w-[481px] max-w-[calc(100vw-360px)] flex-col items-center gap-2.5 text-center">
          <div className="relative grid size-[400px] place-items-center">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#7f52d8_0%,rgba(127,82,216,0.55)_24%,rgba(127,82,216,0.2)_43%,rgba(127,82,216,0)_65%)] blur-xl" />
            <div className="absolute size-[172px] rounded-full bg-[radial-gradient(circle,#00140e_0%,#003525_62%,rgba(0,98,67,0)_72%)] shadow-[0_0_50px_rgba(150,95,255,0.8)]" />
            <div className="relative grid size-[172px] place-items-center rounded-full">
              <Icon
                className="size-[150px] animate-spin text-white [animation-duration:2.4s]"
                name="sparkle"
              />
              <div className="pointer-events-none absolute inset-[34px] rotate-45 rounded-[40%] bg-[linear-gradient(135deg,#fff176_0%,#ff8748_45%,#00a77a_76%,#7f64ff_100%)] opacity-90 blur-[1px]" />
              <Icon
                className="relative size-[150px] animate-spin text-white [animation-duration:2.4s]"
                name="sparkle"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-[7px] leading-[1.48]">
            <h2 className="w-full text-2xl font-bold">
              একটি আদর্শ পাঠ পরিকল্পনা সাজাচ্ছি...
            </h2>
            <p className="w-full text-lg leading-[1.48] text-[#afb3bb]">
              ৪০ মিনিটের জন্য সব টপিক আর এক্টিভিটি নিখুঁতভাবে বসানো হচ্ছে।
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function GeneratedLessonScreen({ onBack }: { onBack: () => void }) {
  const [activePanel, setActivePanel] = useState<SidebarPanel | null>(null);
  const [aiState, setAiState] = useState<AiInteractionState>("idle");
  const [aiInput, setAiInput] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedClass, setSelectedClass] = useState("ক্লাস ৬");
  const [selectedSubject, setSelectedSubject] = useState("বিজ্ঞান");
  const [selectedChapter, setSelectedChapter] = useState("আধিক");
  const [selectedTopics, setSelectedTopics] = useState([
    "আধিক",
    "জীববিজ্ঞান",
    "পৃথিবী বিজ্ঞান",
    "উৎপাদনশীলতা",
    "পারমাণবিক শক্তি",
    "আবহাওয়া পরিবর্তন",
    "ইলেকট্রন",
    "পরিবেশ বিজ্ঞান",
  ]);
  const [selectedDuration, setSelectedDuration] = useState("৪০ মিনিট");
  const [selectedClassType, setSelectedClassType] = useState(
    "শিক্ষার্থী সংখ্যা বেশি",
  );

  useEffect(() => {
    if (aiState !== "typing") {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setAiState("response");
    }, 1300);

    return () => window.clearTimeout(timeout);
  }, [aiState]);

  const resetAfterSubject = () => {
    setSelectedChapter("");
    setSelectedTopics([]);
    setSelectedDuration("");
    setSelectedClassType("");
  };

  const resetAfterChapter = () => {
    setSelectedTopics([]);
    setSelectedDuration("");
    setSelectedClassType("");
  };

  const resetAfterTopic = () => {
    setSelectedDuration("");
    setSelectedClassType("");
  };

  const resetAfterDuration = () => {
    setSelectedClassType("");
  };

  const handleSelectSubject = (className: string, subject: string) => {
    setSelectedClass(className);
    setSelectedSubject(subject);
    resetAfterSubject();
    setActivePanel("chapter");
  };

  const handleSelectChapter = (chapter: string) => {
    setSelectedChapter(chapter);
    resetAfterChapter();
    setActivePanel("topic");
  };

  const handleToggleTopic = (topic: string) => {
    const nextTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter((item) => item !== topic)
      : [...selectedTopics, topic];

    setSelectedTopics(nextTopics);
    resetAfterTopic();
  };

  const handleSelectDuration = (duration: string) => {
    setSelectedDuration(duration);
    resetAfterDuration();
    setActivePanel("classType");
  };

  const handleSelectClassType = (classType: string) => {
    setSelectedClassType(classType);
    setActivePanel(null);
  };

  const openComposer = (prompt = "") => {
    setAiInput(prompt);
    setAiState((current) => (current === "response" ? "response" : "composer"));
  };

  const submitAiPrompt = () => {
    const prompt = aiInput.trim();

    if (!prompt) {
      setToast("প্রথমে একটি প্রশ্ন লিখুন।");
      return;
    }

    setLastPrompt(prompt);
    setAiState("typing");
  };

  const closeComposer = () => {
    setAiInput("");
    setAiState((current) => (current === "response" ? "response" : "idle"));
  };

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_12%_7%,#535353_0%,#343c4a_18%,#162542_42%,#0a0f3b_100%)] font-bengali">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-primary-950"
        href="#lesson-content"
      >
        মূল কনটেন্টে যান
      </a>
      {activePanel ? (
        <button
          aria-label="এক্সটেন্ডেড সাইডবার বন্ধ করুন"
          className="fixed inset-0 z-10 cursor-default bg-transparent"
          onClick={() => setActivePanel(null)}
          type="button"
        />
      ) : null}
      <div
        className={`mx-auto min-h-dvh w-full max-w-[1440px] overflow-visible pt-[82px] ${
          aiState === "idle" ? "pb-16" : "pb-40"
        }`}
      >
        <TopBar onBack={onBack} />
        <div className="flex gap-5">
          <LessonSetup
            activePanel={activePanel}
            onClosePanel={() => setActivePanel(null)}
            onSelectChapter={handleSelectChapter}
            onSelectClassType={handleSelectClassType}
            onSelectDuration={handleSelectDuration}
            onSelectSubject={handleSelectSubject}
            onToggleTopic={handleToggleTopic}
            selectedChapter={selectedChapter}
            selectedClass={selectedClass}
            selectedClassType={selectedClassType}
            selectedDuration={selectedDuration}
            selectedSubject={selectedSubject}
            selectedTopics={selectedTopics}
            setActivePanel={setActivePanel}
          />
          <div aria-hidden="true" className="w-[280px] shrink-0 xl:w-[320px]" />
          <div className="min-w-0 flex-1 max-w-[1060px]">
            {aiState === "typing" ? (
              <AiTypingPanel onInfo={() => setInfoOpen(true)} />
            ) : (
              <>
                <LessonStatusHeader onInfo={() => setInfoOpen(true)} />
                <LessonPlanCard />
                {aiState === "response" ? (
                  <AiResponseCard prompt={lastPrompt} />
                ) : null}
                <PromptStack
                  onAskAi={() => openComposer()}
                  onPromptSelect={(prompt) => openComposer(prompt)}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {aiState !== "idle" ? (
        <AiComposer
          input={aiInput}
          onChange={setAiInput}
          onClose={closeComposer}
          onSubmit={submitAiPrompt}
        />
      ) : null}
      {infoOpen ? <LessonInfoPopover onClose={() => setInfoOpen(false)} /> : null}
      {toast ? (
        <ToastMessage message={toast} onClose={() => setToast("")} />
      ) : null}
    </main>
  );
}

export default function Page() {
  const [screen, setScreen] = useState<JourneyScreen>("prepare");
  const goBackFromPrepare = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }

    setScreen("prepare");
  };

  if (screen === "generating") {
    return (
      <GeneratingScreen
        onBack={() => setScreen("prepare")}
        onComplete={() => setScreen("lesson")}
      />
    );
  }

  if (screen === "lesson") {
    return <GeneratedLessonScreen onBack={() => setScreen("prepare")} />;
  }

  return (
    <>
      <PrepareLanding
        modalOpen={screen === "setup"}
        onBack={goBackFromPrepare}
        onStartLessonPlan={() => setScreen("setup")}
      />
      {screen === "setup" ? (
        <FirstTimeSetupModal
          onClose={() => setScreen("prepare")}
          onDone={() => setScreen("generating")}
        />
      ) : null}
    </>
  );
}
