import { mapReflectionToState } from "./mappers";
import { faSave } from "@fortawesome/free-solid-svg-icons";

describe("mapReflectionToState", () => {
  it("should map reflection data to wellness state correctly", () => {
    const mockReflection = {
      user_id: "test-user-id",
      last_updated: "2025-01-10T00:00:00Z",
      name: "Test User",
      email: "test@example.com",
      date: "2025-01-10",
      is_coach: true,
      wake_time: "07:00",
      bedtime: "22:00",
      quote_of_day: "Test quote",
      hydration: 8,
      morning_vitality: 7,
      afternoon_vitality: 6,
      evening_vitality: 5,
      morning_meals: "Breakfast",
      morning_meals_notes: "Notes",
      morning_meals_cravings: "None",
      afternoon_meals: "Lunch",
      afternoon_meals_notes: "Notes",
      afternoon_meals_cravings: "None",
      evening_meals: "Dinner",
      evening_meals_notes: "Notes",
      evening_meals_cravings: "None",
      morning_activity: "Exercise",
      afternoon_activity: "Walk",
      evening_activity: "Yoga",
    };

    const result = mapReflectionToState(mockReflection);

    expect(result).toEqual({
      wasViewingClients: false,
      userId: "test-user-id",
      isLoading: false,
      isAuthenticated: true,
      saveButton: {
        text: "Submit",
        icon: faSave,
        variant: "primary",
      },
      errorMessage: "",
      showModal: false,
      modalMessage: {
        title: "",
        body: "",
        footer: "",
      },
      lastUpdated: "2025-01-10T00:00:00Z",
      isDiverged: false,
      targetDate: null,
      name: "Test User",
      email: "test@example.com",
      date: "2025-01-10",
      isCoach: true,
      "wake-time": "07:00",
      bedtime: "22:00",
      qotd: "Test quote",
      hydration: 8,
      "morning-vitality": 7,
      "afternoon-vitality": 6,
      "evening-vitality": 5,
      "morning-meals": "Breakfast",
      "morning-meals-notes": "Notes",
      "morning-meals-cravings": "None",
      "afternoon-meals": "Lunch",
      "afternoon-meals-notes": "Notes",
      "afternoon-meals-cravings": "None",
      "evening-meals": "Dinner",
      "evening-meals-notes": "Notes",
      "evening-meals-cravings": "None",
      "morning-activity": "Exercise",
      "afternoon-activity": "Walk",
      "evening-activity": "Yoga",
    });
  });

  it("should handle missing optional fields", () => {
    const mockReflection = {
      user_id: "test-user-id",
      name: "Test User",
      email: "test@example.com",
      date: "2025-01-10",
      is_coach: true,
    };

    const result = mapReflectionToState(mockReflection);

    expect(result["wake-time"]).toBe("");
    expect(result.bedtime).toBe("");
    expect(result.qotd).toBe("");
    expect(result.hydration).toBe(0);
    expect(result["morning-vitality"]).toBe(0);
    expect(result["afternoon-vitality"]).toBe(0);
    expect(result["evening-vitality"]).toBe(0);
    expect(result["morning-meals"]).toBe("");
    expect(result["morning-meals-notes"]).toBe("");
    expect(result["morning-meals-cravings"]).toBe("");
    expect(result["afternoon-meals"]).toBe("");
    expect(result["afternoon-meals-notes"]).toBe("");
    expect(result["afternoon-meals-cravings"]).toBe("");
    expect(result["evening-meals"]).toBe("");
    expect(result["evening-meals-notes"]).toBe("");
    expect(result["evening-meals-cravings"]).toBe("");
    expect(result["morning-activity"]).toBe("");
    expect(result["afternoon-activity"]).toBe("");
    expect(result["evening-activity"]).toBe("");
  });
});
