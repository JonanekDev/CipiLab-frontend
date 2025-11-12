import openapi from '../../openapi.json';

type OpenAPISchema = typeof openapi.components.schemas;
type SchemaName = keyof OpenAPISchema;

export function getValidationRules(schemaName: SchemaName, propertyName: string) {
  const schema = openapi.components.schemas[schemaName];
  
  if (!schema || !('properties' in schema)) {
    return undefined;
  }
  
  const properties = schema.properties as Record<string, any>;
  return properties[propertyName];
}