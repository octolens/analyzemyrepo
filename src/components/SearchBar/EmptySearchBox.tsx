import { useRef, useEffect, useState } from "react";
import Modal from "../Modal/Modal";

const CustomSearchBox = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const keydownHandler = (e: KeyboardEvent) => {
    if ((e.key === "k" && e.metaKey) || (e.key === "k" && e.ctrlKey)) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  useEffect(() => {
    window.document.addEventListener("keydown", keydownHandler);

    return () => {
      window.document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  return (
    <form>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
      >
        Search
      </label>
      <div className="relative w-full">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          name="search"
          className="block py-2.5 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-0 focus:border-gray-300 caret-transparent"
          placeholder="Search"
          autoComplete="off"
          ref={inputRef}
          readOnly
          onClick={() => setIsOpen(true)}
        />
        <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none gap-1">
          <kbd className="kbd kbd-xs hidden lg:flex">ctrl</kbd>
          <kbd className="kbd kbd-xs hidden lg:flex">K</kbd>
        </div>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
    </form>
  );
};

export default CustomSearchBox;
