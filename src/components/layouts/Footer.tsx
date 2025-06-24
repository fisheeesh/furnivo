import { siteConfig } from "@/config/site";
import { Link } from "react-router";
import Logo from "../Logo";
import NewsLetterForm from "../NewsLetter";

export default function Footer() {
    return (
        <footer className="w-full border-t px-4 ">
            <div className="mx-auto container pb-8 pt-6 lg:py-6">
                <section className="flex flex-col xl:flex-row gap-10 lg:gap-20 lg:justify-between">
                    <section>
                        <Logo />
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
                    <section className="space-y-4">
                        <h4 className="font-medium">Subscribe to our newsletter</h4>
                        <NewsLetterForm />
                    </section>
                </section>
            </div>
        </footer>
    )
}
