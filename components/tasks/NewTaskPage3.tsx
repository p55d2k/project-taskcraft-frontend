import { kanit } from "@/utils/fonts";

import { IoIosArrowBack } from "react-icons/io";

import { useState, useEffect } from "react";
import Image from "next/image";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material";

import dayjs, { Dayjs } from "dayjs";

interface NewTaskPage3Props {
  date: number;
  setDate: (date: number) => void;
  error: string;
  setError: (error: string) => void;
  goBack: () => void;
  setNext: () => void;
}

const lightTheme = createTheme({
  palette: {
    mode: "light", // Switches the theme to light mode
  },
});

const NewTaskPage3 = ({
  date,
  setDate,
  error,
  setError,
  goBack,
  setNext,
}: NewTaskPage3Props) => {
  const [trySubmit, setTrySubmit] = useState(false);
  const [rawDate, setRawDate] = useState<Dayjs | null>(dayjs(date));

  useEffect(() => {
    if (!trySubmit) return;

    (async () => {
      if (!rawDate) return;
      const now = dayjs();

      if (rawDate.isBefore(now)) {
        setError("Please enter a date in the future.");
        setTrySubmit(false);
        return;
      }

      setDate(rawDate.toDate().getTime());

      setTrySubmit(false);
      setNext();
    })();
  }, [trySubmit]);

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row space-y-44 lg:space-y-0 py-12 lg:py-0 justify-between bg-black">
      <div className="w-full flex flex-col items-center lg:items-start justify-center px-8 lg:px-28 pb-24 lg:pb-0">
        <p className="flex items-center justify-center text-lg text-center lg:text-left lg:pl-1 font-semibold text-gray-400">
          Step 3 of 3
        </p>
        <p
          className={`text-xl md:text-2xl xl:text-3xl text-center lg:text-left lg:pl-1 ${kanit.className} font-semibold`}
        >
          When should this task be completed by?
        </p>
        <p
          className={`md:text-lg xl:text-xl font-extralight text-center lg:text-left lg:pl-1 ${kanit.className} pb-4`}
        >
          Please enter the due date for this task.
        </p>
        <ThemeProvider theme={lightTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="w-full !hidden lg:!flex"
              slotProps={{
                textField: {
                  sx: {
                    backgroundColor: "#fff",
                    outline: "none",
                    borderRadius: "0.25rem",
                  },
                },
              }}
              format="DD/MM/YYYY"
              value={rawDate}
              onChange={(date) => setRawDate(date)}
            />
            <MobileDatePicker
              className="w-full !flex lg:!hidden"
              slotProps={{
                textField: {
                  sx: {
                    backgroundColor: "#fff",
                    outline: "none",
                    borderRadius: "0.25rem",
                  },
                },
              }}
              format="DD/MM/YYYY"
              value={rawDate}
              onChange={(date) => setRawDate(date)}
            />
          </LocalizationProvider>
        </ThemeProvider>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <div className="flex flex-col w-full space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 pt-3">
          <button
            className="button-danger creation-buttons"
            onClick={goBack}
          >
            <IoIosArrowBack size={20} />
            Back
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
