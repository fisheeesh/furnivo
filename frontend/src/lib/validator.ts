import { z } from "zod";

export const LogInSchema = z.object({
    phone: z.string().regex(/^09\d{7,9}$/, {
        message: 'Invalid phone number format',
    }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" })
})

export const RegisterSchema = z.object({
    phone: z.string().regex(/^09\d{7,9}$/, {
        message: 'Invalid phone number format',
    }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string()
        .min(1, { message: "Confirm password is required" })
        .min(6, { message: "Confirm password must be at least 6 characters" })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})


export const QuantitySchema = z.object({
    quantity: z.number().min(0)
})

export const NewsLetterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    })
})

export const ProductFilterSchema = z.object({
    categories: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    types: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})