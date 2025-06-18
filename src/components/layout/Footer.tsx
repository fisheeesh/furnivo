import { Link } from "react-router";
import { Icons } from "../Icons";
import { siteConfig } from "@/config/site";
import NewsLetterForm from "../NewsLetter";

export default function Footer() {
    return (
        <footer className="w-full border-t ml-4 lg:ml-0">
            <div className="mx-auto container pb-8 pt-6 lg:py-6">
                <section className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                    <section>
                        <Link to='/' className="flex items-center space-x-2">
                            <Icons.logo className="size-7" aria-hidden="true" />
                            <span className="font-bold">{siteConfig.name}</span>
                            <span className="sr-only">Home</span>
                        </Link>
                    </section>
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {
                            siteConfig.footerNav.map((foot) => (
                                <div className="space-y-4" key={foot.title}>
                                    <h4 className="font-medium">{foot.title}</h4>
                                    <ul className="space-y-3">
                                        {
                                            foot.items.map(item => (
                                                <li className="" key={item.title}>
                                                    <Link target={item.external ? "_blank" : undefined} className="text-muted-foreground text-sm hover:text-foreground" to={item.href}>
                                                        {item.title}
                                                        <span className="sr-only">{item.title}</span>
                                                    </Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            ))
                        }
                    </section>
                    <section>
                        <NewsLetterForm />
                    </section>
                </section>
            </div>
        </footer>
    )
}
