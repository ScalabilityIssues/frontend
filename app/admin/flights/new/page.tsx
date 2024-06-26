"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { Flight } from "@/clients/gen/flightmngr/flights";
import { FlightsClient } from "@/clients/gen/flightmngr/flights.client";
import { Plane } from "@/clients/gen/flightmngr/planes";
import { PlanesClient } from "@/clients/gen/flightmngr/planes.client";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


export default function AddFlightAdmin() {
    const router = useRouter();
    const clientFlights = new FlightsClient(webTransport);
    const clientAirports = new AirportsClient(webTransport);
    const clientPlanes = new PlanesClient(webTransport);

    const [planes, setPlanes] = useState<Plane[]>();
    const [airports, setAirports] = useState<Airport[]>();
    const [planeIdx, setPlaneIdx] = useState(-1);
    const [originAirportIdx, setOriginAirportIdx] = useState(-1);
    const [destinationAirportIdx, setDestinationAirportIdx] = useState(-1);

    const [flight, setFlight] = useState({
        departureTime: '',
        arrivalTime: ''
    });

    useEffect(() => {
        clientPlanes.listPlanes({ showDeleted: false }).then((result) => {
            setPlanes(result.response.planes);
        });
        clientAirports.listAirports({ showDeleted: false }).then((result) => {
            setAirports(result.response.airports);
        });
    }, []);

    const handleFlightAdd = () => {
        if (planes && airports && planeIdx !== -1 &&
            originAirportIdx !== -1 && destinationAirportIdx !== -1 &&
            flight.departureTime && flight.arrivalTime) {

            const newFlight: Flight = {
                id: '',
                planeId: planes[planeIdx].id,
                departureTime: Timestamp.fromDate(new Date(flight.departureTime)),
                arrivalTime: Timestamp.fromDate(new Date(flight.arrivalTime)),
                originId: airports[originAirportIdx].id,
                destinationId: airports[destinationAirportIdx].id,
                statusEvents: [],
                isCancelled: false,
            };
            clientFlights.createFlight({ flight: newFlight }).then(() => {
                router.push('/admin/flights');
            });
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Add New Flight</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700">
                        Plane:
                        <select
                            onChange={(e) => setPlaneIdx(parseInt(e.target.value))}
                            className="mt-1 block w-full p-1 border border-gray-300 rounded-md"
                        >
                            <option value="-1">Select plane</option>
                            {planes?.map((plane, idx) => (
                                <option key={plane.id} value={idx}>
                                    {plane.model}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700">
                        Origin airport:
                        <select
                            onChange={(e) => setOriginAirportIdx(parseInt(e.target.value))}
                            className="mt-1 block w-full p-1 border border-gray-300 rounded-md"
                        >
                            <option value="-1">Select origin airport</option>
                            {airports?.map((airport, idx) => (
                                <option key={airport.id} value={idx}>
                                    {airport.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700">
                        Destination airport:
                        <select
                            onChange={(e) => setDestinationAirportIdx(parseInt(e.target.value))}
                            className="mt-1 block w-full p-1 border border-gray-300 rounded-md"
                        >
                            <option value="-1">Select destination airport</option>
                            {airports?.map((airport, idx) => (
                                <option key={airport.id} value={idx}>
                                    {airport.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700">
                        Departure time:
                        <input
                            type="datetime-local"
                            value={flight.departureTime}
                            onChange={(e) => setFlight({ ...flight, departureTime: e.target.value })}
                            className="mt-1 block w-full p-1 border border-gray-300 rounded-md"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700">
                        Arrival time:
                        <input
                            type="datetime-local"
                            value={flight.arrivalTime}
                            onChange={(e) => setFlight({ ...flight, arrivalTime: e.target.value })}
                            className="mt-1 block w-full p-1 border border-gray-300 rounded-md"
                        />
                    </label>
                </div>
                <button
                    type="button"
                    onClick={handleFlightAdd}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    Add
                </button>
            </form>
        </div>

    )
}