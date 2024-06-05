"use client"

import { Plane } from "@/clients/gen/flightmngr/planes";
import { PlanesClient } from "@/clients/gen/flightmngr/planes.client";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function PlanesIdAdmin({ params }: { params: { id: string } }) {
    const router = useRouter();
    const clientPlanes = new PlanesClient(webTransport);
    const [plane, setPlane] = useState<Plane>();

    useEffect(() => {
        clientPlanes.getPlane({ id: params.id }).then((result) => {
            setPlane(result.response);
        });
    }, []);

    const handleDelete = () => {
        clientPlanes.deletePlane({ id: params.id }).then(() => {
            window.location.reload();
        })
    }

    return (
        <div className="container mx-auto p-4">
            {plane === undefined ? (
                <h1 className="text-2xl font-bold text-center text-red-500">Plane not found</h1>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-center mb-6">Plane ID: {plane?.id}</h1>
                    <div className="space-y-4">
                        <p className="block text-black-700"><span className="font-semibold">Model:</span> {plane?.model}</p>
                        <p className="block text-black-700"><span className="font-semibold">Cabin Capacity (number of persons):</span> {plane?.cabinCapacity}</p>
                        <p className="block text-black-700"><span className="font-semibold">Cargo Capacity (in kg):</span> {plane?.cargoCapacityKg}</p>
                        <p className={`block ${plane?.deleted ? 'text-red-600' : 'text-green-600'}`}><span className="font-semibold">Deleted:</span> {plane?.deleted ? "Yes" : "No"}</p>
                        {!plane?.deleted && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>

    );
};
