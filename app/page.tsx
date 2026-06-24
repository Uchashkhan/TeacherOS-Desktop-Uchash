"use client";

import { useEffect, useId, useState } from "react";

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
type JourneyScreen =
  | "prepare"
  | "lessonSetup"
  | "generating"
  | "lesson"
  | "smartVideoSetup"
  | "smartVideo";
type SetupStep = "subject" | "chapter" | "topic" | "details";
type AiInteractionState =
  | "idle"
  | "composer"
  | "voice"
  | "typing"
  | "response"
  | "errorTyping";
type PrepareCardId = "lessonPlan" | "smartVideo" | "smartBook" | "quiz";
type SmartVideoTag = "অ্যানিমেটেড ভিডিয়ো" | "রেকর্ডেড ভিডিয়ো";

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
    id: "lessonPlan" as const,
    title: "লেসন প্ল্যান",
    description: "AI-এর সাহায্যে দ্রুত ও সহজে আপনার ক্লাসের লেসন প্ল্যান তৈরি করুন",
    icon: "lesson",
    enabled: true,
  },
  {
    id: "smartVideo" as const,
    title: "স্মার্ট ভিডিও",
    description: "বিষয়গুলো আরও সহজভাবে উপস্থাপনের জন্য প্রাসঙ্গিক ভিডিও দেখুন",
    icon: "video",
    enabled: true,
  },
  {
    id: "smartBook" as const,
    title: "স্মার্ট বুক",
    description: "বিষয়বস্তু পরিষ্কারভাবে বুঝতে ডিজিটাল বই ব্রাউজ করুন",
    icon: "smart-book",
  },
  {
    id: "quiz" as const,
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

const smartVideoTopicOptions = [
  "বিদ্যুতের সংজ্ঞা",
  "বিদ্যুতের ব্যবহার",
  "বিদ্যুতের উৎস",
  "বিদ্যুৎ সরবরাহ",
  "বৈদ্যুতিক সরঞ্জাম",
  "বিদ্যুৎ সাশ্রয়",
  "বিদ্যুৎ অপচয়",
  "নিরাপদ বিদ্যুৎ ব্যবহার",
] as const;

const smartVideoFilters = ["সব ভিডিও", "রেকর্ডেড ভিডিয়ো", "অ্যানিমেটেড ভিডিয়ো"] as const;

const smartVideoVideoItems = [
  {
    title: "শক্তি কীভাবে রূপ বদলায়? শক্তি কীভাবে রূপ বদলায়?",
    duration: "৩:৪০ মি.",
    tag: "অ্যানিমেটেড ভিডিয়ো" as SmartVideoTag,
    tone: "blue",
  },
  {
    title: "শক্তির সংরক্ষণ এবং রূপান্তর সম্পর্কিত প্রশ্নোত্তর সেশন",
    duration: "৩:৪০ মি.",
    tag: "রেকর্ডেড ভিডিয়ো" as SmartVideoTag,
    tone: "rose",
  },
  {
    title: "শক্তির সংরক্ষণ এবং রূপান্তর সম্পর্কিত প্রশ্নোত্তর সেশন",
    duration: "৩:৪০ মি.",
    tag: "রেকর্ডেড ভিডিয়ো" as SmartVideoTag,
    tone: "sage",
  },
  {
    title: "শক্তি কীভাবে রূপ বদলায়? শক্তি কীভাবে রূপ বদলায়?",
    duration: "৩:৪০ মি.",
    tag: "অ্যানিমেটেড ভিডিয়ো" as SmartVideoTag,
    tone: "blue",
  },
  {
    title: "শক্তি কীভাবে রূপ বদলায়? শক্তি কীভাবে রূপ বদলায়?",
    duration: "৩:৪০ মি.",
    tag: "অ্যানিমেটেড ভিডিয়ো" as SmartVideoTag,
    tone: "sand",
  },
] as const;

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
  | "image"
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
    case "image":
      return (
        <svg {...common}>
          <rect height="16" rx="3" width="18" x="3" y="4" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path d="m21 15-4.5-4.5L9 18" />
          <path d="m14 15 2-2 5 5" />
        </svg>
      );
    case "lesson":
      return (
        <img alt="" aria-hidden="true" className={className} src="/lesson-plan-logo.svg" />
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
      return <img alt="" aria-hidden="true" className={className} src="/smart-book-logo.svg" />;
    case "quiz":
      return <img alt="" aria-hidden="true" className={className} src="/quiz-logo.svg" />;
    case "video":
      return <img alt="" aria-hidden="true" className={className} src="/smart-video-logo.svg" />;
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

function OptionIcon({ type }: { type: "book" | "science" | "class" | "topic" }) {
  if (type === "class") {
    return (
      <img
        alt=""
        aria-hidden="true"
        className="size-10 shrink-0 object-contain"
        src="/bangla-logo.svg"
      />
    );
  }

  if (type === "science") {
    return (
      <img
        alt=""
        aria-hidden="true"
        className="size-10 shrink-0 object-contain"
        src="/general-science-logo.svg"
      />
    );
  }

  if (type === "topic") {
    return <SmartVideoTopicIcon />;
  }

  return (
    <img
      alt=""
      aria-hidden="true"
      className="size-10 shrink-0 object-contain"
      src="/chapter-selection-logo.svg"
    />
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
  icon?: "book" | "science" | "class" | "topic";
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

function AiLogo({ className = "size-6" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block overflow-visible ${className}`}
    >
      <img
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.5] object-contain"
        src="/ai-logo.svg"
      />
    </span>
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
          <AiLogo className="size-5 shrink-0" />
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
          <AiLogo className="size-8" />
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

function VoiceWaveform() {
  return (
    <div className="flex h-7 items-center gap-1.5 text-primary-400">
      {[12, 20, 28, 18, 24, 14, 30, 18, 22, 12].map((height, index) => (
        <span
          className="voice-bar w-1.5 rounded-full bg-current"
          key={`${height}-${index}`}
          style={{
            animationDelay: `${index * 55}ms`,
            height,
          }}
        />
      ))}
    </div>
  );
}

function AiComposer({
  attachmentActive,
  input,
  isVoiceMode,
  onChange,
  onClose,
  onStartVoice,
  onSubmit,
  onToggleAttachment,
}: {
  attachmentActive: boolean;
  input: string;
  isVoiceMode: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
  onStartVoice: () => void;
  onSubmit: () => void;
  onToggleAttachment: () => void;
}) {
  const hasInput = Boolean(input.trim());

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
          aria-label={hasInput ? "AI ইনপুট মুছুন" : "ছবি যোগ করুন"}
          className={`ui-soft-press grid size-[59px] shrink-0 cursor-pointer place-items-center rounded-full text-white hover:bg-[#596273] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            attachmentActive ? "bg-primary-500" : "bg-[#4b5362]"
          }`}
          onClick={hasInput ? onClose : onToggleAttachment}
          type="button"
        >
          <Icon className="size-7" name={hasInput ? "close" : "plus"} />
        </button>
        <div className="relative min-w-0 flex-1">
          {attachmentActive ? (
            <div className="ui-fade-up absolute -top-[70px] left-0 flex h-[58px] items-center gap-3 rounded-2xl border border-white/20 bg-[#34364a] px-4 text-white shadow-xl">
              <div className="grid size-10 place-items-center rounded-xl bg-primary-500/20 text-primary-300">
                <Icon className="size-6" name="image" />
              </div>
              <div className="text-sm font-bold leading-tight">
                <p>বোর্ডের ছবি সংযুক্ত</p>
                <p className="text-white/60">lesson-reference.png</p>
              </div>
            </div>
          ) : null}
          {isVoiceMode ? (
            <div className="flex h-[59px] items-center justify-between rounded-full border border-[#7d8298] bg-[#34364a] px-7 text-lg font-semibold text-white">
              <span>ভয়েস শোনা হচ্ছে...</span>
              <VoiceWaveform />
            </div>
          ) : (
            <input
              aria-label="AI-কে জিজ্ঞাসা করুন"
              className="h-[59px] w-full min-w-0 rounded-full border border-[#7d8298] bg-[#34364a] px-7 text-lg font-semibold text-white outline-none transition placeholder:text-white/55 focus:border-white"
              onChange={(event) => onChange(event.target.value)}
              placeholder="AI-কে জিজ্ঞাসা করুন..."
              value={input}
            />
          )}
        </div>
        <button
          aria-label={hasInput ? "প্রশ্ন পাঠান" : "ভয়েস ইনপুট"}
          className="ui-soft-press grid size-[59px] shrink-0 cursor-pointer place-items-center rounded-full bg-primary-500 text-white shadow-glow hover:bg-[#087252] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={hasInput ? undefined : onStartVoice}
          type={hasInput ? "submit" : "button"}
        >
          <Icon className="size-7" name={hasInput ? "send" : "mic"} />
        </button>
      </div>
    </form>
  );
}

function AiResponseCard({
  index,
  prompt,
}: {
  index: number;
  prompt: string;
}) {
  const isQuestionPrompt = prompt.includes("প্রশ্ন");
  const isSimpleLanguagePrompt = prompt.includes("সহজ");

  return (
    <section className="ui-fade-up mt-7 rounded-[24px] bg-white px-8 py-7 text-grayui-900 shadow-[0_18px_42px_rgba(0,0,0,0.08)]">
      <div className="mb-5 flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ffe56a] via-[#008f67] to-[#111a6e] text-white shadow-glow">
          <AiLogo className="size-7" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-primary-500">
            AI উত্তর {index + 1}
          </p>
          <h3 className="mt-1 text-2xl font-bold leading-[1.35]">
            {prompt || "এই লেসন প্ল্যান আরও সহজভাবে সাজান।"}
          </h3>
        </div>
      </div>
      <div className="space-y-4 text-xl leading-[1.55] text-grayui-800">
        {isQuestionPrompt ? (
          <ol className="list-decimal space-y-2 pl-7">
            <li>ব্যাটারি কীভাবে বিদ্যুতের উৎস হিসেবে কাজ করে?</li>
            <li>জেনারেটর কেন যান্ত্রিক শক্তিকে বিদ্যুতে রূপান্তর করে?</li>
            <li>সৌর প্যানেলে কোন শক্তি ব্যবহার করা হয়?</li>
            <li>বিদ্যুৎ অপচয় কমাতে শিক্ষার্থীরা কী করতে পারে?</li>
            <li>একটি বাড়িতে বিদ্যুতের সম্ভাব্য উৎসগুলো তুলনা করো।</li>
          </ol>
        ) : null}
        {isSimpleLanguagePrompt ? (
          <p>
            কঠিন শব্দ বাদ দিয়ে বলতে পারেন: বিদ্যুৎ আসে কয়েকভাবে। ব্যাটারি ছোট
            যন্ত্র চালায়, জেনারেটর বিদ্যুৎ বানায়, আর সূর্যের আলো থেকেও বিদ্যুৎ
            তৈরি করা যায়। ক্লাসে এগুলো ছবি, প্রশ্ন আর দলীয় কাজ দিয়ে বোঝান।
          </p>
        ) : null}
        {!isQuestionPrompt && !isSimpleLanguagePrompt ? (
          <>
            <p>
              ক্লাসটি আরও অংশগ্রহণমূলক করতে শুরুতে বাস্তব উদাহরণ, মাঝখানে দলীয়
              কাজ, এবং শেষে দ্রুত কুইজ রাখুন। এতে শিক্ষার্থীরা ধারণা বুঝবে এবং
              নিজেরা প্রয়োগও করতে পারবে।
            </p>
            <ul className="list-disc space-y-2 pl-7">
              <li>বোর্ডে বিদ্যুতের উৎসের তিনটি ভাগ লিখে উদাহরণ নিতে পারেন।</li>
              <li>প্রতিটি দলকে একটি উৎস দিয়ে ব্যবহার ও সুবিধা ব্যাখ্যা করতে বলুন।</li>
              <li>শেষে দুই মিনিটের ঝটপট প্রশ্ন দিয়ে শেখা যাচাই করুন।</li>
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}

function AiResponseStack({ prompts }: { prompts: string[] }) {
  return (
    <div>
      {prompts.map((prompt, index) => (
        <AiResponseCard
          index={index}
          key={`${prompt}-${index}`}
          prompt={prompt}
        />
      ))}
    </div>
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
    <div className="ui-fade-up fixed left-1/2 top-5 z-[60] flex min-h-[76px] w-[528px] max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-4 rounded-2xl border border-[#f3b5b5] bg-[#fff1f1] px-5 py-3 text-base font-bold text-[#9f1d1d] shadow-2xl">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffd8d8]">
        <Icon className="size-5" name="info" />
      </span>
      <span>{message}</span>
    </div>
  );
}

function PrepareLanding({
  modalOpen,
  onBack,
  onStartJourney,
}: {
  modalOpen?: boolean;
  onBack: () => void;
  onStartJourney: (cardId: PrepareCardId) => void;
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
                  onClick={() => onStartJourney(card.id)}
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
  icon = "lesson",
  label = "লেসন প্ল্যান",
  onBack,
  onClose,
  scrollable,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  icon?: "lesson" | "video";
  label?: string;
  onBack?: () => void;
  onClose: () => void;
  scrollable?: boolean;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="ui-fade-in fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 py-6">
      <section className="ui-modal-in flex min-h-[min(520px,calc(100dvh-48px))] max-h-[calc(100dvh-48px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[32px] bg-white text-grayui-950 shadow-2xl">
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
                <Icon className="size-10" name={icon} />
                <p className="text-xl font-bold leading-[1.48] text-grayui-900">
                  {label}
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

function DurationOption({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={checked}
      className={`ui-soft-press flex h-[62px] w-full cursor-pointer items-center justify-center gap-3 rounded-[20px] border border-b-4 px-3 text-xl font-medium leading-[1.48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
        checked
          ? "border-[#1ca63e] bg-[#e8f6ec] text-grayui-950"
          : "border-grayui-200 bg-white text-grayui-900 hover:border-grayui-300"
      }`}
      onClick={onClick}
      type="button"
    >
      <span
        className={`grid size-7 place-items-center rounded-full border-2 ${
          checked
            ? "border-[#25b11d] bg-[#25b11d] text-white"
            : "border-[#007f5f] bg-white text-transparent"
        }`}
      >
        {checked ? <Icon className="size-4" name="check" /> : null}
      </span>
      {label}
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
  const [selectedDuration, setSelectedDuration] = useState("৪০ মিনিট");
  const [selectedClassType, setSelectedClassType] = useState(
    "শিক্ষার্থী সংখ্যা বেশি",
  );

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

  const canGenerate = Boolean(selectedDuration && selectedClassType);

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

  if (step === "details") {
    return (
      <FirstTimeSetupDetailsStep
        onBack={() => setStep("topic")}
        onClose={onClose}
        onDone={onDone}
        selectedClassType={selectedClassType}
        selectedDuration={selectedDuration}
        setSelectedClassType={setSelectedClassType}
        setSelectedDuration={setSelectedDuration}
      />
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
      <div className="flex flex-col">
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
          onClick={() => setStep("details")}
          type="button"
        >
          এগিয়ে যান
          <Icon className="size-6" name="arrow-curve" />
        </button>
      </div>
    </ModalShell>
  );
}

function FirstTimeSetupDetailsStep({
  onBack,
  onClose,
  onDone,
  selectedClassType,
  selectedDuration,
  setSelectedClassType,
  setSelectedDuration,
}: {
  onBack: () => void;
  onClose: () => void;
  onDone: () => void;
  selectedClassType: string;
  selectedDuration: string;
  setSelectedClassType: (value: string) => void;
  setSelectedDuration: (value: string) => void;
}) {
  const canGenerate = Boolean(selectedDuration && selectedClassType);

  return (
    <ModalShell
      onBack={onBack}
      onClose={onClose}
      scrollable
      subtitle="আপনার প্রয়োজন অনুযায়ী সেরা লার্নিং প্ল্যানটি তৈরি করতে নিচের অপশনগুলো পূরণ করুন।"
      title="ক্লাসের সময় ও ধরন বেছে নিন!"
    >
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 pb-28">
          <section>
            <h3 className="mb-4 text-[22px] font-bold leading-[1.48] text-grayui-950">
              ক্লাসের সময়সীমা
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {durationOptions.map((option) => (
                <DurationOption
                  checked={selectedDuration === option}
                  key={option}
                  label={option}
                  onClick={() => setSelectedDuration(option)}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-[22px] font-bold leading-[1.48] text-grayui-950">
              ক্লাসের ধরন
            </h3>
            <div className="flex flex-col gap-4">
              {classTypeOptions.map((option) => (
                <button
                  aria-pressed={selectedClassType === option}
                  className={`ui-soft-press flex min-h-[64px] w-full cursor-pointer items-center gap-4 rounded-[18px] border border-b-4 px-5 py-3 text-left text-xl font-medium leading-[1.48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                    selectedClassType === option
                      ? "border-[#1ca63e] bg-[#e8f6ec] text-grayui-950"
                      : "border-grayui-200 bg-white text-grayui-900 hover:border-grayui-300"
                  }`}
                  key={option}
                  onClick={() => setSelectedClassType(option)}
                  type="button"
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full border-2 ${
                      selectedClassType === option
                        ? "border-[#25b11d] bg-[#25b11d] text-white"
                        : "border-[#007f5f] bg-white text-transparent"
                    }`}
                  >
                    {selectedClassType === option ? (
                      <Icon className="size-4" name="check" />
                    ) : null}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </section>
        </div>

        <button
          className="sticky bottom-0 mt-auto flex min-h-[58px] w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-b-4 border-[#bb7cff] bg-gradient-to-r from-[#f02fd7] to-[#6f00ff] px-5 text-xl font-bold text-white shadow-[0_-18px_28px_rgba(255,255,255,0.95)] transition duration-200 hover:brightness-110 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canGenerate}
          onClick={onDone}
          type="button"
        >
          <AiLogo className="size-6" />
          জেনারেট করুন
        </button>
      </div>
    </ModalShell>
  );
}

function SmartVideoTopicIcon() {
  const clipId = useId();

  return (
    <svg
      aria-hidden="true"
      className="size-10 shrink-0"
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M27.4769 0H4.33396C3.59725 0 3 0.597255 3 1.33396V33.6073C3 34.7381 3.91671 35.6548 5.04753 35.6548H23.2889C26.3387 35.6548 28.811 33.1825 28.811 30.1328V1.33396C28.8109 0.597255 28.2136 0 27.4769 0Z"
          fill="#006243"
        />
        <path
          d="M3 20.668V33.6082C3 34.739 3.91671 35.6557 5.04753 35.6557H23.2889C26.3387 35.6557 28.811 33.1834 28.811 30.1337V20.668H3Z"
          fill="url(#paint0_linear_469_144755)"
        />
        <path
          d="M27.5575 40.0005H9.31608C8.18526 40.0005 7.26855 39.0837 7.26855 37.9529V5.67966C7.26855 4.94296 7.86581 4.3457 8.60252 4.3457H31.7455C32.4822 4.3457 33.0795 4.94296 33.0795 5.67966V34.4784C33.0795 37.5281 30.6072 40.0005 27.5575 40.0005Z"
          fill="url(#paint1_linear_469_144755)"
        />
        <path
          d="M7.26855 30.4863V37.9524C7.26855 39.0833 8.18526 40 9.31608 40H27.5575C30.6072 40 33.0795 37.5277 33.0795 34.4779V30.4863H7.26855Z"
          fill="url(#paint2_linear_469_144755)"
        />
        <path
          d="M11.3639 33.4961V37.9524C11.3639 39.0832 10.4472 39.9999 9.31641 39.9999H31.6528C34.7025 39.9999 37.1748 37.5276 37.1748 34.4779V33.4961C37.1748 32.7594 36.5776 32.1621 35.8409 32.1621H12.6979C11.9611 32.1621 11.3639 32.7594 11.3639 33.4961Z"
          fill="url(#paint3_linear_469_144755)"
        />
        <path
          d="M11.3639 33.4961V37.9524C11.3639 39.0832 10.4472 39.9999 9.31641 39.9999H31.6528C34.7025 39.9999 37.1748 37.5276 37.1748 34.4779V33.4961C37.1748 32.7594 36.5776 32.1621 35.8409 32.1621H12.6979C11.9611 32.1621 11.3639 32.7594 11.3639 33.4961Z"
          fill="url(#paint4_linear_469_144755)"
        />
        <path
          d="M29.3715 22.0256H11.8896C11.6135 22.0256 11.3896 21.8017 11.3896 21.5256V20.8438C11.3896 20.5676 11.6135 20.3438 11.8896 20.3438H29.3716C29.6478 20.3438 29.8716 20.5676 29.8716 20.8438V21.5256C29.8715 21.8016 29.6477 22.0256 29.3715 22.0256Z"
          fill="url(#paint5_linear_469_144755)"
        />
        <path
          d="M29.3715 25.6291H11.8896C11.6135 25.6291 11.3896 25.4052 11.3896 25.1291V24.4473C11.3896 24.1711 11.6135 23.9473 11.8896 23.9473H29.3716C29.6478 23.9473 29.8716 24.1711 29.8716 24.4473V25.1291C29.8715 25.4052 29.6477 25.6291 29.3715 25.6291Z"
          fill="url(#paint6_linear_469_144755)"
        />
        <path
          d="M24.9169 29.2306H11.8896C11.6135 29.2306 11.3896 29.0068 11.3896 28.7306V28.0488C11.3896 27.7727 11.6135 27.5488 11.8896 27.5488H24.9169C25.1931 27.5488 25.4169 27.7727 25.4169 28.0488V28.7306C25.4169 29.0068 25.193 29.2306 24.9169 29.2306Z"
          fill="url(#paint7_linear_469_144755)"
        />
        <path
          d="M19.8736 8.18164H12.7138C11.9825 8.18164 11.3896 8.7745 11.3896 9.5058V16.6656C11.3896 17.3969 11.9825 17.9897 12.7138 17.9897H19.8736C20.6049 17.9897 21.1977 17.3969 21.1977 16.6656V9.5058C21.1977 8.7745 20.6049 8.18164 19.8736 8.18164Z"
          fill="#006243"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_469_144755"
          gradientUnits="userSpaceOnUse"
          x1="15.9055"
          x2="15.9055"
          y1="22.5313"
          y2="33.9577"
        >
          <stop stopColor="#8A1958" stopOpacity="0" />
          <stop offset="1" stopColor="#EF3D40" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_469_144755"
          gradientUnits="userSpaceOnUse"
          x1="4.17067"
          x2="37.1397"
          y1="5.96068"
          y2="38.9297"
        >
          <stop stopColor="#EEF4FF" />
          <stop offset="1" stopColor="#CFE7FD" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_469_144755"
          gradientUnits="userSpaceOnUse"
          x1="20.174"
          x2="20.174"
          y1="30.8854"
          y2="40.7701"
        >
          <stop stopColor="#8AAADC" stopOpacity="0" />
          <stop offset="1" stopColor="#8AAADC" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_469_144755"
          gradientUnits="userSpaceOnUse"
          x1="23.2456"
          x2="23.2456"
          y1="32.1621"
          y2="39.7897"
        >
          <stop stopColor="#EEF4FF" />
          <stop offset="1" stopColor="#CFE7FD" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_469_144755"
          gradientUnits="userSpaceOnUse"
          x1="23.2456"
          x2="23.2456"
          y1="35.7646"
          y2="41.1855"
        >
          <stop stopColor="#8AAADC" stopOpacity="0" />
          <stop offset="1" stopColor="#8AAADC" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_469_144755"
          gradientUnits="userSpaceOnUse"
          x1="11.3896"
          x2="29.8715"
          y1="21.1846"
          y2="21.1846"
        >
          <stop stopColor="#5A5A5A" />
          <stop offset="1" stopColor="#464646" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_469_144755"
          gradientUnits="userSpaceOnUse"
          x1="11.3896"
          x2="29.8715"
          y1="24.7881"
          y2="24.7881"
        >
          <stop stopColor="#5A5A5A" />
          <stop offset="1" stopColor="#464646" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_469_144755"
          gradientUnits="userSpaceOnUse"
          x1="11.3896"
          x2="25.4169"
          y1="28.3897"
          y2="28.3897"
        >
          <stop stopColor="#5A5A5A" />
          <stop offset="1" stopColor="#464646" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function SmartVideoTopicOption({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="ui-soft-press flex h-[54px] w-full cursor-pointer items-center justify-between rounded-[15px] border border-b-4 border-grayui-300 bg-grayui-100 px-[15px] py-2 text-left text-xl font-medium leading-[1.48] text-grayui-950 hover:border-grayui-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      onClick={onClick}
      type="button"
    >
      <span className="flex min-w-0 items-center gap-5">
        <SmartVideoTopicIcon />
        <span className="truncate">{label}</span>
      </span>
      <Icon className="size-6 shrink-0 text-grayui-600" name="chevron-right" />
    </button>
  );
}

function SmartVideoFirstTimeModal({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<Extract<SetupStep, "subject" | "chapter" | "topic">>(
    "subject",
  );
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

  const selectTopic = (topic: string) => {
    setSelectedTopics([topic]);
    onDone();
  };

  if (step === "subject") {
    return (
      <ModalShell
        icon="video"
        label="স্মার্ট ভিডিয়ো"
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
        icon="video"
        label="স্মার্ট ভিডিয়ো"
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
      icon="video"
      label="স্মার্ট ভিডিয়ো"
      onBack={() => setStep("chapter")}
      onClose={onClose}
      scrollable
      subtitle="পরবর্তী ধাপে এগোতে একটি টপিক নির্ধারণ করুন"
      title="টপিক নির্বাচন করুন"
    >
      <div className="flex flex-col gap-3">
        {smartVideoTopicOptions.map((option, index) => (
          <SmartVideoTopicOption
            key={`${option}-${index}`}
            label={option}
            onClick={() => selectTopic(option)}
          />
        ))}
      </div>
    </ModalShell>
  );
}

function SmartVideoTopBar({ onBack }: { onBack: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex min-h-20 items-center justify-between gap-6 border-b-2 border-white/30 bg-primary-950 px-[50px] py-3 text-white">
      <div className="flex min-w-0 items-center gap-4">
        <IconButton label="পেছনে যান" onClick={onBack}>
          <Icon className="size-9" name="arrow-left" />
        </IconButton>
        <h1 className="truncate text-2xl font-bold leading-[1.48]">স্মার্ট ভিডিয়ো</h1>
      </div>
      <div className="grid size-[55px] place-items-center overflow-hidden">
        <Icon className="size-[55px]" name="video" />
      </div>
    </header>
  );
}

function SmartVideoSetup({
  activePanel,
  onClosePanel,
  onSelectChapter,
  onSelectSubject,
  onToggleTopic,
  selectedChapter,
  selectedClass,
  selectedSubject,
  selectedTopics,
  setActivePanel,
}: {
  activePanel: Extract<SidebarPanel, "subject" | "chapter" | "topic"> | null;
  onClosePanel: () => void;
  onSelectChapter: (value: string) => void;
  onSelectSubject: (className: string, subject: string) => void;
  onToggleTopic: (value: string) => void;
  selectedChapter: string;
  selectedClass: string;
  selectedSubject: string;
  selectedTopics: string[];
  setActivePanel: (panel: Extract<SidebarPanel, "subject" | "chapter" | "topic">) => void;
}) {
  const valuesByPanel = {
    subject: selectedSubject,
    chapter: selectedChapter || "নির্বাচন করুন",
    topic: selectedTopics.length ? selectedTopics[0] : "নির্বাচন করুন",
  };

  return (
    <div className="fixed left-[10px] top-[90px] z-20 flex h-[calc(100dvh-100px)]">
      <aside className="h-full w-[300px] overflow-hidden rounded-l-[10px] border-r border-grayui-800 bg-primary-950 p-[15px]">
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
              onClick={() =>
                setActivePanel(item.id as Extract<SidebarPanel, "subject" | "chapter" | "topic">)
              }
              pill={false}
              value={valuesByPanel[item.id as keyof typeof valuesByPanel]}
            />
          ))}
        </div>
      </aside>

      {activePanel ? (
        <aside className="ui-slide-panel h-full w-[318px] overflow-hidden rounded-r-[10px] border-l border-white/15 bg-primary-950 p-[15px]">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold leading-[1.48] text-grayui-100">
              {activePanel === "subject"
                ? "ক্লাস ও বিষয়"
                : activePanel === "chapter"
                  ? "অধ্যায়"
                  : "টপিক"}
            </h3>
            <button
              aria-label="এক্সটেন্ডেড সাইডবার বন্ধ করুন"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-white transition duration-200 hover:bg-white/10 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={onClosePanel}
              type="button"
            >
              <Icon className="size-6" name="close" />
            </button>
          </div>
          <div className="h-[calc(100%-72px)] overflow-y-auto pr-0.5">
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
                  <div className="flex flex-col gap-3.5">
                    {smartVideoTopicOptions.map((option, index) => (
                      <PanelOption
                        checked={selectedTopics.includes(option)}
                        icon="topic"
                        key={`${option}-${index}`}
                        onClick={() => onToggleTopic(option)}
                      >
                        {option}
                      </PanelOption>
                    ))}
                  </div>
                ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}

function SmartVideoFilter({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={`ui-soft-press relative flex h-12 cursor-pointer items-center justify-center rounded-full px-4 text-[18px] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
        active
          ? "border border-b-4 border-[#2a9919] bg-white font-medium text-primary-500"
          : "bg-white font-normal text-[#111] hover:bg-grayui-100"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function SmartVideoCard({
  duration,
  tag,
  title,
}: {
  duration: string;
  tag: SmartVideoTag;
  title: string;
  tone: "blue" | "rose" | "sage" | "sand";
}) {
  const tagClass =
    tag === "অ্যানিমেটেড ভিডিয়ো"
      ? "border-[#118be8] text-[#118be8]"
      : "border-primary-500 text-primary-500";

  return (
    <article className="flex h-[146px] w-full max-w-[500px] items-center gap-3 overflow-hidden rounded-[32px] border-2 border-b-[5px] border-grayui-200 bg-white pr-4 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_3px_3px_rgba(0,0,0,0.04)]">
      <div className="relative flex h-[146px] w-[clamp(180px,48%,235px)] shrink-0 items-center justify-center rounded-l-[30px] bg-gradient-to-b from-[rgba(162,50,50,0.3)] to-[rgba(60,19,19,0.3)]">
        <div className="grid size-[50px] place-items-center rounded-full border border-white/80 bg-white/25 text-white backdrop-blur-sm">
          <svg aria-hidden="true" className="size-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="m8 6 10 6-10 6V6Z" />
          </svg>
        </div>
      </div>
      <div className="flex h-[135px] min-w-0 flex-1 flex-col justify-center gap-[10px] py-[5px]">
        <div className="flex min-w-0 flex-col gap-[5px]">
          <span
            className={`inline-flex h-8 max-w-full w-fit shrink-0 items-center justify-center rounded-full border px-3 text-[15px] font-medium leading-[1.4] ${tagClass}`}
          >
            {tag}
          </span>
          <h3 className="line-clamp-2 break-words text-[18px] font-bold leading-[1.48] text-[#222]">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[16px] font-medium text-grayui-700">
          <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7.8v4.9l3.2 2" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          <span>{duration}</span>
        </div>
      </div>
    </article>
  );
}

function SmartVideoScreen({ onBack }: { onBack: () => void }) {
  const [activePanel, setActivePanel] = useState<
    Extract<SidebarPanel, "subject" | "chapter" | "topic"> | null
  >(null);
  const [selectedClass, setSelectedClass] = useState("ক্লাস ৬");
  const [selectedSubject, setSelectedSubject] = useState("বিজ্ঞান");
  const [selectedChapter, setSelectedChapter] = useState("বিদ্যুৎ");
  const [selectedTopics, setSelectedTopics] = useState(["বিদ্যুতের উৎস"]);
  const [activeFilter, setActiveFilter] = useState<(typeof smartVideoFilters)[number]>(
    "সব ভিডিও",
  );

  const handleSelectSubject = (className: string, subject: string) => {
    setSelectedClass(className);
    setSelectedSubject(subject);
    setSelectedChapter("");
    setSelectedTopics([]);
    setActivePanel("chapter");
  };

  const handleSelectChapter = (chapter: string) => {
    setSelectedChapter(chapter);
    setActivePanel("topic");
  };

  const handleToggleTopic = (topic: string) => {
    setSelectedTopics([topic]);
    setActivePanel(null);
  };

  const filteredVideos = smartVideoVideoItems.filter((video) =>
    activeFilter === "সব ভিডিও" ? true : video.tag === activeFilter,
  );

  return (
    <main className="min-h-dvh bg-[linear-gradient(180deg,#d8dddf_0%,#d5e0e6_100%)] font-bengali">
      <SmartVideoTopBar onBack={onBack} />
      <SmartVideoSetup
        activePanel={activePanel}
        onClosePanel={() => setActivePanel(null)}
        onSelectChapter={handleSelectChapter}
        onSelectSubject={handleSelectSubject}
        onToggleTopic={handleToggleTopic}
        selectedChapter={selectedChapter}
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        selectedTopics={selectedTopics}
        setActivePanel={setActivePanel}
      />

      <section className="box-border w-full pl-[330px] pr-6 pt-[90px] lg:pr-[50px]">
        <div className="w-full max-w-none">
          <div className="mb-[30px] flex items-start justify-between gap-6">
            <h2 className="text-[32px] font-bold leading-[1.48] text-grayui-900">
              {selectedTopics[0] || "বিদ্যুতের উৎস"}
            </h2>
            <p className="pt-1 text-[18px] font-medium leading-[1.48] text-grayui-700">
              {filteredVideos.length} টি ভিডিও
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {smartVideoFilters.map((filter) => (
              <SmartVideoFilter
                active={activeFilter === filter}
                key={filter}
                label={filter}
                onClick={() => setActiveFilter(filter)}
              />
            ))}
          </div>

          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-x-5 gap-y-5">
            {filteredVideos.map((video, index) => (
              <SmartVideoCard key={`${video.tag}-${video.title}-${index}`} {...video} />
            ))}
          </div>
        </div>
      </section>
    </main>
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
            <img
              alt=""
              className="size-[330px] animate-spin object-contain [animation-duration:2.8s]"
              src="/ai-loader-logo.svg"
            />
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
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [attachmentActive, setAttachmentActive] = useState(false);
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
    if (aiState === "voice") {
      const timeout = window.setTimeout(() => {
        setAiInput("বোর্ডের ছবির সাথে মিলিয়ে ক্লাসের কার্যক্রম সাজান।");
        setAttachmentActive(true);
        setAiState("composer");
      }, 1300);

      return () => window.clearTimeout(timeout);
    }

    if (aiState !== "typing" && aiState !== "errorTyping") {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      if (aiState === "errorTyping") {
        setToast("AI উত্তর তৈরি করা যায়নি। আবার চেষ্টা করুন।");
        setAiState(promptHistory.length ? "response" : "composer");
        return;
      }

      setAiState("response");
    }, 1300);

    return () => window.clearTimeout(timeout);
  }, [aiState, promptHistory.length]);

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
    setAttachmentActive(false);
    setAiState((current) => (current === "response" ? "response" : "composer"));
  };

  const submitAiPrompt = () => {
    const prompt = aiInput.trim();

    if (!prompt) {
      setToast("প্রথমে একটি প্রশ্ন লিখুন বা ভয়েস ইনপুট ব্যবহার করুন।");
      return;
    }

    if (prompt.toLowerCase().includes("error") || prompt.includes("এরর")) {
      setAiState("errorTyping");
      return;
    }

    setPromptHistory((current) => [...current, prompt]);
    setAiInput("");
    setAttachmentActive(false);
    setAiState("typing");
  };

  const closeComposer = () => {
    setAiInput("");
    setAttachmentActive(false);
    setAiState((current) =>
      current === "response" || promptHistory.length ? "response" : "idle",
    );
  };

  const startVoiceInput = () => {
    setAiInput("");
    setAttachmentActive(false);
    setAiState("voice");
  };

  const toggleAttachment = () => {
    setAttachmentActive((current) => {
      const next = !current;

      if (next && !aiInput.trim()) {
        setAiInput("বোর্ডের ছবির সাথে মিলিয়ে ক্লাসের কার্যক্রম সাজান।");
      }

      return next;
    });
    setAiState("composer");
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
          aiState === "idle" ? "pb-16" : "pb-44"
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
            {aiState === "typing" || aiState === "errorTyping" ? (
              <AiTypingPanel onInfo={() => setInfoOpen(true)} />
            ) : (
              <>
                <LessonStatusHeader onInfo={() => setInfoOpen(true)} />
                <LessonPlanCard />
                {promptHistory.length ? (
                  <AiResponseStack prompts={promptHistory} />
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
          attachmentActive={attachmentActive}
          input={aiInput}
          isVoiceMode={aiState === "voice"}
          onChange={setAiInput}
          onClose={closeComposer}
          onStartVoice={startVoiceInput}
          onSubmit={submitAiPrompt}
          onToggleAttachment={toggleAttachment}
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

  const startJourney = (cardId: PrepareCardId) => {
    if (cardId === "lessonPlan") {
      setScreen("lessonSetup");
      return;
    }

    if (cardId === "smartVideo") {
      setScreen("smartVideoSetup");
    }
  };

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

  if (screen === "smartVideo") {
    return <SmartVideoScreen onBack={() => setScreen("prepare")} />;
  }

  return (
    <>
      <PrepareLanding
        modalOpen={screen === "lessonSetup" || screen === "smartVideoSetup"}
        onBack={goBackFromPrepare}
        onStartJourney={startJourney}
      />
      {screen === "lessonSetup" ? (
        <FirstTimeSetupModal
          onClose={() => setScreen("prepare")}
          onDone={() => setScreen("generating")}
        />
      ) : null}
      {screen === "smartVideoSetup" ? (
        <SmartVideoFirstTimeModal
          onClose={() => setScreen("prepare")}
          onDone={() => setScreen("smartVideo")}
        />
      ) : null}
    </>
  );
}
