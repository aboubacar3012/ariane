import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { redirect } from "next/navigation";
import WelcomePage from "../components/WelcomePage";

export default async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <WelcomePage />;
  }

  console.log("Session", session);

  redirect("/environment");
  // return (
  //   <div>
  //     <h1>Welcome {session.user.name}</h1>
  //   </div>
  // );
}
