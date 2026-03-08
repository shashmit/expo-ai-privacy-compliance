# Integration Guide

## 1. Install dependencies

```bash
npm install @bot_shashmit/expo-ai-privacy-compliance
```

## 2. Create consent config

```ts
import { defineConsentConfig } from "@bot_shashmit/expo-ai-privacy-compliance";

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

## 3. Gate AI actions with consent

Wrap your app with `ConsentGateProvider`, then use `useConsentGate()` to protect handlers with `withConsent`.

```tsx
import { useMemo, useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import {
  ConsentGateProvider,
  defineConsentConfig,
  useConsentGate
} from "@bot_shashmit/expo-ai-privacy-compliance";

const consentConfig = defineConsentConfig({
  providers: [
    {
      id: "openai",
      name: "OpenAI",
      usageDescription: "Used for chat completion.",
      imageSlug: "openai"
    }
  ],
  privacyPolicyUrl: "https://example.com/privacy",
  extraMessage: "We use AI providers to deliver assistant features."
});

function AIActions() {
  const { withConsent, hasConsent } = useConsentGate();

  const sendPrompt = () => {};

  return (
    <View>
      <Text>{hasConsent ? "Consent granted" : "Consent needed"}</Text>
      <Pressable onPress={withConsent(sendPrompt)}>
        <Text>Ask AI</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [hasConsent, setHasConsent] = useState(false);

  const gateConfig = useMemo(
    () => ({
      providers: consentConfig.providers,
      privacyPolicyUrl: consentConfig.privacyPolicyUrl,
      extraMessage: consentConfig.extraMessage,
      theme: consentConfig.ui?.theme,
      showRequiredDisclosure: consentConfig.ui?.showRequiredDisclosure,
      agreeButtonLabel: "Allow AI usage",
      onOpenPrivacyPolicy: (url: string) => Linking.openURL(url)
    }),
    []
  );

  return (
    <ConsentGateProvider
      hasConsent={hasConsent}
      onConsentGiven={() => setHasConsent(true)}
      config={gateConfig}
    >
      <AIActions />
    </ConsentGateProvider>
  );
}
```

When consent is not granted, wrapped handlers open the consent bottom sheet. When the user taps **I agree on terms** (or your custom label), `onConsentGiven` is called and future wrapped handlers run normally.

## 4. Use `ConsentFlow` directly (optional)

Use this if you want to control bottom-sheet visibility manually.

```tsx
import { useState } from "react";
import { Linking, Pressable, Text } from "react-native";
import { ConsentFlow } from "@bot_shashmit/expo-ai-privacy-compliance";

export default function App() {
  const [hasConsent, setHasConsent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Text>{hasConsent ? "Consent granted" : "Consent needed"}</Text>
      <Pressable onPress={() => setIsVisible(true)}>
        <Text>Open Consent</Text>
      </Pressable>
      <ConsentFlow
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        providers={consentConfig.providers}
        privacyPolicyUrl={consentConfig.privacyPolicyUrl}
        extraMessage={consentConfig.extraMessage}
        theme={consentConfig.ui?.theme}
        showRequiredDisclosure={consentConfig.ui?.showRequiredDisclosure}
        agreeButtonLabel="Allow AI usage"
        onOpenPrivacyPolicy={(url) => Linking.openURL(url)}
        onDecision={(accepted) => {
          if (accepted) {
            setHasConsent(true);
          }
          setIsVisible(false);
        }}
      />
    </>
  );
}
```

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

### `ConsentGateProvider` props

- `hasConsent`: current app consent status.
- `onConsentGiven()`: callback fired when user agrees.
- `config.providers`: provider list to render.
- `config.privacyPolicyUrl`: privacy URL for link action.
- `config.extraMessage`: optional custom intro text.
- `config.theme`: optional UI theme override.
- `config.showRequiredDisclosure`: optional required disclosure toggle.
- `config.agreeButtonLabel`: optional custom agree button text.
- `config.onOpenPrivacyPolicy(url)`: callback for link handling.

### `useConsentGate()` return value

- `withConsent(handler)`: wraps event handlers and gates them behind consent.
- `hasConsent`: current consent status from provider context.

### `ConsentFlow` props

- `isVisible`: show/hide bottom sheet.
- `providers`: provider list to render.
- `privacyPolicyUrl`: privacy URL for link action.
- `extraMessage`: optional custom intro text.
- `theme`: optional UI theme override.
- `showRequiredDisclosure`: optional required disclosure toggle.
- `agreeButtonLabel`: optional custom agree button text.
- `onOpenPrivacyPolicy(url)`: callback for link handling.
- `onRequestClose()`: callback for sheet dismiss.
- `onDecision(accepted)`: callback fired when user taps agree.
