import openapi from '../../openapi.json';

type OpenAPISchema = typeof openapi.components.schemas;
export type SchemaName = keyof OpenAPISchema;

export type ValidationError =
  | 'required'
  | 'length'
  | 'pattern'
  | 'invalid_enum'
  | 'match'

export function getValidationRules(schemaName: SchemaName, propertyName: string) {
  const schema = openapi.components.schemas[schemaName];
  
  if (!schema || !('properties' in schema)) {
    return undefined;
  }
  
  const properties = schema.properties as Record<string, any>;
  return properties[propertyName];
}


export function validateField(schemaName: SchemaName, field: string, value: string): ValidationError[] | null {
  const rules = getValidationRules(schemaName, field);
  if (!rules) return null;

  const errors: ValidationError[] = [];

  if ((rules?.minLength && value.length < rules.minLength)
    || (rules?.maxLength && value.length > rules.maxLength)) {
    errors.push('length');
  }

  if (rules?.pattern) {
    const pattern = new RegExp(rules.pattern.replace(/^\/|\/$/g, ''));
    if (!pattern.test(value)) {
      errors.push('pattern');
    }
  }

  if (rules?.enum && !rules.enum.includes(value)) {
    errors.push('invalid_enum');
  }

  return errors;
}