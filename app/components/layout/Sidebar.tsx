
import { auth } from "@/lib/auth";
import SideNav from "./SideNav";
import SideQuickLike from "./SideQuickLike";


export default async function Sidebar() {
  const session = await auth()
  return (
    <div className="bg-white rounded-lg shadow p-4">
    <SideNav id={session?.user.id} />
    <hr className="my-4" />
    <SideQuickLike/>
    </div>
  );
}
