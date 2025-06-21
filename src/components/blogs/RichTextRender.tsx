import Dompurify from "dompurify"
import type React from "react"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    content: string
}

export default function RichTextRender({ content, className }: Props) {
    const sanitizedContent = Dompurify.sanitize(content)

    return (
        // * When we want to run html code in jsx, it is dangerous but we have sanitized
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} className={className} />
    )
}
