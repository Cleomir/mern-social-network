import Ajv from "ajv";

const validateRequest = (
  schema: object,
  data: object
): Ajv.ErrorObject[] | null | undefined => {
  const ajv = new Ajv({ allErrors: true });
  const valid = ajv.validate(schema, data);

  if (!valid) {
    return ajv.errors;
  }
};

export default validateRequest;
