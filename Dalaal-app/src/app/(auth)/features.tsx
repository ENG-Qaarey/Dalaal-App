import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';

export const options = { headerShown: false };

const CITIES = ['Muqdisho', 'Hargeisa', 'Galkacyo', 'Garowe', 'Kismayo'];

const DISTRICTS_BY_CITY: Record<string, string[]> = {
  Muqdisho: [
    'Waaberi',
    'Hodan',
    'Howlwadaag',
    'Wadajir',
    'Dharkenley',
    'Dayniile',
    'Wardhigley',
    'Hamar Weyne',
    'Hamar Jajab',
    'Shangaani',
    'Boondheere',
    'Shibis',
    'Abdiaziz',
    'Karaan',
    'Yaqshid',
    'Heliwaa',
    'Kaxda',
    'Warta Nabadda',
    'Xamar Jabjab',
    'Darasalaam',
  ],
  Hargeisa: ['26 June', 'Ahmed Dhagax', 'Ibraahim Koodbuur', 'Mohamed Mooge', 'Gacan Libaax', 'Koodbuur'],
  Galkacyo: ['Wadajir', 'Garsoor', 'Horumar', 'Israac'],
  Garowe: ['Waaberi', 'Hantiwadaag', 'Wadajir', '1da August'],
  Kismayo: ['Farjano', 'Faanoole', 'Calanley', 'Dalxiiska'],
};

const HERO_IMAGES = [
  require('../../assets/images/Featues-image/unsplash-1.jpg'),
  require('../../assets/images/Featues-image/unsplash-2.jpg'),
  require('../../assets/images/Featues-image/unsplash-3.jpg'),
  require('../../assets/images/Featues-image/unsplash-4.jpg'),
  require('../../assets/images/Featues-image/unsplash-5.jpg'),
  require('../../assets/images/Featues-image/unsplash-6.jpg'),
];

