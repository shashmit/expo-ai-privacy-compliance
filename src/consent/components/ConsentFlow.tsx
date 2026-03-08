import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AIProvider, ConsentUITheme, DisclosureItem } from "../../types";
import { ConsentDisclosureCard } from "./ConsentDisclosureCard";
import { getProviderImage } from "../provider-images";
import { defaultTheme } from "../../theme";

interface ConsentFlowProps {
  isVisible: boolean;
  providers: AIProvider[];
  privacyPolicyUrl: string;
  extraMessage?: string;
  theme?: Partial<ConsentUITheme>;
  showRequiredDisclosure?: boolean;
  agreeButtonLabel?: string;
  declineButtonLabel?: string;
  onOpenPrivacyPolicy: (url: string) => void;
  onRequestClose?: () => void;
  onDecision?: (accepted: boolean) => void | Promise<void>;
}

export const ConsentFlow: React.FC<ConsentFlowProps> = ({
  isVisible,
  providers,
  privacyPolicyUrl,
  extraMessage,
  theme,
  showRequiredDisclosure = true,
  agreeButtonLabel,
  declineButtonLabel,
  onOpenPrivacyPolicy,
  onRequestClose,
  onDecision
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mergedTheme = { ...defaultTheme, ...theme };

  const disclosures = useMemo<DisclosureItem[]>(
    () =>
      providers.map((provider) => {
        const providerImage = getProviderImage(provider.imageSlug ?? provider.id);
        return {
          id: provider.id,
          title: provider.name,
          description: provider.usageDescription,
          required: provider.required ?? true,
          imageUri: providerImage?.imageUri,
          fallbackColor: providerImage?.fallbackColor
        };
      }),
    [providers]
  );

  const handleTermsAgreement = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Direct agreement without double confirmation
      if (onDecision) {
        await Promise.resolve(onDecision(true));
      }
      onRequestClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (onDecision) {
        await Promise.resolve(onDecision(false));
      }
      onRequestClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onRequestClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onRequestClose} />
        <View
          style={[
            styles.sheet,
            {
              borderTopLeftRadius: mergedTheme.sheetRadius,
              borderTopRightRadius: mergedTheme.sheetRadius,
              backgroundColor: mergedTheme.surfaceColor
            }
          ]}
        >
          <View style={styles.handle} />
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator>
            <ConsentDisclosureCard
              title={"AI Data Sharing Permission"}
              description={extraMessage ?? "Review how your data is shared with AI partners."}
              disclosures={disclosures}
              privacyPolicyUrl={privacyPolicyUrl}
              onOpenPrivacyPolicy={onOpenPrivacyPolicy}
              theme={theme}
              showRequiredDisclosure={showRequiredDisclosure}
            />
          </ScrollView>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={handleDecline}
              style={[
                styles.secondaryButton,
                {
                  borderRadius: mergedTheme.buttonRadius,
                  borderColor: mergedTheme.textColor
                },
                isSubmitting ? styles.disabled : undefined
              ]}
            >
              <Text style={[styles.secondaryButtonLabel, { color: mergedTheme.textColor }]}>
                {declineButtonLabel ?? "Decline"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={handleTermsAgreement}
              style={[
                styles.termsButton,
                {
                  backgroundColor: mergedTheme.buttonBackgroundColor,
                  borderRadius: mergedTheme.buttonRadius
                },
                isSubmitting ? styles.disabled : undefined
              ]}
            >
              <Text style={[styles.termsButtonLabel, { color: mergedTheme.buttonTextColor }]}>
                {agreeButtonLabel ?? "I agree on terms"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.42)"
  },
  backdrop: {
    flex: 1
  },
  sheet: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 14,
    maxHeight: "60%"
  },
  scrollArea: {
    flexGrow: 0
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    alignSelf: "center"
  },
  termsButton: {
    height: 48,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButton: {
    height: 48,
    flex: 1,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonLabel: {
    fontWeight: "600",
    fontSize: 15
  },
  termsButtonLabel: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 15
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  disabled: {
    opacity: 0.6
  }
});
