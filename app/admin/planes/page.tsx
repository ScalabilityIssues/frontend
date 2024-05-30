"use client"

import { Plane } from "@/clients/gen/flightmngr/planes";
import { PlanesClient } from "@/clients/gen/flightmngr/planes.client";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function PlanesAdmin() {
    const router = useRouter();
    const clientPlanes = new PlanesClient(webTransport);
    const [planes, setPlanes] = useState<Plane[]>([]);

    useEffect(() => {
        clientPlanes.listPlanes({ showDeleted: true }).then((result) => {
            setPlanes(result.response.planes);
        });
    }, []);

    return (
        <div>
            <h1>Plane list</h1>
            <ul>
                {planes.map((plane, index) => (
                    <li key={index}>
                        <h2>{plane.model}</h2>
                        <p>Cabin capacity (number of person): {plane.cabinCapacity}</p>
                        <p>Cabin capacity (in kg): {plane.cargoCapacityKg}</p>
                        <p>Deleted: {plane.deleted}</p>
                        <button type="button" onClick={() => { router.push(`/admin/planes/${plane.id}`) }}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}