import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";

const url = 'http://localhost:50051';
export const webTransport = new GrpcWebFetchTransport({ baseUrl: url });