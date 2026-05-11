import { Link } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react"

type BackProps = {
    href: string;
};

export default function Back({
    href,
}: BackProps) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 text-[#99FF33] group transition-all duration-300 mb-12 font-semibold"
        >
            <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-2 font-semibold" />
            Kembali
        </Link>
    )
}