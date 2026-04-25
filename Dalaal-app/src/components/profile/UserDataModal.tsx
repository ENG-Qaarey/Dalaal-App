import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  colors: any;
  items: { label: string; value: string }[];
  initialValues: {
    bio: string;
    whatsappNumber: string;
    telegramHandle: string;
    city: string;
    country: string;
    language: string;
    currency: string;
  };
  onSave: (values: {
    bio: string;
    whatsappNumber: string;
    telegramHandle: string;
    city: string;
    country: string;
    language: string;
    currency: string;
  }) => Promise<void>;
};

export default function UserDataModal({ visible, onClose, colors, items, initialValues, onSave }: Props) {
  const [bio, setBio] = useState(initialValues.bio);
  const [whatsappNumber, setWhatsappNumber] = useState(initialValues.whatsappNumber);
  const [telegramHandle, setTelegramHandle] = useState(initialValues.telegramHandle);
  const [city, setCity] = useState(initialValues.city);
  const [country, setCountry] = useState(initialValues.country);
  const [language, setLanguage] = useState(initialValues.language);
  const [currency, setCurrency] = useState(initialValues.currency);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setBio(initialValues.bio);
    setWhatsappNumber(initialValues.whatsappNumber);
    setTelegramHandle(initialValues.telegramHandle);
    setCity(initialValues.city);
    setCountry(initialValues.country);
    setLanguage(initialValues.language);
    setCurrency(initialValues.currency);
  }, [visible, initialValues]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        bio: bio.trim(),
        whatsappNumber: whatsappNumber.trim(),
        telegramHandle: telegramHandle.trim(),
        city: city.trim(),
        country: country.trim(),
        language: language.trim(),
        currency: currency.trim(),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.brandBorder }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textMain }]}>Privacy & Security</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.tableRow }]}>
              <Ionicons name="close" size={18} color={colors.textMain} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Account data visible to you</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <View key={item.label} style={[styles.row, { borderBottomColor: colors.brandBorder }]}>
                <Text style={[styles.label, { color: colors.textMain }]}>{item.label}</Text>
                <Text style={[styles.value, { color: colors.textMuted }]}>{item.value}</Text>
              </View>
            ))}

            <Text style={[styles.editTitle, { color: colors.textMain }]}>Edit Contact & Links</Text>
            <TextInput
              value={whatsappNumber}
              onChangeText={setWhatsappNumber}
              placeholder="WhatsApp number or link"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.textMain, borderColor: colors.brandBorder, backgroundColor: colors.tableRow }]}
            />
            <TextInput
              value={telegramHandle}
              onChangeText={setTelegramHandle}
              placeholder="Telegram username or link"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.textMain, borderColor: colors.brandBorder, backgroundColor: colors.tableRow }]}
            />
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Bio"
              placeholderTextColor={colors.textMuted}
              multiline
              style={[styles.textArea, { color: colors.textMain, borderColor: colors.brandBorder, backgroundColor: colors.tableRow }]}
            />
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.textMain, borderColor: colors.brandBorder, backgroundColor: colors.tableRow }]}
            />
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="Country code (e.g. SO)"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              style={[styles.input, { color: colors.textMain, borderColor: colors.brandBorder, backgroundColor: colors.tableRow }]}
            />
            <View style={styles.split}>
              <TextInput
                value={language}
                onChangeText={setLanguage}
                placeholder="Language (e.g. so)"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={[styles.splitInput, { color: colors.textMain, borderColor: colors.brandBorder, backgroundColor: colors.tableRow }]}
              />
              <TextInput
                value={currency}
                onChangeText={setCurrency}
                placeholder="Currency (e.g. USD)"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                style={[styles.splitInput, { color: colors.textMain, borderColor: colors.brandBorder, backgroundColor: colors.tableRow }]}
              />
            </View>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={[styles.saveBtn, { backgroundColor: colors.brandBlue }]}
            >
              <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    padding: 14,
    maxHeight: '76%',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '900' },
  subtitle: { marginTop: 4, marginBottom: 10, fontSize: 11 },
  closeBtn: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  row: { paddingVertical: 11, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '800', flex: 1 },
  value: { fontSize: 11, fontWeight: '700', maxWidth: '58%', textAlign: 'right' },
  editTitle: { marginTop: 14, marginBottom: 8, fontSize: 13, fontWeight: '900' },
  input: { height: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 8, fontSize: 12 },
  textArea: { minHeight: 74, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingTop: 10, marginBottom: 8, fontSize: 12, textAlignVertical: 'top' },
  split: { flexDirection: 'row', gap: 8 },
  splitInput: { flex: 1, height: 42, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginBottom: 10, fontSize: 12 },
  saveBtn: { height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  saveBtnText: { color: '#fff', fontSize: 12, fontWeight: '900' },
});
