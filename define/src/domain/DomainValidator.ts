import { ModelValidator, ValidateError, Model } from "@quick-qui/model-core";
import {
  existEntity,
  DomainModel,
  withDomainModel
} from "./DomainModel";
import { getNameInsureCategory } from "../BaseDefine";
import enjoi from "enjoi";
import schema from "./EntitySchema.json";

export class DomainValidator implements ModelValidator {
  validate(model: Model): ValidateError[] {
    //TODO 没有完全实现

    return [
      ...injectValidate(model),
      ...(withDomainModel(model)?.domainModel?.q_applyTo(bySchema) ?? [])
    ];
  }
}
function injectValidate(model: Model): ValidateError[] {
  const re: ValidateError[] = [];
  const m = withDomainModel(model);
  if (m?.domainModel) {
    m.domainModel.entities.forEach(entity => {
      if (entity.inject) {
        try {
          const name = getNameInsureCategory(entity.inject, "entities");
          if (!existEntity(m, name)) {
            re.push(
              new ValidateError(
                `entities/${entity.name}`,
                `no entity find in injection - expect=${name}`
              )
            );
          }
        } catch (e) {
          re.push(new ValidateError(`entities/${entity.name}`, e.message));
        }
      }
    });
  }
  return re;
}
  const s = enjoi.schema(schema);

function bySchema(model: DomainModel): ValidateError[] {
  return model.entities
    .map(entity => {
      const { error, value } = s.validate(entity,  { abortEarly: false });

      return (
        error?.details.map(detail => {
          return new ValidateError(
            `entities/${entity.name ?? "_noName"}`,
            detail.message
          );
        }) ?? []
      );
    })
    .flat();
}
