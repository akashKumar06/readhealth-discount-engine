import { normalizeAgents } from "./normalizer.js";

// --- Helper functions ---
const calculateWeightedScores = (normalizedAgents, weights) => {
  return normalizedAgents.map((agent) => {
    let score = 0;
    for (const key in weights) {
      if (agent.normalized[key] && weights[key]) {
        score += agent.normalized[key] * weights[key];
      }
    }
    return { ...agent, weightedScore: score };
  });
};

const generateJustification = (agent, thresholds) => {
  if (agent.weightedScore >= thresholds.high) {
    return "Excellent performance bonus on top of a base allocation for team contribution.";
  }
  if (agent.weightedScore >= thresholds.medium) {
    return "Strong performance bonus added to the base team allocation.";
  }
  return "Receives base team allocation plus a performance-based bonus.";
};

// --- Main Allocation Function ---
export const allocateDiscount = (siteKitty, salesAgents, config) => {
  if (!salesAgents || salesAgents.length === 0) {
    return { allocations: [], totalAllocated: 0, remainingKitty: siteKitty };
  }

  // --- Step 1: Split the Kitty into Base and Bonus Pools ---
  const baseBonusSplit = config.baseBonusSplit || 0; // Default to 0 if not provided
  const baseKitty = siteKitty * baseBonusSplit;
  const bonusKitty = siteKitty * (1 - baseBonusSplit);

  // --- Step 2: Calculate the Base Allocation for Everyone ---
  // This amount is shared equally among all agents.
  const baseAllocationPerAgent = Math.floor(baseKitty / salesAgents.length);

  // Initialize allocations with the base amount for each agent.
  let allocations = salesAgents.map((agent) => ({
    id: agent.id,
    assignedDiscount: baseAllocationPerAgent,
    justification: "",
  }));
  let totalAllocated = baseAllocationPerAgent * salesAgents.length;

  // --- Step 3: Calculate and Distribute the Bonus Pool ---
  const normalizedAgents = normalizeAgents(salesAgents);
  const agentsWithScores = calculateWeightedScores(
    normalizedAgents,
    config.weights
  );
  const totalWeightedScore = agentsWithScores.reduce(
    (sum, agent) => sum + agent.weightedScore,
    0
  );

  if (totalWeightedScore > 0) {
    // Distribute the bonus kitty proportionally
    for (const agent of agentsWithScores) {
      const proportion = agent.weightedScore / totalWeightedScore;
      const bonusAmount = Math.floor(proportion * bonusKitty);

      const allocationRecord = allocations.find((a) => a.id === agent.id);
      if (allocationRecord) {
        allocationRecord.assignedDiscount += bonusAmount;
        totalAllocated += bonusAmount;
      }
      // Add justification based on performance
      allocationRecord.justification = generateJustification(
        agent,
        config.justificationThresholds
      );
    }
  }

  // --- Step 4: Distribute All Remainders ---
  // This includes remainders from both base and bonus flooring.
  let remainingKitty = siteKitty - totalAllocated;
  if (remainingKitty > 0 && agentsWithScores.length > 0) {
    agentsWithScores.sort((a, b) => b.weightedScore - a.weightedScore);
    const topAgentId = agentsWithScores[0].id;

    const topAgentAllocation = allocations.find((a) => a.id === topAgentId);
    if (topAgentAllocation) {
      topAgentAllocation.assignedDiscount += remainingKitty;
      totalAllocated += remainingKitty;
    }
  }

  // Final check for agents who might not have gotten a bonus justification
  allocations.forEach((a) => {
    if (!a.justification) {
      a.justification =
        "Receives base team allocation. No performance bonus applied.";
    }
  });

  return {
    allocations,
    totalAllocated,
    remainingKitty: siteKitty - totalAllocated,
  };
};
