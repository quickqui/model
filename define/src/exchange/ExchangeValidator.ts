import { ModelValidator, Model, ValidateError } from "@quick-qui/model-core";
import { withExchangeModel, ExchangeModel } from "./ExchangeModel";
import enjoi from "enjoi";
import schema from "./ExchangeSchema.json";
export class ExchangeValidator implements ModelValidator {
  validate(model: Model): ValidateError[] {
    let re: ValidateError[] = [];
    //TODO 没有完全实现
    return withExchangeModel(model)?.exchangeModel?.q_applyTo(bySchema) ?? [];
  }
}
const s = enjoi.schema(schema);

function bySchema(model: ExchangeModel): ValidateError[] {
  return model.exchanges
    .map(exchange => {
      const { error, value } = s.validate(exchange, { abortEarly: false });
      return (
        error?.details.map(
          detail =>
            new ValidateError(
              `exchanges/${exchange.resources ?? "_noName"}`,
              detail.message
            )
        ) ?? []
      );
    })
    .flat();
}
