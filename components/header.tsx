
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav className="bg-blue-500 p-2">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" aria-current="page">
                    <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full"></Image>
                </Link>
                <div className="space-x-4">
                    <Link href="/staff" className="text-white hover:text-gray-300">Staff</Link>
                    <Link href="/admin" className="text-white hover:text-gray-300">Admin</Link>
                </div>
            </div>
        </nav>
    )
}