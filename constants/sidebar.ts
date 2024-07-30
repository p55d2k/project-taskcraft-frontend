import { FaHome, FaVideo } from "react-icons/fa";
import { IoMdSchool, IoMdSettings, IoIosChatboxes } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";
import { GoArrowSwitch } from "react-icons/go";
import { TbReport, TbReportSearch } from "react-icons/tb";
import { MdTaskAlt } from "react-icons/md";
import { LuBrainCircuit } from "react-icons/lu";
import { IconType } from "react-icons";

export interface SidebarItem {
  text: string;
  icon: IconType;
  link: string;
}

export interface SidebarSectionType {
  name: string;
  items: SidebarItem[];
}

const getSidebarItems = (): SidebarSectionType[] => {
  return [
    {
      name: "quick links",
      items: [
        { text: "Home", icon: FaHome, link: "/dashboard" },
        { text: "Chat", icon: IoIosChatboxes, link: "/chat" },
        { text: "Ask AI", icon: LuBrainCircuit, link: "/ai" },
        { text: "Tasks", icon: MdTaskAlt, link: "/tasks" },
        { text: "Meeting", icon: FaVideo, link: "/meeting" },
      ],
    },
    {
      name: "writing",
      items: [ 
        {
          text: "View Reports",
          icon: TbReportSearch,
          link: "/reports",
        },
        { text: "Write Report", icon: TbReport, link: "/reports/new" },
        { text: "Paraphrase Tool", icon: TfiWrite, link: "/writing/pp" },
        // https://github.com/natsuozawa/citeapa
        { text: "Citation Generator", icon: IoMdSchool, link: "/writing/cite" },
      ],
    },
    {
      name: "management",
      items: [
        { text: "Switch Project", icon: GoArrowSwitch, link: "/projects" },
        {
          text: "Project Settings",
          icon: IoMdSettings,
          link: "/project-settings",
        },
      ],
    },
  ];
};

export default getSidebarItems;
