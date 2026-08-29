import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, orders, orderItems } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createOrder(input: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  province: string;
  postalCode: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: Array<{ productSlug: string; productName: string; colorway: string; size: string; quantity: number; unitPrice: number }>;
}) {
  const db = await getDb();
  if (!db) {
    console.error(JSON.stringify({ scope: "commerce_order", event: "persistence_unavailable", orderNumber: input.orderNumber }));
    throw new Error("ORDER_PERSISTENCE_UNAVAILABLE");
  }
  let result;
  try {
    result = await db.insert(orders).values({
    orderNumber: input.orderNumber, customerName: input.customerName, customerEmail: input.customerEmail,
    customerPhone: input.customerPhone, shippingAddress: input.shippingAddress, province: input.province,
    postalCode: input.postalCode, subtotal: input.subtotal, shippingFee: input.shippingFee, total: input.total,
    paymentStatus: "pending",
    });
    const orderId = Number(result[0]?.insertId || 0);
    if (orderId && input.items.length) await db.insert(orderItems).values(input.items.map((item) => ({ ...item, orderId })));
    console.info(JSON.stringify({ scope: "commerce_order", event: "created", orderNumber: input.orderNumber, itemCount: input.items.length }));
    return { orderNumber: input.orderNumber, persisted: true };
  } catch (error) {
    console.error(JSON.stringify({ scope: "commerce_order", event: "create_failed", orderNumber: input.orderNumber, message: error instanceof Error ? error.message : "unknown error" }));
    throw error;
  }
}

export async function markOrderPaidFromItn(orderNumber: string, amountZar: string) {
  const db = await getDb();
  if (!db) return false;
  const amountRand = Math.round(Number(amountZar));
  if (!Number.isFinite(amountRand) || amountRand < 0) return false;
  const result = await db.update(orders).set({ paymentStatus: "paid" }).where(and(eq(orders.orderNumber, orderNumber), eq(orders.total, amountRand), eq(orders.paymentStatus, "pending")));
  return Number(result[0]?.affectedRows || 0) === 1;
}

// TODO: add feature queries here as your schema grows.
