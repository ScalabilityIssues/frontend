'use client'
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav className="hidden sm:ml-6 sm:block bg-blue-500">
            <div className="hidden sm:ml-6 sm:block bg-blue-500">
                <div className="flex space-x-4">
                    <Link href="/" aria-current="page">
                        <Image src="/logo.png" alt="Logo" width={40} height={40} className ="rounded-full"></Image>
                    </Link>
                    <Link href="/staff" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Staff</Link>
                    {/*
                    <Link href="/admin" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Admin</Link>
                    */}
                    <Link href="/" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Login</Link>
                </div>
            </div>
        </nav>
    )
}