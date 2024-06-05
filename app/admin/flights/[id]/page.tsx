"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { Flight, FlightStatusEvent } from "@/clients/gen/flightmngr/flights";
import { FlightsClient } from "@/clients/gen/flightmngr/flights.client";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";
import { webTransport } from "@/clients/transports/web";
import FlightStatusEventComponent from "@/components/flight-status";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FlightsIdAdmin({ params }: { params: { id: string } }) {
    const router = useRouter();
    const clientFlights = new FlightsClient(webTransport);
    const clientAirports = new AirportsClient(webTransport);
    const [flight, setFlight] = useState<Flight>();
    const [origin, setOrigin] = useState<Airport>();
    const [destination, sepestination] = useState<Airport>();
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStatusEvent, setSelectedStatusEvent] = useState('');

    useEffect(() => {

        clientFlights.getFlight({ id: params.id }).then((result) => {
            setFlight(result.response);
        });
    }, []);

    useEffect(() => {
        if (flight) {
            clientAirports.getAirport({ id: flight.originId }).then((result) => {
                setOrigin(result.response);
            });
            clientAirports.getAirport({ id: flight.destinationId }).then((result) => {
                sepestination(result.response);
            });
        }
    }, [flight]);

    const handleStatusEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setSelectedStatusEvent(e.target.value);
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        let statusEvent: FlightStatusEvent | undefined = undefined;

        switch (selectedStatusEvent) {
            case 'cancelled':
                const reason = formData.get('cancel_reason') as string;
                statusEvent = ({
                    timestamp: Timestamp.fromDate(new Date()),
                    event: {
                        oneofKind: "flightCancelled",
                        flightCancelled: { reason: reason }
                    }
                })
                break;
            case 'delayed':
                const departureTime = formData.get('delayed_departureTime') as string;
                const arrivalTime = formData.get('delayed_arrivalTime') as string;
                statusEvent = ({
                    timestamp: Timestamp.fromDate(new Date()),
                    event: {
                        oneofKind: "flightDelayed",
                        flightDelayed: {
                            departureTime: Timestamp.fromDate(new Date(departureTime)),
                            arrivalTime: Timestamp.fromDate(new Date(arrivalTime))
                        }
                    }
                })
                break;
            case 'gate_departure':
                const gateDeparture = formData.get('gate_departure') as string;
                statusEvent = ({
                    timestamp: Timestamp.fromDate(new Date()),
                    event: {
                        oneofKind: "flightGateDeparture",
                        flightGateDeparture: { gate: gateDeparture }
                    }
                })
                break;
            case 'gate_arrival':
                const gateArrival = formData.get('gate_arrival') as string;
                statusEvent = ({
                    timestamp: Timestamp.fromDate(new Date()),
                    event: {
                        oneofKind: "flightGateArrival",
                        flightGateArrival: { gate: gateArrival }
                    }
                })
                break;
        }

        clientFlights.updateFlight({ id: params.id, statusEvent }).then(() => {
            setIsEditing(false);
            window.location.reload();
        });
    }


    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="container mx-auto p-4">
            {flight === undefined ? (
                <h1 className="text-2xl font-bold text-center text-red-600 mb-6">Flight not found</h1>
            ) : (
                isEditing ? (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-6">Edit Flight</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="eventSelect" className="block text-gray-700">Event Type</label>
                                <select name="event" onChange={handleStatusEventChange} id="eventSelect" className="mt-1 block w-full p-1 border border-gray-300 rounded-md">
                                    <option value="">Select an event</option>
                                    <option value="cancelled">Flight Cancelled</option>
                                    <option value="delayed">Flight Delayed</option>
                                    <option value="gate_departure">Flight Gate Departure</option>
                                    <option value="gate_arrival">Flight Gate Arrival</option>
                                </select>
                            </div>

                            {selectedStatusEvent === 'cancelled' && (
                                <div>
                                    <label htmlFor="cancel_reason" className="block text-gray-700">Reason</label>
                                    <input type="text" id="cancel_reason" name="cancel_reason" className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                                </div>
                            )}

                            {selectedStatusEvent === 'delayed' && (
                                <div>
                                    <label htmlFor="delayed_departureTime" className="block text-gray-700">Departure Time</label>
                                    <input type="datetime-local" id="delayed_departureTime" name="delayed_departureTime" className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                                    <label htmlFor="delayed_arrivalTime" className="block text-gray-700 mt-4">Arrival Time</label>
                                    <input type="datetime-local" id="delayed_arrivalTime" name="delayed_arrivalTime" className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                                </div>
                            )}

                            {selectedStatusEvent === 'gate_departure' && (
                                <div>
                                    <label htmlFor="gate_departure" className="block text-gray-700">Gate</label>
                                    <input type="text" id="gate_departure" name="gate_departure" className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                                </div>
                            )}

                            {selectedStatusEvent === 'gate_arrival' && (
                                <div>
                                    <label htmlFor="gate_arrival" className="block text-gray-700">Gate</label>
                                    <input type="text" id="gate_arrival" name="gate_arrival" className="mt-1 block w-full p-1 border border-gray-300 rounded-md" />
                                </div>
                            )}

                            <div className="flex space-x-4">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update Flight</button>
                                <button type="button" onClick={toggleEdit} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-6">Flight id: {flight?.id}</h1>
                        <div className="space-y-4">
                            <p className="text-gray-700"><strong>Origin airport:</strong> {origin?.name} - {origin?.iata}</p>
                            <p className="text-gray-700"><strong>Destination airport:</strong> {destination?.name} - {destination?.iata}</p>
                            <p className="text-gray-700"><strong>Plane id:</strong> {flight.planeId}</p>
                            <p className="text-gray-700"><strong>Departure time:</strong> {flight.departureTime ? (Timestamp.toDate(flight.departureTime).toUTCString()) : "No info available"}</p>
                            <p className="text-gray-700"><strong>Expected departure time:</strong> {flight.expectedDepartureTime ? (Timestamp.toDate(flight.expectedDepartureTime).toUTCString()) : "No info available"}</p>
                            <p className="text-gray-700"><strong>Departure gate:</strong> {flight.departureGate ? flight.departureGate : "No info available"}</p>
                            <p className="text-gray-700"><strong>Arrival time:</strong> {flight.arrivalTime ? (Timestamp.toDate(flight.arrivalTime).toUTCString()) : "No info available"}</p>
                            <p className="text-gray-700"><strong>Expected arrival time:</strong> {flight.expectedArrivalTime ? (Timestamp.toDate(flight.expectedArrivalTime).toUTCString()) : "No info available"}</p>
                            <p className="text-gray-700"><strong>Arrival gate:</strong> {flight.arrivalGate ? flight.arrivalGate : "No info available"}</p>
                            <p className={`${flight.isCancelled ? 'text-red-600' : 'text-green-600'}`}><strong>Cancelled:</strong> {flight.isCancelled ? "Yes" : "No"}</p>
                        </div>

                        <h2 className="text-2xl font-bold text-center mt-6 mb-4">Status events</h2>
                        <ul className="space-y-2">
                            {flight.statusEvents.slice()
                                .sort((a, b) => {
                                    return ((a.timestamp && Timestamp.toDate(a.timestamp).getTime()) || 0) -
                                        ((b.timestamp && Timestamp.toDate(b.timestamp).getTime()) || 0);
                                })
                                .map((event, index) => (
                                    <li key={index} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                                        <FlightStatusEventComponent props={event} />
                                    </li>
                                ))}
                        </ul>
                        <div className="flex justify-center mt-6">
                            <button type="button" onClick={toggleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Edit</button>
                        </div>
                    </>
                )
            )}
        </div>
    )
}
