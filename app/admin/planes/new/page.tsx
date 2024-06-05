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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Add New Plane</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700">
                        Model:
                        <input type="text" value={plane.model} onChange={(e) => updatePlane('model', e.target.value)} className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700">
                        Cabin capacity:
                        <input type="number" value={plane.cabinCapacity} onChange={(e) => updatePlane('cabinCapacity', parseInt(e.target.value))} className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700">
                        Cargo capacity (in kg):
                        <input type="number" value={plane.cargoCapacityKg} onChange={(e) => updatePlane('cargoCapacityKg', parseInt(e.target.value))} className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                    </label>
                </div>
                <button type="button" onClick={handlePlaneAdd} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Add
                </button>
            </form>
        </div>

    )


}