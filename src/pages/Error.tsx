import Header from "@/components/layout/Header";
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
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="mx-auto flex flex-1 items-center">
                <Card className="w-[350px] md:w-[500px]">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Oops!</CardTitle>
                        <CardDescription className="text-destructive">
                            An error occured accidently.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex-col gap-2">
                        <Button variant='outline' asChild>
                            <Link to='/'>Go to Home</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    )
}
