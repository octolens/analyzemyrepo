import { useRouter } from "next/router";
import { connectSearchBox } from "react-instantsearch-dom";
import { useRef, useEffect, useState } from "react";

const CustomSearchBox = ({
  currentRefinement,
  isSearchStalled,
  refine,
}: any) => {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const keydownHandler = (e: KeyboardEvent) => {
    if ((e.key === "k" && e.metaKey) || (e.key === "k" && e.ctrlKey)) {
      e.preventDefault();
      inputRef?.current?.focus();
    }
  };

  useEffect(() => {
    window.document.addEventListener("keydown", keydownHandler);

    return () => {
      window.document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  return (
    <form
      noValidate
      action=""
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const elements = document.getElementsByClassName("search-hits");
        if (elements.length > 0) {
          router.push(`/analyze/${elements[0]?.textContent}`);
        } else {
          router.push(`/analyze/${currentRefinement}`);
        }
        refine("");
        inputRef?.current?.blur();
      }}
    >
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
          id="default-search"
          className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
          placeholder="Search for a repo"
          value={currentRefinement}
          onChange={(event) => refine(event.currentTarget.value)}
          autoComplete="off"
          autoFocus
          ref={inputRef}
        />
        <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none gap-1">
          <kbd className="kbd hidden lg:flex">ctrl</kbd>
          <kbd className="kbd hidden lg:flex">K</kbd>
        </div>
      </div>
    </form>
  );
};

const SearchBox = connectSearchBox(CustomSearchBox);

export default SearchBox;
