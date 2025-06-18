import { Link } from "react-router";
import { Icons } from "../Icons";
import { siteConfig } from "@/config/site";

export default function Footer() {
    return (
        <footer className="w-full border-t">
            <div className="mx-auto container">
                <section className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                    <section>
                        <Link to='/' className="flex items-center space-x-2">
                            <Icons.logo className="size-7" aria-hidden="true" />
                            <span className="font-bold">{siteConfig.name}</span>
                            <span className="sr-only">Home</span>
                        </Link>
                    </section>
                    <section className="grid grid-cols-2 md:grid-cols-4">

                    </section>
                </section>
            </div>
        </footer>
    )
}
