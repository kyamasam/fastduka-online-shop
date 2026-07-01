import { Home } from "lucide-react"
import Link from "next/link"

interface BreadCrumbsMenu {
    label: string,
    link?: string
}
interface BreadcrumbProps {
    title?: string

    menu?: BreadCrumbsMenu[]
}
function Breadcrumbs({ title = "", menu = [] }: BreadcrumbProps) {
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
                    {menu.length > 0 && (
                        <>
                            {menu.map(item => (
                                <>
                                    <span>•</span>
                                    <Link href={`/${item?.link}`} className="flex items-center hover:text-gray-900">
                                        <span>{item?.label}</span>
                                    </Link>
                                </>
                            ))}
                        </>
                    )}

                </div>
            </div >
        </div>
    )
}

export default Breadcrumbs