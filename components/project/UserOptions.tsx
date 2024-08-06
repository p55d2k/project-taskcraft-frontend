import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Role } from "@/types";

import {
  memberLeaveProject,
  mentorLeaveProject,
  transferOwnership,
} from "@/utils/projects";

import { VscSettingsGear } from "react-icons/vsc";
import toast from "react-hot-toast";

interface UserOptionsProps {
  type: Role;
  username: string;
  projectID: string;
  userRole: Role;
  setUserRole: (role: Role) => void;
  className?: string;
}

const UserOptions = ({
  type,
  username,
  projectID,
  userRole,
  setUserRole,
  className,
}: UserOptionsProps) => {
  if (!username) return null;

  return (
    <div className={`flex flex-row items-center justify-between ${className}`}>
      <span
        className={`${
          type === "owner"
            ? "text-blue-1"
            : type === "member"
            ? "text-orange-1"
            : "text-yellow-1"
        } text-lg`}
      >
        {username}
      </span>

      {type !== "owner" &&
        (userRole === "owner" ||
          (userRole === "mentor" && type === "member")) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="glassmorphism p-2 cursor-pointer rounded">
              <VscSettingsGear size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {type === "member" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () => {
                    await memberLeaveProject(projectID, username)
                      .then(() => {
                        toast.success("User has been kicked");
                      })
                      .catch((error) => {
                        console.error(`Failed to kick user: ${error}`);
                        toast.error(`Failed to kick user`);
                      });
                  }}
                >
                  Kick
                </DropdownMenuItem>
              )}

              {type === "member" && userRole === "owner" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () => {
                    await transferOwnership(projectID, username)
                      .then(() => {
                        toast.success("Ownership has been transferred");
                        setUserRole("member");
                      })
                      .catch((error) => {
                        console.error(`Failed to transfer ownership: ${error}`);
                        toast.error("Failed to transfer ownership");
                      });
                  }}
                >
                  Transfer Ownership
                </DropdownMenuItem>
              )}

              {type === "mentor" && userRole === "owner" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () => {
                    await mentorLeaveProject(projectID, username)
                      .then(() => {
                        toast.success("Mentor has been kicked");
                      })
                      .catch((error) => {
                        console.error(`Failed to kick user: ${error}`);
                        toast.error(`Failed to kick user`);
                      });
                  }}
                >
                  Kick
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
    </div>
  );
};

export default UserOptions;
