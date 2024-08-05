import Image from "next/image";
import Link from "next/link";

const NotFound404Page = () => {
  return (
    <div className="min-h-screen pt-24 lg:pt-0 flex flex-col lg:flex-row -space-y-24 sm:space-y-0 justify-between">
      <div className="w-full h-full lg:min-h-screen flex flex-col space-y-3 md:space-y-5 items-center lg:items-start px-16 lg:px-28 lg:pt-10 justify-center">
        <h1 className="font-bold text-center lg:text-left text-4xl md:text-5xl lg:text-6xl uppercase border-b-[6px] border-white pb-1">
          404 Not Found.
        </h1>
        <p className="text-xl md:text-2xl xl:text-3xl text-center lg:text-left xl:max-w-[70%]">
          Congrats, you found our hidden mascot catgirls/catgirl that can only be found
          on this page!
        </p>

        <Link
          className="button-primary w-full text-center xl:max-w-[70%]"
          href="/"
        >
          Go Home
        </Link>
      </div>
      <div className="w-full lg:w-[85%] min-h-[60vh] sm:min-h-screen lg:h-auto -z-10 flex items-end justify-center">
        <Image
          src="/imgs/catgirls/catgirl404.png"
          alt=""
          width={100}
          height={100}
          className="w-full opacity-80"
          unoptimized
        />
      </div>
    </div>
  );
};

export default NotFound404Page;
