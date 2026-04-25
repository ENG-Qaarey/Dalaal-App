import React, { useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';
import useAuth from '../../hooks/useAuth';
import { authService } from '../../services/auth';

const CITY_OPTIONS = ['Mogadishu', 'Hargeisa', 'Garowe', 'Kismayo', 'Baidoa', 'Bosaso', 'Beledweyne'];
const COUNTRY_OPTIONS = [
  { label: 'Somalia', value: 'SO' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Ethiopia', value: 'ET' },
  { label: 'Djibouti', value: 'DJ' },
  { label: 'Uganda', value: 'UG' },
];

export default function PrivacySecurityPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const { user, checkAuth } = useAuth();
  const C = Colors[scheme];

  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.profile?.whatsappNumber || '');
  const [telegramHandle, setTelegramHandle] = useState(user?.profile?.telegramHandle || '');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [country, setCountry] = useState(user?.profile?.country || '');
  const [language, setLanguage] = useState(user?.profile?.language || '');
  const [currency, setCurrency] = useState(user?.profile?.currency || '');
  const [isSaving, setIsSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(!!user?.twoFactorEnabled);
  const [pickerType, setPickerType] = useState<'city' | 'country' | null>(null);

  const readonlyData = useMemo(
    () => [
      { label: 'Email', value: user?.email || '—' },
      { label: 'Phone', value: user?.phone || '—' },
      { label: 'Role', value: user?.role || '—' },
      { label: 'Status', value: user?.status || '—' },
      { label: 'Email Verified', value: user?.emailVerified ? 'Yes' : 'No' },
      { label: 'Last Login', value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—' },
    ],
    [user]
  );

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      await authService.updateProfile({
        bio: bio.trim(),
        whatsappNumber: whatsappNumber.trim(),
        telegramHandle: telegramHandle.trim(),
        city: city.trim(),
        country: country.trim(),
        language: language.trim(),
        currency: currency.trim(),
      });
      await checkAuth();
      Alert.alert('Saved', 'Privacy and security data updated.');
    } catch (error: any) {
      Alert.alert('Update failed', error?.message || 'Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: C.brandBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: C.tableRow }]}>
          <Ionicons name="arrow-back" size={16} color={C.textMain} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.textMain }]}>Privacy & Security</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Security</Text>
          <View style={[styles.row, { borderBottomColor: C.brandBorder }]}>
            <Text style={[styles.rowLabel, { color: C.textMain }]}>Two-factor authentication</Text>
            <Switch value={twoFactorEnabled} onValueChange={setTwoFactorEnabled} />
          </View>
          <Text style={[styles.note, { color: C.textMuted }]}>2FA UI is ready. Backend enable/disable can be connected next.</Text>
        </View>

        <View style={[styles.card, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Account Info</Text>
          {readonlyData.map((item) => (
            <View key={item.label} style={[styles.row, { borderBottomColor: C.brandBorder }]}>
              <Text style={[styles.rowLabel, { color: C.textMain }]}>{item.label}</Text>
              <Text style={[styles.rowValue, { color: C.textMuted }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Contact & Links</Text>
          <TextInput value={whatsappNumber} onChangeText={setWhatsappNumber} placeholder="WhatsApp number or link" placeholderTextColor={C.textMuted} style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.tableRow }]} />
          <TextInput value={telegramHandle} onChangeText={setTelegramHandle} placeholder="Telegram username or link" placeholderTextColor={C.textMuted} style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.tableRow }]} />
          <TextInput value={bio} onChangeText={setBio} placeholder="Bio" placeholderTextColor={C.textMuted} multiline style={[styles.textArea, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.tableRow }]} />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setPickerType('city')}
            style={[styles.selectInput, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}
          >
            <Text style={[styles.selectText, { color: city ? C.textMain : C.textMuted }]}>{city || 'Select city'}</Text>
            <Ionicons name="chevron-down" size={14} color={C.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setPickerType('country')}
            style={[styles.selectInput, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}
          >
            <Text style={[styles.selectText, { color: country ? C.textMain : C.textMuted }]}>
              {COUNTRY_OPTIONS.find((opt) => opt.value === country)?.label || 'Select country'}
            </Text>
            <Ionicons name="chevron-down" size={14} color={C.textMuted} />
          </TouchableOpacity>
          <View style={styles.split}>
            <TextInput value={language} onChangeText={setLanguage} placeholder="Language" placeholderTextColor={C.textMuted} style={[styles.splitInput, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.tableRow }]} />
            <TextInput value={currency} onChangeText={setCurrency} placeholder="Currency" placeholderTextColor={C.textMuted} autoCapitalize="characters" style={[styles.splitInput, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.tableRow }]} />
          </View>
          <TouchableOpacity disabled={isSaving} onPress={saveChanges} style={[styles.saveBtn, { backgroundColor: C.brandBlue }]}>
            <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={!!pickerType} transparent animationType="fade" onRequestClose={() => setPickerType(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
            <Text style={[styles.modalTitle, { color: C.textMain }]}>{pickerType === 'city' ? 'Select City' : 'Select Country'}</Text>
            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
              {(pickerType === 'city' ? CITY_OPTIONS : COUNTRY_OPTIONS.map((c) => c.label)).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.optionRow, { borderBottomColor: C.brandBorder }]}
                  onPress={() => {
                    if (pickerType === 'city') {
                      setCity(item);
                    } else {
                      const selected = COUNTRY_OPTIONS.find((c) => c.label === item);
                      setCountry(selected?.value || '');
                    }
                    setPickerType(null);
                  }}
                >
                  <Text style={[styles.optionText, { color: C.textMain }]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setPickerType(null)} style={[styles.cancelBtn, { backgroundColor: C.tableRow }]}>
              <Text style={[styles.cancelText, { color: C.textMain }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: { borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10, paddingBottom: 10 },
  backBtn: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '900' },
  content: { padding: 12, paddingBottom: 28 },
  card: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '900', marginBottom: 8 },
  row: { borderBottomWidth: 1, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { fontSize: 12, fontWeight: '800', flex: 1 },
  rowValue: { fontSize: 11, fontWeight: '700', maxWidth: '55%', textAlign: 'right' },
  note: { fontSize: 11, marginTop: 8 },
  input: { height: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 8, fontSize: 12 },
  selectInput: {
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 12, fontWeight: '700' },
  textArea: { minHeight: 74, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingTop: 10, marginBottom: 8, fontSize: 12, textAlignVertical: 'top' },
  split: { flexDirection: 'row', gap: 8 },
  splitInput: { flex: 1, height: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 10, fontSize: 12 },
  saveBtn: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  modalCard: { width: '100%', borderWidth: 1, borderRadius: 14, padding: 12 },
  modalTitle: { fontSize: 14, fontWeight: '900', marginBottom: 8 },
  optionRow: { height: 42, borderBottomWidth: 1, justifyContent: 'center' },
  optionText: { fontSize: 12, fontWeight: '700' },
  cancelBtn: { height: 40, borderRadius: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 12, fontWeight: '800' },
});
