import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';

type TabConfig = {
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  label: string;
  isCreate?: boolean;
};

const TABS_CONFIG: Record<string, TabConfig> = {
  index: { icon: 'home-outline', iconFocused: 'home', label: 'Home' },
  search: { icon: 'search-outline', iconFocused: 'search', label: 'Search' },
  create: { icon: 'add-circle-outline', iconFocused: 'add-circle', label: 'Create', isCreate: true },
  chat: { icon: 'chatbubble-outline', iconFocused: 'chatbubble', label: 'Chat' },
  profile: { icon: 'person-outline', iconFocused: 'person', label: 'Profile' },
};

type Props = {
  state: any;
  descriptors: any;
  navigation: any;
  colors: ThemePalette;
};

export default function PremiumTabBar({
  state,
  descriptors,
  navigation,
  colors,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'web' ? 10 : 6);

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.brandBorder,
          paddingBottom: bottomPad,
        },
      ]}
    >
      {state.routes.map((route: any) => {
        const config = TABS_CONFIG[route.name];
        if (!config) return null;

        const { options } = descriptors[route.key];
        if (options?.href === null) return null;

        const isFocused = state.index === state.routes.indexOf(route);
        const active = config.isCreate ? colors.brandOrange : colors.brandBlue;
        const color = isFocused || config.isCreate ? active : colors.textMuted;
        const iconName = isFocused ? config.iconFocused : config.icon;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isFocused }}
            accessibilityLabel={config.label}
            testID={`${route.name}-tab`}
            activeOpacity={0.7}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            style={styles.tab}
          >
            <Ionicons name={iconName} size={22} color={color} />
            <Text
              style={[
                styles.label,
                {
                  color,
                  fontWeight: isFocused ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              {config.label}
            </Text>
            {isFocused && !config.isCreate ? (
              <View style={[styles.dot, { backgroundColor: active }]} />
            ) : (
              <View style={styles.dotSpacer} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    ...Platform.select({
      web: {
        maxWidth: 720,
        width: '100%',
        alignSelf: 'center',
      } as object,
      default: {},
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 48,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.15,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  dotSpacer: {
    width: 4,
    height: 4,
    marginTop: 2,
  },
});
