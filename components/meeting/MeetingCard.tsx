import Image from "next/image";

interface MeetingCardProps {
  img: string;
  title: string;
  description: string;
  className?: string;
  handleClick: () => void;
}

const MeetingCard = ({
  img,
  title,
  description,
  className,
  handleClick,
}: MeetingCardProps) => {
  return (
    <div
      className={`${className} px-4 py-6 flex flex-col justify-between w-full xl:mx-w-[270px] min-h-[260px] rounded-xl cursor-pointer border-2 border-transparent hover:border-white ease-in-out transition-all duration-400`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center glassmorphism size-12 rounded-lg">
        <Image src={img} alt="meeting" width={27} height={27} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </div>
  );
};

export default MeetingCard;
