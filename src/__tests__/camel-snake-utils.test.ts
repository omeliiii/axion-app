import {
    transformToCamelCase,
    transformToSnakeCase,
} from "@/redux/camel-snake-utils";

describe("camel-snake-utils", () => {
    describe("transformToSnakeCase", () => {
        it("should convert camelCase keys to snake_case", () => {
            const input = { firstName: "John", lastName: "Doe" };
            const expected = { first_name: "John", last_name: "Doe" };

            expect(transformToSnakeCase(input)).toEqual(expected);
        });

        it("should handle nested objects", () => {
            const input = { userData: { walletAddress: "kujira1..." } };
            const expected = { user_data: { wallet_address: "kujira1..." } };

            expect(transformToSnakeCase(input)).toEqual(expected);
        });

        it("should handle arrays of objects", () => {
            const input = [{ leagueId: "1" }, { leagueId: "2" }];
            const expected = [{ league_id: "1" }, { league_id: "2" }];

            expect(transformToSnakeCase(input)).toEqual(expected);
        });

        it("should return primitives unchanged", () => {
            expect(transformToSnakeCase("hello")).toBe("hello");
            expect(transformToSnakeCase(42)).toBe(42);
            expect(transformToSnakeCase(null)).toBe(null);
            expect(transformToSnakeCase(undefined)).toBe(undefined);
        });

        it("should handle empty objects and arrays", () => {
            expect(transformToSnakeCase({})).toEqual({});
            expect(transformToSnakeCase([])).toEqual([]);
        });
    });

    describe("transformToCamelCase", () => {
        it("should convert snake_case keys to camelCase", () => {
            const input = { first_name: "John", last_name: "Doe" };
            const expected = { firstName: "John", lastName: "Doe" };

            expect(transformToCamelCase(input)).toEqual(expected);
        });

        it("should handle nested objects", () => {
            const input = { user_data: { wallet_address: "kujira1..." } };
            const expected = { userData: { walletAddress: "kujira1..." } };

            expect(transformToCamelCase(input)).toEqual(expected);
        });

        it("should handle arrays of objects", () => {
            const input = [{ league_id: "1" }, { league_id: "2" }];
            const expected = [{ leagueId: "1" }, { leagueId: "2" }];

            expect(transformToCamelCase(input)).toEqual(expected);
        });

        it("should return primitives unchanged", () => {
            expect(transformToCamelCase("hello")).toBe("hello");
            expect(transformToCamelCase(42)).toBe(42);
            expect(transformToCamelCase(null)).toBe(null);
        });

        it("should be inverse of transformToSnakeCase", () => {
            const original = {
                leagueId: "abc",
                totalValueLocked: 1000,
                estimatedRewards: [{ prizeAmount: 100, prizeDenom: "ukuji" }],
            };

            const snaked = transformToSnakeCase(original);
            const restored = transformToCamelCase(snaked);

            expect(restored).toEqual(original);
        });
    });
});
