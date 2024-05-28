"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { webTransport } from "@/clients/transports/web";
import { useEffect, useState } from "react";

export default function AirportsAdmin() {
    const clientAirports = new AirportsClient(webTransport);
    const [airports, setAirports] = useState<Airport[]>([]);
    useEffect(() => {
        clientAirports.listAirports({ showDeleted: true }).then((result) => {
            setAirports(result.response.airports);
        });
    }, []);

    return (<div>
        <h1>Airport list</h1>
        <ul>
            {airports.map((airport) => (
                <li key={airport.id}>
                    <h2>{airport.name}</h2>
                    <p>IATA code: {airport.iata}</p>
                    <p>ICAO code: {airport.icao}</p>
                    <p>City: {airport.city}</p>
                    <p>Country: {airport.country}</p>
                    <p>Deleted: {airport.deleted}</p>
                </li>
            ))}
        </ul>
    </div>)
}