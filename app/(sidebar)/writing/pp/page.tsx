"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardWrapper from "@/components/DashboardWrapper";
import { Textarea } from "@/components/ui/textarea";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { useState } from "react";
import toast from "react-hot-toast";

import { paraphrase } from "@/utils/paraphrase";
import { OpenAIResponse } from "@/openai";

const ParapharasePage = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [toParaphrase, setToParaphrase] = useState<string>("");
  const [response, setResponse] = useState<string>();

  const handleParaphrase = async () => {
    if (!toParaphrase) {
      toast.error("Please enter text to paraphrase.");
      return;
    }

    if (toParaphrase.length > 2000) {
      toast.error("Text must be less than 2000 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await paraphrase(toParaphrase);

      if (data) {
        setResponse(data.choices[0].message.content);
        setDialogOpen(true);
      } else {
        toast.error("Error generating paraphrased text.");
      }
    } catch (error) {
      toast.error("Error generating paraphrased text.");
      console.error("Error generating paraphrased text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper loading={loading} pageName="Paraphrase Tool">
      <div className="flex flex-col space-y-8 divide-y-2 divide-[gray] pt-4 md:pt-6">
        <section className="flex flex-col space-y-4">
          <h3 className="font-bold text-lg md:text-xl lg:text-2xl">
            Paraphrase Text
          </h3>

          <Textarea
            disabled={loading}
            className="text-lg w-full h-96 bg-dark-1 focus:ring-0 focus:outline-none"
            placeholder="Text to paraphrase"
            value={toParaphrase}
            onChange={(e) => setToParaphrase(e.target.value)}
          />

          <button
            onClick={handleParaphrase}
            className="button-primary w-full text-center"
          >
            Paraphrase
          </button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  Paraphrased Text
                </DialogTitle>
                <DialogDescription className="text-sm md:text-base pb-2">
                  {response
                    ? `Generated Text: ${response}`
                    : "No response generated."}
                </DialogDescription>

                <button
                  className="button-safe py-2"
                  onClick={() => {
                    navigator.clipboard.writeText(response || "");
                    toast.success("Text copied to clipboard!");
                  }}
                >
                  Copy Text
                </button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </DashboardWrapper>
  );
};

export default ParapharasePage;
