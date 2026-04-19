import { LoaderCircle } from "lucide-react";

export const Loader = ({ size = "md", message = "Loading data..." }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <LoaderCircle className={`${sizes[size]} animate-spin text-accentRed`} />
      {message ? <p className="text-sm text-whiteMuted">{message}</p> : null}
    </div>
  );
};

export const FullPageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="f1-card min-w-[260px]">
        <Loader size="lg" message={message} />
      </div>
    </div>
  );
};

export default Loader;

