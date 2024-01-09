'use client'
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav>
            <div className="hidden sm:ml-6 sm:block bg-blue-500">
                <div className="flex space-x-4">
                    <a href="/" className ="bg-blue-500 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">
                    <Image src="/logo.png" alt="Logo" width={30} height={30}></Image>
                    </a>
                    <a href="/staff" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Staff</a>
                    {/*
                    <a href="/admin" class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Admin</a>
                    */}
                    <a href="/" className="text-white hover:bg-blue-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Login</a>
                </div>
            </div>
        </nav>
    )
}