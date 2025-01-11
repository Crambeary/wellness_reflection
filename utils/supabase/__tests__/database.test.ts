import {
  upsertWellnessReflection,
  getWellnessReflections,
  getTodaysReflection,
  getSelectedReflection,
} from "../database";
import { createClient } from "../server";

// Mock the helpers module
jest.mock("@/utils/helpers", () => ({
  getLocalISOString: () => "2025-01-10",
}));

// Mock the Supabase client
jest.mock("../server", () => ({
  createClient: jest.fn(),
}));

describe("Database Functions", () => {
  const mockUserId = "test-user-id";
  let mockSupabase: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a mock Supabase client with chaining
    mockSupabase = {
      from: jest.fn(() => mockSupabase),
      select: jest.fn(() => mockSupabase),
      insert: jest.fn(() => mockSupabase),
      update: jest.fn(() => mockSupabase),
      eq: jest.fn(() => mockSupabase),
      order: jest.fn(() => mockSupabase),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    };

    // Make createClient return our mock
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  // describe('upsertWellnessReflection', () => {
  //   const mockReflectionData = {
  //     date: '2025-01-10',
  //     'wake-time': '07:00',
  //     bedtime: '23:00',
  //     qotd: 'Test quote',
  //     hydration: 8,
  //     'morning-vitality': 5,
  //     'afternoon-vitality': 4,
  //     'evening-vitality': 3,
  //     'morning-meals': 'Breakfast',
  //     'morning-meals-notes': 'Notes',
  //     'morning-meals-cravings': 'None',
  //   }

  //   it('should insert new wellness reflection data', async () => {
  //     // Mock no existing reflection for initial check
  //     mockSupabase.single.mockResolvedValueOnce({ data: null, error: null })

  //     // Mock successful insert
  //     const mockInsertResponse = {
  //       data: [{ ...mockReflectionData, user_id: mockUserId }],
  //       error: null
  //     }
  //     mockSupabase.select.mockResolvedValueOnce(mockInsertResponse)

  //     const result = await upsertWellnessReflection(mockReflectionData, mockUserId)

  //     expect(mockSupabase.from).toHaveBeenCalledWith('wellness_reflections')
  //     expect(result).toEqual({ reflection: mockInsertResponse.data[0], error: null })
  //   })

  //   it('should update existing wellness reflection data', async () => {
  //     // Mock existing reflection for initial check
  //     mockSupabase.single.mockResolvedValueOnce({
  //       data: { ...mockReflectionData, user_id: mockUserId },
  //       error: null
  //     })

  //     // Mock successful update
  //     const mockUpdateResponse = {
  //       data: [{ ...mockReflectionData, user_id: mockUserId }],
  //       error: null
  //     }
  //     mockSupabase.select.mockResolvedValueOnce(mockUpdateResponse)

  //     const result = await upsertWellnessReflection(mockReflectionData, mockUserId)

  //     expect(mockSupabase.from).toHaveBeenCalledWith('wellness_reflections')
  //     expect(result).toEqual({ reflection: mockUpdateResponse.data[0], error: null })
  //   })

  //   it('should handle errors gracefully', async () => {
  //     const mockError = new Error('Database error')
  //     mockSupabase.single.mockRejectedValueOnce(mockError)

  //     const result = await upsertWellnessReflection(mockReflectionData, mockUserId)
  //     expect(result.error).toBeTruthy()
  //     expect(result.reflection).toBeNull()
  //   })
  // })

  describe("getWellnessReflections", () => {
    it("should fetch all wellness reflections for a user", async () => {
      const mockReflections = [
        { id: 1, date: "2025-01-10" },
        { id: 2, date: "2025-01-09" },
      ];

      mockSupabase.order.mockResolvedValueOnce({
        data: mockReflections,
        error: null,
      });

      const result = await getWellnessReflections(mockUserId);

      expect(mockSupabase.from).toHaveBeenCalledWith("wellness_reflections");
      expect(result).toEqual({ reflections: mockReflections, error: null });
    });
  });

  describe("getTodaysReflection", () => {
    it("should fetch today's reflection", async () => {
      const mockTodayReflection = { id: 1, date: "2025-01-10" };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockTodayReflection,
        error: null,
      });

      const result = await getTodaysReflection(mockUserId);

      expect(mockSupabase.from).toHaveBeenCalledWith("wellness_reflections");
      expect(result).toEqual({ reflection: mockTodayReflection, error: null });
    });

    it("should return null when no reflection exists", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" },
      });

      const result = await getTodaysReflection(mockUserId);

      expect(result).toEqual({ reflection: null, error: null });
    });
  });

  describe("getSelectedReflection", () => {
    const mockDate = "2025-01-10";

    it("should fetch reflection for specific date", async () => {
      const mockReflection = { id: 1, date: mockDate };

      mockSupabase.single.mockResolvedValueOnce({
        data: mockReflection,
        error: null,
      });

      const result = await getSelectedReflection(mockUserId, mockDate);

      expect(mockSupabase.from).toHaveBeenCalledWith("wellness_reflections");
      expect(result).toEqual({ reflection: mockReflection, error: null });
    });

    it("should return null when no reflection exists", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116" },
      });

      const result = await getSelectedReflection(mockUserId, mockDate);

      expect(result).toEqual({ reflection: null, error: null });
    });
  });
});
