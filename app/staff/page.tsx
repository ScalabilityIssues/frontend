"use client"

import { ValidationClient } from "@/clients/gen/validationsvc/validation.client"
import { webTransport } from "@/clients/transports/web";
import QrScanner from "@/components/qr-scanner"
import { useEffect, useState } from "react"
import * as ed from '@noble/ed25519';
import { SignedTicket, TicketClaims } from "@/clients/gen/validationsvc/validation";
import { Timestamp } from "@/clients/gen/google/protobuf/timestamp";

/*
API pseudo structure
- On GET show the home page for validating the ticket by the staff
- On button clicking call gRPC method to validate the ticket
@ JonM0
*/
export default function Staff() {
    const [keys, setKeys] = useState<Uint8Array[]>([])

    const [detectedCode, setDetectedCode] = useState<string>("")
    const [ticket, setTicket] = useState<TicketClaims | null>(null)

    useEffect(() => {
        new ValidationClient(webTransport).getVerificationKeys({}).then((result) => {
            setKeys(result.response.verificationKeys)
        })
    }, [])

    useEffect(() => {
        if (keys.length === 0 || detectedCode === "" || ticket !== null) { return; }

        const data = Buffer.from(detectedCode, 'base64')
        const { signature, ticket: ticketBlob } = SignedTicket.fromBinary(data)

        ed.verifyAsync(signature, ticketBlob, keys[0]).then(isValid => {
            if (isValid) {
                setTicket(TicketClaims.fromBinary(ticketBlob))
            }
            else {
                console.log('Invalid signature');
            }
        })
    }, [detectedCode, keys, ticket])

    return (
        <div className="container mx-auto p-8">
            {ticket !== null && (
                <div>
                    <h1 className="text-3xl font-semibold">Ticket Details</h1>
                    <p className="block text-black-700"><span className="font-semibold">Id:</span> {ticket.ticketId}</p>
                    <p className="block text-black-700"><span className="font-semibold">Reserved at:</span> {ticket.ticketCreatedAt ? (Timestamp.toDate(ticket.ticketCreatedAt).toLocaleString()) : ("No info available")}</p>

                    <h2 className="text-2xl font-semibold mt-6">Passenger Details</h2>
                    <p className="block text-black-700"><span className="font-semibold">SSN:</span> {ticket.passengerDetails?.ssn}</p>
                    <p className="block text-black-700"><span className="font-semibold">Name:</span> {ticket.passengerDetails?.name}</p>
                    <p className="block text-black-700"><span className="font-semibold">Surname:</span> {ticket.passengerDetails?.surname}</p>
                    <p className="block text-black-700"><span className="font-semibold">Birth date:</span> {ticket.passengerDetails?.birthDate ? (Timestamp.toDate(ticket.passengerDetails.birthDate).toLocaleDateString()) : ("No info available")}</p>
                    <p className="block text-black-700"><span className="font-semibold">Email:</span> {ticket.passengerDetails?.email}</p>

                    <button
                        type="button"
                        onClick={() => (setTicket(null), setDetectedCode(""))}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-6"                    >
                        Clear
                    </button>
                </div>
            )}
            {
                keys.length > 0 ? (
                    <div className="mx-auto mt-8" style={{ display: ticket !== null ? 'none' : undefined }}>
                        <QrScanner successCallback={setDetectedCode} />
                    </div>
                ) : (
                    <div className="mt-8 text-center text-gray-500">Fetching keys...</div>
                )
            }
        </div >

    )
}