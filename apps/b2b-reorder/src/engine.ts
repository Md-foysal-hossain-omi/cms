// Reorder engine: learns how often each B2B company location reorders,
// overall and per product, and flags who is late. Pure functions, no Shopify calls,
// so the same code runs in the app backend, a daily job, or tests.

export interface OrderLine {
  variantId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface B2BOrder {
  id: string;
  companyLocationId: string;
  createdAt: string; // ISO date-time
  lines: OrderLine[];
}

export type Status = "learning" | "on_track" | "due_soon" | "overdue" | "lapsed";

export interface Settings {
  /** Orders needed before we predict a rhythm. */
  minOrders: number;
  /** Days past the expected date before "overdue". */
  graceDays: number;
  /** Days before the expected date that count as "due_soon". */
  dueSoonDays: number;
  /** Lapsed when days since last order >= interval × this. */
  lapsedMultiplier: number;
  /** Accounts still "learning" are lapsed after this many quiet days. */
  inactiveDays: number;
  ignoreVariantIds: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  minOrders: 3,
  graceDays: 2,
  dueSoonDays: 3,
  lapsedMultiplier: 3,
  inactiveDays: 60,
  ignoreVariantIds: [],
};

export interface Cadence {
  orderCount: number;
  lastOrderAt: string;
  /** Median days between orders; null while learning. */
  intervalDays: number | null;
  nextDueAt: string | null;
  /** Positive = late, negative = days left. Null while learning. */
  daysLate: number | null;
  daysSinceLast: number;
  status: Status;
}

export interface ProductCadence extends Cadence {
  variantId: string;
  title: string;
  usualQuantity: number;
  unitPrice: number;
}

export interface SuggestedLine {
  variantId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface LocationReport extends Cadence {
  companyLocationId: string;
  /** Median order value. */
  expectedValue: number;
  /** Ranking score: expected value weighted by how late (0 when not late). */
  priority: number;
  products: ProductCadence[];
  suggestedLines: SuggestedLine[];
}

const DAY_MS = 86_400_000;

const toDay = (iso: string): number => Math.floor(Date.parse(iso) / DAY_MS);
const fromDay = (day: number): string => new Date(day * DAY_MS).toISOString().slice(0, 10);

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/** Cadence from the distinct days something was ordered. */
function cadence(days: number[], today: number, s: Settings): Cadence {
  const unique = [...new Set(days)].sort((a, b) => a - b);
  const last = unique[unique.length - 1]!;
  const daysSinceLast = today - last;
  const base = { orderCount: unique.length, lastOrderAt: fromDay(last), daysSinceLast };

  if (unique.length < s.minOrders) {
    const status: Status = daysSinceLast >= s.inactiveDays ? "lapsed" : "learning";
    return { ...base, intervalDays: null, nextDueAt: null, daysLate: null, status };
  }

  const gaps = unique.slice(1).map((d, i) => d - unique[i]!);
  const intervalDays = Math.max(1, Math.round(median(gaps)));
  const daysLate = daysSinceLast - intervalDays;

  let status: Status;
  if (daysSinceLast >= intervalDays * s.lapsedMultiplier) status = "lapsed";
  else if (daysLate > s.graceDays) status = "overdue";
  else if (daysLate >= -s.dueSoonDays) status = "due_soon";
  else status = "on_track";

  return { ...base, intervalDays, nextDueAt: fromDay(last + intervalDays), daysLate, status };
}

const NEEDS_ACTION: Status[] = ["due_soon", "overdue", "lapsed"];

function analyzeLocation(
  companyLocationId: string,
  orders: B2BOrder[],
  today: number,
  s: Settings,
): LocationReport {
  const ignored = new Set(s.ignoreVariantIds);
  const loc = cadence(orders.map((o) => toDay(o.createdAt)), today, s);

  const byVariant = new Map<string, { title: string; days: number[]; qty: number[]; price: number; lastDay: number }>();
  for (const order of orders) {
    const day = toDay(order.createdAt);
    for (const line of order.lines) {
      if (ignored.has(line.variantId)) continue;
      const v = byVariant.get(line.variantId) ?? { title: line.title, days: [], qty: [], price: line.unitPrice, lastDay: -Infinity };
      v.days.push(day);
      v.qty.push(line.quantity);
      if (day >= v.lastDay) {
        v.lastDay = day;
        v.price = line.unitPrice;
        v.title = line.title;
      }
      byVariant.set(line.variantId, v);
    }
  }

  const products: ProductCadence[] = [...byVariant].map(([variantId, v]) => ({
    variantId,
    title: v.title,
    usualQuantity: Math.round(median(v.qty)),
    unitPrice: v.price,
    ...cadence(v.days, today, s),
  }));
  products.sort((a, b) => (b.daysLate ?? -Infinity) - (a.daysLate ?? -Infinity));

  // Suggest the late products; if the account is late but no single product has a
  // rhythm yet, fall back to what appears in at least half of its orders.
  let picks = products.filter((p) => NEEDS_ACTION.includes(p.status));
  if (picks.length === 0 && NEEDS_ACTION.includes(loc.status)) {
    picks = products.filter((p) => p.orderCount * 2 >= loc.orderCount);
  }
  const suggestedLines = picks.map(({ variantId, title, usualQuantity, unitPrice }) => ({
    variantId,
    title,
    quantity: usualQuantity,
    unitPrice,
  }));

  const orderValues = orders.map((o) =>
    o.lines.filter((l) => !ignored.has(l.variantId)).reduce((sum, l) => sum + l.quantity * l.unitPrice, 0),
  );
  const expectedValue = round2(median(orderValues));

  let priority = 0;
  if (loc.status === "overdue" || loc.status === "lapsed") {
    const lateness = loc.intervalDays ? (loc.daysLate ?? 0) / loc.intervalDays : 1;
    priority = round2(expectedValue * Math.min(Math.max(lateness, 0), 2));
  }

  return { companyLocationId, ...loc, expectedValue, priority, products, suggestedLines };
}

const STATUS_RANK: Record<Status, number> = { overdue: 0, lapsed: 1, due_soon: 2, learning: 3, on_track: 4 };

/** One report per company location, most urgent first. */
export function analyze(
  orders: B2BOrder[],
  now: Date = new Date(),
  settings: Partial<Settings> = {},
): LocationReport[] {
  const s = { ...DEFAULT_SETTINGS, ...settings };
  const today = Math.floor(now.getTime() / DAY_MS);

  const byLocation = new Map<string, B2BOrder[]>();
  for (const order of orders) {
    const list = byLocation.get(order.companyLocationId) ?? [];
    list.push(order);
    byLocation.set(order.companyLocationId, list);
  }

  return [...byLocation]
    .map(([id, list]) => analyzeLocation(id, list, today, s))
    .sort(
      (a, b) =>
        b.priority - a.priority ||
        STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
        (b.daysLate ?? -Infinity) - (a.daysLate ?? -Infinity),
    );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
