import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

type Params = { lang?: string };

const GOOGLE_LOGO_URI = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/40px-Google_%22G%22_logo.svg.png';

export default function Login() {
	const router = useRouter();
	const params = useLocalSearchParams<Params>();
	const { scheme } = useAppTheme();
	const C = Colors[scheme];

	const [phoneOrEmail, setPhoneOrEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const canContinue = phoneOrEmail.trim().length >= 4 && password.length >= 6;

	const onGooglePress = () => {
		Alert.alert('Google Sign-In', 'Google sign-in is not connected yet.');
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
									<Ionicons name="home" size={22} color={C.surface} />
								</View>
								<Text style={[styles.brand, { color: C.brandBlueDark }]}>Dalaal-Prime</Text>
							</View>
							<Text style={[styles.title, { color: C.textMain }]}>Login</Text>
							<Text style={[styles.subtitle, { color: C.textMuted }]}>Welcome back.</Text>
							{!!params.lang && <Text style={[styles.langNote, { color: C.textMuted }]}>Language: {params.lang}</Text>}
						</FadeIn>

						<FadeIn delay={120}>
							<Text style={[styles.label, { color: C.textMuted }]}>Phone or email</Text>
							<TextInput
								value={phoneOrEmail}
								onChangeText={setPhoneOrEmail}
								placeholder="61xxxxxxx or you@example.com"
								placeholderTextColor={C.textMuted}
								style={[styles.input, { borderColor: C.brandBorder, color: C.textMain, backgroundColor: C.surface }]}
								autoCapitalize="none"
								keyboardType="email-address"
								returnKeyType="next"
							/>

							<Text style={[styles.label, { color: C.textMuted }]}>Password</Text>
							<View style={[styles.passwordRow, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
								<TextInput
									value={password}
									onChangeText={setPassword}
									placeholder="Password"
									placeholderTextColor={C.textMuted}
									style={[styles.passwordInput, { color: C.textMain }]}
									secureTextEntry={!showPassword}
									autoCapitalize="none"
									returnKeyType="done"
									onSubmitEditing={() => {
										if (canContinue) router.replace('/(tabs)');
									}}
								/>
								<TouchableOpacity
									onPress={() => setShowPassword((current) => !current)}
									activeOpacity={0.8}
									style={styles.eyeBtn}
								>
									<Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.textMuted} />
								</TouchableOpacity>
							</View>
						</FadeIn>
					</View>

					<View style={{ flex: 1 }} />

					<FadeIn delay={220}>
						<View style={styles.footer}>
							<TouchableOpacity onPress={onGooglePress} activeOpacity={0.9} style={[styles.googleBtn, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
								<Image source={{ uri: GOOGLE_LOGO_URI }} style={styles.googleIcon} resizeMode="contain" />
								<Text style={[styles.googleText, { color: C.textMain }]}>Continue with Google</Text>
							</TouchableOpacity>

							<TouchableOpacity
								disabled={!canContinue}
								onPress={() => router.replace('/(tabs)')}
								style={[styles.primaryBtn, { backgroundColor: canContinue ? C.brandBlue : C.brandBorder }]}
							>
								<Text style={[styles.primaryText, { color: C.surface }]}>Login</Text>
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
	content: { paddingHorizontal: 24 },
	brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
	logoBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
	brand: { fontSize: 20, fontWeight: '900' },
	title: { fontSize: 30, fontWeight: '900' },
	subtitle: { marginTop: 8, fontSize: 14, lineHeight: 20 },
	langNote: { marginTop: 8, fontSize: 12 },
	label: { marginTop: 18, fontSize: 12 },
	input: { height: 56, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, fontWeight: '700', marginTop: 10 },
	passwordRow: { height: 56, borderRadius: 14, borderWidth: 1, marginTop: 10, paddingLeft: 14, paddingRight: 6, flexDirection: 'row', alignItems: 'center' },
	passwordInput: { flex: 1, fontSize: 15, fontWeight: '700', paddingVertical: 0 },
	eyeBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
	footer: { paddingHorizontal: 24, paddingBottom: 22, gap: 14, marginTop: 18 },
	googleBtn: { height: 54, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
	googleIcon: { width: 18, height: 18, marginRight: 10 },
	googleText: { fontSize: 15, fontWeight: '900' },
	primaryBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
	primaryText: { fontSize: 16, fontWeight: '900' },
	linkBtn: { height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, backgroundColor: 'transparent' },
	linkText: { fontSize: 14, fontWeight: '800' },
});

