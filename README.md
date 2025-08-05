# Red Health: Smart Discount Allocation Engine

This project is a script-based application designed to fairly, explainably, and dynamically allocate a fixed discount kitty among a team of sales agents. The allocation is data-driven, considering multiple agent attributes like performance, seniority, and sales effectiveness.

## Core Approach: The "Base + Bonus" Model

The allocation logic is built on a **Base + Bonus Model**, which was chosen to balance team-wide rewards with incentives for individual excellence. This approach directly implements a key suggestion from the project description.

Here is how it works:

1.  **Kitty Split**: The total `siteKitty` is divided into two distinct pools based on a configurable split (e.g., 40% Base, 60% Bonus):

    - **Base Pool**: This portion rewards team participation. It is distributed **equally** among all sales agents, providing a fair minimum allocation for everyone and fostering team morale.
    - **Bonus Pool**: This portion rewards individual performance. It is distributed **proportionally** based on a calculated `weightedScore` for each agent.

2.  **Weighted Score Calculation**: The bonus allocation is driven by a weighted score, which addresses the core requirements of the assignment:
    - **Normalization**: To fairly compare different metrics (like a 0-100 score vs. months of seniority), all agent attributes are first normalized to a common 0-1 scale. This ensures no single attribute disproportionately influences the outcome.
    - **Configurable Weights**: Each normalized attribute is multiplied by a weight defined in `config.json`. This allows a manager to easily tune the system's priorities without changing any code, making the logic future-proof and tunable. For example, `targetAchievedPercent` can be weighted more heavily than `activeClients` to emphasize sales effectiveness.

## Design Justification & Edge Case Handling

This section provides a detailed breakdown of how the chosen model handles all scenarios and edge cases outlined in the assignment.

### Why the "Base + Bonus" Model is Best

This model was chosen over simpler alternatives (like a purely proportional model or a tier-based system) because it provides the most balanced and fair solution for every question posed in the assignment brief:

- **Performance might signal reliability. Should a top performer get more?**

  - **Yes.** The "Bonus Pool" is distributed proportionally based on performance scores. This directly and significantly rewards top performers.

- **Seniority could represent loyalty. Should long-timers receive extra credit?**

  - **Yes.** `seniorityMonths` is a key factor in the weighted score calculation for the bonus pool. By assigning it a weight in `config.json`, the model explicitly gives "extra credit" to loyal, long-time agents.

- **Target achievement is a direct link to sales effectiveness. How do you reward this?**

  - **Yes.** This is a core strength. The model uses `targetAchievedPercent` as a heavily weighted component of the bonus calculation, creating a direct and powerful financial reward for effective sales agents.

- **Active clients indicate current workload. Should higher responsibility earn more?**

  - **Yes.** The number of `activeClients` contributes to the weighted score. Therefore, agents managing a higher workload receive a larger portion of the bonus pool, directly rewarding their higher responsibility.

- **These parameters vary in range and meaning. How do you bring them to a common scale?**

  - **Through Normalization.** The "Bonus" calculation is built on a normalization function that converts every attribute to a common 0-1 scale before applying weights, ensuring fair comparisons.

- **You can design logic to assign base amounts first, then add variable bonuses.**

  - **This is the exact implementation.** Our model is the literal fulfillment of this design suggestion, splitting the kitty into a "Base Pool" (for the base amount) and a "Bonus Pool" (for the variable bonus).

- **Consider adding minimum and maximum thresholds per agent.**

  - **The model provides a natural minimum.** The "Base Pool" guarantees a fair, non-zero minimum for every agent, ensuring team-wide inclusion. Strict min/max thresholds can also be easily applied as a final step on top of this logic.

- **What happens if all agents are exactly the same on all fields?**

  - **It behaves perfectly.** If all agents are identical, the Base Pool is split equally, and their weighted scores for the Bonus Pool are also identical, meaning the Bonus Pool is _also_ split equally. The final result is that every agent receives the exact same amount, which is the ideal and fair outcome.

- **Avoid hardcoding logic where possible — your system should be future-proof and tunable.**
  - **The system is highly tunable.** The split between the Base and Bonus pools and the weights for every performance metric are all defined in `config.json`, allowing a manager to easily adjust priorities without touching a single line of code.

### Edge Cases Handled

The implementation includes logic to handle several important edge cases to ensure robust and predictable behavior:

- **Empty Agent List**: If the `salesAgents` array is empty or not provided, the program will not crash. It will return an empty `allocations` array and correctly report the entire kitty as remaining.
- **Zero-Value Attributes**: If all agents have a value of `0` for a specific attribute (e.g., no one has any active clients), the normalization logic prevents a division-by-zero error by ensuring the divisor is at least 1.
- **Rounding Errors**: To prevent allocating more money than available, the logic uses `Math.floor()` during proportional calculations. The few rupees or paisas left over from this flooring are then collected and distributed to the single highest-scoring agent, ensuring the entire kitty is used.
- **Zero Total Score**: In the unlikely event that all agents score zero on all metrics, the Bonus Pool is not distributed. The agents still receive their equal share of the Base Pool.

## How to Run the Program

### Prerequisites

- Node.js (v18 or later recommended)
- npm (comes bundled with Node.js)

### 1. Installation

Clone the repository and install the necessary dependencies (only `jest` for testing).

```bash
# Navigate to the project directory
cd redhealth-discount-engine

# Install dependencies
npm install
```

### 2. Running the Script

To run the allocation engine, use the `node main.js` command, followed by the path to your input JSON file.

**Example:**

```bash
node main.js samples/input_normal.json
```

The script will print a formatted JSON object to the console containing the detailed allocations and a summary report.

### 3. Running Tests

To run the automated tests and verify the logic, use the `test` script defined in `package.json`.

```bash
npm test
```

This will execute all test suites, including checks for normal cases, edge cases, and the Base + Bonus logic.
