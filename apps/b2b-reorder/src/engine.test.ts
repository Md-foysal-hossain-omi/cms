import { describe, expect, it } from "vitest";
import { analyze, median, type B2BOrder, type OrderLine } from "./engine";

const flour: OrderLine = { variantId: "v-flour", title: "Flour 25kg", quantity: 24, unitPrice: 20 };
const sugar: OrderLine = { variantId: "v-sugar", title: "Sugar 10kg", quantity: 10, unitPrice: 12 };

let seq = 0;
const order = (loc: string, date: string, lines: OrderLine[]): B2BOrder => ({
  id: `o${++seq}`,
  companyLocationId: loc,
  createdAt: `${date}T10:00:00Z`,
  lines,
});

const NOW = new Date("2026-10-26T09:00:00Z");

describe("median", () => {
  it("handles odd, even and empty lists", () => {
    expect(median([5, 1, 3])).toBe(3);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([])).toBe(0);
  });
});

describe("analyze", () => {
  it("flags an account that is late on its 14-day rhythm", () => {
    const orders = [
      order("bakery", "2026-09-07", [flour]),
      order("bakery", "2026-09-21", [flour]),
      order("bakery", "2026-10-05", [flour]),
    ];
    const [report] = analyze(orders, NOW);
    expect(report).toMatchObject({
      companyLocationId: "bakery",
      intervalDays: 14,
      nextDueAt: "2026-10-19",
      daysLate: 7,
      status: "overdue",
      expectedValue: 480,
    });
    expect(report!.suggestedLines).toEqual([{ variantId: "v-flour", title: "Flour 25kg", quantity: 24, unitPrice: 20 }]);
    expect(report!.priority).toBe(240); // 480 × 7/14
  });

  it("keeps a fresh account on track", () => {
    const orders = [
      order("cafe", "2026-09-26", [flour]),
      order("cafe", "2026-10-06", [flour]),
      order("cafe", "2026-10-16", [flour]),
    ];
    const [report] = analyze(orders, NOW);
    expect(report!.status).toBe("due_soon"); // due 26 Oct, today
    const [early] = analyze(orders, new Date("2026-10-19T09:00:00Z"));
    expect(early!.status).toBe("on_track");
    expect(early!.suggestedLines).toEqual([]);
  });

  it("finds a product that stopped while the account still orders", () => {
    // Weekly orders; sugar dropped out after the third week.
    const orders = [
      order("shop", "2026-09-21", [flour, sugar]),
      order("shop", "2026-09-28", [flour, sugar]),
      order("shop", "2026-10-05", [flour, sugar]),
      order("shop", "2026-10-12", [flour]),
      order("shop", "2026-10-19", [flour]),
      order("shop", "2026-10-26", [flour]),
    ];
    const [report] = analyze(orders, NOW);
    expect(report!.status).toBe("on_track"); // ordered today
    const sugarRow = report!.products.find((p) => p.variantId === "v-sugar")!;
    expect(sugarRow.status).toBe("lapsed"); // 21 days quiet on a 7-day rhythm
    expect(report!.suggestedLines.map((l) => l.variantId)).toEqual(["v-sugar"]);
  });

  it("calls an account lapsed after three missed cycles", () => {
    const orders = [
      order("deli", "2026-07-01", [flour]),
      order("deli", "2026-07-15", [flour]),
      order("deli", "2026-07-29", [flour]),
    ];
    expect(analyze(orders, NOW)[0]!.status).toBe("lapsed");
  });

  it("waits for enough orders, but still catches long silence", () => {
    const fresh = analyze([order("new", "2026-10-20", [flour])], NOW)[0]!;
    expect(fresh).toMatchObject({ status: "learning", intervalDays: null, daysLate: null });

    const quiet = analyze([order("old", "2026-08-01", [flour])], NOW)[0]!;
    expect(quiet.status).toBe("lapsed");
    expect(quiet.suggestedLines.map((l) => l.variantId)).toEqual(["v-flour"]);
  });

  it("counts two orders on the same day once", () => {
    const orders = [
      order("bar", "2026-09-28", [flour]),
      order("bar", "2026-10-05", [flour]),
      order("bar", "2026-10-05", [sugar]),
      order("bar", "2026-10-12", [flour]),
    ];
    expect(analyze(orders, NOW)[0]).toMatchObject({ orderCount: 3, intervalDays: 7 });
  });

  it("uses the latest price and skips ignored products", () => {
    const orders = [
      order("x", "2026-09-07", [{ ...flour, unitPrice: 18 }, sugar]),
      order("x", "2026-09-21", [{ ...flour, unitPrice: 19 }, sugar]),
      order("x", "2026-10-05", [{ ...flour, unitPrice: 21 }, sugar]),
    ];
    const [report] = analyze(orders, NOW, { ignoreVariantIds: ["v-sugar"] });
    expect(report!.products.map((p) => p.variantId)).toEqual(["v-flour"]);
    expect(report!.suggestedLines[0]!.unitPrice).toBe(21);
    expect(report!.expectedValue).toBe(456); // 24 × 19
  });

  it("puts the most money at risk first", () => {
    const small = { ...flour, quantity: 2 };
    const orders = [
      ...["2026-09-07", "2026-09-21", "2026-10-05"].map((d) => order("small", d, [small])),
      ...["2026-09-07", "2026-09-21", "2026-10-05"].map((d) => order("big", d, [flour])),
      ...["2026-10-06", "2026-10-16", "2026-10-23"].map((d) => order("ok", d, [flour])),
    ];
    expect(analyze(orders, NOW).map((r) => r.companyLocationId)).toEqual(["big", "small", "ok"]);
  });
});
