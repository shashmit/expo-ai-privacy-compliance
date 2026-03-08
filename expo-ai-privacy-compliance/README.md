# @native/expo-ai-privacy-compliance

Consent UI framework for Expo React Native apps using AI providers.

## What it provides

- Consent flow with provider list and native allow/decline popup
- Provider-level usage messaging plus optional global extra message
- Privacy policy URL display with built-in link handling
- Bottom sheet capped at 60% of screen height with automatic scrolling
- Modular UI configuration for button colors, title color, link color, and roundness
- Built-in provider badge image registry with slug-based mapping
- Internationalization-ready consent copy and accessible UI defaults

## Installation

```bash
npm install @native/expo-ai-privacy-compliance
```

## AI implementation helper

For faster rollout planning, use the guided agent prompt in `AGENT.md`.

- Open [AGENT.md](./AGENT.md)
- Paste it into your preferred AI agent as the system prompt
- Choose **Quick** mode for defaults or **Detailed** mode for full discovery
- Follow the generated implementation plan and checklist

## Quick start

```tsx
import {
  ConsentFlow,
  defineConsentConfig
} from "@native/expo-ai-privacy-compliance";

const consentConfig = defineConsentConfig({
  providers: [
    {
      id: "openai",
      name: "OpenAI",
      usageDescription: "Used for chat completion.",
      imageSlug: "openai"
    },
    {
      id: "claude",
      name: "Claude",
      usageDescription: "Used for safety review.",
      imageSlug: "claude"
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      usageDescription: "Used for provider routing.",
      imageSlug: "openrouter"
    }
  ],
  privacyPolicyUrl: "https://example.com/privacy",
  extraMessage: "We use AI providers to deliver assistant features.",
  ui: {
    showRequiredDisclosure: false,
    theme: {
      buttonBackgroundColor: "#111827",
      buttonTextColor: "#FFFFFF",
      titleColor: "#7C3AED",
      privacyPolicyColor: "#0EA5E9",
      borderRadius: 16,
      sheetRadius: 28,
      buttonRadius: 14
    }
  }
});
```

## Present consent bottom sheet

Trigger the consent UI from any app action. The sheet includes an **I agree on terms** button that triggers a native allow/decline popup.

```tsx
const [showConsentSheet, setShowConsentSheet] = useState(false);

<Pressable onPress={() => setShowConsentSheet(true)}>
  <Text>Open Consent</Text>
</Pressable>

<ConsentFlow
  locale="en"
  isVisible={showConsentSheet}
  onRequestClose={() => setShowConsentSheet(false)}
  providers={consentConfig.providers}
  privacyPolicyUrl={consentConfig.privacyPolicyUrl}
  extraMessage={consentConfig.extraMessage}
  theme={consentConfig.ui?.theme}
  showRequiredDisclosure={consentConfig.ui?.showRequiredDisclosure}
  onOpenPrivacyPolicy={(url) => Linking.openURL(url)}
  onDecision={(accepted) => {
    setConsentStatus(accepted ? "granted" : "denied");
  }}
/>
```

## UI customization guide

Use the `ui.theme` object to control the consent sheet visuals:

- `buttonBackgroundColor`: Agree button background color
- `buttonTextColor`: Agree button text color
- `titleColor`: Title color for the consent heading
- `privacyPolicyColor`: Privacy policy link color
- `borderRadius`: Roundness for consent card corners
- `sheetRadius`: Roundness for bottom sheet top corners
- `buttonRadius`: Roundness for the primary action button

Use `showRequiredDisclosure: false` to remove the "Required disclosure" line from each provider row.

## Provider image slug guide

Provider images are bundled in the package and resolved by `imageSlug`.

Set this inside each provider:

```tsx
{
  id: "openai",
  name: "OpenAI",
  usageDescription: "Used for chat completion.",
  imageSlug: "openai"
}
```

Built-in slugs:

- `openai`
- `claude`
- `openrouter`
- `anthropic`
- `awsbedrock`
- `microsoft`
- `azureopenai`
- `vertexai`
- `googleai`
- `cohere`
- `togetherai`
- `huggingface`
- `fireworks`
- `replicate`
- `mistral`
- `perplexity`
- `meta`
- `grok`
- `deepseek`

If `imageSlug` is not set, the package tries to resolve from `id`.

## Consent UI components

- `ConsentDisclosureCard`
- `ConsentFlow`

All components are keyboard/screen-reader aware through native accessibility roles.
