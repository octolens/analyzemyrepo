import { useSession, signIn } from "next-auth/react";
import HeaderDashboard from "../../components/Headers/HeaderDashboard";
import { FormEvent, useState } from "react";
import { trpc } from "../../utils/trpc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserPlaceHolder = () => {
  return (
    <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 animate-pulse">
      <div className="flex justify-end px-4 pt-4">
        <button
          id="dropdownButton"
          data-dropdown-toggle="dropdown"
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
          </svg>
        </button>
      </div>
      <div className="flex flex-col items-center pb-10">
        <svg
          className="w-24 h-24 text-gray-200 dark:text-gray-700"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          ></path>
        </svg>
        <div className="pb-14 justify-center flex flex-col items-center pt-2">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
          <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
        <div className="inline-flex items-center px-4 text-sm font-medium text-center text-white bg-gray-200 rounded-lg w-48 h-10"></div>
      </div>
    </div>
  );
};

export default function Page() {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4 py-8 space-y-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            Sign in to your account
          </h1>
          <div className="flex flex-col items-center justify-center w-full space-y-4">
            <button
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <span>Sign in with GitHub</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderDashboard />
      {status == "loading" ? (
        <div className="flex justify-center p-10">
          <UserPlaceHolder />
        </div>
      ) : (
        <main className="flex justify-center p-10">
          <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-end px-4 pt-4">
              <button
                id="dropdownButton"
                data-dropdown-toggle="dropdown"
                className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                type="button"
              >
                <span className="sr-only">Open dropdown</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center pb-10">
              <img
                className="mb-3 w-24 h-24 rounded-full shadow-lg"
                src={session?.user?.image as string}
                alt="User Image"
              />
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {session?.user?.name as string}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Github User
              </span>
              <div className="flex mt-4 space-x-3 md:mt-6">
                <a
                  className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-black focus:ring-4 focus:outline-none"
                  onClick={() => setOpen(!open)}
                >
                  {open ? "Close" : "Request to parse a repo"}
                </a>
              </div>
              {open ? <AdditionalInfo /> : null}
            </div>
          </div>
        </main>
      )}
    </>
  );
}

const AdditionalInfo = () => {
  const [repo, setRepo] = useState("");
  const { data: session } = useSession();
  const mutation = trpc.useMutation(["postgres.add_parse_request"]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // we know for sure there is a user because code in Page checked that
    mutation.mutate({
      full_name: repo,
      user_id: session?.user?.id as string,
    });

    toast("Request submitted succesfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="mr-auto ml-5 pt-5">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Repo name
          </label>
          <input
            type="text"
            id="repo"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-black block w-72 p-2.5"
            placeholder="CrowdDotDev/crowd.dev"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            required
          />
          <p
            id="helper-text-explanation"
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            Insert a repo in a format <b>organization/name</b>
          </p>
        </div>
        <button
          type="submit"
          className="text-white bg-primary hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};
