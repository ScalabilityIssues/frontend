import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">
                        <Image src="/logo.png" alt="Logo" width={100} height={100}></Image>
                    </Link>
                </li>
                <li>
                    <Link href="/staff">
                        Staff page
                    </Link>
                </li>
                {/* <li>
                    <Link href="/admin">
                    </Link>
                </li> */}
                <li>
                    <Link href="/">Login</Link>
                </li>
            </ul>
        </nav>
    )
}