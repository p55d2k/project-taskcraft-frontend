"use client";

import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  router.push("/projects");
  return <Loading loading />;
};

export default HomePage;
