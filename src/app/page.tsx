import { logout } from "./logout/actions";
import { createClient } from "../../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (!data.session) {
    redirect('/login');
  }
  return (
    <div>
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
