const messagesErrors = {
  "Participant Already Set": "already_participant",
  "Competition Started": "league_started",
  "Competition Ended": "league_ended",
  "No Rewards To Claim": "no_rewards_to_claim",
  "No Refunds To Claim": "no_refunds_to_claim",
  "User already has a code": "user_already_has_code",
  "insufficient funds": "insufficient_funds",
} as const;

type MessagesErrorsType = typeof messagesErrors;

export const useGetErrorType = () => {
  return {
    getErrorType: (e: Error) => {
      let errorType: ContractError = "generic";

      if (e?.message) {
        const messagesErrorsKeys = Object.keys(messagesErrors) as Array<
          keyof MessagesErrorsType
        >; // Chiavi esatte di messagesErrors

        const error = messagesErrorsKeys.find((mE) =>
          e.message.includes(mE),
        ) as keyof MessagesErrorsType | null;

        if (error) {
          errorType = messagesErrors[error] as ContractError;
        }
      }

      return errorType;
    },
  };
};

export type ContractError =
  | "generic"
  | "already_participant"
  | "league_started"
  | "league_ended"
  | "no_rewards_to_claim"
  | "no_refunds_to_claim"
  | "user_already_has_code"
  | "insufficient_funds";
