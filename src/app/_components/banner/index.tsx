import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function Banner() {
  return (
    <aside className="w-full bg-secondary md:h-10 text-sm text-secondary-foreground font-medium flex max-[430px]:flex-col md:items-center justify-center gap-2 md:gap-4 py-2 px-4">
      <h2 className="bg-background/20 rounded-full py-1 px-3 max-md:hidden">
        New
      </h2>
      <p className="font-normal">
        Join our Telegram to get update about our governance token,{" "}
        <span className="font-medium">$SWAIP</span>
      </p>
      <Link
        href="https://t.me/SwaipInfo"
        className="bg-background/20 rounded-full py-1 px-3 flex items-center gap-2 group max-w-fit"
      >
        <span>Telegram</span>
        <ArrowRight className="size-4 group-hover:ml-2 duration-300" />
      </Link>
    </aside>
  );
}
