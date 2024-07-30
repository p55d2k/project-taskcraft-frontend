import { AiOutlineLoading } from "react-icons/ai";

const Loading = ({ loading }: { loading: boolean }) => {
  if (!loading) return null;
  return (
    <div className="loading-parent">
      <AiOutlineLoading className="text-white text-6xl animate-spin" />
    </div>
  );
};

export default Loading;
