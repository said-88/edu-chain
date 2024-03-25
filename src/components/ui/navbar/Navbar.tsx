import { ThemeToggle } from "@/components/ui"
import Link from "next/link"
import { siteConfig } from "@/lib/site"
import { buttonVariants } from "@/components/ui"
import { Icons } from "@/components/ui/navbar/icons"
import { ConnectButton } from "@rainbow-me/rainbowkit"


export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
    <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
      <Link href={"/admin"}>
            <span className="font-extrabold text-2xl">Admin</span>
      </Link>
      <div className="flex flex-1 items-center justify-end space-x-4">
        <nav className="flex items-center space-x-1">
          <span className="pr-2">
            <ConnectButton/>
          </span>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </div>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </div>
  </header>
  )
}
