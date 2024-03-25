import Image from "next/image";

const About = () => {
  return (
    <div className="bg-slate-900 h-full w-screen text-white p-8">
      <h1 className="text-5xl flex-row h-20 font-bold hidden md:flex">
        Dashboard | What will you build today?
      </h1>
      <main className="flex flex-col space-y-14">
        <div className="flex flex-col border-b border-1 border-[gray] space-y-6 pb-5">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            Features
          </h1>
          <div className="flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-5">
            <div className="flex flex-col space-y-2 md:space-y-4">
              <span className="text-base md:text-lg xl:text-xl">
                A simplified and clean user interface. <br />A myriad of
                features, including but not limited to:
              </span>
              <span className="text-base md:text-lg xl:text-xl">
                (1) an AI tool to write reports and paraphrasing
                <br />
                (2) a convenient online meet <br />
                (3) a work organisation system
                <br />
                (4) a citation generator
                <br />
                (5) a project and assignment management tool (for teachers,
                group leaders & group members)
                <br />
                (6) A centralised communication tool, and quick channels of
                communication, between students and teachers <br />
              </span>
            </div>
            <Image
              src="https://help.nflxext.com/396a2a39-8d34-4260-b07a-6391fe04ded5_what_is_netflix_2_en.png"
              alt="zkflix-next"
              width={1000}
              height={600}
              unoptimized
            />
          </div>
        </div>
        <div className="flex flex-col border-b border-1 border-[gray] space-y-6 pb-5">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            How do you use Project TaskCraft?
          </h1>
          <div className="flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-5">
            <div className="flex flex-col space-y-2 md:space-y-4">
              <span className="text-base md:text-lg xl:text-xl">
                1. [For group leaders] Click “create new project on the
                homepage”. <br />
                2. Invite members to the project by entering their name.
                <br />
                3. Team Members accept invite.
                <br />
                4. [For Group Leaders] Enter project descriptions for AI to
                generate a customisable list of tasks.
                <br />
                5. AI will set difficulty for each task and assign it to members
                once finalised by group leader.
                <br />
                6. Group leader may enter strengths / weaknesses of each member
                for AI to assign tasks.
                <br />
                7. Group members can submit work evidence as proof of
                completion.
                <br />
              </span>
            </div>
            <Image
              src="https://help.nflxext.com/7ac9b493-ae69-431a-923d-3cb8a79d7e63_what_is_netflix_3_en.png"
              alt="zkflix-next"
              width={1000}
              height={600}
              unoptimized
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
