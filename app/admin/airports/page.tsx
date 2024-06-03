"use client"

import { Airport } from "@/clients/gen/flightmngr/airports";
import { AirportsClient } from "@/clients/gen/flightmngr/airports.client";
import { webTransport } from "@/clients/transports/web";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

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



    return (<div className="container mx-auto">
        <h1>Airport list</h1>
        <ul>
            {airports.map((airport) => (
                <li key={airport.id}>
                    <h2>{airport.name}</h2>
                    <p>IATA code: {airport.iata}</p>
                    <p>ICAO code: {airport.icao}</p>
                    <p>City: {airport.city}</p>
                    <p>Country: {airport.country}</p>
                    <p>Deleted: {airport.deleted ? "Yes" : "No"}</p>
                </li>
            ))}
        </ul>

        <h2>Add new airport TEMP</h2>
        <label>
            ICAO code:
            <input type="text" value={newAirport.icao} onChange={(e) => setNewAirport({ ...newAirport, icao: e.target.value })} />
        </label>
        <label>
            IATA code:
            <input type="text" value={newAirport.iata} onChange={(e) => setNewAirport({ ...newAirport, iata: e.target.value })} />
        </label>
        <label>
            Name:
            <input type="text" value={newAirport.name} onChange={(e) => setNewAirport({ ...newAirport, name: e.target.value })} />
        </label>
        <label>
            Country:
            <input type="text" value={newAirport.country} onChange={(e) => setNewAirport({ ...newAirport, country: e.target.value })} />
        </label>
        <label>
            City:
            <input type="text" value={newAirport.city} onChange={(e) => setNewAirport({ ...newAirport, city: e.target.value })} />
        </label>
        <button type="button" onClick={handleAddAirport}>Add airport</button>


    </div>)
}
