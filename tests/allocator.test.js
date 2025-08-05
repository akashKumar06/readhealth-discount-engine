
import { allocateDiscount } from '../src/allocator.js';

import config from '../config.json' with { type: 'json' };

import normalInput from '../samples/input_normal.json' with { type: 'json' };
import allSameInput from '../samples/input_allsame.json' with { type: 'json' };
import roundingInput from '../samples/input_rounding.json' with { type: 'json' };


describe('Discount Allocation Engine', () => {

  // Test Suite 1: Normal Case
  describe('when handling a normal case', () => {
    const { siteKitty, salesAgents } = normalInput;
    const result = allocateDiscount(siteKitty, salesAgents, config);
    const allocations = result.allocations;

    it('should allocate the entire kitty exactly', () => {
      expect(result.totalAllocated).toBe(siteKitty);
      expect(result.remainingKitty).toBe(0);
    });

    it('should assign a higher discount to a higher-performing agent', () => {
      const agentA3 = allocations.find(a => a.id === 'A3'); // Top performer
      const agentA2 = allocations.find(a => a.id === 'A2'); // Lower performer
      expect(agentA3.assignedDiscount).toBeGreaterThan(agentA2.assignedDiscount);
    });
  });

  // Test Suite 2: All-Same Scores Case
  describe('when all agents have identical scores', () => {
    const { siteKitty, salesAgents } = allSameInput;
    const result = allocateDiscount(siteKitty, salesAgents, config);
    const allocations = result.allocations;
    
    it('should allocate the kitty almost equally among all agents', () => {
      // With 10000 kitty and 3 agents, two get 3333, one gets 3334 due to remainder
      const firstAgentDiscount = allocations[0].assignedDiscount;
      const secondAgentDiscount = allocations[1].assignedDiscount;
      // Check that their allocations are within 1 unit of each other
      expect(Math.abs(firstAgentDiscount - secondAgentDiscount)).toBeLessThanOrEqual(1);
    });

    it('should allocate the entire kitty', () => {
        expect(result.totalAllocated).toBe(siteKitty);
    });
  });

  // Test Suite 3: Rounding Edge Case
  describe('when dealing with a rounding edge case', () => {
    const { siteKitty, salesAgents } = roundingInput;
    const result = allocateDiscount(siteKitty, salesAgents, config);

    it('should allocate the entire kitty exactly, leaving no remainder', () => {
      expect(result.totalAllocated).toBe(siteKitty);
      expect(result.remainingKitty).toBe(0);
    });
  });

  // Test Suite 4: Base + Bonus Logic
  describe('when using the Base + Bonus model', () => {
    const { siteKitty, salesAgents } = normalInput; 
    const result = allocateDiscount(siteKitty, salesAgents, config);
    const allocations = result.allocations;

    const baseKitty = siteKitty * config.baseBonusSplit;
    const expectedBasePerAgent = Math.floor(baseKitty / salesAgents.length);

    it('should give even the lowest performer at least the base allocation', () => {
      // Find the agent who received the minimum discount
      const minAllocation = Math.min(...allocations.map(a => a.assignedDiscount));
      expect(minAllocation).toBeGreaterThanOrEqual(expectedBasePerAgent);
    });

    it('should give the top performer more than just the base allocation', () => {
        const agentA3 = allocations.find(a => a.id === 'A3'); // Top performer
        expect(agentA3.assignedDiscount).toBeGreaterThan(expectedBasePerAgent);
    });
  });
});