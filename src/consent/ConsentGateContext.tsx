import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AIProvider, ConsentUITheme } from "../types";
import { ConsentFlow } from "./components/ConsentFlow";

interface ConsentGateConfig {
  providers: AIProvider[];
  privacyPolicyUrl: string;
  extraMessage?: string;
  theme?: Partial<ConsentUITheme>;
  showRequiredDisclosure?: boolean;
  agreeButtonLabel?: string;
  onOpenPrivacyPolicy: (url: string) => void;
}

interface ConsentGateContextValue {
  /**
   * Wraps any handler function. If consent has not been granted,
   * it opens the consent bottom sheet instead of calling the handler.
   * Once consent is granted, the handler executes normally.
   */
  withConsent: <T extends (...args: any[]) => any>(handler: T) => (...args: Parameters<T>) => void;
  /** Whether the user has granted AI consent */
  hasConsent: boolean;
}

const ConsentGateContext = createContext<ConsentGateContextValue | null>(null);

interface ConsentGateProviderProps {
  /** Current consent status — `true` if user has agreed, `false` otherwise */
  hasConsent: boolean;
  /** Called when the user agrees to terms via the gated bottom sheet */
  onConsentGiven: () => void;
  /** Configuration for the consent bottom sheet */
  config: ConsentGateConfig;
  children: React.ReactNode;
}

export const ConsentGateProvider: React.FC<ConsentGateProviderProps> = ({
  hasConsent,
  onConsentGiven,
  config,
  children
}) => {
  const [sheetVisible, setSheetVisible] = useState(false);

  const withConsent = useCallback(
    <T extends (...args: any[]) => any>(handler: T) => {
      return (...args: Parameters<T>) => {
        if (hasConsent) {
          handler(...args);
        } else {
          setSheetVisible(true);
        }
      };
    },
    [hasConsent]
  );

  const handleDecision = useCallback(
    (accepted: boolean) => {
      if (accepted) {
        onConsentGiven();
      }
      setSheetVisible(false);
    },
    [onConsentGiven]
  );

  const handleClose = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const value = useMemo<ConsentGateContextValue>(
    () => ({ withConsent, hasConsent }),
    [withConsent, hasConsent]
  );

  return (
    <ConsentGateContext.Provider value={value}>
      {children}
      <ConsentFlow
        isVisible={sheetVisible}
        providers={config.providers}
        privacyPolicyUrl={config.privacyPolicyUrl}
        extraMessage={config.extraMessage}
        theme={config.theme}
        showRequiredDisclosure={config.showRequiredDisclosure}
        agreeButtonLabel={config.agreeButtonLabel}
        onOpenPrivacyPolicy={config.onOpenPrivacyPolicy}
        onRequestClose={handleClose}
        onDecision={handleDecision}
      />
    </ConsentGateContext.Provider>
  );
};

/**
 * Hook that returns a `withConsent` wrapper function.
 *
 * Wrap any `onPress` or event handler with `withConsent(handler)`.
 * If the user hasn't consented to AI terms, the consent bottom sheet
 * opens instead of executing the handler.
 *
 * @example
 * ```tsx
 * const { withConsent } = useConsentGate();
 *
 * <Pressable onPress={withConsent(() => openCamera())}>
 *   <Text>Take Photo with AI</Text>
 * </Pressable>
 *
 * <Button onPress={withConsent(() => sendToAI(message))} title="Send" />
 * ```
 */
export function useConsentGate(): ConsentGateContextValue {
  const context = useContext(ConsentGateContext);
  if (!context) {
    throw new Error("useConsentGate must be used within a <ConsentGateProvider>");
  }
  return context;
}
