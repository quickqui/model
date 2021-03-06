import { ModelValidator, Model, ValidateError } from "@quick-qui/model-core";
import {
  existFunction,
  FunctionModel,
  withFunctionModel,
} from "./FunctionModel";
import { getNameInsureCategory, withoutAbstract } from "../BaseDefine";
import enjoi from "enjoi";
import schema from "./FunctionSchema.json";
import _ from "lodash";
import "@quick-qui/util/dist/extensions";
import { findResource, withInfoModel } from "../info";
export class FunctionValidator implements ModelValidator {
  validate(model: Model): ValidateError[] {
    return [
      ...extendValidate(model),
      ...(withFunctionModel(model)?.functionModel?.q_applyTo(bySchema) ?? []),
    ];
  }
}
export function resourceRefCheck(model: Model): ValidateError[] {
  const re: ValidateError[] = [];
  withoutAbstract(withFunctionModel(model)?.functionModel.functions).forEach(
    (fun) => {
      const infoModel = withInfoModel(model)?.infoModel;
      if (infoModel) {
        const resource = findResource(infoModel, fun.resource);
        if (!resource)
          re.push(
            new ValidateError(
              `functions/${fun.name}`,
              `no resource find - expect=${fun.resource}`
            )
          );
        else if (!resource[2])
          re.push(
            //TODO 这里可能应该是个warning，而不是一个error。
            new ValidateError(
              `functions/${fun.name}`,
              `no entity find - expect=${fun.resource}`
            )
          );
      } else {
        re.push(
          new ValidateError(`functions/${fun.name}`, `no info model find`)
        );
      }
    }
  );
  return re;
}

function extendValidate(model: Model): ValidateError[] {
  const re: ValidateError[] = [];
  withFunctionModel(model)?.functionModel.functions.forEach((fun) => {
    if (fun.extend) {
      try {
        const name = getNameInsureCategory(fun.extend, "functions");
        if (!existFunction(model, name)) {
          re.push(
            new ValidateError(
              `functions/${fun.name}`,
              `no function find in extend - expect=${name}`
            )
          );
        }
      } catch (e) {
        re.push(new ValidateError(`function/${fun.name}`, e.message));
      }
    }
  });
  return re;
}

const s = enjoi.schema(schema);
function bySchema(model: FunctionModel): ValidateError[] {
  return model.functions
    .filter((fun) => !(fun.abstract === true))
    .map((fun) => {
      const { error } = s.validate(fun, { abortEarly: false });

      return (
        error?.details.map(
          (detail) =>
            new ValidateError(
              `functions/${fun.name ?? "_noName"}`,
              detail.message
            )
        ) ?? []
      );
    })
    .flat();
}
