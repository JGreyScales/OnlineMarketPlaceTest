import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';
import SessionStorage from 'react-native-session-storage';
import { GlobalStyles, colors } from '../functions/globalStyleSheet';
import { CommonActions } from '@react-navigation/native';
import navigateNewPage from '../functions/NavigateNewScreen';
import { CustomButton } from '../functions/CustomButton';


const MAX_BIO_LENGTH = 250;
const MAX_USERNAME_LENGTH = 20;
const MAX_INTERESTS = 5;

export default function UserHomePage({navigation}) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [userBioInput, setUserBioInput] = useState('');
  const [userPhotoInput, setUserPhotoInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState([]);
  const [interestSuggestions, setInterestSuggestions] = useState([]);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const sessionToken = await SessionStorage.getItem('@sessionKey');

        const response = await fetch('http://localhost:3000/user/home', {
          method: 'GET',
          headers: {
            Authorization: sessionToken,
          },
        });

        const interestResponse = await fetch('http://localhost:3000/user/interestList', {
            method: 'GET',
            headers: {
                Authorization: sessionToken
            }
          })

        if (response.ok) {
            const data = await response.json();

            if (interestResponse.ok) {
                const interestData = await interestResponse.json();

                const tagStringsReponse = await fetch('http://localhost:3000/interest/tags', {method: 'POST', headers: {Authorization: sessionToken, 'Content-Type': 'application/json'}, body: JSON.stringify({tags: interestData.data})})
                const tagStrings = await tagStringsReponse.json()
                data.userInterests = tagStrings;
            }
          
            setContent(data);
            setError(null);
        } else {
          setError('Failed to fetch user home content');
          setContent(null);
        }
      } catch (error) {
        setError('Fetch error: ' + error.message);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // When opening modal, preload inputs with current content values
  const openModal = () => {
    setUserNameInput(content?.userName || '');
    setUserBioInput(content?.userBio || '');
    setUserPhotoInput(content?.userPhoto ? content.userPhoto : '');
    setInterests(content?.userInterests || []); // assuming interests array exists
    setInterestInput('');
    setInterestSuggestions([]);
    setModalVisible(true);
  };

  // Fetch interest suggestions from API when interestInput changes
  useEffect(() => {
    if (interestInput.length === 0) {
      setInterestSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setFetchingSuggestions(true);
      try {
        const sessionToken = await SessionStorage.getItem('@sessionKey');
        
        const response = await fetch(`http://localhost:3000/interest/AC/${interestInput}`, {
          headers: {
            Authorization: sessionToken,
          },
        });
        if (response.ok) {
            const interestList = [];
            const suggestions = await response.json();
                suggestions.data.forEach(element => {
                    if (!interests.includes(element.tag)) {
                        interestList.push(element.tag)
                    }
                });
          setInterestSuggestions(interestList);
        } else {
          setInterestSuggestions([]);
        }
      } catch {
        setInterestSuggestions([]);
      } finally {
        setFetchingSuggestions(false);
      }
    };

    // Debounce fetch with a timeout
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [interestInput, interests]);

  const addInterest = (interest) => {
    // interest = interest.tag
    if (interests.length >= MAX_INTERESTS) return;
    if (interests.includes(interest)) return;
    setInterests((prev) => [...prev, interest]);
    setInterestInput('');
    setInterestSuggestions([]);
  };

  const removeInterest = (interest) => {
    setInterests((prev) => prev.filter((i) => i !== interest));
  };

  const onSave = async () => {
    setModalVisible(false);
    setContent((prev) => ({
      ...prev,
      userName: userNameInput.trim(),
      userBio: userBioInput.trim(),
      userInterests: interests
    }));

    try {

        const sessionToken = await SessionStorage.getItem('@sessionKey');
        const requestBody = {
            userName: userNameInput.trim(),
            userBio: userBioInput.trim(),
          };

        if (interests.length > 0){
          requestBody.interests = interests
        }
        
        const response = await fetch('http://localhost:3000/user/', {method: 'PATCH', headers: {'Authorization': sessionToken, 'Content-Type': 'application/json'}, body: JSON.stringify(requestBody)});
    } catch (err) {

    }
    setInterests(interests)
  };


  const onSignout = () => {
    sessionStorage.removeItem('@sessionKey')
    // clear route history & set the current display to the initialRoute
    navigation.dispatch(
      CommonActions.reset({
        inedx: 0,
        routes: [{name: 'login'}]
      })
    )
  }

  const onContextSwitch = (newPage) => {navigateNewPage(newPage, navigation)}

  if (loading) {
    return (
      <View style={GlobalStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={GlobalStyles.center}>
        <Text style={GlobalStyles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!content) {
    return (
      <View style={GlobalStyles.center}>
        <Text>No user data available.</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={GlobalStyles.container}>
        {/* Profile Section */}
        <View style={GlobalStyles.profileContainer}>
          <Image
            style={GlobalStyles.profileImage}
            source={{ uri: content.userPhoto ? content.userPhoto : '' }}
            resizeMode="cover"
          />
          <Text style={GlobalStyles.userName}>{content.userName}</Text>
          <Text style={GlobalStyles.userBio}>{content.userBio}</Text>
        </View>

        {/* Button Section */}
        <View style={GlobalStyles.buttonContainer}>
          <CustomButton text="Update Profile" onPress={openModal} />
          <CustomButton text="Browse Products" onPress={() => onContextSwitch('products')} />
          <CustomButton text="Seller Portal" onPress={() => onContextSwitch('sellerPOVHomepage')} />
          <CustomButton text="Add Funds" onPress={() => onContextSwitch('fundsControl')} />
          <CustomButton text="View Transactions" onPress={() => onContextSwitch('transaction')} />
          <CustomButton text="Sign out" onPress={onSignout} />
        </View>
      </ScrollView>

      {/* Update Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={GlobalStyles.modalWrapper}
        >
          <View style={GlobalStyles.modalContainer}>
            <Text style={GlobalStyles.modalTitle}>Update Profile</Text>

            {/* User Name */}
            <Text style={GlobalStyles.inputLabel}>Username</Text>
            <TextInput
              style={GlobalStyles.input}
              placeholder="Username"
              value={userNameInput}
              onChangeText={(text) =>
                text.length <= MAX_USERNAME_LENGTH && setUserNameInput(text)
              }
              maxLength={MAX_USERNAME_LENGTH}
            />
            <Text style={GlobalStyles.charCount}>
              {userNameInput.length} / {MAX_USERNAME_LENGTH}
            </Text>

            {/* User Bio */}
            <Text style={GlobalStyles.inputLabel}>User Bio</Text>
            <TextInput
              style={[GlobalStyles.input, GlobalStyles.multilineInput]}
              placeholder="User Bio"
              value={userBioInput}
              onChangeText={(text) =>
                text.length <= MAX_BIO_LENGTH && setUserBioInput(text)
              }
              multiline={true}
              maxLength={MAX_BIO_LENGTH}
            />
            <Text style={GlobalStyles.charCount}>
              {userBioInput.length} / {MAX_BIO_LENGTH}
            </Text>

            {/* Interests input */}
            <Text style={GlobalStyles.inputLabel}>Interests (max {MAX_INTERESTS})</Text>
            <TextInput
              style={GlobalStyles.input}
              placeholder="Type to get suggestions"
              value={interestInput}
              onChangeText={setInterestInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {fetchingSuggestions && <Text>Loading suggestions...</Text>}
            {interestSuggestions.length > 0 && (
              <FlatList
                data={interestSuggestions}
                keyExtractor={(item) => item}
                style={GlobalStyles.suggestionList}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity style={GlobalStyles.suggestionItem} onPress={() => addInterest(item)}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* Selected interests */}
            <View>
              {interests.map((interest) => (
                <View key={interest} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{interest}</Text>
                  <TouchableOpacity onPress={() => removeInterest(interest)}>
                    <Text style={GlobalStyles.removeInterest}> ×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Save and Cancel buttons */}
              <TouchableOpacity
                style={[GlobalStyles.button, GlobalStyles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={GlobalStyles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[GlobalStyles.button, GlobalStyles.modalButtonSave]}
                onPress={onSave}
              >
                <Text style={GlobalStyles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}