import { MouseEventHandler } from "react";

interface HeaderProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text?: string;
}

export default function Header({ onClick, text }: HeaderProps) {
  return (
    <div className="h-12 relative flex flex-col justify-center">
      <button
        onClick={onClick}
        className="flex items-center space-x-1 absolute left-10 z-50"
      >
        <svg
          className="w-5 h-5 stroke-sky-600"
          data-darkreader-inline-stroke=""
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          ></path>
        </svg>
        {text && <span className="text-lg text-sky-600">{text}</span>}
      </button>
    </div>
  );
}
