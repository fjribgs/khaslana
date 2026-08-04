import { Head } from "@inertiajs/react";
import VerificationIndex from "@/components/khaslana/settings/verification/verification-index";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import { additionalVerification } from "@/routes";
import type { BreadcrumbItem } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import SuperadminIndex from "@/components/khaslana/settings/verification/superadmin-index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Verification(props: any) {
    const { user } = useAuth();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Verifikasi UMKM",
            href: additionalVerification().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verifikasi UMKM" />
            <SettingsLayout>
                {user.superadmin ? (
                    <SuperadminIndex requestedUmkm={props.requestedUmkm} />
                ) : (
                    <VerificationIndex {...props} />
                )}
            </SettingsLayout>
        </AppLayout>
    );
}