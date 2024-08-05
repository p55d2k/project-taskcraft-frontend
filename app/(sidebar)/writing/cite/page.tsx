"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import DashboardWrapper from "@/components/DashboardWrapper";
import { Input } from "@/components/ui/input";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { useState } from "react";
import toast from "react-hot-toast";

import {
  getAPAWebsiteCitation,
  getAPAWebsiteInTextCitation,
  WebsiteCitation,
} from "@/utils/citation";

const defaultValues: WebsiteCitation = {
  url: "",
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  year: "",
};

const CitePage = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const [websiteCitationData, setWebsiteCitationData] =
    useState<WebsiteCitation>(defaultValues);
  const [finishedCitation, setFinishedCitation] = useState<string>();
  const [finishedInTextCitation, setFinishedInTextCitation] =
    useState<string>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <DashboardWrapper loading={loading} pageName="Citation Generator">
      <div className="flex flex-col space-y-8 divide-y-2 divide-[gray] pt-4 md:pt-6">
        <section className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <h3 className="font-bold text-lg md:text-xl lg:text-2xl">
              Website Information
            </h3>
            <p className="text-[gray] text-sm md:text-base lg:text-lg">
              Fields marked with <span className="text-red-500">*</span> are
              required. Please leave any fields you do not have information for
              blank.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <label className="inline-block w-full">
              <span className="font-semibold">
                URL <span className="text-red-500">*</span>
              </span>
              <Input
                disabled={loading}
                className="text-lg"
                placeholder="https://example.com"
                value={websiteCitationData.url}
                onChange={(e) =>
                  setWebsiteCitationData({
                    ...websiteCitationData,
                    url: e.target.value,
                  })
                }
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">
                Website Title <span className="text-red-500">*</span>
              </span>
              <Input
                disabled={loading}
                className="text-lg"
                placeholder="Our History of Healthcare"
                value={websiteCitationData.title}
                onChange={(e) => {
                  setWebsiteCitationData({
                    ...websiteCitationData,
                    title: e.target.value,
                  });
                }}
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">
                First Name <span className="text-red-500">*</span>
              </span>
              <Input
                disabled={loading}
                className="text-lg"
                placeholder="J. / John"
                value={websiteCitationData.firstName}
                onChange={(e) => {
                  setWebsiteCitationData({
                    ...websiteCitationData,
                    firstName: e.target.value,
                  });
                }}
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">Middle Name</span>
              <Input
                disabled={loading}
                className="text-lg"
                placeholder="C. / Charles"
                value={websiteCitationData.middleName}
                onChange={(e) => {
                  setWebsiteCitationData({
                    ...websiteCitationData,
                    middleName: e.target.value,
                  });
                }}
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">
                Last Name <span className="text-red-500">*</span>
              </span>
              <Input
                disabled={loading}
                className="text-lg"
                placeholder="Doe"
                value={websiteCitationData.lastName}
                onChange={(e) => {
                  setWebsiteCitationData({
                    ...websiteCitationData,
                    lastName: e.target.value,
                  });
                }}
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">
                Year of Publication <span className="text-red-500">*</span>
              </span>
              <Input
                disabled={loading}
                className="text-lg"
                placeholder="2021"
                value={websiteCitationData.year}
                onChange={(e) => {
                  setWebsiteCitationData({
                    ...websiteCitationData,
                    year: e.target.value,
                  });
                }}
              />
            </label>
          </div>

          <button
            className="button-primary py-2"
            onClick={() => {
              try {
                setLoading(true);

                setFinishedCitation(getAPAWebsiteCitation(websiteCitationData));
                setFinishedInTextCitation(
                  getAPAWebsiteInTextCitation(websiteCitationData)
                );

                setDialogOpen(true);
              } catch (error: any) {
                console.error(error);
                toast.error(
                  error?.message ||
                    "Failed to generate citation. Please try again later."
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            Generate Citation
          </button>

          <button
            className="button-danger py-2"
            onClick={() => {
              setWebsiteCitationData(defaultValues);
              setFinishedCitation(undefined);
            }}
          >
            Reset Fields
          </button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  Citation
                </DialogTitle>
                <DialogDescription className="text-sm md:text-base pb-2">
                  {finishedCitation
                    ? `Generated Citation: ${finishedCitation}`
                    : "No citation generated yet."}
                </DialogDescription>

                <button
                  className="button-safe py-2"
                  onClick={() => {
                    navigator.clipboard.writeText(finishedCitation || "");
                    toast.success("Citation copied to clipboard!");
                  }}
                >
                  Copy Citation
                </button>

                <button
                  className="button-warning py-2"
                  onClick={() => {
                    navigator.clipboard.writeText(finishedInTextCitation || "");
                    toast.success("In-Text Citation copied to clipboard!");
                  }}
                >
                  Copy In-Text Citation
                </button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </DashboardWrapper>
  );
};

export default CitePage;
