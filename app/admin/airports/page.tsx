"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AirportsAdmin() {
    const router = useRouter();
    const clientAirports = new AirportsClient(webTransport);
    const [airports, setAirports] = useState<Airport[]>([]);
    useEffect(() => {
        clientAirports.listAirports({ showDeleted: true }).then((result) => {
            setAirports(result.response.airports);
        });
    }, []);

    const [newAirport, setNewAirport] = useState({
        icao: "",
        iata: "",
        name: "",
        country: "",
        city: ""
    });

    const handleAddAirport = () => {
        const currAirport: Airport = {
            id: '',
            icao: newAirport.icao,
            iata: newAirport.iata,
            name: newAirport.name,
            country: newAirport.country,
            city: newAirport.city,
            deleted: false
        };
        clientAirports.createAirport({ airport: currAirport }).then(() => {
            router.refresh();
        });
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Airport List</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {airports.map((airport) => (
                    <li key={airport.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                        <h2 className="text-xl font-semibold mb-2">{airport.name}</h2>
                        <p className="text-gray-700"><strong>IATA code:</strong> {airport.iata}</p>
                        <p className="text-gray-700"><strong>ICAO code:</strong> {airport.icao}</p>
                        <p className="text-gray-700"><strong>City:</strong> {airport.city}</p>
                        <p className="text-gray-700"><strong>Country:</strong> {airport.country}</p>
                        <p className={`text-sm font-bold ${airport.deleted ? 'text-red-600' : 'text-green-600'}`}>
                            Deleted: {airport.deleted ? "Yes" : "No"}
                        </p>
                    </li>
                ))}
            </ul>


            {/* <h2 className="text-2xl font-bold mt-8 mb-4">Add new airport</h2>
            <label className="block mb-2">
                ICAO code:
                <input
                    type="text"
                    value={newAirport.icao}
                    onChange={(e) => setNewAirport({ ...newAirport, icao: e.target.value })}
                    className="border border-gray-300 px-2 py-1 rounded-md w-full"
                />
            </label>
            <label className="block mb-2">
                IATA code:
                <input
                    type="text"
                    value={newAirport.iata}
                    onChange={(e) => setNewAirport({ ...newAirport, iata: e.target.value })}
                    className="border border-gray-300 px-2 py-1 rounded-md w-full"
                />
            </label>
            <label className="block mb-2">
                Name:
                <input
                    type="text"
                    value={newAirport.name}
                    onChange={(e) => setNewAirport({ ...newAirport, name: e.target.value })}
                    className="border border-gray-300 px-2 py-1 rounded-md w-full"
                />
            </label>
            <label className="block mb-2">
                Country:
                <input
                    type="text"
                    value={newAirport.country}
                    onChange={(e) => setNewAirport({ ...newAirport, country: e.target.value })}
                    className="border border-gray-300 px-2 py-1 rounded-md w-full"
                />
            </label>
            <label className="block mb-2">
                City:
                <input
                    type="text"
                    value={newAirport.city}
                    onChange={(e) => setNewAirport({ ...newAirport, city: e.target.value })}
                    className="border border-gray-300 px-2 py-1 rounded-md w-full"
                />
            </label>
            <button
                type="button"
                onClick={handleAddAirport}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Add airport
            </button> */}
        </div>
    );
}
