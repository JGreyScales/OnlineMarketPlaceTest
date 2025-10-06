// globalStyles.js

import { Platform, StyleSheet } from 'react-native';

// Color Palette
export const colors = {
  primary: '#6200EE',       // Primary blue for buttons
  secondary: '#03DAC6',     // Secondary teal for accents
  background: '#F4F4F4',    // Light grey background
  text: '#212121',          // Dark grey text
  error: '#B00020',         // Red for errors
  border: '#E0E0E0',        // Light grey for borders
  modalBackground: 'rgba(0,0,0,0.6)', // Dark semi-transparent background for modals
  buttonText: '#FFFFFF',    // White text for buttons
};

export const GlobalStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },

  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  signUpButton: {
    backgroundColor: '#34C759',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Container and center alignment styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Profile Section
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  userBio: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  interestsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 10,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  interestText: {
    color: '#fff',
    fontSize: 14,
  },

  // Button Section
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Add shadow for Android
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.modalBackground,
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    maxHeight: '90%',
    width: '85%',
    alignSelf: 'center',
    elevation: 5, // Add shadow for depth
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.primary,
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: 5,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top', // For better multiline text alignment
  },
  charCount: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'right',
  },

  // Interests suggestions
  suggestionList: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  removeInterest: {
    color: '#B00020',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },

  // Modal buttons
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButtonCancel: {
    backgroundColor: '#e0e0e0',
  },
  modalButtonSave: {
    backgroundColor: colors.primary,
  },
  modalButtonTextCancel: {
    color: '#000',
  },

  // Custom button hover and focus states (web-focused)
  buttonHover: {
    backgroundColor: colors.secondary,
  },
  inputFocus: {
    borderColor: colors.primary,
    backgroundColor: '#e0f7fa',
  },

  // General Text Styles
  text: {
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },

    // Transaction Log (Full-width row per transaction)
    transactionLogItem: {
      width: '100%',
      backgroundColor: '#fff',
      padding: 16,
      marginVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 1,
    },
    transactionTextGroup: {
      flex: 3,
    },
    transactionSeller: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    transactionProduct: {
      fontSize: 14,
      color: '#555',
    },
    transactionDate: {
      fontSize: 12,
      color: '#999',
    },
    transactionPrice: {
      flex: 1,
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'right',
      color: colors.primary,
    },
  
    // Product Grid (Flex layout)
    productGridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    productCard: {
      width: '48%',
      backgroundColor: '#fff',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      marginBottom: 12,
      elevation: 2,
    },
    productImage: {
      width: '100%',
      height: 120,
      borderRadius: 8,
      marginBottom: 8,
      resizeMode: 'cover',
    },
    productTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
    },
  
    // Product Detail Page
    productDetailContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    productDetailImageContainer: {
      flex: 1,
      marginRight: 20,
    },
    productDetailImage: {
      width: '100%',
      height: 300,
      borderRadius: 12,
      resizeMode: 'contain',
      backgroundColor: '#fff',
    },
    productDetailInfo: {
      flex: 1,
    },
    productDetailTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 10,
    },
    productDetailPrice: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 10,
    },
    productDetailSeller: {
      fontSize: 16,
      color: '#555',
      marginBottom: 8,
    },
    productDetailRating: {
      fontSize: 14,
      color: '#FFA000', // Amber for star rating
      marginBottom: 12,
    },
    productDetailDescription: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 22,
    },


      // Store Page Styles
  storePageContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  storeHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  storeImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  storeName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  storeRating: {
    fontSize: 16,
    color: '#FFA000', // Amber
    marginBottom: 10,
    textAlign: 'center',
  },
  storeBio: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Store Items Section
  storeItemsSection: {
    flex: 1,
  },
  storeItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  storeItemCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  storeItemImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  storeItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  storeItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },

  
});
