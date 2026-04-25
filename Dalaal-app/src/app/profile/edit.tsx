import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
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

export default function EditProfile() {
  const router = useRouter();
  const { scheme } = useAppTheme();
  const { user, checkAuth } = useAuth();
  const C = Colors[scheme];

  const [firstName, setFirstName] = useState(user?.profile?.firstName || '');
  const [lastName, setLastName] = useState(user?.profile?.lastName || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [country, setCountry] = useState(user?.profile?.country || '');
  const [isSaving, setIsSaving] = useState(false);
  const [pickerType, setPickerType] = useState<'city' | 'country' | null>(null);

  useEffect(() => {
    setFirstName(user?.profile?.firstName || '');
    setLastName(user?.profile?.lastName || '');
    setBio(user?.profile?.bio || '');
    setCity(user?.profile?.city || '');
    setCountry(user?.profile?.country || '');
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await authService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        city: city.trim(),
        country: country.trim(),
      });
      await checkAuth();
      Alert.alert('Saved', 'Profile updated successfully.');
      router.back();
    } catch (error: any) {
      Alert.alert('Save failed', error?.message || 'Could not update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]}>
      <View style={[styles.header, { borderBottomColor: C.brandBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: C.tableRow }]}>
          <Ionicons name="arrow-back" size={16} color={C.textMain} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.textMain }]}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, { color: C.textMain }]}>First name</Text>
        <TextInput value={firstName} onChangeText={setFirstName} placeholder="First name" placeholderTextColor={C.textMuted} style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.tableRow }]} />

        <Text style={[styles.label, { color: C.textMain }]}>Last name</Text>
        <TextInput value={lastName} onChangeText={setLastName} placeholder="Last name" placeholderTextColor={C.textMuted} style={[styles.input, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.tableRow }]} />

        <Text style={[styles.label, { color: C.textMain }]}>Bio</Text>
        <TextInput value={bio} onChangeText={setBio} placeholder="Bio" placeholderTextColor={C.textMuted} multiline style={[styles.textArea, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.tableRow }]} />

        <Text style={[styles.label, { color: C.textMain }]}>City</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setPickerType('city')}
          style={[styles.selectInput, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}
        >
          <Text style={[styles.selectText, { color: city ? C.textMain : C.textMuted }]}>{city || 'Select city'}</Text>
          <Ionicons name="chevron-down" size={14} color={C.textMuted} />
        </TouchableOpacity>

        <Text style={[styles.label, { color: C.textMain }]}>Country</Text>
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

        <TouchableOpacity disabled={isSaving} onPress={handleSave} style={[styles.saveBtn, { backgroundColor: C.brandBlue }]}>
          <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
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
  safe: { flex: 1 },
  header: { height: 54, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10 },
  iconBtn: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '900' },
  content: { padding: 12, paddingBottom: 30 },
  label: { fontSize: 12, fontWeight: '800', marginBottom: 6 },
  input: { height: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 10, fontSize: 12 },
  selectInput: {
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 12, fontWeight: '700' },
  textArea: { minHeight: 78, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingTop: 10, marginBottom: 10, fontSize: 12, textAlignVertical: 'top' },
  saveBtn: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  saveText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 18 },
  modalCard: { width: '100%', borderWidth: 1, borderRadius: 14, padding: 12 },
  modalTitle: { fontSize: 14, fontWeight: '900', marginBottom: 8 },
  optionRow: { height: 42, borderBottomWidth: 1, justifyContent: 'center' },
  optionText: { fontSize: 12, fontWeight: '700' },
  cancelBtn: { height: 40, borderRadius: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 12, fontWeight: '800' },
});
