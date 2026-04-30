import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

export default function BookingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { title } = useLocalSearchParams<{ title: string }>();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];

  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [type, setType] = useState('In-Person');

  const handleBook = () => {
    Alert.alert('Booking Confirmed!', `Your ${type} tour for "${title || 'Property'}" is set for the ${selectedDate}th at ${selectedTime}.`, [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const dates = Array.from({ length: 14 }, (_, i) => i + 1);
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '04:30 PM'];

  return (
    <View style={[styles.safe, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 44) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="chevron-back" size={16} color={C.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.textMain }]}>Book a Tour</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 20 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subText, { color: C.textMuted }]}>Schedule a viewing for:</Text>
        <Text style={[styles.propTitle, { color: C.brandBlue }]}>{title || 'Selected Property'}</Text>

        <View style={[styles.section, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Tour Type</Text>
          <View style={styles.row}>
            {['In-Person', 'Video Call'].map(t => (
              <TouchableOpacity
                key={t}
                activeOpacity={0.8}
                onPress={() => setType(t)}
                style={[
                  styles.toggleBtn, 
                  { 
                    backgroundColor: type === t ? C.brandBlue : C.tableRow, 
                    borderColor: type === t ? C.brandBlue : C.brandBorder 
                  }
                ]}
              >
                <Ionicons name={t === 'In-Person' ? 'walk' : 'videocam'} size={16} color={type === t ? '#fff' : C.textMain} style={{ marginRight: 6 }} />
                <Text style={[styles.toggleText, { color: type === t ? '#fff' : C.textMain }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {dates.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => setSelectedDate(d)}
                style={[
                  styles.dateBox, 
                  { 
                    backgroundColor: selectedDate === d ? C.brandOrange : C.tableRow,
                    borderColor: selectedDate === d ? C.brandOrange : C.brandBorder 
                  }
                ]}
              >
                <Text style={[styles.dateDay, { color: selectedDate === d ? '#fff' : C.textMuted }]}>Oct</Text>
                <Text style={[styles.dateNum, { color: selectedDate === d ? '#fff' : C.textMain }]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Select Time</Text>
          <View style={styles.timeGrid}>
            {times.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setSelectedTime(t)}
                style={[
                  styles.timeBox,
                  {
                    backgroundColor: selectedTime === t ? C.brandBlue : C.tableRow,
                    borderColor: selectedTime === t ? C.brandBlue : C.brandBorder
                  }
                ]}
              >
                <Text style={[styles.timeText, { color: selectedTime === t ? '#fff' : C.textMain }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={handleBook} style={[styles.bookBtn, { backgroundColor: C.brandBlue }]}>
          <Text style={styles.bookBtnText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 10 },
  backBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900' },
  content: { padding: 12 },
  subText: { fontSize: 12, fontWeight: '700' },
  propTitle: { fontSize: 16, fontWeight: '900', marginBottom: 16 },
  section: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '900', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  toggleBtn: { flex: 1, flexDirection: 'row', height: 40, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  toggleText: { fontSize: 12, fontWeight: '800' },
  dateBox: { width: 60, height: 70, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontSize: 11, fontWeight: '800', marginBottom: 2 },
  dateNum: { fontSize: 18, fontWeight: '900' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeBox: { width: '31%', height: 40, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  timeText: { fontSize: 12, fontWeight: '800' },
  bookBtn: { height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  bookBtnText: { color: '#fff', fontSize: 15, fontWeight: '900' }
});
