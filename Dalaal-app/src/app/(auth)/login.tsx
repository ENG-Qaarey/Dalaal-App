import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';
import { isValidEmail } from '../../utils/auth-form';
import useAuth from '../../hooks/useAuth';

export const options = { headerShown: false };

type Params = { lang?: string };

export default function Login() {
	const router = useRouter();
	const params = useLocalSearchParams<Params>();
	const { scheme } = useAppTheme();
	const C = Colors[scheme];
	const { login, isLoading: authLoading } = useAuth();

	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const onLoginPress = async () => {
		if (identifier.length < 3) {
			Alert.alert('Invalid Input', 'Please enter a valid email or phone number.');
			return;
		}
		if (password.length < 8) {
			Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
			return;
		}

		setLoading(true);
		try {
			console.log('Attempting login with:', identifier.trim().toLowerCase());
			const result = await login({
				identifier: identifier.trim().toLowerCase(),
				password: password,
			});
			console.log('Login successful, navigating to tabs...');
			// Navigate to the main app after successful login
			router.replace('/(tabs)');
		} catch (error: any) {
			console.error('Login failed:', error?.response?.status, error?.response?.data);
			Alert.alert('Login Error', error.response?.data?.message || 'Invalid email/phone or password.');
		} finally {
			setLoading(false);
		}
	};

	const canContinue = identifier.length >= 3 && password.length >= 8;

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
			<OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					<FadeIn style={styles.header}>
						<View style={styles.brandRow}>
							<View style={[styles.logoBox, { backgroundColor: C.brandBlue }]}>
								<Ionicons name="home" size={22} color={C.surface} />
							</View>
							<Text style={[styles.brand, { color: C.brandBlueDark }]}>Dalaal-Prime</Text>
						</View>
						<Text style={[styles.title, { color: C.textMain }]}>Welcome Back</Text>
						<Text style={[styles.subtitle, { color: C.textMuted }]}>Enter your credentials to continue</Text>
					</FadeIn>

					<View style={styles.form}>
						<FadeIn delay={100}>
							<Text style={[styles.label, { color: C.textMuted }]}>Email or Phone</Text>
							<TextInput
								style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.surface }]}
								placeholder="Email or +252..."
								placeholderTextColor={C.textMuted}
								value={identifier}
								onChangeText={setIdentifier}
								autoCapitalize="none"
								keyboardType="default"
								returnKeyType="next"
							/>
						</FadeIn>

						<FadeIn delay={150}>
							<Text style={[styles.label, { color: C.textMuted }]}>Password</Text>
							<View style={[styles.passwordContainer, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
								<TextInput
									style={[styles.passwordInput, { color: C.textMain }]}
									placeholder="••••••••"
									placeholderTextColor={C.textMuted}
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
									autoCapitalize="none"
									returnKeyType="done"
									onSubmitEditing={onLoginPress}
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
					</View>

					<View style={{ flex: 1, minHeight: 40 }} />

					<FadeIn delay={220}>
						<View style={styles.footer}>
							<TouchableOpacity
								disabled={!canContinue || loading || authLoading}
								onPress={onLoginPress}
								style={[styles.primaryBtn, { backgroundColor: canContinue ? C.brandBlue : C.brandBorder }]}
							>
								{loading || authLoading ? (
									<ActivityIndicator color={C.surface} />
								) : (
									<Text style={[styles.primaryText, { color: C.surface }]}>Login</Text>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => router.replace({ pathname: '/register', params: { lang: params.lang } })}
								style={[styles.linkBtn, { borderColor: C.brandBorder }]}
							>
								<Text style={[styles.linkText, { color: C.brandBlue }]}>Create an account</Text>
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
	scrollContent: { paddingTop: 10, paddingBottom: 40, flexGrow: 1 },
	header: { paddingHorizontal: 20, marginBottom: 24 },
	brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
	logoBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
	brand: { fontSize: 18, fontWeight: '900' },
	form: { paddingHorizontal: 20, gap: 20 },
	title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
	subtitle: { marginTop: 8, fontSize: 14, lineHeight: 20, opacity: 0.7 },
	label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
	input: { height: 50, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
	passwordContainer: { height: 50, borderRadius: 14, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center' },
	passwordInput: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
	eyeIcon: { paddingHorizontal: 12, height: '100%', justifyContent: 'center' },
	footer: { paddingHorizontal: 20, paddingBottom: 30, gap: 14, marginTop: 30 },
	primaryBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
	primaryText: { fontSize: 16, fontWeight: '800' },
	linkBtn: { height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
	linkText: { fontSize: 15, fontWeight: '700' },
});