export default function Features() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [districtModalOpen, setDistrictModalOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const districts = useMemo(() => DISTRICTS_BY_CITY[selectedCity] ?? [], [selectedCity]);
  const filteredCities = useMemo(
    () => CITIES.filter((city) => city.toLowerCase().includes(cityQuery.trim().toLowerCase())),
    [cityQuery]
  );
  const filteredDistricts = useMemo(
    () => districts.filter((district) => district.toLowerCase().includes(districtQuery.trim().toLowerCase())),
    [districts, districtQuery]
  );

  const selectedDistrictLabel = selectedDistricts.length > 0 ? selectedDistricts[0] : '';
  const canContinue = Boolean(selectedCity);

  const handleSkip = () => {
    router.replace({ pathname: '/register', params: { lang: params.lang ?? 'English' } });
  };

  const handleContinue = () => {
    router.replace({
      pathname: '/register',
      params: {
        lang: params.lang ?? 'English',
        city: selectedCity,
        district: selectedDistrictLabel,
      },
    });
  };

  const openDistrictPicker = (city: string) => {
    setSelectedCity(city);
    setSelectedDistricts([]);
    setDistrictQuery('');
    setCityModalOpen(false);
    setDistrictModalOpen(true);
  };

  const toggleDistrict = (district: string) => {
    setSelectedDistricts((current) => {
      if (current.includes(district)) {
        return current.filter((item) => item !== district);
      }
      return [district];
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: C.surface }]}>
      <View style={styles.heroContainer}>
        <ImageBackground
          source={HERO_IMAGES[currentImageIndex]}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          
          <SafeAreaView edges={['top']} style={{ flex: 1, justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.9}
              style={[styles.skipBtn, { backgroundColor: C.tableRow + 'CC' }]}
            >
              <Text style={[styles.skipText, { color: C.textMain }]}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Raadi hanti kiro ama iib ah</Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>

      <View style={[styles.sheet, { backgroundColor: C.surface }]}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <View style={[styles.handle, { backgroundColor: C.brandBorder }]} />
        <Text style={[styles.sectionTitle, { color: C.textMain }]}>Select your location</Text>

        <TouchableOpacity
          onPress={() => setCityModalOpen(true)}
          activeOpacity={0.9}
          style={[styles.selectRow, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}
        >
          <View style={[styles.selectLeftIcon, { borderColor: C.brandBorder }]}>
            <Ionicons name="locate-outline" size={20} color={C.textMuted} />
          </View>
          <View style={styles.selectTextWrap}>
            <Text style={[styles.selectLabel, { color: C.textMuted }]}>City</Text>
            <Text style={[styles.selectValue, { color: C.textMain }]}>{selectedCity || 'Select city'}</Text>
          </View>
          {selectedCity ? (
            <Ionicons name="checkmark-circle" size={20} color={C.brandBlue} style={{ marginRight: 8 }} />
          ) : null}
          <Ionicons name="chevron-down" size={20} color={C.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.9}
          style={[styles.continueBtn, { backgroundColor: canContinue ? C.brandBlue : C.textMuted + '40' }]}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={cityModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: C.surface }]}>
            <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
            <View style={[styles.handle, { backgroundColor: C.brandBorder }]} />
            <View style={styles.modalHeaderRow}>
              <View style={{ width: 34 }} />
              <Text style={[styles.modalTitle, { color: C.textMain }]}>Select City</Text>
              <TouchableOpacity onPress={() => setCityModalOpen(false)} style={[styles.roundIconBtn, { borderColor: C.brandBorder }]}>
                <Ionicons name="close" size={20} color={C.textMain} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: C.textMuted }]}>Select the city you want to see property for</Text>

            <View style={[styles.searchWrap, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
              <Ionicons name="search" size={20} color={C.textMuted} />
              <TextInput
                value={cityQuery}
                onChangeText={setCityQuery}
                placeholder="Search"
                placeholderTextColor={C.textMuted}
                style={[styles.searchInput, { color: C.textMain }]}
              />
            </View>

            <View style={[styles.separator, { backgroundColor: C.brandBorder }]} />

            <TouchableOpacity style={[styles.locationRow, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]} activeOpacity={0.9}>
              <View style={[styles.selectLeftIcon, { borderColor: C.brandBorder }]}>
                <Ionicons name="locate-outline" size={20} color={C.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.locationRowTitle, { color: C.textMain }]}>Select Location</Text>
                <Text style={[styles.locationRowSub, { color: C.textMuted }]}>Use your current location</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={C.textMuted} />
            </TouchableOpacity>

            <Text style={[styles.resultsText, { color: C.textMuted }]}>{filteredCities.length + 1} results</Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedCity('All');
                  setSelectedDistricts([]);
                  setCityModalOpen(false);
                }}
                activeOpacity={0.9}
                style={[styles.optionRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
              >
                <Ionicons name="earth" size={20} color={C.brandBlue} />
                <Text style={[styles.optionLabel, { color: C.textMain }]}>All</Text>
                {selectedCity === 'All' ? (
                  <Ionicons name="checkmark-circle" size={22} color={C.brandBlue} />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color={C.brandBorder} />
                )}
              </TouchableOpacity>

              {filteredCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  onPress={() => openDistrictPicker(city)}
                  activeOpacity={0.9}
                  style={[styles.optionRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
                >
                  <Ionicons name="business" size={20} color={C.brandBlue} />
                  <Text style={[styles.optionLabel, { color: C.textMain }]}>{city}</Text>
                  <Ionicons name="chevron-forward" size={20} color={C.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={districtModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setDistrictModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: C.surface }]}>
            <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
            <View style={[styles.handle, { backgroundColor: C.brandBorder }]} />
            <View style={styles.modalHeaderRow}>
              <TouchableOpacity
                onPress={() => {
                  setDistrictModalOpen(false);
                  setCityModalOpen(true);
                }}
                style={[styles.roundIconBtn, { borderColor: C.brandBorder }]}
              >
                <Ionicons name="chevron-back" size={20} color={C.textMain} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: C.textMain }]}>Select Districts</Text>
              <TouchableOpacity onPress={() => setDistrictModalOpen(false)} style={[styles.roundIconBtn, { borderColor: C.brandBorder }]}>
                <Ionicons name="close" size={20} color={C.textMain} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: C.textMuted }]}>Choose district in {selectedCity}</Text>

            <View style={[styles.searchWrap, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
              <Ionicons name="search" size={20} color={C.textMuted} />
              <TextInput
                value={districtQuery}
                onChangeText={setDistrictQuery}
                placeholder="Search Districts"
                placeholderTextColor={C.textMuted}
                style={[styles.searchInput, { color: C.textMain }]}
              />
            </View>

            <View style={[styles.separator, { backgroundColor: C.brandBorder }]} />

            <TouchableOpacity
              onPress={() => setSelectedDistricts([])}
              activeOpacity={0.9}
              style={[styles.optionRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
            >
              <Ionicons name="business" size={20} color={C.brandBlue} />
              <Text style={[styles.optionLabel, { color: C.textMain }]}>All in ({selectedCity})</Text>
              {selectedDistricts.length === 0 ? (
                <Ionicons name="checkmark-circle" size={22} color={C.brandBlue} />
              ) : (
                <Ionicons name="ellipse-outline" size={22} color={C.brandBorder} />
              )}
            </TouchableOpacity>

            <Text style={[styles.resultsText, { color: C.textMuted }]}>{filteredDistricts.length} results</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredDistricts.map((district) => {
                const selected = selectedDistricts.includes(district);
                return (
                  <TouchableOpacity
                    key={district}
                    onPress={() => toggleDistrict(district)}
                    activeOpacity={0.9}
                    style={[styles.optionRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
                  >
                    <Ionicons name="location" size={20} color={C.brandBlue} />
                    <Text style={[styles.optionLabel, { color: C.textMain }]}>{district}</Text>
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={22} color={C.brandBlue} />
                    ) : (
                      <Ionicons name="ellipse-outline" size={22} color={C.brandBorder} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setDistrictModalOpen(false)}
              activeOpacity={0.9}
              style={[styles.continueBtn, { backgroundColor: C.brandBlue, marginBottom: 20 }]}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { width: '100%', height: '52%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  skipBtn: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 8,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  skipText: { fontSize: 13, fontWeight: '700' },
  heroTextWrap: { paddingHorizontal: 20, paddingBottom: 40 },
  heroTitle: { color: '#fff', fontWeight: '900', fontSize: 24, lineHeight: 30, maxWidth: '90%' },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 16,
    overflow: 'hidden',
    zIndex: 5,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, lineHeight: 24, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  selectRow: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectLeftIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectTextWrap: { flex: 1 },
  selectLabel: { fontSize: 11, lineHeight: 14 },
  selectValue: { fontSize: 14, lineHeight: 18, fontWeight: '600' },
  continueBtn: {
    marginTop: 16,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  roundIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: { fontSize: 14, marginTop: 6, marginBottom: 12 },
  searchWrap: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  separator: { height: 1, marginVertical: 12 },
  locationRow: {
    borderWidth: 1,
    borderRadius: 14,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  locationRowTitle: { fontSize: 16, fontWeight: '600' },
  locationRowSub: { fontSize: 13 },
  resultsText: { fontSize: 13, marginTop: 10, marginBottom: 6 },
  optionRow: {
    height: 56,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  optionLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
});
