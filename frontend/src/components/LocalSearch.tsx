import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useSearchParams } from 'react-router'

export default function LcoalSearch() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('query') || '')

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query) {
                searchParams.set('query', query)
                setSearchParams(searchParams)
            } else {
                searchParams.delete('query')
                setSearchParams(searchParams)
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [query, searchParams, setSearchParams])

    return (
        <Input
            type="search"
            value={query}
            placeholder="Search..."
            className='w-full md:w-[300px] min-h-[40px]'
            onChange={(e) => setQuery(e.target.value)}
        />
    )
}
