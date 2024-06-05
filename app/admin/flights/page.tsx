"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { Flight } from "@/clients/gen/flightmngr/flights";
import { FlightsClient } from "@/clients/gen/flightmngr/flights.client";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/*
API pseudo structure
- On GET show the form for inserting new flights
- On form submit call gRPC method to insert the new flight
*/



export default function FlightsAdmin() {
    const ITEMS_PER_PAGE = 20;
    const [flights, setFlights] = useState<Flight[]>([]);
    const [airportDict, setAirportDict] = useState<Record<string, Airport>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const clientAirports = new AirportsClient(webTransport);
    const clientFlights = new FlightsClient(webTransport);

    useEffect(() => {
        clientFlights.listFlights({ includeCancelled: true }).then((result) => {
            setFlights(result.response.flights);
        });
    }, []);

    useEffect(() => {
        clientAirports.listAirports({ showDeleted: true }).then((result) => {
            setAirportDict(Object.fromEntries(
                result.response.airports.map((airport) => [airport.id, airport])
            ));
        });
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const paginatedFlights = flights.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(flights.length / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Flight List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Origin</th>
                            <th className="py-3 px-6 text-left">Destination</th>
                            <th className="py-3 px-6 text-left">Departure time</th>
                            <th className="py-3 px-6 text-left">Arrival time</th>
                            <th className="py-3 px-6 text-left">Additional action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {paginatedFlights.map((flight, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{airportDict[flight.originId]?.name} - {airportDict[flight.originId]?.iata}</td>
                                <td className="py-3 px-6 text-left">{airportDict[flight.destinationId]?.name} - {airportDict[flight.destinationId]?.iata}</td>
                                <td className="py-3 px-6 text-left">{flight.departureTime ? (Timestamp.toDate(flight.departureTime).toUTCString()) : "No info available"}</td>
                                <td className="py-3 px-6 text-left">{flight.arrivalTime ? (Timestamp.toDate(flight.arrivalTime).toUTCString()) : "No info available"}</td>
                                <td className="py-3 px-6 text-left space-x-2">
                                    <button type="button" onClick={() => router.push(`/admin/planes/${flight.planeId}`)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">More plane info</button>
                                    <button type="button" onClick={() => router.push(`/admin/flights/${flight.id}`)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">More flight info</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </div>
    )
}
