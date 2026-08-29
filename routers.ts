import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import { isValidSize } from "@shared/catalog";
import { createOrder } from "./db";
import { getPayFastConfig, preparePayFastPayload } from "./payfast";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  commerce: router({
    payfastStatus: publicProcedure.query(() => getPayFastConfig()),
    preparePayfast: publicProcedure.input(z.object({ amount: z.number().nonnegative(), orderNumber: z.string().min(3), name: z.string().min(2), email: z.string().email(), phone: z.string().optional() })).mutation(({ ctx, input }) => { const forwardedHost = String(ctx.req.headers["x-forwarded-host"] || ctx.req.headers.host || "localhost:3000").split(",")[0].trim(); const forwardedProto = String(ctx.req.headers["x-forwarded-proto"] || ctx.req.protocol || "https").split(",")[0].trim(); const origin = `${forwardedProto}://${forwardedHost}`; return preparePayFastPayload({ ...input, returnUrl: `${origin}/checkout/success?order=${encodeURIComponent(input.orderNumber)}`, cancelUrl: `${origin}/checkout/cancel?order=${encodeURIComponent(input.orderNumber)}`, notifyUrl: `${origin}/api/payfast/itn` }); }),
    createOrder: publicProcedure.input(z.object({
      customerName: z.string().min(2).max(160),
      customerEmail: z.string().email(),
      customerPhone: z.string().min(7).max(32),
      shippingAddress: z.string().min(5).max(1000),
      province: z.string().min(2).max(64),
      postalCode: z.string().min(3).max(16),
      subtotal: z.number().int().nonnegative(),
      shippingFee: z.number().int().nonnegative(),
      total: z.number().int().nonnegative(),
      items: z.array(z.object({ productSlug: z.string().min(2), productName: z.string().min(2), colorway: z.string().min(1), size: z.string().trim().refine(isValidSize, "Invalid size"), quantity: z.number().int().positive(), unitPrice: z.number().int().positive() })).min(1),
    })).mutation(({ input }) => { const orderNumber = `HRS-${nanoid(8).toUpperCase()}`; console.info(JSON.stringify({ scope: "commerce_order", event: "received", orderNumber, itemCount: input.items.length, total: input.total })); return createOrder({ ...input, orderNumber }); }),
  }),
});

export type AppRouter = typeof appRouter;
