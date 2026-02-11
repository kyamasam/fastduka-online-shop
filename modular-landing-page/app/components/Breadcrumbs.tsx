import { Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbProps {
    child_page_label: string
}
function Breadcrumbs({ child_page_label }: BreadcrumbProps) {
    return (
        <>
            {/* Breadcrumb */}
            < div className="py-4" >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="flex items-center hover:text-gray-900">
                        <Home size={16} className="mr-1" />
                        Home
                    </Link>
                    <span>•</span>
                    <span>{child_page_label}</span>
                </div>
            </div >
        </>
    )
}

export default Breadcrumbs