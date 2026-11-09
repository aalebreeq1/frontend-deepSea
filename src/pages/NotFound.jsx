import { Button } from "@heroui/react";
import { Link, useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  }

  return (
    <main
      aria-labelledby="not-found-heading"
      className="grid min-h-[calc(100svh-4rem)] place-items-center bg-background px-6 py-16 text-foreground"
    >
      <div className="flex max-w-lg flex-col items-center gap-6 text-center">
        <p className="text-8xl font-bold tracking-tight text-accent sm:text-9xl">
          404
        </p>

        <h1 id="not-found-heading" className="text-3xl font-semibold sm:text-4xl">
          Page not found
        </h1>

        <p className="text-base leading-relaxed text-muted">
          Lost at sea? The page you are looking for does not exist or has moved.
          Head back to the surface to continue exploring.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-5 font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Back to Home
          </Link>

          <Button variant="secondary" onPress={handleBack}>
            Go Back
          </Button>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
