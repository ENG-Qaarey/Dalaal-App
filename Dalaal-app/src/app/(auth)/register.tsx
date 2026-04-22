import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

type Params = { lang?: string };

export default function Register() {
	const router = useRouter();
	const params = useLocalSearchParams<Params>();
	const colorScheme = useColorScheme() as 'light' | 'dark' | null;
	const C = Colors[colorScheme ?? 'light'];

	const [fullName, setFullName] = useState('');
	const [phoneOrEmail, setPhoneOrEmail] = useState('');
	const [password, setPassword] = useState('');

	const canContinue = fullName.trim().length >= 2 && phoneOrEmail.trim().length >= 4 && password.length >= 6;

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
			<OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

			<View style={styles.content}>
				<FadeIn>
					<View style={styles.brandRow}>
						<View style={[styles.logoBox, { backgroundColor: C.brandBlue }]}
							>
							<Ionicons name="home" size={22} color={C.surface} />
						</View>
						<Text style={[styles.brand, { color: C.brandBlueDark }]}>Dalaal</Text>
					</View>
					<Text style={[styles.title, { color: C.textMain }]}>Create account</Text>
					<Text style={[styles.subtitle, { color: C.textMuted }]}>Sign up to start using the app.</Text>
					{!!params.lang && <Text style={[styles.langNote, { color: C.textMuted }]}>Language: {params.lang}</Text>}
				</FadeIn>

				<FadeIn delay={120}>
					<Text style={[styles.label, { color: C.textMuted }]}>Full name</Text>
					<TextInput
						value={fullName}
						onChangeText={setFullName}
						placeholder="Your name"
						placeholderTextColor={C.textMuted}
						style={[styles.input, { borderColor: C.brandBorder, color: C.textMain, backgroundColor: C.surface }]}
						autoCapitalize="words"
					/>

					<Text style={[styles.label, { color: C.textMuted, marginTop: 14 }]}>Phone or email</Text>
					<TextInput
						value={phoneOrEmail}
						onChangeText={setPhoneOrEmail}
						placeholder="61xxxxxxx or you@example.com"
						placeholderTextColor={C.textMuted}
						style={[styles.input, { borderColor: C.brandBorder, color: C.textMain, backgroundColor: C.surface }]}
						autoCapitalize="none"
					/>

					<Text style={[styles.label, { color: C.textMuted, marginTop: 14 }]}>Password</Text>
					<TextInput
						value={password}
						onChangeText={setPassword}
						placeholder="Minimum 6 characters"
						placeholderTextColor={C.textMuted}
						style={[styles.input, { borderColor: C.brandBorder, color: C.textMain, backgroundColor: C.surface }]}
						secureTextEntry
						autoCapitalize="none"
					/>
				</FadeIn>
			</View>

			<FadeIn delay={220}>
				<View style={styles.footer}>
					<TouchableOpacity
						disabled={!canContinue}
						onPress={() => router.replace('/(tabs)')}
						style={[styles.primaryBtn, { backgroundColor: canContinue ? C.brandBlue : C.brandBorder }]}
					>
						<Text style={[styles.primaryText, { color: C.surface }]}>Register</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => router.replace({ pathname: '/login', params: { lang: params.lang } })}
						style={[styles.linkBtn, { borderColor: C.brandBorder }]}
					>
						<Text style={[styles.linkText, { color: C.brandBlue }]}>Already have an account? Login</Text>
					</TouchableOpacity>
				</View>
			</FadeIn>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { flex: 1, paddingHorizontal: 24, paddingTop: 22 },
	brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
	logoBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
	brand: { fontSize: 20, fontWeight: '900' },
	title: { fontSize: 30, fontWeight: '900' },
	subtitle: { marginTop: 8, fontSize: 14, lineHeight: 20 },
	langNote: { marginTop: 8, fontSize: 12 },
	label: { marginTop: 18, fontSize: 12 },
	input: { height: 54, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, fontWeight: '700' },
	footer: { paddingHorizontal: 24, paddingBottom: 22, gap: 12 },
	primaryBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
	primaryText: { fontSize: 16, fontWeight: '900' },
	linkBtn: { height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, backgroundColor: 'transparent' },
	linkText: { fontSize: 14, fontWeight: '800' },
});

