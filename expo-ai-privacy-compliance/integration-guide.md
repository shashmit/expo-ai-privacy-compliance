# Integration Guide

## 1. Install dependencies

```bash
npm install @native/expo-ai-privacy-compliance
```

## 2. Create consent config

```ts
import { defineConsentConfig } from "@native/expo-ai-privacy-compliance";

const consentConfig = defineConsentConfig({
  providers: [
    {
      id: "openai",
      name: "OpenAI",
      usageDescription: "Used for chat completion.",
      imageSlug: "openai",
      required: true
    },
    {
      id: "google-ai",
      name: "Google AI",
      usageDescription: "Used for content safety checks.",
      imageSlug: "googleai"
    }
  ],
  privacyPolicyUrl: "https://example.com/privacy",
  extraMessage: "We send prompts to configured AI providers to deliver assistant features.",
  ui: {
    showRequiredDisclosure: false,
    theme: {
      primaryColor: "#2563EB",
      surfaceColor: "#FFFFFF",
      textColor: "#0F172A",
      titleColor: "#0F172A",
      privacyPolicyColor: "#0EA5E9",
      buttonBackgroundColor: "#111827",
      buttonTextColor: "#FFFFFF",
      borderRadius: 14,
      sheetRadius: 24,
      buttonRadius: 14
    }
  }
});
```

## 3. Show consent bottom sheet

```tsx
import { ConsentFlow } from "@native/expo-ai-privacy-compliance";

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

Pressing **I agree on terms** opens a native allow/decline popup before `onDecision` is fired.

## Config reference

### `defineConsentConfig(...)`

- `providers` (required): array of providers displayed in consent list.
- `privacyPolicyUrl` (required): URL opened when user taps **Privacy Policy**.
- `extraMessage` (optional): message shown above provider list.
- `ui` (optional): UI behavior and theme customizations.

### Provider fields

- `id` (required): stable unique provider key.
- `name` (required): provider display name.
- `usageDescription` (required): description shown under provider name.
- `required` (optional, default `true`): controls required disclosure label visibility.
- `imageSlug` (optional): maps to built-in provider image.

### `ui` fields

- `showRequiredDisclosure` (optional, default `true`): show/hide **Required disclosure** text.
- `theme` (optional): override visual tokens.

### `ui.theme` fields

- `primaryColor`: accent color for bullets and required disclosure text.
- `surfaceColor`: card and sheet surface color.
- `textColor`: default body text color.
- `titleColor`: consent title color.
- `privacyPolicyColor`: privacy policy link color.
- `buttonBackgroundColor`: agree button background color.
- `buttonTextColor`: agree button text color.
- `borderRadius`: consent card corner radius.
- `sheetRadius`: bottom sheet top corner radius.
- `buttonRadius`: agree button corner radius.

## Runtime props reference

`ConsentFlow` runtime props you can control from app state:

- `locale`: one of `en | es | fr | de | ja`.
- `isVisible`: show/hide bottom sheet.
- `providers`: provider list to render.
- `privacyPolicyUrl`: privacy URL for link action.
- `extraMessage`: optional custom intro text.
- `theme`: optional UI theme override.
- `showRequiredDisclosure`: optional required disclosure toggle.
- `onOpenPrivacyPolicy(url)`: callback for link handling.
- `onRequestClose()`: callback for sheet dismiss.
- `onDecision(accepted)`: callback fired after native allow/decline.
