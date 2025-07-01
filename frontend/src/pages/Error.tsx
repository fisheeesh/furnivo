import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Link } from "react-router";

export default function Error() {
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            {/* <Header /> */}
            <main className="mx-auto flex flex-1 items-center my-32">
                <Card className="w-[350px] md:w-[500px] lg:w-[500px]">
                    <CardHeader className="grid place-items-center gap-2">
                        <div className="border border-dashed border-muted-foreground/70 rounded-full size-24 grid place-items-center mt-2 mb-4">
                            <Icons.exclamation className="size-10 text-muted-foreground/70" aria-hidden="true" />
                        </div>
                        <CardTitle className="text-2xl">Oops!</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            An error occured accidently.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button variant='outline' asChild>
                            <Link to='/'>Go to Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
            {/* <Footer /> */}
        </div>
    )
}
