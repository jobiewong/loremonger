import packageJson from "~/../package.json";

export function Header() {
  return (
    <header className="h-(--header-height) flex items-center justify-between border-b px-4">
      <h3 className="font-semibold text-pink-500">
        Loremonger{" "}
        <span className="text-muted-foreground font-normal">
          {packageJson.version}
        </span>
      </h3>
    </header>
  );
}
