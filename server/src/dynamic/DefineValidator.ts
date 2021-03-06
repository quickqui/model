import { ValidateError } from "@quick-qui/model-core";
import { Define } from "./Define";


import enjoi from "enjoi";
import schema from "./DefineSchema.json";
const s = enjoi.schema(schema);

export function bySchema(defines:Define[]): ValidateError[] {
  return defines
    .map(def => {
      const { error, value } = s.validate(def, { abortEarly: false });

      return (
        error?.details.map(detail => {
          return new ValidateError(
            `defines/${def.name ?? "_noName"}`,
            detail.message
          );
        }) ?? []
      );
    })
    .flat();
}