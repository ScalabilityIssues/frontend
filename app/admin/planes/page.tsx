"use client"

import { Plane } from "@/clients/gen/flightmngr/planes";
import { PlanesClient } from "@/clients/gen/flightmngr/planes.client";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function PlanesAdmin() {
    const ITEMS_PER_PAGE = 20;
    const router = useRouter();
    const clientPlanes = new PlanesClient(webTransport);
    const [planes, setPlanes] = useState<Plane[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        clientPlanes.listPlanes({ showDeleted: true }).then((result) => {
            setPlanes(result.response.planes);
        });
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const paginatedPlanes = planes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(planes.length / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Plane List</h1>
            <ul className="space-y-4">
                {paginatedPlanes.map((plane, index) => (
                    <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-2">{plane.model}</h2>
                        <p className="block text-black-700"><span className="font-semibold">Cabin capacity (number of persons):</span> {plane.cabinCapacity}</p>
                        <p className="block text-black-700"><span className="font-semibold">Cargo capacity (in kg):</span> {plane.cargoCapacityKg}</p>
                        <p className={`block text-black-700 ${plane.deleted ? 'text-red-600' : 'text-green-600'}`}><span className="font-semibold">Deleted:</span> {plane.deleted ? "Yes" : "No"}</p>
                        <button type="button" onClick={() => { router.push(`/admin/planes/${plane.id}`) }} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center mt-4">
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>

    )
}
