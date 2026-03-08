import React, { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ConsentUITheme, DisclosureItem } from "../../types";
import { defaultTheme } from "../../theme";

interface ConsentDisclosureCardProps {
  title?: string;
  description?: string;
  disclosures: DisclosureItem[];
  privacyPolicyUrl: string;
  theme?: Partial<ConsentUITheme>;
  showRequiredDisclosure?: boolean;
  onOpenPrivacyPolicy: (url: string) => void;
}

export const ConsentDisclosureCard: React.FC<ConsentDisclosureCardProps> = ({
  title,
  description,
  disclosures,
  privacyPolicyUrl,
  onOpenPrivacyPolicy,
  theme,
  showRequiredDisclosure = true
}) => {
  const merged = { ...defaultTheme, ...theme };
  const [failedImageIds, setFailedImageIds] = useState<string[]>([]);
  const failedImageIdSet = useMemo(() => new Set(failedImageIds), [failedImageIds]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: merged.surfaceColor,
          borderRadius: merged.borderRadius
        }
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: merged.titleColor }]}
      >
        {title ?? "AI Data Sharing Permission"}
      </Text>
      <Text style={[styles.description, { color: merged.textColor }]}>
        {description ?? "Review how your data is shared with AI partners."}
      </Text>
      {disclosures.map((item) => (
        <View key={item.id} style={styles.row}>
          {item.imageUri && !failedImageIdSet.has(item.id) ? (
            <Image
              source={{ uri: item.imageUri }}
              style={styles.logo}
              accessibilityLabel={`${item.title} logo`}
              onError={() => {
                setFailedImageIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
              }}
            />
          ) : (
            <View
              style={[
                styles.logo,
                {
                  backgroundColor: item.fallbackColor ?? "#E2E8F0"
                }
              ]}
              accessibilityLabel={`${item.title} placeholder`}
            />
          )}
          <View style={styles.rowBody}>
            <Text style={[styles.disclosureTitle, { color: merged.textColor }]}>{item.title}</Text>
            <Text style={[styles.disclosureDescription, { color: merged.textColor }]}>
              {item.description}
            </Text>
            {showRequiredDisclosure && item.required ? (
              <Text style={[styles.required, { color: merged.primaryColor }]}>
                {"Required disclosure"}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
      <Pressable
        accessibilityRole="link"
        onPress={() => onOpenPrivacyPolicy(privacyPolicyUrl)}
        style={styles.policyButton}
      >
        <Text style={[styles.policyLabel, { color: merged.privacyPolicyColor }]}>
          {"Privacy Policy"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "600"
  },
  description: {
    fontSize: 14,
    lineHeight: 20
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8
  },
  logo: {
    width: 22,
    height: 22,
    borderRadius: 6,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  rowBody: {
    flex: 1,
    gap: 4
  },
  disclosureTitle: {
    fontSize: 15,
    fontWeight: "600"
  },
  disclosureDescription: {
    fontSize: 13,
    lineHeight: 18
  },
  required: {
    fontSize: 12,
    fontWeight: "600"
  },
  policyButton: {
    marginTop: 6
  },
  policyLabel: {
    fontWeight: "600"
  }
});
