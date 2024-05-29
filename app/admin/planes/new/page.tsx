"use client"

import { Plane } from "@/clients/gen/flightmngr/planes";
import { PlanesClient } from "@/clients/gen/flightmngr/planes.client";
import { webTransport } from "@/clients/transports/web";
import { appendFileSync } from "fs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function AddPlanesAdmin() {
    const router = useRouter();
    const clientPlanes = new PlanesClient(webTransport);
    const [plane, setPlane] = useState({
        model: '',
        cabinCapacity: 0,
        cargoCapacityKg: 0
    });

    const updatePlane = (field: string, value: string | number) => {
        setPlane({
            ...plane,
            [field]: value
        });
    };

    const handlePlaneAdd = () => {
        const newPlane = {
            model: plane.model,
            cabinCapacity: plane.cabinCapacity,
            cargoCapacityKg: plane.cargoCapacityKg
        } as Plane;
        clientPlanes.createPlane({ plane: newPlane }).then(() => {
            router.push('/admin/planes');
        });
    }


    return (
        <div>
            <h1>Add new plane</h1>
            <form>
                <label>
                    Model:
                    <input type="text" value={plane.model} onChange={(e) => updatePlane('model', e.target.value)} />
                </label>
                <label>
                    Cabin capacity:
                    <input type="number" value={plane.cabinCapacity} onChange={(e) => updatePlane('cabinCapacity', parseInt(e.target.value))} />
                </label>
                <label>
                    Cargo capacity (in kg):
                    <input type="number" value={plane.cargoCapacityKg} onChange={(e) => updatePlane('cargoCapacityKg', parseInt(e.target.value))} />
                </label>
                <button type="button" onClick={handlePlaneAdd}>Add</button>
            </form>
        </div>
    )


}


/**
 * // A plane model that is present in the fleet.
message Plane {

    // The unique identifier for the plane model.
    // This is a UUID.
    string id = 1 [
        (google.api.field_behavior) = IDENTIFIER
        ];

        // The name of the plane model.
    string model = 3 [
        (google.api.field_behavior) = REQUIRED,
        (google.api.field_behavior) = IMMUTABLE
    ];

        // The number of passengers that the plane can carry.
    uint32 cabin_capacity = 4 [
        (google.api.field_behavior) = REQUIRED,
        (google.api.field_behavior) = IMMUTABLE
    ];

        // The maximum weight of cargo that the plane can carry, in kg.
    uint32 cargo_capacity_kg = 5 [
        (google.api.field_behavior) = REQUIRED,
        (google.api.field_behavior) = IMMUTABLE
    ];

        // Whether the plane model has been soft-deleted.
    bool deleted = 6 [
        (google.api.field_behavior) = OUTPUT_ONLY
    ];
}
 */