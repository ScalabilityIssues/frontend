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
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Monitoring</h2>
      <button type="button" onClick={() => router.push("/admin/airports/")}>Check all the airports</button>
      <button type="button" onClick={() => router.push("/admin/planes/")}>Check all the planes</button>
      <button type="button" onClick={() => router.push("/admin/flights/")}>Check all the flights</button>
      <h2>Insertion</h2>
      <button type="button" onClick={() => router.push("/admin/planes/new")}>Add new plane</button>
      <button type="button" onClick={() => router.push("/admin/flights/new")}>Add new flight</button>
    </div>
  );
}
