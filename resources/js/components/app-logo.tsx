import KhaslanaLogo from '@/assets/images/khaslana.svg';
import KhaslanaLogoDark from '@/assets/images/khaslana-dark.svg';

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center justify-center rounded-md
                group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:w-full"
            >
                <img
                    src={KhaslanaLogo}
                    alt="Khaslana Logo"
                    className="
                        hidden h-12 w-12
                        group-data-[collapsible=icon]:mx-auto
                        group-data-[collapsible=icon]:h-7
                        group-data-[collapsible=icon]:w-7
                        dark:block
                    "
                />

                <img
                    src={KhaslanaLogoDark}
                    alt="Khaslana Logo"
                    className="
                        h-12 w-12
                        group-data-[collapsible=icon]:mx-auto
                        group-data-[collapsible=icon]:h-7
                        group-data-[collapsible=icon]:w-7
                        dark:hidden
                    "
                />
                {/* <KhaslanaLogo className="size-5 fill-current text-white dark:text-black" /> */}
            </div>
            <div className="ml-1 grid flex-1 text-left text-xl">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Khaslana
                </span>
            </div>
        </>
    );
}
