import { z } from "zod";

export const LogInSchema = z.object({
    phone: z.string().regex(/^09\d{7,9}$/, {
        message: 'Invalid phone number format',
    }),
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 digit" })
        .regex(/^\d+$/, "Password must be numbers")
})

// export const RegisterSchema = z.object({
//     phone: z.string().regex(/^09\d{7,9}$/, {
//         message: 'Invalid phone number format',
//     }),
//     password: z.string()
//         .min(1, { message: "Password is required" })
//         .min(6, { message: "Password must be at least 6 characters" }),
//     confirmPassword: z.string()
//         .min(1, { message: "Confirm password is required" })
//         .min(6, { message: "Confirm password must be at least 6 characters" })
// }).refine(data => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"]
// })


export const QuantitySchema = z.object({
    quantity: z
        .string()
        .min(1, { message: "Must not be empty." })
        .max(4, "Too Many! Is it real?")
        .regex(/^\d+$/, { message: "Must be digit." })
})

export const NewsLetterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    })
})

export const ProductFilterSchema = z.object({
    categories: z.array(z.string()),
    // .refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one item.",
    // }),
    types: z.array(z.string())
    // .refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one item.",
    // }),
})

export const RegisterSchema = z.object({
    phone: z.string().regex(/^09\d{7,9}$/, { message: 'Invalid phone number format' }),
})

export const OTPSchema = z.object({
    otp: z.string().min(6, {
        message: "Your OTP must be 6 characters.",
    }),
})

export const ConfirmPasswordSchema = z.object({
    password: z.string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^\d+$/, "Password must be numbers"),
    confirmPassword: z.string()
        .min(1, { message: "Confirm password is required" })
        .min(8, { message: "Confirm password must be at least 8 characters" })
        .regex(/^\d+$/, "Password must be numbers")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export const UpadateUserDataSchema = z.object({
    phone: z.string().regex(/^09\d{7,9}$/, { message: 'Invalid phone number format' }),
    email: z.string().email({ message: 'Invalid email format' }),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    image: z.any().optional()
})

export const UpdatePasswordSchema = z.object({
    oldPassword: z.string()
        .min(1, { message: "Old Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^\d+$/, "Password must be numbers"),
    newPassword: z.string()
        .min(1, { message: "New Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^\d+$/, "Password must be numbers"),
})