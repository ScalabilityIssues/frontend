'use client'
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav className="hidden sm:block bg-blue-500">
            <div className="hidden sm:ml-6 sm:mb-6 sm:block bg-blue-500">
                <div className="flex items-center space-x-6 pt-3 pb-3">
                    <Link href="/" aria-current="page">
                        <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full"></Image>
                    </Link>
                    <Link href="/staff" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Staff</Link>

                    <Link href="/admin" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Admin</Link>

                    <Link href="/" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Login</Link>
                </div>
            </div>
        </nav>
    )
}