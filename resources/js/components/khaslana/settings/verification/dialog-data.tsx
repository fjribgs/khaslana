import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { UmkmData } from "@/types/umkm";
import { X } from "lucide-react";

interface DialogDataProps {
    open: boolean;
    onClose: () => void;
    umkmData: UmkmData;
}

export default function DialogData({
    umkmData,
    open,
    onClose,
}: DialogDataProps) {
    if (!open) return;

    return (
        <div
            className="
                fixed inset-0
                bg-black/80
                backdrop-blur-sm
                flex items-center justify-center
                px-4 z-50
            "
        >
            <div
                className="
                    w-full max-w-2xl
                    bg-[#131313]
                    border border-[#99ff33]/20
                    rounded-3xl
                    p-8 relative
                    shadow-[0_0_40px_rgba(153,255,51,0.15)]
                "
            >
                <div
                    onClick={onClose}
                    className="
                        absolute top-2 right-2
                        p-2 bg-transparent
                        rounded-3xl
                        cursor-pointer group
                        hover:bg-red-500/10
                        transition
                    "
                >
                    <X className="size-7 text-white/80 group-hover:text-red-500 transition" />
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl mb-2">Data Verifikasi Umkm</h2>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nama Pemilik UMKM</Label>
                        <Input
                            type="text"
                            readOnly
                            value={umkmData.umkm.user?.name}
                            className="
                                focus-visible:ring-0
                                focus-visible:border-white/7
                                cursor-default
                            "
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="store_name">Nama Toko</Label>
                        <Input
                            type="text"
                            readOnly
                            value={umkmData.umkm.store_name}
                            className="
                                focus-visible:ring-0
                                focus-visible:border-white/7
                                cursor-default
                            "
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <div className="flex flex-1 flex-col gap-2">
                            <Label htmlFor="nik">NIK</Label>
                            <Input
                                type="text"
                                readOnly
                                value={umkmData.nik ?? ''}
                                className="
                                    focus-visible:ring-0
                                    focus-visible:border-white/7
                                    cursor-default
                                "
                            />
                        </div>
                        <div className="flex flex-col flex-1 gap-2 w-full">
                            <Label htmlFor="ktp">Foto KTP</Label>
                            <Button
                                asChild
                                variant="outline"
                                className="bg-transparent"
                            >
                                <a
                                    href={`/storage/${umkmData.file_path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Lihat Foto KTP
                                </a>
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <div className="flex flex-1 flex-col gap-2">
                            <Label htmlFor="npwp">NPWP</Label>
                            <Input
                                type="text"
                                readOnly
                                value={umkmData.npwp ?? ''}
                                className="
                                    focus-visible:ring-0
                                    focus-visible:border-white/7
                                    cursor-default
                                "
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <Label htmlFor="nib">NIB</Label>
                            <Input
                                type="text"
                                readOnly
                                value={umkmData.nib ?? ''}
                                className="
                                    focus-visible:ring-0
                                    focus-visible:border-white/7
                                    cursor-default
                                "
                            />
                        </div>
                    </div>
                    <div className="mt-4 ms-auto">
                        <Button
                            onClick={onClose}
                            className="
                                bg-[#99FF33] hover:bg-transparent
                                border border-[#99FF33]
                                text-[#1E1B26] hover:text-[#99FF33]
                                transition cursor-pointer
                            "
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}