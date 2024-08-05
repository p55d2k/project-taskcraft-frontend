import Image from "next/image";
import Link from "next/link";

const DocHeader = ({ children, className }: HeaderProps) => {
  return (
    <div className={`header ${className}`}>
      <Link
        href="/docs"
        className="md:flex-1 flex flex-row items-center w-full"
      >
        <Image
          unoptimized
          src="/assets/icons/logo-icon.svg"
          alt="ZKDocs"
          width={40}
          height={40}
          className="hidden md:block"
        />
        <span className="text-white pl-2 text-2xl font-bold hidden md:block">
          TaskCraft Docs
        </span>

        <Image
          unoptimized
          src="/assets/icons/logo-icon.svg"
          alt="ZKDocs"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        />
      </Link>

      {children}
    </div>
  );
};

export default DocHeader;
