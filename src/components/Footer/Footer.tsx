import Link from "next/link";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer aria-label="Site Footer" className="bg-white  shadow">
      <div className="mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="container flex flex-col md:flex-row flex-wrap justify-start items-center mx-auto px-2 sm:px-6 lg:px-8 max-w-screen-xl gap-4">
          <Link
            href="/"
            className="flex flex-1 items-center text-primary font-bold text-md md:text-xl"
          >
            <Image
              width="240"
              height="132"
              alt="analyzemyrepo.com"
              src="/logo.png"
              priority={true}
            ></Image>
          </Link>

          <div className="flex justify-center items-center">
            {/* <nav
              aria-label="Footer Services Nav"
              className="flex flex-col space-y-1 md:flex-row md:space-x-8 md:space-y-0 whitespace-nowrap items-center"
            >
              <Link className="text-black font-semibold" href="/about">
                about
              </Link>
              <Link
                className="text-black font-semibold"
                href="/collections/fastest-growing-weekly"
              >
                fastest growing repos
              </Link>
              <Link className="text-black font-semibold" href="/ai-search">
                AI search
              </Link>
            </nav> */}
          </div>

          <div className="flex flex-none md:flex-1 justify-end gap-4 items-center">
            <Link
              className="text-gray-700 transition hover:text-gray-700/75"
              href="https://twitter.com/CrowdDotDev"
              target="_blank"
              rel="noreferrer"
            >
              <span className="sr-only"> Twitter </span>

              <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0"
              className="h-6 w-6"
              height="1em"
              width="1em"
              >
              <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
               </svg>

                
            </Link>

            <Link
              className="text-gray-700 transition hover:text-gray-700/75"
              href="https://github.com/CrowdDotDev/analyzemyrepo"
              target="_blank"
              rel="noreferrer"
            >
              <span className="sr-only"> GitHub </span>

              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center flex-wrap mt-4 pt-4 md:mt-8 md:pt-8 mb-2">
          <div>
            This tool is powered by&nbsp;
            <a href="https://crowd.dev" className="text-primary">
              crowd.dev
            </a>
          </div>
          <div>
            <a
              href="https://github.com/CrowdDotDev/crowd.dev"
              className="text-primary"
            >
              Leave a star on our main repository
            </a>
            , if you want to support our work for open source projects ⭐
          </div>
        </div>
      </div>
    </footer>
  );
};

export const EmailForm = () => {
  const subscribe = trpc.useMutation("postgres.subscribe_to_newsletter");

  const [email, setEmail] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<string>(
    "Once per month. No spam."
  );

  useEffect(() => {
    if (subscribe.isSuccess) {
      setCurrentMessage("Thank you! Your submission has been received!");
    }
  }, [subscribe.isSuccess]);

  useEffect(() => {
    if (subscribe.isError) {
      setCurrentMessage("Something went wrong");
    }
  }, [subscribe.isError]);

  return (
    <div className="w-full pattern-wavy pattern-gray-100 pattern-bg-white pattern-size-4 pattern-opacity-100">
      <div className="mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <p className="block text-center text-xl sm:text-3xl font-bold tracking-tight text-gray-900 lg:font-extrabold lg:leading-none">
            Get updates on the fastest growing repos and cool stats about GitHub
            right in your inbox
          </p>

          <form
            className={`${
              subscribe.isSuccess ? "hidden " : ""
            } mt-6 flex flex-col`}
            onSubmit={async (e) => {
              e.preventDefault();
              subscribe.mutate({
                email: email,
                consent: consent,
              });
            }}
          >
            <div className="relative max-w-lg">
              <label className="sr-only" htmlFor="email">
                {" "}
                Email{" "}
              </label>
              <input
                className="w-full rounded-full border-gray-200 bg-gray-100 p-4 pr-32 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                id="email"
                type="email"
                placeholder="Your favorite email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary/75"
                type="submit"
              >
                {subscribe.isLoading ? "Please wait..." : "Subscribe"}
              </button>
            </div>
            <div className="flex flex-row items-center self-center mt-4 gap-1">
              <input
                type="checkbox"
                className="focus:ring-0"
                id="consent"
                checked={consent}
                onChange={() => setConsent(!consent)}
                required
              />
              <p className="text-xs text-center">
                I agree to the storage of my email for the purpose of contacting
                me.
              </p>
            </div>
          </form>

          <p className="text-center text-black font-semibold pt-4">
            {currentMessage}
          </p>
        </div>
      </div>
    </div>
  );
};
