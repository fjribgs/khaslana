import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
    size?: "sm" | "md";
    text?: string;
    className?: string;
}

export default function VerifiedBadge({
    size = "sm",
    text = "UMKM Terverifikasi",
}: Props) {
    const iconSize = size === "sm" ? 14 : 18;
    const textClass =
        size === "sm"
            ? "text-xs"
            : "text-sm";

    return (
        <Badge
            variant="outline"
            className="
                inline-flex items-center gap-1.5
                rounded-full
                border-[#99FF33]
                bg-[#99FF33]/10
                px-2.5 py-1
                font-medium text-[#99FF33]
                hover:bg-[#99FF33]/10
                cursor-default
            "
        >
            <ShieldCheck
                size={iconSize}
                className="text-[#99FF33]"
            />
           <span className={textClass}>
                {text}
            </span>
        </Badge>
    );
}