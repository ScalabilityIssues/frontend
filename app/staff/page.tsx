"use client"

import { ValidationClient } from "@/clients/gen/validationsvc/validation.client"
import { webTransport } from "@/clients/transports/web";
import QrScanner from "@/components/qr-scanner"
import { useEffect, useState } from "react"
import * as ed from '@noble/ed25519';
import { SignedTicket, TicketClaims } from "@/clients/gen/validationsvc/validation";

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
            <div className="block text-black-700 mb-4">Ticket id: {ticket?.ticketId}</div>
            <button
                type="button"
                onClick={() => (setTicket(null), setDetectedCode(""))}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Clear
            </button>
            {keys.length > 0 ? (
                <div className="mx-auto mt-8">
                    <QrScanner successCallback={setDetectedCode} />
                </div>
            ) : (
                <div className="mt-8 text-center text-gray-500">Fetching keys...</div>
            )}
        </div>

    )
}