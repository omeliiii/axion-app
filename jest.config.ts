import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: ["**/__tests__/**/*.test.ts"],
    transformIgnorePatterns: [
        "/node_modules/(?!nanoid)",
    ],
};

export default config;
