import {readFile} from "node:fs/promises";
import {extname} from "node:path";
import {
  isValidEnvironment,
  isValidFileType,
  isValidFileDescription,
  isValidConfig
} from "./Config/validators";

/**
 * Which environment are we currently running in
 */
export type Environment = "production" | "development";

/**
 * The type of this file
 * 
 * If not provided, this value will be inferred from the file extension. 
 * This determines what processing will be run on the input file
 */
export type FileType = "js" | "css" | "sass" | "scss";

/**
 * A single file to be processed and output by the build system
 */
export type FileDescription = {
  input: string,
  output: string,
  environment?: Environment,
  type?:  FileType,
  minify?: boolean,
  map?: boolean
};

/**
 * Minimum configuration required to get assets compiled
 */
export type Config = {
  name?: string,
  manifest?: boolean | string,
  outDir: string,
  files: FileDescription[]
};

export type PreparedConfig = Config & {
  files: Required<FileDescription>[]
};

function inferFileType(file: string): FileType {
  const extension = extname(file).substring(1).toLowerCase();

  console.log(extension);

  if (!isValidFileType(extension)) {
    throw new Error(`Could not determine type of file:\n${file}`);
  }

  return extension;
}

function populateFileDescription(description: FileDescription): Required<FileDescription> {
  if (!isValidEnvironment(description.environment)) {
    description.environment = "development";
  }

  if (!isValidFileType(description.type)) {
    description.type = inferFileType(description.input);
  }

  if (typeof description.minify !== "boolean") {
    description.minify = description.environment === "production";
  }

  if (typeof description.map !== "boolean") {
    description.map = false;
  }

  return description as Required<FileDescription>;
}

/**
 * Parse the given JSON string to see if it is a valid configuration
 *
 * @param {string} input Configuration JSON string
 * @return {Config}      Parsed configuration
 */
function parse(input: string): PreparedConfig {
  const config = JSON.parse(input) as unknown;

  if (config === null || typeof config === "string") {
    throw new Error(`Failed to parse the Bundlit config file`);
  }

  if (!isValidConfig(config)) {
    throw new Error(`Config is missing required fields`);
  }
  
  config.files = config.files.map((description: FileDescription) => {
    return populateFileDescription(description);
  });

  return config as PreparedConfig;
}

/**
 * Attempt to load a JSON configuration file from disk
 *
 * @param {string} file Absolute path to config file
 */
export async function load(file: string): Promise<PreparedConfig> {
  let contents;

  try {
    contents = await readFile(file, {
      encoding: "utf-8"
    });
  } catch (e) {
    throw new Error(`Failed to load Bundlit config file:\n${file}`);
  }

  return parse(contents);
};
