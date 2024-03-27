import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <div className="bg-slate-900 h-screen md:h-full w-full text-white p-8 flex flex-col space-y-3 md:items-center">
      <h1 className="text-5xl flex-row font-bold flex">
        Feedback for Project TaskCraft
      </h1>
      <div className="hidden md:flex">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSdbfEWKjcVJAZeJ6Y7FNPH5H7HQHZDczJd-rAihO4RQ6aYB_w/viewform?embedded=true"
          width="640"
          height="847"
        >
          Loading…
        </iframe>
      </div>
      <div className="flex md:hidden">
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLSdbfEWKjcVJAZeJ6Y7FNPH5H7HQHZDczJd-rAihO4RQ6aYB_w/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl text-blue-500 underline hover:text-blue-300 transition ease-in-out duration-300"
        >
          Link to Feedback Form
        </Link>
      </div>
    </div>
  );
};

export default About;
