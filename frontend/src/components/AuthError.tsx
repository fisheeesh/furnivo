export default function AuthError({ text, ...props }: { text: string | undefined } & React.ComponentProps<"p">) {
    return (
        <p className='text-red-600 w-full bg-red-200 text-center p-1.5 text-sm' {...props}>
            {text}
        </p>
    )
}
