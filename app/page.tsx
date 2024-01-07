'use client'
import React, { useEffect, useState } from 'react';
import Header from "@/components/header"
import Footer from "@/components/footer"
import { webTransport } from '@/clients/transports/web';
import { exampleServerGRPC } from '@/components/example';
import { AirportsClient } from '@/clients/gen/airports.client';


export default function Home() {

  // example of server call
  useEffect(() => {
    exampleServerGRPC().then((planes) => console.log(planes));
  });
  // example of client call
  const s = new AirportsClient(webTransport);
  s.listAirports({}).then((planes) => console.log(planes.response));

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numPassengers, setNumPassengers] = useState(1);

  return (
    <>
      <Header />
      <main>
        <div className='flex items-center justify-center text-3xl'> <h1> Welcome to Horizon Airline! </h1></div>
        <div className='flex items-center justify-left'>
          <form className="bg-blue-200 p-8 rounded-lg grid grid-cols-2 gap-4">
            <label htmlFor="departure">Departure:</label>
            <input
              type="text"
              id="departure"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)} //must fetch airports from flight management service
            />

            <label htmlFor="destination">Destination:</label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)} //must fetch airports from flight management service
            />

            <label htmlFor="departureDate">Departure Date:</label>
            <input
              type="date"
              id="departureDate"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />

            <label htmlFor="returnDate">Return Date:</label>
            <input
              type="date"
              id="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />

            <label htmlFor="numPassengers">Number of Passengers:</label>
            <input
              type="number"
              id="numPassengers"
              value={numPassengers}
              onChange={(e) => setNumPassengers(parseInt(e.target.value))}
              min="1"
            />

            <button type="submit">
              Search Flights
            </button>
          </form>
        </div>

      </main>
      <Footer />
    </>
  )
}
