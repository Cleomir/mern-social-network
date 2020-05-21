import Ajv, { Options, ValidateFunction } from "ajv";

const validateRequest = (
  schema: object,
  data: object,
  ...referencedSchemas: object[]
): Ajv.ErrorObject[] | null | undefined => {
  const ajvOptions: Options = { allErrors: true };

  // add referenced schemas, if any
  ajvOptions.schemas =
    referencedSchemas.length > 0 ? [...referencedSchemas, schema] : [schema];

  const ajv = new Ajv(ajvOptions);
  const validate: ValidateFunction = ajv.compile(schema);

  if (!validate(data)) {
    return validate.errors;
  }
};

export default validateRequest;
