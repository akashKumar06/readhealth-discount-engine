Red Health: Smart Discount Allocation Engine
This project is a script-based application designed to fairly, explainably, and dynamically allocate a fixed discount kitty among a team of sales agents. The allocation is data-driven, considering multiple agent attributes like performance, seniority, and sales effectiveness.

Core Approach: The "Base + Bonus" Model
The allocation logic is built on a Base + Bonus Model, which was chosen to balance team-wide rewards with incentives for individual excellence. This approach directly implements a key suggestion from the project description.

Here is how it works:

Kitty Split: The total siteKitty is divided into two distinct pools based on a configurable split (e.g., 40% Base, 60% Bonus):

Base Pool: This portion rewards team participation. It is distributed equally among all sales agents, providing a fair minimum allocation for everyone and fostering team morale.

Bonus Pool: This portion rewards individual performance. It is distributed proportionally based on a calculated weightedScore for each agent.

Weighted Score Calculation: The bonus allocation is driven by a weighted score, which addresses the core requirements of the assignment:

Normalization: To fairly compare different metrics (like a 0-100 score vs. months of seniority), all agent attributes are first normalized to a common 0-1 scale. This ensures no single attribute disproportionately influences the outcome.

Configurable Weights: Each normalized attribute is multiplied by a weight defined in config.json. This allows a manager to easily tune the system's priorities without changing any code, making the logic future-proof and tunable. For example, targetAchievedPercent can be weighted more heavily than activeClients to emphasize sales effectiveness.

Fairness: This system ensures that top performers get more, long-timers receive extra credit for loyalty, and those with higher workloads are rewarded.

Edge Case Handling: The logic gracefully handles scenarios where all agents have identical stats by allocating the kitty equally, and it ensures the entire kitty is distributed down to the last unit by assigning any rounding remainders to the top-performing agent.

Assumptions Made
Input Data: The input JSON file is assumed to be well-formed and contain valid data types for all agent attributes. The script does not perform deep data validation.

Configuration: The weights in config.json are considered a business decision and are easily tunable. They should ideally sum to 1.0 for the scoring to be most intuitive.

Remainder Distribution: For simplicity and to ensure the entire kitty is used, any small amount left over after proportional allocation is given to the single highest-scoring agent.

How to Run the Program
Prerequisites
Node.js (v18 or later recommended)

npm (comes bundled with Node.js)

1. Installation
   Clone the repository and install the necessary dependencies (only jest for testing).

# Navigate to the project directory

cd redhealth-discount-engine

# Install dependencies

npm install

2. Running the Script
   To run the allocation engine, use the node main.js command, followed by the path to your input JSON file.

Example:

node main.js samples/input_normal.json

The script will print a formatted JSON object to the console containing the detailed allocations and a summary report.

3. Running Tests
   To run the automated tests and verify the logic, use the test script defined in package.json.

npm test

This will execute all test suites, including checks for normal cases, edge cases, and the Base + Bonus logic.
