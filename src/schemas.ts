import { z } from "zod";

export const wilayaCodeSchema = z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5),
    z.literal(6), z.literal(7), z.literal(8), z.literal(9), z.literal(10),
    z.literal(11), z.literal(12), z.literal(13), z.literal(14), z.literal(15),
    z.literal(16), z.literal(17), z.literal(18), z.literal(19), z.literal(20),
    z.literal(21), z.literal(22), z.literal(23), z.literal(24), z.literal(25),
    z.literal(26), z.literal(27), z.literal(28), z.literal(29), z.literal(30),
    z.literal(31), z.literal(32), z.literal(33), z.literal(34), z.literal(35),
    z.literal(36), z.literal(37), z.literal(38), z.literal(39), z.literal(40),
    z.literal(41), z.literal(42), z.literal(43), z.literal(44), z.literal(45),
    z.literal(46), z.literal(47), z.literal(48), z.literal(49), z.literal(50),
    z.literal(51), z.literal(52), z.literal(53), z.literal(54), z.literal(55),
    z.literal(56), z.literal(57), z.literal(58),
], { message: "Invalid wilaya code" });

// Optional: Type from schema
export type WilayaCode = z.infer<typeof wilayaCodeSchema>;