import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';
import useAuth from '../../hooks/useAuth';

export const options = { headerShown: false };

type Params = { email: string; type?: 'login' | 'register' };

export default function VerifyEmail() {
	const router = useRouter();
	const params = useLocalSearchParams<Params>();
	const { scheme } = useAppTheme();
	const C = Colors[scheme];
	const { verifyOtp, sendOtp, isLoading: authLoading } = useAuth();

	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);

	const isLogin = params.type === 'login';

	const onVerifyPress = async () => {
		if (code.length !== 6) return;
		setLoading(true);
		try {
			if (isLogin) {
				await verifyOtp(params.email, code);
				router.replace('/(tabs)');
			} else {
				// This was the old verify-email logic, but we can unify it to OTP login
				await verifyOtp(params.email, code);
				Alert.alert('Success', 'Account verified! You are now logged in.', [
					{ text: 'OK', onPress: () => router.replace('/(tabs)') }
				]);
			}
		} catch (error: any) {
			Alert.alert('Verification Error', error.response?.data?.message || 'Invalid code');
		} finally {
			setLoading(false);
		}
	};

	const onResendPress = async () => {
		setLoading(true);
		try {
			await sendOtp(params.email);
			Alert.alert('Success', 'A new 6-digit code has been sent to your email.');
		} catch (error: any) {
			Alert.alert('Error', error.response?.data?.message || 'Failed to resend code');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
			<OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{
						paddingTop: 22,
						paddingBottom: 24,
						flexGrow: 1,
					}}
				>
					<View style={styles.content}>
						<FadeIn>
							<View style={styles.brandRow}>
								<View style={[styles.logoBox, { backgroundColor: C.brandBlue }]}>
									<Ionicons name="mail-outline" size={22} color={C.surface} />
								</View>
								<Text style={[styles.brand, { color: C.brandBlueDark }]}>Dalaal-Prime</Text>
							</View>
							<Text style={[styles.title, { color: C.textMain }]}>{isLogin ? 'Login Code' : 'Verify Email'}</Text>
							<Text style={[styles.subtitle, { color: C.textMuted }]}>
								Enter the 6-digit code sent to {params.email}
							</Text>
						</FadeIn>

						<FadeIn delay={120}>
							<Text style={[styles.label, { color: C.textMuted }]}>Verification Code</Text>
							<TextInput
								value={code}
								onChangeText={setCode}
								placeholder="123456"
								placeholderTextColor={C.textMuted}
								style={[styles.input, { borderColor: C.brandBorder, color: C.textMain, backgroundColor: C.surface }]}
								keyboardType="number-pad"
								maxLength={6}
								returnKeyType="done"
								onSubmitEditing={onVerifyPress}
							/>
						</FadeIn>
					</View>

					<View style={{ flex: 1 }} />

					<FadeIn delay={220}>
						<View style={styles.footer}>
							<TouchableOpacity
								disabled={code.length !== 6 || loading || authLoading}
								onPress={onVerifyPress}
								style={[styles.primaryBtn, { backgroundColor: code.length === 6 ? C.brandBlue : C.brandBorder }]}
							>
								{loading || authLoading ? (
									<ActivityIndicator color={C.surface} />
								) : (
									<Text style={[styles.primaryText, { color: C.surface }]}>{isLogin ? 'Login' : 'Verify'}</Text>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								onPress={onResendPress}
								style={[styles.linkBtn, { borderColor: C.brandBorder }]}
							>
								<Text style={[styles.linkText, { color: C.brandBlue }]}>Resend Code</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => router.replace('/login')}
								style={[styles.linkBtn, { borderColor: 'transparent' }]}
							>
								<Text style={[styles.linkText, { color: C.textMuted }]}>Back to Login</Text>
							</TouchableOpacity>
						</View>
					</FadeIn>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { paddingHorizontal: 24 },
	brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
	logoBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
	brand: { fontSize: 20, fontWeight: '900' },
	title: { fontSize: 30, fontWeight: '900' },
	subtitle: { marginTop: 8, fontSize: 14, lineHeight: 20 },
	label: { marginTop: 18, fontSize: 12 },
	input: { height: 56, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, fontSize: 18, fontWeight: '700', marginTop: 10, textAlign: 'center', letterSpacing: 8 },
	footer: { paddingHorizontal: 24, paddingBottom: 22, gap: 14, marginTop: 18 },
	primaryBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
	primaryText: { fontSize: 16, fontWeight: '900' },
	linkBtn: { height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, backgroundColor: 'transparent' },
	linkText: { fontSize: 14, fontWeight: '800' },
});
