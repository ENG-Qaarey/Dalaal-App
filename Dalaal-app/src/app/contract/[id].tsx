import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

export default function ContractScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { title } = useLocalSearchParams<{ title: string }>();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];

  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSign = () => {
    if (!agreed) {
      Alert.alert('Missing Signature', 'Please agree to the terms to digitally sign.');
      return;
    }
    Alert.alert('Signed Successfully', 'Your e-signature has been securely recorded.', [
      { text: 'Done', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={[styles.safe, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 44) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="close" size={18} color={C.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.textMain }]}>E-Signature</Text>
        <View style={{ width: 34 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.docContainer, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <View style={[styles.docHeader, { borderBottomColor: C.brandBorder }]}>
            <Ionicons name="document-lock" size={20} color={C.brandOrange} />
            <Text style={[styles.docTitle, { color: C.textMain }]}>Lease / Purchase Agreement</Text>
          </View>
          
          <ScrollView 
            style={styles.docScroll}
            onScroll={() => setHasScrolled(true)}
            scrollEventThrottle={16}
          >
            <Text style={[styles.docText, { color: C.textMuted }]}>
              Property: {title || 'Selected Listing'}{'\n\n'}
              This Electronic Signature Agreement ("Agreement") is made to securely process your real estate transaction.{'\n\n'}
              1. BINDING EFFECT: By applying your electronic signature, you are legally binding yourself to the terms of the full document.{'\n\n'}
              2. CONSENT: You consent to conduct business electronically. You may request paper copies from your agent.{'\n\n'}
              3. FINANCIALS: You agree to all listed financial terms, including earnest money deposits, down payments, and monthly fees as outlined in the principal listing.{'\n\n'}
              4. CANCELATION: Cancelation must be provided in writing within the 48-hour inspection period.
              {'\n\n'}{'\n\n'}(Scroll to enable signature)
            </Text>
          </ScrollView>
        </View>

        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => hasScrolled && setAgreed(!agreed)}
          style={styles.checkRow}
        >
          <View style={[styles.checkbox, { borderColor: C.brandBorder, backgroundColor: agreed ? C.brandBlue : 'transparent' }]}>
            {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={[styles.checkText, { color: hasScrolled ? C.textMain : C.textMuted }]}>
            I have read and agree to digitally sign this document.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleSign} 
          disabled={!agreed}
          style={[styles.signBtn, { backgroundColor: agreed ? C.brandBlue : C.tableRow, borderColor: agreed ? C.brandBlue : C.brandBorder }]}
        >
          <Ionicons name="create-outline" size={18} color={agreed ? '#fff' : C.textMuted} style={{ marginRight: 8 }} />
          <Text style={[styles.signBtnText, { color: agreed ? '#fff' : C.textMuted }]}>Confirm E-Signature</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 10 },
  backBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900' },
  content: { padding: 12, flex: 1 },
  docContainer: { flex: 1, borderWidth: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  docHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, gap: 8 },
  docTitle: { fontSize: 14, fontWeight: '900' },
  docScroll: { padding: 16 },
  docText: { fontSize: 13, lineHeight: 22 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkText: { flex: 1, fontSize: 12, fontWeight: '700' },
  signBtn: { height: 50, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  signBtnText: { fontSize: 15, fontWeight: '900' }
});
