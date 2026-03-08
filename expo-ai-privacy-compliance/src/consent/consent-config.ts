import { AIProvider, ConsentUIOptions } from "../types";

export interface ConsentConfig {
  providers: AIProvider[];
  privacyPolicyUrl: string;
  extraMessage?: string;
  ui?: ConsentUIOptions;
}

export const defineConsentConfig = (
  config: ConsentConfig
): ConsentConfig => {
  if (!config.providers.length) {
    throw new Error("At least one AI provider must be configured.");
  }
  return config;
};
