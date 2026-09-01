import { describe, expect, it } from "vitest";
import { categoryTone } from "./category";
import { CLIENTS, CLIENT_LIST } from "./clients";
import { QUESTIONS } from "./questions";

describe("clients and categories", () => {
  it("keeps 10 to 15 catalog clients", () => {
    expect(CLIENT_LIST.length).toBeGreaterThanOrEqual(10);
    expect(CLIENT_LIST.length).toBeLessThanOrEqual(15);
    expect(new Set(CLIENT_LIST.map((item) => item.id)).size).toBe(CLIENT_LIST.length);
  });

  it("uses every catalog client at least once", () => {
    for (const client of Object.values(CLIENTS)) {
      expect(
        QUESTIONS.some(
          (item) => item.clientName === client.name && item.clientRole === client.role,
        ),
      ).toBe(true);
    }
  });

  it("maps every question category to a tone", () => {
    for (const question of QUESTIONS) {
      const tone = categoryTone(question.category);
      expect(tone.label.length).toBeGreaterThan(0);
    }
  });
});
