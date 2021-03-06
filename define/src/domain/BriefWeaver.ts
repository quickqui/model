import { Entity, withDomainModel } from "./DomainModel";
import * as _ from "lodash";
import { forEachEntity } from "./DomainModel";
import { ModelWeaver, Model, WeaveLog } from "@quick-qui/model-core";
import { appendAnnotation } from "../Annotation";

export class BriefWeaver implements ModelWeaver {
  name = "brief";
  weave(model: Model): [Model, WeaveLog[]] {
    const withDomain = withDomainModel(model);
    if (!withDomain) {
      return [model, []];
    }
    return forEachEntity(withDomain, defaultBrief);
  }
}

//TODO 是否应该在这里？brief不应该是entities的基本属性，应该是跟function相关的？好像也不是。算是一种表现模型？
function defaultBrief(entity: Entity): [Entity, WeaveLog[]] {
  const guessingName = [
    "name",
    "title",
    "subject",
    "description",
    "code",
    "text",
    "content",
  ];
  if (!entity?.annotations?.["brief"]) {
    const guessedName = guessingName.find((gn) => {
      return !!entity.properties.find((p) => p.name === gn);
    });
    if (guessedName) {
      return [
        appendAnnotation(entity, "brief", guessedName),
        [
          new WeaveLog(
            `entities/${entity.name}`,
            `brief guessed for entities/${entity.name}- ${guessedName}`
          ),
        ],
      ];
    } else return [entity, []];
  }
  return [entity, []];
}
