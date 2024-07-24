import { kanit } from "@/utils/fonts";
import { doesUserExist } from "@/utils/users";
import useAuth from "@/hooks/useAuth";

import { IoIosArrowBack } from "react-icons/io";
import { IoAdd } from "react-icons/io5";

import { useState, useEffect } from "react";
import Image from "next/image";

interface NewTaskPage3Props {
  mentors: string[];
  members: string[];
  error: string;
  setMentors: (name: string[]) => void;
  setError: (error: string) => void;
  goBack: () => void;
  setNext: () => void;
}

const NewTaskPage3 = ({
  mentors,
  members,
  error,
  setMentors,
  setError,
  goBack,
  setNext,
}: NewTaskPage3Props) => {
  const [trySubmit, setTrySubmit] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!trySubmit) return;

    async function attemptNext() {
      for (const mentor of mentors) {
        if (mentor === "") {
          setError("Please fill in all the fields");
          setTrySubmit(false);
          return;
        }

        if (members.includes(mentor)) {
          setError("A member cannot be a mentor");
          setTrySubmit(false);
          return;
        }

        const exists = await doesUserExist(mentor);
        if (!exists) {
          setError(`User with ID "${mentor}" does not exist`);
          setTrySubmit(false);
          return;
        }

        if (mentor === user?.uid) {
          setError("You cannot mentor yourself");
          setTrySubmit(false);
          return;
        }
      }

      setTrySubmit(false);
      setNext();
    }

    attemptNext();
  }, [trySubmit]);

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row space-y-44 lg:space-y-0 py-12 lg:py-0 justify-between">
      <div className="w-full flex flex-col items-center lg:items-start justify-center px-8 lg:px-28 pb-24 lg:pb-0">
        <p className="flex items-center justify-center text-lg text-center lg:text-left lg:pl-1 font-semibold text-gray-400">
          Step 3 of 3
        </p>
        <p
          className={`text-xl md:text-2xl xl:text-3xl text-center lg:text-left lg:pl-1 ${kanit.className} font-semibold`}
        >
          Who should mentor this project?
        </p>
        <p
          className={`md:text-lg xl:text-xl font-extralight text-center lg:text-left lg:pl-1 ${kanit.className}`}
        >
          Please enter the user IDs of the people you would like to mentor this
          project. Alternatively, you can leave this blank.
        </p>
        <div className="flex flex-col space-y-2 mt-3 w-full">
          {mentors.map((mentor, index) => (
            <div key={index} className="flex items-center space-x-5 w-full">
              <input
                type="text"
                className="input-field text-lg w-full"
                value={mentor}
                onChange={(e) =>
                  setMentors(
                    mentors.map((m, i) => (i === index ? e.target.value : m))
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") setTrySubmit(true);
                }}
              />
              <button
                className="bg-red-500 hover:bg-red-600 py-2 px-3 border-none button !w-auto -mb-3"
                onClick={() => {
                  setError("");
                  setMentors(mentors.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <div className="flex flex-col w-full space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 pt-3">
          <button className="button-secondary creation-buttons" onClick={goBack}>
            <IoIosArrowBack size={20} />
            Back
          </button>
          <button
            className={`${
              mentors.length === 10 ? "button-disabled" : "button-safe"
            } creation-buttons`}
            onClick={() => {
              if (mentors.length === 10) return;
              setMentors([...mentors, ""]);
            }}
          >
            <IoAdd size={20} />
            Add
          </button>
          <button
            className="button-primary creation-buttons"
            onClick={() => setTrySubmit(true)}
          >
            Next
          </button>
        </div>
      </div>
      <div className="w-full lg:w-[85%] min-h-[50vh] sm:min-h-screen lg:h-auto -z-10 flex items-end justify-center">
        <Image
          src="/imgs/catgirl3.png"
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

export default NewTaskPage3;
