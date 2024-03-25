import Image from "next/image";

const About = () => {
  return (
    <div className="bg-slate-900 h-full w-screen text-white p-8">
      <h1 className="text-5xl flex-row h-20 font-bold flex">
        Feedback for Project TaskCraft
      </h1>
      <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdbfEWKjcVJAZeJ6Y7FNPH5H7HQHZDczJd-rAihO4RQ6aYB_w/viewform?embedded=true" width="640" height="847">Loading…</iframe>
    </div>
  );
};

export default About;
