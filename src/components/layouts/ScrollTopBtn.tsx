import { useEffect, useState } from "react";
import { Icons } from "../Icons";
import { Button } from "../ui/button";

export default function ScrollTopBtn() {
    const [showBtn, setShowBtn] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowBtn(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
    return (
        <Button
            variant='outline'
            onClick={scrollToTop}
            type="button"
            id="to-top"
            size='icon'
            className={`${showBtn ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}  outline-none cursor-pointer border  rounded-full flex fixed bottom-5 right-5 z-50 items-center justify-center`}>
            <Icons.up className="size-5" />
        </Button>
    )
}
