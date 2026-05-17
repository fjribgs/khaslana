import { Head, Link } from '@inertiajs/react';

export default function NotFound() {
    return (
        <>
            <Head title="404 - Page Not Found" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
                <h1 className="text-8xl font-bold text-primary">404</h1>

                <h2 className="mt-4 text-3xl font-semibold">
                    kocak
                </h2>

                <p className="mt-3 max-w-md text-muted-foreground">
                    nyasar lu bang
                </p>

                <Link
                    href="/"
                    className="mt-8 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </>
    );
}