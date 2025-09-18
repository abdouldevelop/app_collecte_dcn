import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  runOnJS,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
  BounceIn,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors, Rs, SIZES } from '@/shared/utils';
import QRScannerCompo from '@/features/scanner';
import GloringBtn from '@/components/form/GloringBtn';
import { action } from '@nozbe/watermelondb/decorators';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const SCANNER_SIZE = 200;

export default function Page() {
  const [activeTab, setActiveTab] = useState('scan');
  const [formData, setFormData] = useState('');
  const [isShowingScanner, setIsShowingScanner] = useState(false);

  // Shared values for animations
  const tabTransition = useSharedValue(0);
  const scanLinePosition = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const cardFloat = useSharedValue(0);
  const cornerPulse = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);
  const backgroundParticles = useSharedValue(0);

  // Initialize animations on mount
  useEffect(() => {
    // Continuous scan line animation
    scanLinePosition.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Floating card animation
    cardFloat.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Corner pulse animation
    cornerPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Shimmer animation
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );

    // Background particles animation
    backgroundParticles.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  // Handle tab change with spring animation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    tabTransition.value = withSpring(tab === 'scan' ? 0 : 1, {
      damping: 20,
      stiffness: 150,
      mass: 1,
    });
  };

  // Handle button press animations
  const handleSwitchScanner = (isShow: boolean) => {
    setIsShowingScanner(isShow);
  };

  const handleQRScan = () => {
    Alert.alert(
      "QR Scanner",
      "Opening camera for QR code scanning...\n\nIn a real app, you would use expo-camera or expo-barcode-scanner here.",
      [{ text: "OK" }]
    );
  };

  const handleFormSubmit = () => {
    if (formData.trim()) {
      Alert.alert("Success", `Data submitted successfully:\n\n${formData}`);
      setFormData('');
    } else {
      Alert.alert("Error", "Please enter some data before submitting");
    }
  };

  // Animated styles
  const animatedScanLine = useAnimatedStyle(() => {
    const translateY = interpolate(
      scanLinePosition.value,
      [0, 1],
      [0, SCANNER_SIZE - 60]
    );
    
    return {
      transform: [{ translateY }],
      opacity: interpolate(scanLinePosition.value, [0, 0.5, 1], [0.8, 1, 0.8]),
    };
  });

  const animatedCardFloat = useAnimatedStyle(() => {
    const translateY = interpolate(cardFloat.value, [0, 1], [0, -8]);
    const rotateZ = interpolate(cardFloat.value, [0, 1], [0, 1]);
    
    return {
      transform: [
        { translateY },
        { rotateZ: `${rotateZ}deg` }
      ],
    };
  });

  const animatedCornerPulse = useAnimatedStyle(() => {
    const scale = interpolate(cornerPulse.value, [0, 1], [1, 1.1]);
    const opacity = interpolate(cornerPulse.value, [0, 1], [1, 0.7]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const animatedButtonScale = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedTabTransition = useAnimatedStyle(() => {
    const translateX = interpolate(
      tabTransition.value,
      [0, 1],
      [0, -width]
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  const animatedTabIndicator = useAnimatedStyle(() => {
    const translateX = interpolate(
      tabTransition.value,
      [0, 1],
      [0, width / 2 - 10]
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  const animatedShimmer = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerPosition.value,
      [-1, 1],
      [-200, width + 200]
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  const animatedBackgroundParticle1 = useAnimatedStyle(() => {
    const translateY = interpolate(backgroundParticles.value, [0, 1], [0, -20]);
    const translateX = interpolate(backgroundParticles.value, [0, 1], [0, 10]);
    
    return {
      transform: [{ translateY }, { translateX }],
      opacity: interpolate(backgroundParticles.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
    };
  });

  const animatedBackgroundParticle2 = useAnimatedStyle(() => {
    const translateY = interpolate(backgroundParticles.value, [0, 1], [0, 15]);
    const translateX = interpolate(backgroundParticles.value, [0, 1], [0, -8]);
    
    return {
      transform: [{ translateY }, { translateX }],
      opacity: interpolate(backgroundParticles.value, [0, 0.5, 1], [0.2, 0.5, 0.2]),
    };
  });

  if(isShowingScanner){
    return <QRScannerCompo handleClose={() => handleSwitchScanner(false)} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Background particles */}
      <Animated.View style={[styles.particle1, animatedBackgroundParticle1]} />
      <Animated.View style={[styles.particle2, animatedBackgroundParticle2]} />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Shimmer effect */}
        <Animated.View style={[styles.shimmer, animatedShimmer]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        
        <Animated.Text 
          entering={FadeIn.delay(300).springify()}
          style={styles.headerTitle}
        >
          Versement
        </Animated.Text>
        <Animated.Text 
          entering={FadeIn.delay(500).springify()}
          style={styles.headerSubtitle}
        >
          Scannez le QR code du client
        </Animated.Text>
      </LinearGradient>

      {/* Tab Switcher */}
      {/* <Animated.View 
        style={styles.tabContainer}
      >
        <BlurView intensity={20} style={styles.tabBlur}>
          <Animated.View style={[styles.tabIndicator, animatedTabIndicator]} />
          
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('scan')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="qr-code" 
              size={24} 
              color={activeTab === 'scan' ? '#6366f1' : '#9ca3af'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'scan' && styles.activeTabText
            ]}>
              QR Scanner
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('form')}
            activeOpacity={0.7}
          >
            <MaterialIcons 
              name="edit" 
              size={24} 
              color={activeTab === 'form' ? '#6366f1' : '#9ca3af'} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === 'form' && styles.activeTabText
            ]}>
              Manual Entry
            </Text>
          </TouchableOpacity>
        </BlurView>
      </Animated.View> */}

      {/* Content Area */}
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.slideContainer]}>
          {/* QR Scanner Tab */}
          <View style={styles.tabContent}>
            <Animated.View 
              style={[styles.scannerCard,]}
              // entering={BounceIn.delay(900)}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.cardGradient}
              >
                <View style={styles.scannerFrame}>
                  {/* Animated corner indicators */}
                  <Animated.View style={[styles.cornerTopLeft, animatedCornerPulse]} />
                  <Animated.View style={[styles.cornerTopRight, animatedCornerPulse]} />
                  <Animated.View style={[styles.cornerBottomLeft, animatedCornerPulse]} />
                  <Animated.View style={[styles.cornerBottomRight, animatedCornerPulse]} />
                  
                  {/* Animated scanning line */}
                  <Animated.View style={[styles.scanLine, animatedScanLine]}>
                    <LinearGradient
                      colors={['transparent', '#6366f1', 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.scanLineGradient}
                    />
                  </Animated.View>
                  
                  <MaterialCommunityIcons 
                    name="qrcode-scan" 
                    size={80} 
                    color="#e5e7eb" 
                  />
                </View>
              </LinearGradient>
            </Animated.View>
            
            <Animated.Text 
              entering={FadeIn.delay(110)}
              style={styles.instructionText}
            >
              Appuiez puis placez le code QR dans le cadre pour le scanner
            </Animated.Text>
            
            <GloringBtn
            label="Scannez QR Code"
            TStyle={{ fontSize: SIZES.mx }}
            icon={<Ionicons name="camera" size={24} color="white" />}
            action={() => handleSwitchScanner(true)}
            />
          </View>

          {/* Form Tab */}
          <View style={styles.tabContent}>
            <Animated.View 
              style={[styles.formCard, animatedCardFloat]}
              entering={BounceIn.delay(900)}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={styles.cardGradient}
              >
                <View style={styles.inputContainer}>
                  <MaterialIcons name="text-fields" size={24} color="#6366f1" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your data here..."
                    placeholderTextColor="#9ca3af"
                    value={formData}
                    onChangeText={setFormData}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </LinearGradient>
            </Animated.View>
            
            <Animated.Text 
              entering={FadeIn.delay(1100)}
              style={styles.instructionText}
            >
              Manually enter the data if QR scanning is not available
            </Animated.Text>
            
            <Animated.View 
              style={[styles.buttonContainer, animatedButtonScale]}
              entering={SlideInRight.delay(1300).springify()}
            >
              <TouchableOpacity 
                onPress={() => handleButtonPress(handleFormSubmit)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.secondaryButton}
                >
                  <MaterialIcons name="check" size={24} color="white" />
                  <Text style={styles.buttonText}>Submit Data</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View 
        entering={FadeIn.delay(1500)}
        style={styles.footer}
      >
        <Text style={styles.footerText}>Traitement sécurisé des données</Text>
        <Ionicons name="shield-checkmark" size={16} color="#10b981" />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 200,
  },
  headerTitle: {
    fontSize: SIZES.xl + 3,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  tabContainer: {
    marginVertical: Rs(20),
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    boxShadow: colors.boxShadow.sm,
    
  },
  tabBlur: {
    flexDirection: 'row',
    padding: 5,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    left: 5,
    width: width / 2 - 15,
    backgroundColor: '#f0f0ff',
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    zIndex: 1,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
    marginTop: Rs(50),
    // backgroundColor: "red",
    // paddingTop: Rs(5)
  },
  slideContainer: {
    flexDirection: 'row',
    width: width * 2,
     paddingTop: Rs(15)
  },
  tabContent: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scannerCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  formCard: {
    width: '100%',
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  scannerFrame: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#6366f1',
    borderTopLeftRadius: 5,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#6366f1',
    borderTopRightRadius: 5,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#6366f1',
    borderBottomLeftRadius: 5,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#6366f1',
    borderBottomRightRadius: 5,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    zIndex: 1,
  },
  scanLineGradient: {
    flex: 1,
    borderRadius: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#374151',
    minHeight: 100,
  },
  instructionText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 25,
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
    marginRight: 8,
  },
  particle1: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e7ff',
  },
  particle2: {
    position: 'absolute',
    top: height * 0.7,
    right: width * 0.15,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd6fe',
  },
});