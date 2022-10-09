import Link from "next/link";

const HeaderDashboard = () => {
  return (
    <>
      <header className="bg-neutral border border-solid border-b-black shadow">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-screen-xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <Link href="/">
                <a className="block text-primary font-bold text-xl">
                  <span className="sr-only">Home</span>
                  repoanalyzer.com
                </a>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderDashboard;
