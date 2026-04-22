import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';

type SkeletonProps = {
	width?: number | `${number}%`;
	height?: number;
	borderRadius?: number;
	style?: ViewStyle;
};

export default function Skeleton({ width = '100%', height = 16, borderRadius = 12, style }: SkeletonProps) {
	const opacity = useRef(new Animated.Value(0.45)).current;

	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 0.9,
					duration: 800,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.45,
					duration: 800,
					easing: Easing.inOut(Easing.ease),
					useNativeDriver: true,
				}),
			])
		);

		animation.start();
		return () => animation.stop();
	}, [opacity]);

	return <Animated.View style={[styles.base, { width, height, borderRadius, opacity }, style]} />;
}

const styles = StyleSheet.create({
	base: {
		backgroundColor: '#d9e4f4',
		overflow: 'hidden',
	},
});
