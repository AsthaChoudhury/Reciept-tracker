import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      capacity: 10,
      mode: "LIVE",
      refillRate: 10,
      interval: 3600,
    }),
  ],
});

export default aj;
