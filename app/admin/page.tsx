"use client"

import { useRouter } from "next/navigation";
/*
API pseudo structure
- On GET show admin page with button for inserting new flights, planes (by admin/flights/ and admin/planes)
  and below the list of all the flights and it's possible to have more info about each flight or modify it 
- GetAirport for extracting some airport info (supported airports are already preloaded)
- ListFlights for extracting all the flights
*/
export default function Admin() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Monitoring</h2>
        <div className="space-y-2">
          <button type="button" onClick={() => router.push("/admin/airports/")} className="bg-blue-500 text-white px-4 py-2 mx-1 rounded-md hover:bg-blue-600 w-full md:w-auto">Check all the airports</button>
          <button type="button" onClick={() => router.push("/admin/planes/")} className="bg-blue-500 text-white px-4 py-2 mx-1 rounded-md hover:bg-blue-600 w-full md:w-auto">Check all the planes</button>
          <button type="button" onClick={() => router.push("/admin/flights/")} className="bg-blue-500 text-white px-4 py-2 mx-1 rounded-md hover:bg-blue-600 w-full md:w-auto">Check all the flights</button>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Insertion</h2>
        <div className="space-y-2">
          <button type="button" onClick={() => router.push("/admin/planes/new")} className="bg-green-500 text-white px-4 py-2 mx-1 rounded-md hover:bg-green-600 w-full md:w-auto">Add new plane</button>
          <button type="button" onClick={() => router.push("/admin/flights/new")} className="bg-green-500 text-white px-4 py-2 mx-1 rounded-md hover:bg-green-600 w-full md:w-auto">Add new flight</button>
        </div>
      </div>
    </div>

  );
}
