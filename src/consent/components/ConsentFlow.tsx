import React, { useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AIProvider, ConsentUITheme, DisclosureItem } from "../../types";
import { ConsentDisclosureCard } from "./ConsentDisclosureCard";
import { getProviderImage } from "../provider-images";

interface ConsentFlowProps {
  isVisible: boolean;
  providers: AIProvider[];
  privacyPolicyUrl: string;
  extraMessage?: string;
  theme?: Partial<ConsentUITheme>;
  showRequiredDisclosure?: boolean;
  onOpenPrivacyPolicy: (url: string) => void;
  onRequestClose?: () => void;
  onDecision?: (accepted: boolean) => void | Promise<void>;
}

const defaultTheme: ConsentUITheme = {
  primaryColor: "#2563EB",
  surfaceColor: "#FFFFFF",
  textColor: "#0F172A",
  titleColor: "#0F172A",
  privacyPolicyColor: "#2563EB",
  buttonBackgroundColor: "#0F172A",
  buttonTextColor: "#F8FAFC",
  borderRadius: 12,
  sheetRadius: 24,
  buttonRadius: 12
};

export const ConsentFlow: React.FC<ConsentFlowProps> = ({
  isVisible,
  providers,
  privacyPolicyUrl,
  extraMessage,
  theme,
  showRequiredDisclosure = true,
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

  const openNativePrompt = () =>
    new Promise<boolean>((resolve) => {
      Alert.alert("Allow AI data sharing?", "Choose Allow to continue with AI-enabled features or Decline to use fallback mode.", [
        {
          text: "Decline",
          style: "cancel",
          onPress: () => resolve(false)
        },
        {
          text: "Allow",
          style: "default",
          onPress: () => resolve(true)
        }
      ]);
    });

  const handleTermsAgreement = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const accepted = await openNativePrompt();
      if (onDecision) {
        await Promise.resolve(onDecision(accepted));
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
              {"I agree on terms"}
            </Text>
          </Pressable>
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
    borderRadius: 12,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center"
  },
  termsButtonLabel: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 15
  },
  disabled: {
    opacity: 0.6
  }
});
