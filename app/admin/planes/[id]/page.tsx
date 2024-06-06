"use client"

import { Plane } from "@/clients/gen/flightmngr/planes";
import { PlanesClient } from "@/clients/gen/flightmngr/planes.client";
import { webTransport } from "@/clients/transports/web";
import { useEffect, useState } from "react";


export default function PlanesIdAdmin({ params }: { params: { id: string } }) {
    const clientPlanes = new PlanesClient(webTransport);
    const [plane, setPlane] = useState<Plane>();

    useEffect(() => {
        clientPlanes.getPlane({ id: params.id }).then((result) => {
            setPlane(result.response);
        });
    }, []);

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
                    </div>
                </>
            )}
        </div>

    );
};
