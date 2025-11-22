export function DotsPattern({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="w-full h-full bg-repeat dots-background" {...props} />;
}
