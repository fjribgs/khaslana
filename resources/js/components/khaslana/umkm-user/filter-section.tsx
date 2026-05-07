import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function FilterSection() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('Terdekat');
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        'Terdekat',
        'Terbaru',
        'Terpopuler',
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener(
            'mousedown',
            handleClickOutside
        );
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="flex flex-row w-full justify-between items-center">
                <span className="text-xl lg:text-3xl font-bold cursor-default">
                    Jelajahi Direktori
                </span>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="
                            flex items-center gap-4
                            bg-transparent
                            px-2 py-1
                            text-sm lg:text-lg
                            font-semibold
                            hover:cursor-pointer
                            transition
                            group
                        "
                    >
                        <span className="text-[#B7B7B7] font-medium">
                            Urutkan:
                        </span>
                        <span className="text-[#99FF33] transition-opacity group-hover:opacity-80">
                            {selected}
                        </span>
                        <ChevronDown
                            className={`
                                w-6 h-6 text-[#7C7C91]
                                transition-transform duration-300
                                ${open ? 'rotate-180' : ''}
                            `}
                        />
                    </button>
                    {open && (
                        <div
                            className="
                                absolute right-0 mt-3
                                min-w-[180px]
                                rounded-2xl
                                bg-[#1F1D2B]/95
                                backdrop-blur-xl
                                shadow-2xl
                                overflow-hidden
                                z-50
                            "
                        >
                            {options.map((option, index) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        setSelected(option);
                                        setOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-5 py-3
                                        transition
                                        hover:bg-white/5
                                        hover:cursor-pointer
                                        ${
                                            index !== options.length - 1
                                                ? 'border-b border-b-gray-700'
                                                : ''
                                        }
                                        ${selected === option
                                            ? 'text-[#99FF33]'
                                            : 'text-white'
                                        }
                                    `}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* search bar */}
            <div className="w-full mt-6 mb-8">
                <div
                    className="
                        flex items-center gap-4
                        w-full
                        bg-[#242424]
                        rounded-full
                        px-6 py-4
                        transition
                        focus-within:ring-2
                        focus-within:ring-[#99FF33]/40
                    "
                >
                    <Search className="w-5 h-5 text-[#B7B7B7]" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Apa yang anda cari?"
                        className="
                            w-full
                            bg-transparent
                            outline-none
                            text-white
                            placeholder:text-[#A3A3A3]
                            text-sm lg:text-base
                        "
                    />
                </div>
            </div>
        </>
    )
}