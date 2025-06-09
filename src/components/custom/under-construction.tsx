import { Link } from "@tanstack/react-router";

export default function UnderConstruction() {
  return (
    <section className="flex flex-col items-center justify-center h-full p-4">
      <div className="flex flex-col items-center space-y-4">
        <ConstructionIcon className="h-24 w-24 text-yellow-500 dark:text-yellow-300" />
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
          Under Construction
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md text-center">
          This page is currently under construction. We're working hard to get
          it ready for you. Stay tuned!
        </p>
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500"
          //   prefetch={false}
        >
          Go back to the main page
        </Link>
      </div>
    </section>
  );
}

function ConstructionIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
      <path d="M10 14 2.3 6.3" />
      <path d="m14 6 7.7 7.7" />
      <path d="m8 6 8 8" />
    </svg>
  );
}
