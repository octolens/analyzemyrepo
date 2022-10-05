import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
      <p>Email: {session?.user?.email}</p>
      <p>Name: {session?.user?.name}</p>
      <p>Image: {session?.user?.image}</p>
    </>
  );
}
