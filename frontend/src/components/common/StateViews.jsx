import { AlertTriangle, Inbox } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import Loader from "./Loader";

export const LoadingState = ({ message }) => {
  return (
    <Card hover={false} className="flex items-center justify-center min-h-[220px]">
      <Loader size="lg" message={message || "Loading..."} />
    </Card>
  );
};

export const EmptyState = ({ title = "No data available", description = "Try adjusting filters." }) => {
  return (
    <Card hover={false} className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
      <Inbox className="h-8 w-8 text-whiteMuted" />
      <p className="text-base font-semibold text-whitePrimary">{title}</p>
      <p className="max-w-md text-sm text-whiteMuted">{description}</p>
    </Card>
  );
};

export const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card hover={false} className="border-accentRed/40 bg-accentRed/10">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-accentRed" />
        <div className="flex-1">
          <p className="font-semibold text-whitePrimary">Request failed</p>
          <p className="mt-1 text-sm text-whiteMuted">{message}</p>
          {onRetry ? (
            <Button className="mt-3" variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

