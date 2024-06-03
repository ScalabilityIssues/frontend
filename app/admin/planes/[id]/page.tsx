"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { Flight } from "@/clients/gen/flightmngr/flights";
import { FlightsClient } from "@/clients/gen/flightmngr/flights.client";
import { Plane } from "@/clients/gen/flightmngr/planes";
import { PlanesClient } from "@/clients/gen/flightmngr/planes.client";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";
import { webTransport } from "@/clients/transports/web";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";


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
            router.push('/admin/planes');
        })
    }

    return (
        <div className="container mx-auto">
            {plane === undefined ? (<h1>Plane not found</h1>) :
                <>
                    <h1>Plane id: {plane?.id}</h1>
                    <p>{plane?.model}</p>
                    <p>Cabin capacity (number of person): {plane?.cabinCapacity}</p>
                    <p>Cabin capacity (in kg): {plane?.cargoCapacityKg}</p>
                    <p>Deleted: {plane?.deleted ? "Yes" : "No"}</p>
                    {!plane?.deleted && <button type="button" onClick={handleDelete}>Delete</button>}
                </>
            }
        </div >
    );
};
