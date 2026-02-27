// Mock nanoid to avoid ESM import issues in Jest
jest.mock("nanoid", () => ({
    customAlphabet: (chars: string, size: number) => () =>
        Array.from({ length: size }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length)),
        ).join(""),
}));

import { generateReferralCode, getMsgs } from "@/hooks/contracts/contract-utils";

describe("contract-utils", () => {
    describe("generateReferralCode", () => {
        it("should generate a 10-character alphanumeric code", () => {
            const code = generateReferralCode();

            expect(code).toHaveLength(10);
            expect(code).toMatch(/^[0-9A-Z]+$/);
        });

        it("should generate unique codes on each call", () => {
            const codes = new Set(
                Array.from({ length: 100 }, () => generateReferralCode()),
            );

            // With 36^10 possible codes, collisions in 100 are virtually impossible
            expect(codes.size).toBe(100);
        });
    });

    describe("getMsgs", () => {
        it("should build a valid MsgExecuteContract message", () => {
            const sender = "kujira1abc...";
            const contract = "kujira1contract...";
            const msg = new TextEncoder().encode(JSON.stringify({ participate: {} }));
            const funds = [{ denom: "ukuji", amount: "1000000" }];

            const result = getMsgs(sender, contract, msg, funds);

            expect(result).toHaveLength(1);
            expect(result[0].typeUrl).toBe(
                "/cosmwasm.wasm.v1.MsgExecuteContract",
            );
            expect(result[0].value).toBeDefined();
        });

        it("should handle null funds", () => {
            const sender = "kujira1abc...";
            const contract = "kujira1contract...";
            const msg = new TextEncoder().encode(JSON.stringify({ claim: {} }));

            const result = getMsgs(sender, contract, msg, null);

            expect(result).toHaveLength(1);
            expect(result[0].typeUrl).toBe(
                "/cosmwasm.wasm.v1.MsgExecuteContract",
            );
        });
    });
});
