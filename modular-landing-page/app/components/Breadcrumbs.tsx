import { Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbProps {
    child_page_label: string
    title?: string
    child_page_label2?: string
}
function Breadcrumbs({ title = "", child_page_label, child_page_label2 }: BreadcrumbProps) {
    return (
        <div className="py-4">
            {title !== "" && <h1 style={{}} className="text-3xl font-bold">{title}</h1>}
            {/* Breadcrumb */}
            < div className="py-4" >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="flex items-center hover:text-gray-900">
                        <Home size={16} className="mr-1" />
                        Home
                    </Link>
                    <span>•</span>
                    <span>{child_page_label}</span>
                    {child_page_label2 !== null &&
                        <>
                            <span>•</span>
                            <span>{child_page_label2}</span>
                        </>
                    }
                </div>
            </div >
        </div>
    )
}

export default Breadcrumbs