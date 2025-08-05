/*
Implement the Normalization Logic
The Goal: The attributes for each agent—performanceScore (0-100), seniorityMonths, and activeClients—are all on different scales. To compare them fairly, we must bring them to a common scale (a process called normalization). We'll convert each value into a score between 0 and 1, where 1 represents the highest value for that attribute across all agents in the list.
*/

/**
 * Finds the maximum value for each relevant attribute across all agents.
 * This is the first step in normalization.
 * @param {Array<Object>} agents - The list of sales agents from the input.
 * @returns {Object} An object containing the max value for each attribute.
 *
 * Example:
 * If agents have performanceScores of 90 and 70, it returns { performanceScore: 90, ... }
 */

const findMaxValues = (agents) => {
  const maxValues = {
    performanceScore: 0,
    seniorityMonths: 0,
    targetAchievedPercent: 0,
    activeClients: 0,
  };

  for (const agent of agents) {
    for (const key in maxValues) {
      if (agent[key] > maxValues[key]) {
        maxValues[key] = agent[key];
      }
    }
  }
  return maxValues;
};

/**
 * Normalizes agent data to a 0-1 scale based on the maximum values found.
 * A score of 1 means the agent has the max value for that attribute.
 * @param {Array<Object>} agents - The list of sales agents.
 * @returns {Array<Object>} A new list of agents, with each agent object
 * containing an added `normalized` property.
 */

export const normalizeAgents = (agents) => {
  const maxValues = findMaxValues(agents);

  for (const key in maxValues) {
    if (maxValues[key] === 0) {
      maxValues[key] = 1;
    }
  }

  return agents.map((agent) => {
    const normalized = {
      performanceScore: agent.performanceScore / maxValues.performanceScore,
      seniorityMonths: agent.seniorityMonths / maxValues.seniorityMonths,
      targetAchievedPercent:
        agent.targetAchievedPercent / maxValues.targetAchievedPercent,
      activeClients: agent.activeClients / maxValues.activeClients,
    };
    return { ...agent, normalized };
  });
};
