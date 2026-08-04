import Heading from "@/components/heading";
import type { UmkmData } from "@/types/umkm";

interface SuperadminIndexProps {
    requestedUmkm: UmkmData[];
}

export default function SuperadminIndex({
    requestedUmkm,
}: SuperadminIndexProps) {
    console.log(requestedUmkm);
    
    return (
        <div className="space-y-6">
            <Heading
                variant="default"
                title="Daftar Verifikasi UMKM"
                description="Daftar UMKM yang mengajukan verifikasi data diri lanjutan"
            />
        </div>
    )
}