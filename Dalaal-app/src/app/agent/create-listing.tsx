import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';

export const options = { headerShown: false };

export default function CreateListing() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Property');
  const [images, setImages] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleAddImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.8,
      selectionLimit: 5,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map(a => a.uri);
      setImages([...images, ...newUris]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handlePublish = () => {
    if (!title || !price || !location) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    
    if (!agreed) {
      Alert.alert('Agreement Required', 'Please agree to the terms and conditions to publish the listing.');
      return;
    }
    
    setIsPublishing(true);
    // Simulate network request
    setTimeout(() => {
      setIsPublishing(false);
      Alert.alert('Success', 'Listing published successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1500);
  };

  return (
    <View style={[styles.safe, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 44) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="chevron-back" size={16} color={C.textMain} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerTitle, { color: C.textMain }]}>Create Listing</Text>
          <Text style={[styles.headerSubtitle, { color: C.textMuted }]}>Add a new property or vehicle</Text>
        </View>
        <View style={styles.placeholderBtn} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={[styles.section, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
            <Text style={[styles.label, { color: C.textMain }]}>Listing Type</Text>
            <View style={styles.typeRow}>
              {['Property', 'Vehicle', 'Land'].map((t) => (
                <TouchableOpacity
                  key={t}
                  activeOpacity={0.8}
                  onPress={() => setType(t)}
                  style={[
                    styles.typeBtn,
                    { backgroundColor: type === t ? C.brandBlue : C.tableRow, borderColor: type === t ? C.brandBlue : C.brandBorder }
                  ]}
                >
                  <Text style={[styles.typeBtnText, { color: type === t ? '#fff' : C.textMain }]}>{t}</Text>
                </TouchableOpacity>
              ))}
</View>
          </View>

          <View style={[styles.section, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
            <Text style={[styles.label, { color: C.textMain }]}>Media (Photos / Videos)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaScroll}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrap}>
                  <Image source={{ uri }} style={styles.uploadedImage} />
                  <TouchableOpacity onPress={() => handleRemoveImage(index)} style={styles.removeImageBtn}>
                    <Ionicons name="close" size={10} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={handleAddImage} activeOpacity={0.8} style={[styles.addMediaBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                <Ionicons name="camera" size={20} color={C.textMuted} />
                <Text style={[styles.addMediaText, { color: C.textMuted }]}>Add Photo</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={[styles.section, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
            <Text style={[styles.label, { color: C.textMain }]}>Basic Details</Text>
            
            <TextInput
              placeholder="Listing Title (e.g. Modern Villa in Hodan)"
              placeholderTextColor={C.textMuted}
              style={[styles.input, { color: C.textMain, backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput
              placeholder="Price (e.g. $150,000)"
              placeholderTextColor={C.textMuted}
              keyboardType="numeric"
              style={[styles.input, { color: C.textMain, backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
              value={price}
              onChangeText={setPrice}
            />
            
            <TextInput
              placeholder="Location / Neighborhood"
              placeholderTextColor={C.textMuted}
              style={[styles.input, { color: C.textMain, backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
              value={location}
              onChangeText={setLocation}
            />

            <TextInput
              placeholder="Description..."
              placeholderTextColor={C.textMuted}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea, { color: C.textMain, backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={[styles.section, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
            <Text style={[styles.label, { color: C.textMain }]}>Agreement</Text>
            <Text style={[styles.signatureHint, { color: C.textMuted }]}>By checking the box below, I confirm that the information provided is accurate and I agree to the terms and conditions.</Text>
            
            <TouchableOpacity 
              onPress={() => setAgreed(!agreed)} 
              style={[styles.agreementCheck, { backgroundColor: agreed ? C.brandBlue : C.tableRow, borderColor: C.brandBorder }]}
            >
              <Ionicons name={agreed ? 'checkmark' : 'square-outline'} size={20} color={agreed ? '#fff' : C.textMuted} />
              <Text style={[styles.agreementTextCheck, { color: agreed ? '#fff' : C.textMain }]}>I agree to the terms and conditions</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePublish}
            disabled={isPublishing}
            style={[styles.publishBtn, { backgroundColor: C.brandBlue }]}
          >
            {isPublishing ? (
              <Text style={[styles.publishBtnText, { color: '#fff' }]}>Publishing...</Text>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={[styles.publishBtnText, { color: '#fff' }]}>Publish Listing</Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 12, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderBtn: { width: 34, height: 34 },
  headerTextWrap: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900' },
  headerSubtitle: { fontSize: 11, marginTop: 2 },
  content: { paddingHorizontal: 12, paddingTop: 8 },
  section: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '900', marginBottom: 10 },
  typeRow: { flexDirection: 'row', gap: 6 },
  typeBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  typeBtnText: { fontSize: 11, fontWeight: '800' },
  mediaScroll: { gap: 8 },
  addMediaBtn: { width: 80, height: 80, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addMediaText: { fontSize: 9, fontWeight: '700', marginTop: 4 },
  imageWrap: { width: 80, height: 80, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  uploadedImage: { width: '100%', height: '100%' },
  removeImageBtn: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  input: { height: 40, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 10, fontSize: 13, fontWeight: '600' },
  textArea: { height: 80, paddingTop: 10, textAlignVertical: 'top' },
  publishBtn: { height: 46, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  publishBtnText: { fontSize: 14, fontWeight: '900' },
  signatureHint: { fontSize: 11, marginBottom: 10 },
  agreementCheck: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, marginTop: 8 },
  agreementTextCheck: { fontSize: 12, fontWeight: '700', marginLeft: 10 },
});
