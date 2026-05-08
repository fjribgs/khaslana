import KhaslanaLogo from '@/assets/images/khaslana.svg';

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center justify-center rounded-md">
                <img
                    src={KhaslanaLogo}
                    alt="Khaslana Logo"
                    className='fill-current text-white dark:text-black h-12 w-12'
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
