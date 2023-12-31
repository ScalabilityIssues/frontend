'use server'

import { PlanesClient } from "@/clients/gen/planes.client"
import { serverTransport } from "@/clients/transports/server"

export async function exampleServerGRPC() {
    const client = new PlanesClient(serverTransport.flightManager);
    const resp = await client.listPlanes({});
    return { ...resp.response }
}

