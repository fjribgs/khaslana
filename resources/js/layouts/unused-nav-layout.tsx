import { Head } from "@inertiajs/react"
import Footer from "@/components/khaslana/footer"
import Back from "@/layouts/components/back";

type UnusedNavLayoutProps = {
    children: React.ReactNode;
    backHref: string;
}

export default function UnusedNavLayout({ children, backHref }: UnusedNavLayoutProps) {
    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen h-auto">
                <div className="flex flex-col px-6 lg:px-[70px] pt-12">
                    <Back href={backHref} />
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}