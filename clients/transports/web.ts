import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

const baseUrl = process.env.NEXT_PUBLIC_GRPC_URL || "/";
export const webTransport = new GrpcWebFetchTransport({ baseUrl });