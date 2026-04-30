import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  useDerivedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '../constants/theme';
import { useAppTheme } from '../context/theme-context';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40;
const TAB_WIDTH = TAB_BAR_WIDTH / 5;

const LIQUID_SPRING = {
  damping: 15,
  stiffness: 100,
  mass: 0.6,
};

const ACTIVE_BLUE = '#2F7CF6';

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  
  const translateX = useSharedValue(state.index * TAB_WIDTH);
  
  // Velocity-based stretch for real liquid feel
  const prevTranslateX = useSharedValue(state.index * TAB_WIDTH);
  const stretch = useDerivedValue(() => {
    const diff = Math.abs(translateX.value - prevTranslateX.value);
    prevTranslateX.value = translateX.value;
    return 1 + (diff / TAB_WIDTH) * 0.8;
  });

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, LIQUID_SPRING);
  }, [state.index]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value + (TAB_WIDTH - 54) / 2 },
        { scaleX: stretch.value }
      ],
    };
  });

  return (
    <View style={styles.container}>
      <BlurView
        intensity={scheme === 'dark' ? 60 : 90}
        tint={scheme === 'dark' ? 'dark' : 'light'}
        style={[
          styles.mainCapsule,
          { 
            backgroundColor: scheme === 'dark' ? 'rgba(20, 20, 20, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            borderColor: scheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
          }
        ]}
      >
        {/* The Translucent Liquid Blob (Reference Style) */}
        <Animated.View style={[styles.liquidBlob, animatedIndicatorStyle]} />

        <View style={styles.tabsRow}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label = options.title !== undefined ? options.title : route.name;
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate(route.name);
              }
            };

            const getIcon = (name: string, focused: boolean) => {
              switch (name) {
                case 'index': return focused ? 'home' : 'home-outline';
                case 'search': return focused ? 'search' : 'search-outline';
                case 'chat': return focused ? 'chatbubbles' : 'chatbubbles-outline';
                case 'explore': return focused ? 'compass' : 'compass-outline';
                case 'profile': return focused ? 'person' : 'person-outline';
                default: return 'help-outline';
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={1}
              >
                <Ionicons 
                  name={getIcon(route.name, isFocused) as any} 
                  size={24} 
                  color={isFocused ? ACTIVE_BLUE : (scheme === 'dark' ? '#FFFFFF' : '#666666')} 
                />
                <Text style={[
                  styles.label, 
                  { 
                    color: isFocused ? ACTIVE_BLUE : (scheme === 'dark' ? '#FFFFFF' : '#666666'),
                    fontWeight: isFocused ? '900' : '700'
                  }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  mainCapsule: {
    width: TAB_BAR_WIDTH,
    height: 74,
    borderRadius: 37,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  tabsRow: {
    flexDirection: 'row',
    flex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liquidBlob: {
    position: 'absolute',
    top: 10,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Light translucent pill as per reference
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: 9,
    marginTop: 4,
    textTransform: 'capitalize',
  },
});
