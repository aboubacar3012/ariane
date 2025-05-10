import { headers } from "next/headers";
import { auth } from "../lib/auth";
import WelcomePage from "../components/WelcomePage";
import { redirect } from "next/navigation";

export default async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <WelcomePage />;
  }

  redirect("/environment");
  // return (
  //   <div>
  //     <h1>Welcome {session.user.name}</h1>
  //   </div>
  // );
}
