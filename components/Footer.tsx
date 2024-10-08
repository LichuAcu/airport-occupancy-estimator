export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with ❤️ by{" "}
          <a
            href="https://v0.dev/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            v0
          </a>
          {" and "}
          <a
            href="https://github.com/LichuAcu"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            LichuAcu
          </a>
        </p>
      </div>
    </footer>
  );
}
