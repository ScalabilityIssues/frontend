"use client"

import { ValidationClient } from "@/clients/gen/validationsvc/validation.client"
import { webTransport } from "@/clients/transports/web";
import QrScanner from "@/components/qr-scanner"
import { useCallback, useEffect, useState } from "react"
import * as ed from '@noble/ed25519';
import { SignedTicket } from "@/clients/gen/validationsvc/validation";
import { Html5QrcodeResult } from "html5-qrcode";
import { Ticket } from "@/clients/gen/ticketsrvc/tickets";

/*
API pseudo structure
- On GET show the home page for validating the ticket by the staff
- On button clicking call gRPC method to validate the ticket
@ JonM0
*/
export default function Staff() {
    const [keys, setKeys] = useState<Uint8Array[]>([])

    const [detectedCode, setDetectedCode] = useState<string>("")
    const [ticket, setTicket] = useState<Ticket | null>(null)

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
                setTicket(Ticket.fromBinary(ticketBlob))
            }
            else {
                console.log('Invalid signature');
            }
        })
    }, [detectedCode, keys, ticket])


    return (
        <div className="container mx-auto">
            <div>Ticket id: {ticket?.id}</div>
            <button type="button" onClick={() => (setTicket(null), setDetectedCode(""))}>Clear</button>
            {keys.length > 0 ? <div className="mx-auto">
                <QrScanner successCallback={setDetectedCode} />
            </div> : <div>Fetching keys...</div>}
        </div>
    )
}