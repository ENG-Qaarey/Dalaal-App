import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';
import { isValidEmail, normalizeEmail } from '../../utils/auth-form';
import { authService } from '../../services/auth';

export const options = { headerShown: false };

export default function ForgotPassword() {
	const router = useRouter();
	const { scheme } = useAppTheme();
	const C = Colors[scheme];

	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);

	const onSendPress = async () => {
		if (!isValidEmail(email)) {
			Alert.alert('Invalid Email', 'Please enter a valid email address.');
			return;
		}

		setLoading(true);
		try {
			await authService.forgotPassword(normalizeEmail(email));
			Alert.alert('Success', 'A verification code has been sent to your email.', [
				{
					text: 'OK',
					onPress: () => router.push({
						pathname: '/reset-password',
						params: { email: normalizeEmail(email) }
					})
				}
			]);
		} catch (error: any) {
			Alert.alert('Error', error.response?.data?.message || 'Failed to send reset code.');
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
					contentContainerStyle={styles.scrollContent}
				>
					<FadeIn style={styles.header}>
						<TouchableOpacity onPress={() => router.back()} style={[styles.backIconBtn, { borderColor: C.brandBorder }]}>
							<Ionicons name="arrow-back" size={20} color={C.textMain} />
						</TouchableOpacity>
						<View style={styles.brandRow}>
							<Image
								source={require('../../assets/images/AppLogo.png')}
								style={{ width: 36, height: 36, borderRadius: 10, marginRight: 8 }}
								resizeMode="contain"
							/>
							<Text style={[styles.brand, { color: C.brandBlueDark }]}>Dalaal-Prime</Text>
						</View>
						<Text style={[styles.title, { color: C.textMain }]}>Forgot Password</Text>
						<Text style={[styles.subtitle, { color: C.textMuted }]}>
							Enter your email to receive a password reset verification code
						</Text>
					</FadeIn>

					<View style={styles.form}>
						<FadeIn delay={120}>
							<Text style={[styles.label, { color: C.textMuted }]}>Email Address</Text>
							<TextInput
								value={email}
								onChangeText={setEmail}
								placeholder="example@email.com"
								placeholderTextColor={C.textMuted}
								style={[styles.input, { borderColor: C.brandBorder, color: C.textMain, backgroundColor: C.surface }]}
								keyboardType="email-address"
								autoCapitalize="none"
								returnKeyType="done"
								onSubmitEditing={onSendPress}
							/>
						</FadeIn>
					</View>

					<View style={{ flex: 1 }} />

					<FadeIn delay={220}>
						<View style={styles.footer}>
							<TouchableOpacity
								disabled={!isValidEmail(email) || loading}
								onPress={onSendPress}
								style={[styles.primaryBtn, { backgroundColor: isValidEmail(email) ? C.brandBlue : C.brandBorder }]}
							>
								{loading ? (
									<ActivityIndicator color={C.surface} />
								) : (
									<Text style={[styles.primaryText, { color: C.surface }]}>Send Code</Text>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => router.replace('/login')}
								style={styles.backBtn}
							>
								<Text style={[styles.backText, { color: C.textMuted }]}>Back to Login</Text>
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
	form: { paddingHorizontal: 20 },
	label: { fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 12 },
	input: { height: 50, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
	footer: { paddingHorizontal: 20, gap: 14, marginTop: 40 },
	primaryBtn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
	primaryText: { fontSize: 16, fontWeight: '800' },
	backBtn: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
	backText: { fontSize: 14, fontWeight: '600' },
});
