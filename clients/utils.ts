import { FieldMask } from "./gen/google/protobuf/field_mask";

export function makeUpdateMask<T>(obj: Partial<T>): { update: T, update_mask: FieldMask } {
    const paths = Object.keys(obj);
    return { update: obj as T, update_mask: { paths } };
}