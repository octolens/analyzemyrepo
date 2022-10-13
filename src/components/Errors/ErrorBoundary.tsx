import React from "react";
import Header from "../Headers/NewHeader";
import Router from "next/router";

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className="flex flex-col flex-grow items-center justify-center gap-4">
          <h2 className="text-3xl font-extrabold">
            Seems like this repo does not exist
          </h2>
          <button
            type="button"
            className="px-5 py-2.5 text-sm mr-3 md:mr-0 font-medium text-white bg-black rounded-md shadow"
            onClick={() => {
              Router.push("/");
            }}
          >
            Go to the main page
          </button>
        </main>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
