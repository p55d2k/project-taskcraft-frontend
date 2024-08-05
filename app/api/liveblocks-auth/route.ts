import { auth } from "@/firebase";
import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { name } from "@stream-io/video-react-sdk";

export async function POST(request: Request) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get the current user from your database
  const user = {
    id: currentUser.uid,
    info: {
      id: currentUser.uid || "",
      name: currentUser.displayName || "Anonymous",
      email: currentUser.email || "",
      avatar: currentUser.photoURL || "/imgs/pfp.jpg",
      color: getUserColor(currentUser.uid),
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}
