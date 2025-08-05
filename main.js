import fs from "fs";
import path from "path";
import { allocateDiscount } from "./src/allocator.js";
const main = () => {
  // 1. Get input file path from the command-line arguments.
  const inputFile = process.argv[2];

  // 2. Validate that an input file was provided. If not, show an error and how to use the script.
  if (!inputFile) {
    console.error("Error: Please provide a path to an input JSON file.");
    console.log("Usage: node main.js <path_to_input_file>");
    process.exit(1); // Exit the program with an error code
  }

  // 3. Load and parse the input data file inside a try...catch block for error handling.
  let inputData;
  try {
    // path.resolve ensures we have an absolute path to the file
    const rawInput = fs.readFileSync(path.resolve(inputFile), "utf-8");
    inputData = JSON.parse(rawInput);
  } catch (error) {
    console.error(`Error reading or parsing input file: ${error.message}`);
    process.exit(1);
  }

  // 4. Load and parse the configuration file.
  let config;
  try {
    const rawConfig = fs.readFileSync(path.resolve("config.json"), "utf-8");
    config = JSON.parse(rawConfig);
  } catch (error) {
    console.error(`Error reading or parsing config.json: ${error.message}`);
    process.exit(1);
  }

  // 5. Destructure the needed data from the loaded input file
  const { siteKitty, salesAgents } = inputData;

  // 6. Call the allocation engine with all the necessary data
  const result = allocateDiscount(siteKitty, salesAgents, config);

  // 7. Output the final result as a nicely formatted JSON string.
  //    The 'null, 2' arguments make the JSON output readable.
  console.log(JSON.stringify(result, null, 2));
};

main();
