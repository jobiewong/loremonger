import packageJson from "~/../package.json";

const links = ["File", "Edit", "View", "Help"];

export function Header() {
  return (
    <header className="h-(--header-height) flex items-center justify-between border-b border-black px-4 bg-background">
      <div>
        <div className="flex items-center gap-1 -ml-2">
          {links.map((link) => (
            <button
              key={link}
              className="text-sm font-medium hover:bg-muted px-2 py-0.5 cursor-pointer"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
      <p className="font-semibold text-pink-500 select-none">
        Loremonger{" "}
        <span className="text-muted-foreground font-normal">
          {packageJson.version}
        </span>
      </p>
    </header>
  );
}
