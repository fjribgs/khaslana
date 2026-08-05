import { router } from "@inertiajs/react";
import { useState } from "react";
import { Check, CircleUserRound, Eye, Store, UserRoundX, X } from "lucide-react";
import Heading from "@/components/heading";
import { Card, CardContent } from "@/components/ui/card";
import { statusUpdate } from "@/routes/additionalVerification";
import type { UmkmData } from "@/types/umkm";
import DialogData from "./dialog-data";
import { showSuccessToast } from "@/lib/toast";

interface SuperadminIndexProps {
    requestedUmkm: UmkmData[];
}

export default function SuperadminIndex({
    requestedUmkm,
}: SuperadminIndexProps) {
    const [open, setOpen] = useState(false);
    const [selectedUmkm, setSelectedUmkm] = useState<UmkmData | null>(null);

    const handleCardClicked = (umkm: UmkmData) => {
        setOpen(true);
        setSelectedUmkm(umkm);
    }

    const handleUpdateVerification = (
        id: number,
        status: 'VERIFIED' | 'REJECT',
    ) => {
        router.patch(statusUpdate(id),
            { status },
            {
                preserveScroll: true,
                onSuccess: () => {
                    showSuccessToast(status === 'VERIFIED'
                        ? 'Data UMKM berhasil di verifikasi!'
                        : 'Data UMKM berhasil ditolak!'
                    );
                },
            }
        );
    };
    
    return (
        <div className="space-y-6">
            <Heading
                variant="default"
                title="Daftar Verifikasi UMKM"
                description="Daftar UMKM yang mengajukan verifikasi data diri lanjutan"
            />
            {requestedUmkm.length === 0 && (
                <div className="flex flex-col w-full items-center justify-center text-muted-foreground gap-4 mt-12">
                    <UserRoundX className="size-32" />
                    <p>Belum ada umkm yang mengajukan verifikasi data diri!</p>
                </div>
            )}
            <div className="flex flex-col gap-4">
                {requestedUmkm.map(umkm => (
                    <Card
                        key={umkm.id}
                        onClick={() => handleCardClicked(umkm)}
                        className="
                            bg-[#1E1B26] shadow-2xl
                            border border-[#99FF33]/50
                            text-white cursor-pointer
                        "
                    >
                        <CardContent className="flex gap-2 items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2 items-center">
                                    <Store className="size-4" />
                                    <h2 className="text-xl">
                                        {umkm.umkm.store_name}
                                    </h2>
                                </div>
                                <div className="flex gap-2 items-center text-muted-foreground">
                                    <p className="text-sm">
                                        {umkm.umkm.user?.name}
                                    </p>
                                    <CircleUserRound className="size-3.5" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-2 rounded-full border border-blue-500 bg-blue-500/5 hover:bg-blue-500/20">
                                    <Eye className="size-5 text-blue-500" />
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateVerification(umkm.id, 'REJECT');
                                    }}
                                    className="p-2 rounded-full border border-red-500 bg-red-500/5 hover:bg-red-500/20"
                                >
                                    <X className="size-5 text-red-500" />
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateVerification(umkm.id, 'VERIFIED');
                                    }}
                                    className="p-2 rounded-full border border-[#99FF33] bg-[#99FF33]/5 hover:bg-[#99FF33]/20"
                                >
                                    <Check className="size-5 text-[#99FF33]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {(open && selectedUmkm) && (
                <DialogData
                    open={open}
                    onClose={() => setOpen(false)}
                    umkmData={selectedUmkm}
                />
            )}
        </div>
    )
}