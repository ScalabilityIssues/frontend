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
import { useEffect, useState } from "react";


export default function PlanesIdAdmin() {
    const router = useRouter();
    const clientPlanes = new PlanesClient(webTransport);
    const searchParams = useSearchParams();
    const planeId = searchParams.get('id') || '';
    const [plane, setPlane] = useState<Plane>();

    useEffect(() => {
        if (planeId === '') {
            router.push('/admin/planes');
        } else {
            clientPlanes.getPlane({ id: planeId }).then((result) => {
                setPlane(result.response);
            });
        }
    }, []);

    const handleDelete = () => {
        clientPlanes.deletePlane({ id: planeId });
        router.push('/admin/planes');
    }

    return (
        <div>
            {plane === undefined ? (<h1>Plane not found</h1>) :
                <>
                    (<h1>Plane id: {plane?.id}</h1>
                    <p>{plane?.model}</p>
                    <p>Cabin capacity (number of person): {plane?.cabinCapacity}</p>
                    <p>Cabin capacity (in kg): {plane?.cargoCapacityKg}</p>
                    <p>Deleted: {plane?.deleted}</p>
                    {!plane?.deleted && <button onClick={() => { handleDelete }}>Delete</button>})
                </>
            }
        </div >
    );
};
