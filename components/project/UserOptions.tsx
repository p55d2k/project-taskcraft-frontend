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
  userID: string;
  projectID: string;
  userRole: Role;
  setUserRole: (role: Role) => void;
  mentorNames?: string[];
  setMentorNames?: (names: string[]) => void;
  className?: string;
}

const UserOptions = ({
  type,
  username,
  userID,
  projectID,
  userRole,
  setUserRole,
  mentorNames,
  setMentorNames,
  className,
}: UserOptionsProps) => {
  if (!username || !userID) return null;

  return (
    <div className={`flex flex-row items-center justify-between ${className}`}>
      <div className="flex flex-row gap-1">
        <span
          className={`${
            type === "owner"
              ? "text-blue-1"
              : type === "member"
              ? "text-purple-1"
              : "text-yellow-1"
          } text-lg`}
        >
          {username}
        </span>
        <span className="text-[gray] text-lg">({userID})</span>
      </div>

      {type !== "owner" && userRole !== "member" && (
        <DropdownMenu>
          <DropdownMenuTrigger className="glassmorphism p-2 cursor-pointer rounded">
            <VscSettingsGear size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {type === "member" &&
              (userRole === "owner" || userRole === "mentor") && (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      await memberLeaveProject(projectID, userID)
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
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      await transferOwnership(projectID, userID)
                        .then(() => {
                          toast.success("Ownership has been transferred");
                          setUserRole("member");
                        })
                        .catch((error) => {
                          console.error(
                            `Failed to transfer ownership: ${error}`
                          );
                          toast.error("Failed to transfer ownership");
                        });
                    }}
                  >
                    Transfer Ownership
                  </DropdownMenuItem>
                </>
              )}

            {type === "mentor" && userRole === "owner" && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () => {
                    await mentorLeaveProject(projectID, userID)
                      .then(() => {
                        toast.success("Mentor has been kicked");
                        setMentorNames?.(
                          mentorNames?.filter((name) => name !== username) || []
                        );
                      })
                      .catch((error) => {
                        console.error(`Failed to kick user: ${error}`);
                        toast.error(`Failed to kick user`);
                      });
                  }}
                >
                  Kick
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserOptions;
