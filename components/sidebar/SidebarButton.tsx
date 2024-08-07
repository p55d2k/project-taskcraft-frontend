import { IconType } from "react-icons";

interface SidebarButtonProps {
  onClick: () => void;
  Icon: IconType;
  text: string;
}

const SidebarButton = ({
  onClick,
  Icon,
  text,
}: SidebarButtonProps): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className="flex items-center space-x-3 cursor-pointer p-2 px-3 bg-transparent text-white hover:bg-[#1f1f1f] transition-all duration-300 ease-in-out"
    >
      <Icon size={24} />
      <p className="text-white">{text}</p>
    </div>
  );
};

export default SidebarButton;
