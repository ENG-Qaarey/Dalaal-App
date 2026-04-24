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
	const { sendOtp, isLoading: authLoading } = useAuth();

	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);

	const onSendOtpPress = async () => {
		if (!isValidEmail(email)) {
			Alert.alert('Invalid Email', 'Please enter a valid email address.');
			return;
		}

		setLoading(true);
		try {
  			await sendOtp(email.trim().toLowerCase());
  			router.push({
  				pathname: '/verify-email',
  				params: { email: email.trim().toLowerCase(), type: 'login' }
  			});
		} catch (error: any) {
			console.error(error);
			Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const canContinue = email.length > 5 && isValidEmail(email);

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
						<Text style={[styles.subtitle, { color: C.textMuted }]}>Enter your email to continue</Text>
					</FadeIn>

					<View style={styles.form}>
						<FadeIn delay={100}>
							<Text style={[styles.label, { color: C.textMuted }]}>Email Address</Text>
							<TextInput
								style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.surface }]}
								placeholder="example@email.com"
								placeholderTextColor={C.textMuted}
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								keyboardType="email-address"
								returnKeyType="done"
								onSubmitEditing={onSendOtpPress}
							/>
						</FadeIn>
					</View>

					<View style={{ flex: 1, minHeight: 40 }} />

					<FadeIn delay={220}>
						<View style={styles.footer}>
							<TouchableOpacity
								disabled={!canContinue || loading || authLoading}
								onPress={onSendOtpPress}
								style={[styles.primaryBtn, { backgroundColor: canContinue ? C.brandBlue : C.brandBorder }]}
							>
								{loading || authLoading ? (
									<ActivityIndicator color={C.surface} />
								) : (
									<Text style={[styles.primaryText, { color: C.surface }]}>Send OTP</Text>
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
	scrollContent: { paddingTop: 20, paddingBottom: 60, flexGrow: 1 },
	header: { paddingHorizontal: 24, marginBottom: 40 },
	brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
	logoBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
	brand: { fontSize: 20, fontWeight: '900' },
	form: { paddingHorizontal: 24, gap: 28 },
	title: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
	subtitle: { marginTop: 12, fontSize: 16, lineHeight: 24, opacity: 0.7 },
	label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
	input: { height: 60, borderRadius: 18, borderWidth: 1.5, paddingHorizontal: 20, fontSize: 16, fontWeight: '600' },
	footer: { paddingHorizontal: 24, paddingBottom: 40, gap: 18, marginTop: 40 },
	primaryBtn: { height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
	primaryText: { fontSize: 18, fontWeight: '800' },
	linkBtn: { height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
	linkText: { fontSize: 16, fontWeight: '700' },
});
