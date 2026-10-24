import { z } from "zod";

export const passwordRule = z
  .string()
  .min(1, "Password is required")
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/\d/, "Add a number")
  .regex(/[^A-Za-z0-9\s]/, "Add a symbol (e.g. @ # $ !)");