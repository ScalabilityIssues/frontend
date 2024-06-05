"use client"

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { webTransport } from '@/clients/transports/web'
import { AirportsClient } from '@/clients/gen/flightmngr/airports.client';
import { Airport } from '@/clients/gen/flightmngr/airports';

/* import { webTransport } from '@/clients/transports/web';
import { exampleServerGRPC } from '@/components/example'; 
import { AirportsClient } from '@/clients/gen/flightmngr/airports.client'; */
/* // example of server call
useEffect(() => {
  exampleServerGRPC().then((planes) => console.log(planes));
});
// example of client call
const s = new AirportsClient(webTransport);
s.listAirports({}).then((planes) => console.log(planes.response)); */

export default function Home() {

  const airportsClient = new AirportsClient(webTransport);

  const router = useRouter();
  const [airports, setAirports] = useState<Airport[]>([]);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  useEffect(() => {
    airportsClient.listAirports({ showDeleted: false }).then((result) => {
      setAirports(result.response.airports);
    });
  }, []);

  const handleSubmit = () => {
    const params = new URLSearchParams();
    params.set('departure', departure);
    params.set('destination', destination);
    params.set('departureDate', departureDate);
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Welcome to Simurgh Airlines</h1>
        <h2 className="text-2xl text-gray-700">Search for Flights</h2>
      </div>
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <form>
          <div className="mb-4">
            <label htmlFor="departure" className="block text-gray-700 text-sm font-bold mb-2">Departure:</label>
            <select value={departure} id="departure" onChange={(e) => setDeparture(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Select Departure</option>
              {airports.map((airport, index) => (
                <option key={index} value={airport.id}>
                  {airport.iata + ' - ' + airport.name + ' - ' + airport.country}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="destination" className="block text-gray-700 text-sm font-bold mb-2">Destination:</label>
            <select value={destination} id="destination" onChange={(e) => setDestination(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Select Destination</option>
              {airports.map((airport, index) => (
                <option key={index} value={airport.id}>
                  {airport.iata + ' - ' + airport.name + ' - ' + airport.country}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="departureDate" className="block text-gray-700 text-sm font-bold mb-2">Departure Date:</label>
            <input
              type="date"
              id="departureDate"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="text-center">
            <button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Search Flights
            </button>
          </div>

        </form>
      </div>
    </div>

  )
}
