
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav className="block md:sticky top-0 bg-blue-500 z-10">

            <div className="container mx-auto flex items-center space-x-6 p-3">
                <Link href="/" aria-current="page">
                    <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full"></Image>
                </Link>
                <Link href="/staff" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Staff</Link>

                <Link href="/admin" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Admin</Link>
            </div>

        </nav>
    )
}