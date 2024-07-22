import { kanit } from "@/utils/fonts";
import { isUserInProject } from "@/utils/users";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { IoIosArrowBack } from "react-icons/io";
import { IoAdd } from "react-icons/io5";

import { useState, useEffect } from "react";
import Image from "next/image";

interface NewProjectPage2Props {
  assignedTo: string[];
  setAssignedTo: (assignedTo: string[]) => void;
  error: string;
  setError: (error: string) => void;
  goBack: () => void;
  setNext: () => void;
}

const NewProjectPage2 = ({
  assignedTo,
  setAssignedTo,
  error,
  setError,
  goBack,
  setNext,
}: NewProjectPage2Props) => {
  const [trySubmit, setTrySubmit] = useState(false);
  const { projectId } = useData();
  const { user } = useAuth();

  useEffect(() => {
    if (!trySubmit) return;

    async function attemptNext() {
      if (assignedTo.length === 0) {
        setError("Please assign this task to at least one member");
        setTrySubmit(false);
        return;
      }

      for (const assignee of assignedTo) {
        if (assignee === "") {
          setError("Please fill in all the fields");
          setTrySubmit(false);
          return;
        }

        const exists = await isUserInProject(assignee, projectId);
        if (!exists) {
          setError(`User with ID ${assignee} is not in the project`);
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
          Step 2 of 3
        </p>
        <p
          className={`text-xl md:text-2xl xl:text-3xl text-center lg:text-left lg:pl-1 ${kanit.className} font-semibold`}
        >
          Who should do this task?
        </p>
        <p
          className={`md:text-lg xl:text-xl font-extralight text-center lg:text-left lg:pl-1 ${kanit.className}`}
        >
          Please choose the members who should be assigned to this task.
        </p>
        <div className="flex flex-col space-y-2 mt-3 w-full">
          {assignedTo.map((member, index) => (
            <div key={index} className="flex items-center space-x-5 w-full">
              <input
                type="text"
                className="input-field text-lg w-full"
                value={member}
                onChange={(e) =>
                  setAssignedTo(
                    assignedTo.map((m, i) => (i === index ? e.target.value : m))
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
                  setAssignedTo(assignedTo.filter((_, i) => i !== index));
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <div className="flex flex-col w-full space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 pt-3">
          <button
            className="button-secondary creation-buttons"
            onClick={goBack}
          >
            <IoIosArrowBack size={20} />
            Back
          </button>
          <button
            className={`button-safe creation-buttons`}
            onClick={() => {
              if (assignedTo.length === 3) return;
              setAssignedTo([...assignedTo, ""]);
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
          src="/imgs/catgirl2.png"
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

export default NewProjectPage2;
