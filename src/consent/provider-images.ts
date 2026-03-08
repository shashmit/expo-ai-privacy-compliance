export interface ProviderImageEntry {
  imageUri: string;
  fallbackColor: string;
}

const createProviderImage = (domain: string, fallbackColor: string): ProviderImageEntry => {
  return {
    imageUri: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    fallbackColor
  };
};

const providerImageBySlug: Record<string, ProviderImageEntry> = {
  openai: createProviderImage("openai.com", "#111827"),
  claude: createProviderImage("anthropic.com", "#D97706"),
  openrouter: createProviderImage("openrouter.ai", "#0EA5E9"),
  anthropic: createProviderImage("anthropic.com", "#D97706"),
  awsbedrock: createProviderImage("aws.amazon.com", "#F59E0B"),
  microsoft: createProviderImage("microsoft.com", "#2563EB"),
  azureopenai: createProviderImage("azure.microsoft.com", "#2563EB"),
  vertexai: createProviderImage("cloud.google.com", "#1D4ED8"),
  googleai: createProviderImage("ai.google", "#2563EB"),
  cohere: createProviderImage("cohere.com", "#7C3AED"),
  togetherai: createProviderImage("together.ai", "#0F766E"),
  huggingface: createProviderImage("huggingface.co", "#FACC15"),
  fireworks: createProviderImage("fireworks.ai", "#EA580C"),
  replicate: createProviderImage("replicate.com", "#BE123C"),
  mistral: createProviderImage("mistral.ai", "#7C3AED"),
  perplexity: createProviderImage("perplexity.ai", "#059669"),
  meta: createProviderImage("meta.com", "#1D4ED8"),
  grok: createProviderImage("x.ai", "#334155"),
  deepseek: createProviderImage("deepseek.com", "#0891B2")
};

export const getProviderImage = (slug?: string): ProviderImageEntry | undefined => {
  if (!slug) {
    return undefined;
  }
  return providerImageBySlug[slug.toLowerCase()];
};
