import { LoaderIcon } from "lucide-react";

const Loading = () => (
  <div className="flex justify-center items-center h-40">
    <LoaderIcon className="animate-spin mr-2" />
    <span className="text-lg">Loading...</span>
  </div>
);

export default Loading;
