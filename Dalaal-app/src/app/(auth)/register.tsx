import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';
import { isValidEmail, normalizeEmail } from '../../utils/auth-form';
import useAuth from '../../hooks/useAuth';

export const options = { headerShown: false };

type Params = { lang?: string };

export default function Register() {
	const router = useRouter();
	const params = useLocalSearchParams<Params>();
	const { scheme } = useAppTheme();
	const C = Colors[scheme];
	const { register, sendOtp, isLoading: authLoading } = useAuth();

	const [fullName, setFullName] = useState('');
	const [username, setUsername] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const onRegisterPress = async () => {
		if (!fullName.trim()) {
			Alert.alert('Missing Name', 'Please enter your full name.');
			return;
		}
		if (!phone.trim()) {
			Alert.alert('Missing Phone', 'Please enter your phone number.');
			return;
		}
		if (!isValidEmail(email)) {
			Alert.alert('Invalid Email', 'Please enter a valid email address.');
			return;
		}
		if (password.length < 8) {
			Alert.alert('Invalid Password', 'Password must be at least 8 characters long.');
			return;
		}

		setLoading(true);
		try {
			await register({
				fullName: fullName.trim(),
				username: username.trim().toLowerCase(),
				phone: phone.trim(),
				email: normalizeEmail(email),
				password: password,
			});
			// Registration successful, backend already sends a verification email
			router.push({
				pathname: '/verify-email',
				params: { email: normalizeEmail(email), type: 'register' }
			});
		} catch (error: any) {
			console.error(error);
			Alert.alert('Registration Error', error.response?.data?.message || 'Failed to create account.');
		} finally {
			setLoading(false);
		}
	};

	const canContinue = fullName.trim().length > 2 && username.trim().length > 2 && phone.trim().length > 5 && isValidEmail(email) && password.length >= 8;

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
						<Text style={[styles.title, { color: C.textMain }]}>Create Account</Text>
						<Text style={[styles.subtitle, { color: C.textMuted }]}>Join Dalaal App today</Text>
					</FadeIn>

					<View style={styles.form}>
						<FadeIn delay={100}>
							<Text style={[styles.label, { color: C.textMuted }]}>Full Name</Text>
							<TextInput
								style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.surface }]}
								placeholder="John Doe"
								placeholderTextColor={C.textMuted}
								value={fullName}
								onChangeText={setFullName}
								autoCapitalize="words"
								returnKeyType="next"
							/>
						</FadeIn>

						<FadeIn delay={110}>
							<Text style={[styles.label, { color: C.textMuted }]}>Username</Text>
							<TextInput
								style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.surface }]}
								placeholder="johndoe"
								placeholderTextColor={C.textMuted}
								value={username}
								onChangeText={setUsername}
								autoCapitalize="none"
								returnKeyType="next"
							/>
						</FadeIn>

						<FadeIn delay={120}>
							<Text style={[styles.label, { color: C.textMuted }]}>Phone Number</Text>
							<TextInput
								style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.surface }]}
								placeholder="+252 61XXXXXXX"
								placeholderTextColor={C.textMuted}
								value={phone}
								onChangeText={setPhone}
								keyboardType="phone-pad"
								returnKeyType="next"
							/>
						</FadeIn>

						<FadeIn delay={150}>
							<Text style={[styles.label, { color: C.textMuted }]}>Email Address</Text>
							<TextInput
								style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.surface }]}
								placeholder="example@email.com"
								placeholderTextColor={C.textMuted}
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								keyboardType="email-address"
								returnKeyType="next"
							/>
						</FadeIn>

						<FadeIn delay={180}>
							<Text style={[styles.label, { color: C.textMuted }]}>Password</Text>
							<View style={[styles.passwordContainer, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
								<TextInput
									style={[styles.passwordInput, { color: C.textMain }]}
									placeholder="••••••••"
									placeholderTextColor={C.textMuted}
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
									returnKeyType="done"
									onSubmitEditing={onRegisterPress}
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

					<FadeIn delay={250}>
						<View style={styles.footer}>
							<TouchableOpacity
								disabled={!canContinue || loading || authLoading}
								onPress={onRegisterPress}
								style={[styles.primaryBtn, { backgroundColor: canContinue ? C.brandBlue : C.brandBorder }]}
							>
								{loading || authLoading ? (
									<ActivityIndicator color={C.surface} />
								) : (
									<Text style={[styles.primaryText, { color: C.surface }]}>Register</Text>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => router.replace({ pathname: '/login', params: { lang: params.lang } })}
								style={[styles.linkBtn, { borderColor: C.brandBorder }]}
							>
								<Text style={[styles.linkText, { color: C.brandBlue }]}>Already have an account? Login</Text>
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
	header: { paddingHorizontal: 20, marginBottom: 20 },
	brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
	logoBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
	brand: { fontSize: 18, fontWeight: '900' },
	form: { paddingHorizontal: 20, gap: 16 },
	title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
	subtitle: { marginTop: 6, fontSize: 14, lineHeight: 20, opacity: 0.7 },
	label: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
	input: { height: 48, borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
	passwordContainer: { height: 48, borderRadius: 12, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center' },
	passwordInput: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
	eyeIcon: { paddingHorizontal: 12, height: '100%', justifyContent: 'center' },
	footer: { paddingHorizontal: 20, paddingBottom: 30, gap: 14, marginTop: 24 },
	primaryBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
	primaryText: { fontSize: 16, fontWeight: '800' },
	linkBtn: { height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
	linkText: { fontSize: 15, fontWeight: '700' },
});
