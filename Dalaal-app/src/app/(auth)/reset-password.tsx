import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';
import { authService } from '../../services/auth';

export const options = { headerShown: false };

type Params = { email: string };

export default function ResetPassword() {
	const router = useRouter();
	const params = useLocalSearchParams<Params>();
	const { scheme } = useAppTheme();
	const C = Colors[scheme];

	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const onResetPress = async () => {
		if (code.length !== 6) {
			Alert.alert('Invalid Code', 'Please enter the 6-digit verification code.');
			return;
		}
		if (newPassword.length < 8) {
			Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
			return;
		}
		if (newPassword !== confirmPassword) {
			Alert.alert('Mismatch', 'Passwords do not match.');
			return;
		}

		setLoading(true);
		try {
			await authService.resetPassword({
				email: params.email,
				code: code,
				newPassword: newPassword,
			});
			Alert.alert('Success', 'Your password has been reset successfully. You can now login.', [
				{ text: 'OK', onPress: () => router.replace('/login') }
			]);
		} catch (error: any) {
			Alert.alert('Error', error.response?.data?.message || 'Failed to reset password.');
		} finally {
			setLoading(false);
		}
	};

	const canReset = code.length === 6 && newPassword.length >= 8 && newPassword === confirmPassword;

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
			<OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={styles.scrollContent}
				>
					<FadeIn style={styles.header}>
						<TouchableOpacity onPress={() => router.back()} style={[styles.backIconBtn, { borderColor: C.brandBorder }]}>
							<Ionicons name="arrow-back" size={20} color={C.textMain} />
						</TouchableOpacity>
						<View style={styles.brandRow}>
							<View style={[styles.logoBox, { backgroundColor: C.brandBlue }]}>
								<Ionicons name="shield-checkmark-outline" size={22} color={C.surface} />
							</View>
							<Text style={[styles.brand, { color: C.brandBlueDark }]}>Dalaal-Prime</Text>
						</View>
						<Text style={[styles.title, { color: C.textMain }]}>Reset Password</Text>
						<Text style={[styles.subtitle, { color: C.textMuted }]}>
							Enter the code sent to {params.email} and your new password
						</Text>
					</FadeIn>

					<View style={styles.form}>
						<FadeIn delay={100}>
							<Text style={[styles.label, { color: C.textMuted }]}>Verification Code</Text>
							<TextInput
								value={code}
								onChangeText={setCode}
								placeholder="123456"
								placeholderTextColor={C.textMuted}
								style={[styles.input, { borderColor: C.brandBorder, color: C.textMain, backgroundColor: C.surface, textAlign: 'center', letterSpacing: 8 }]}
								keyboardType="number-pad"
								maxLength={6}
							/>
						</FadeIn>

						<FadeIn delay={140}>
							<Text style={[styles.label, { color: C.textMuted }]}>New Password</Text>
							<View style={[styles.passwordContainer, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
								<TextInput
									style={[styles.passwordInput, { color: C.textMain }]}
									placeholder="••••••••"
									placeholderTextColor={C.textMuted}
									value={newPassword}
									onChangeText={setNewPassword}
									secureTextEntry={!showPassword}
									autoCapitalize="none"
								/>
								<TouchableOpacity
									style={styles.eyeIcon}
									onPress={() => setShowPassword(!showPassword)}
								>
									<Ionicons
										name={showPassword ? 'eye-off-outline' : 'eye-outline'}
										size={20}
										color={C.textMuted}
									/>
								</TouchableOpacity>
							</View>
						</FadeIn>

						<FadeIn delay={180}>
							<Text style={[styles.label, { color: C.textMuted }]}>Confirm New Password</Text>
							<TextInput
								style={[styles.input, { borderColor: C.brandBorder, color: C.textMain, backgroundColor: C.surface }]}
								placeholder="••••••••"
								placeholderTextColor={C.textMuted}
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry={!showPassword}
								autoCapitalize="none"
							/>
						</FadeIn>
					</View>

					<View style={{ flex: 1 }} />

					<FadeIn delay={220}>
						<View style={styles.footer}>
							<TouchableOpacity
								disabled={!canReset || loading}
								onPress={onResetPress}
								style={[styles.primaryBtn, { backgroundColor: canReset ? C.brandBlue : C.brandBorder }]}
							>
								{loading ? (
									<ActivityIndicator color={C.surface} />
								) : (
									<Text style={[styles.primaryText, { color: C.surface }]}>Reset Password</Text>
								)}
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
	scrollContent: { paddingTop: 10, paddingBottom: 30, flexGrow: 1 },
	header: { paddingHorizontal: 20, marginBottom: 24 },
	backIconBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
	brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
	logoBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
	brand: { fontSize: 18, fontWeight: '900' },
	title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
	subtitle: { marginTop: 8, fontSize: 14, lineHeight: 20, opacity: 0.7 },
	form: { paddingHorizontal: 20, gap: 16 },
	label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
	input: { height: 50, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
	passwordContainer: { height: 50, borderRadius: 14, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center' },
	passwordInput: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
	eyeIcon: { paddingHorizontal: 12, height: '100%', justifyContent: 'center' },
	footer: { paddingHorizontal: 20, marginTop: 40 },
	primaryBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
	primaryText: { fontSize: 16, fontWeight: '800' },
});
