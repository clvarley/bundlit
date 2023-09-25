import type {Environment, FileType, FileDescription, Config} from "../Config"; 

function isObject(subject: unknown): subject is Record<string, any>
{
  return (typeof subject === "object" && subject !== null);
}

export function isValidEnvironment(environment: unknown): environment is Environment
{
  return (typeof environment === "string"
    && ["production", "development"].includes(environment.toLocaleLowerCase())
  );
};

export function isValidFileType(type: unknown): type is FileType
{
  return (typeof type === "string"
    && ["js", "css", "sass", "scss"].includes(type.toLocaleLowerCase())
  );
};

export function isValidFileDescription(description: unknown): description is FileDescription
{
  if (!isObject(description)) {
    return false;
  }

  if ("input" in description === false || typeof description.input !== "string") {
    return false;
  }

  if ("output" in description === false || typeof description.output !== "string") {
    return false;
  }

  return true;
};

export function isValidConfig(config: unknown): config is Config
{
  if (!isObject(config)) {
    return false;
  }

  if ("outDir" in config === false || typeof config.outDir !== "string") {
    return false;
  }

  if ("files" in config === false || !Array.isArray(config.files)) {
    return false;
  }

  return config.files.every<FileDescription>(isValidFileDescription);
};
