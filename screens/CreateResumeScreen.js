import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  Linking,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import {BASE_API_URL} from '../utils';
import {AppContext} from '../store/app-context';
import {COLOR_PRIMARY, COLOR_TERTIARY, TEXT_PRIMARY} from '../colors';

export default function CreateResumeScreen() {
  const {token} = useContext(AppContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [links, setLinks] = useState([]);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [about, setAbout] = useState('');
  const scrollViewRef = useRef();

  // Skills subscreen
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState('');

  // Project subscreen
  const [projects, setProjects] = useState([]);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescriptionLines, setProjectDescriptionLines] = useState([]);
  const [projectFrom, setProjectFrom] = useState('');
  const [projectTo, setProjectTo] = useState('');
  const [projectDescriptionLine, setProjectDescriptionLine] = useState('');

  // Experience subscreen
  const [experience, setExperience] = useState([]);
  const [position, setPosition] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [experienceLocation, setExperienceLocation] = useState('');
  const [experienceFrom, setExperienceFrom] = useState('');
  const [experienceTo, setExperienceTo] = useState('');
  const [isExperienceModalVisible, setIsExperienceModalVisible] =
    useState(false);
  const [experienceDescriptionLines, setExperienceDescriptionLines] = useState(
    [],
  );
  const [experienceDescriptionLine, setExperienceDescriptionLine] =
    useState('');

  // Education subscreen
  const [education, setEducation] = useState([]);
  const [degree, setDegree] = useState('');
  const [university, setUniversity] = useState('');
  const [educationLocation, setEducationLocation] = useState('');
  const [educationFrom, setEducationFrom] = useState('');
  const [educationTo, setEducationTo] = useState('');
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);

  // Confirm subscree
  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const subScreens = [
    {title: 'general'},
    {title: 'about'},
    {title: 'skills'},
    {title: 'projects'},
    {title: 'experience'},
    {title: 'education'},
    {title: 'confirm'},
  ];

  const screenWidth = Dimensions.get('window').width;

  const scrollToIndex = index => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  const validateProject = () => {
    if (!projectName.trim()) {
      Alert.alert('Missing Field', 'Project Name cannot be empty');
      return false;
    }
    if (!projectFrom.trim()) {
      Alert.alert('Missing Field', 'Enter Start Date');
      return false;
    }
    if (!projectTo.trim()) {
      Alert.alert('Missing Field', 'Enter End Date');
      return false;
    }
    if (projectDescriptionLines.length === 0) {
      Alert.alert(
        'Missing Field',
        'At least add one line to Project description',
      );
      return false;
    }
    return true;
  };

  const validateExperience = () => {
    if (!position.trim()) {
      Alert.alert('Missing Field', 'Position cannot be empty');
      return false;
    }
    if (!companyName.trim()) {
      Alert.alert('Missing Field', 'Company Name cannot be empty');
      return false;
    }
    if (!experienceLocation.trim()) {
      Alert.alert('Missing Field', 'Location cannot be empty');
      return false;
    }
    if (!experienceFrom.trim()) {
      Alert.alert('Missing Field', 'Enter Start Date');
      return false;
    }
    if (!experienceTo.trim()) {
      Alert.alert('Missing Field', 'Enter End Date');
      return false;
    }
    if (experienceDescriptionLines.length === 0) {
      Alert.alert(
        'Missing Field',
        'At least add one line to Experience description',
      );
      return false;
    }
    return true;
  };

  const validateEducation = () => {
    if (!degree.trim()) {
      Alert.alert('Missing Field', 'Degree cannot be empty');
      return false;
    }
    if (!university.trim()) {
      Alert.alert('Missing Field', 'University Name cannot be empty');
      return false;
    }
    if (!educationLocation.trim()) {
      Alert.alert('Missing Field', 'Location cannot be empty');
      return false;
    }
    if (!educationFrom.trim()) {
      Alert.alert('Missing Field', 'Enter Start Date');
      return false;
    }
    if (!educationTo.trim()) {
      Alert.alert('Missing Field', 'Enter End Date');
      return false;
    }
    return true;
  };

  const addLink = (title, url) => {
    if (linkTitle.trim() && linkUrl.trim()) {
      setLinks(prevLinks => [...prevLinks, {title, link: url}]);
      setLinkTitle('');
      setLinkUrl('');
    }
  };

  // Add project function
  const addProject = () => {
    if (validateProject()) {
      setProjects(prevProjects => [
        ...prevProjects,
        {
          projectName: projectName.trim(),
          projectDescription: [...projectDescriptionLines],
          from: projectFrom.trim(),
          to: projectTo.trim(),
        },
      ]);
      setProjectName('');
      setProjectDescriptionLines([]);
      setProjectFrom('');
      setProjectTo('');
      setIsProjectModalVisible(false);
    }
  };

  // Add experience function
  const addExperience = () => {
    if (validateExperience()) {
      setExperience(prevExperience => [
        ...prevExperience,
        {
          position: position.trim(),
          companyName: companyName.trim(),
          location: experienceLocation.trim(),
          from: experienceFrom.trim(),
          to: experienceTo.trim(),
          description: [...experienceDescriptionLines],
        },
      ]);

      setPosition('');
      setCompanyName('');
      setExperienceLocation('');
      setExperienceFrom('');
      setExperienceTo('');
      setExperienceDescriptionLines([]);
      setIsExperienceModalVisible(false);
    }
  };

  const addEducation = () => {
    if (validateEducation()) {
      setEducation(prevEducation => [
        ...prevEducation,
        {
          degree: degree,
          university: university,
          location: educationLocation,
          from: educationFrom,
          to: educationTo,
        },
      ]);

      setDegree('');
      setUniversity('');
      setEducationLocation('');
      setEducationFrom('');
      setEducationTo('');
      setIsEducationModalVisible(false);
    }
  };

  const valdiateResume = () => {
    if (!name.trim()) {
      Alert.alert('Resume Generating Failed', 'Name cannot be empty');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Resume Generating Failed', 'Email cannot be empty');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Resume Generation Failed', 'Address cannot be empty');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Resume Generation Failed', 'Phone cannot be empty');
      return false;
    }
    return true;
  };

  const generateResume = async () => {
    if (valdiateResume()) {
      const resume = {
        name: name.trim(),
        address: address.trim(),
        email: email.trim(),
        phone: phone.trim(),
        links: links,
        about: about.trim(),
        skills: skills,
        projects: projects,
        experience: experience,
        education: education,
      };

      try {
        setLoading(true);
        const response = await axios.post(BASE_API_URL + '/resume', resume, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Linking.openURL(response.data.url);
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          error?.response?.data?.message || 'Error generating resume',
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth,
          );
          setCurrentIndex(newIndex);
        }}>
        {/* General Sub-Screen */}
        <View style={[styles.subScreenContainer, {width: screenWidth}]}>
          <ScrollView contentContainerStyle={styles.subScreenContent}>
            <Text style={styles.screenTitle}>General Information</Text>
            <CustomInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <CustomInput
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
            <CustomInput
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <CustomInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            {links.length > 0 && (
              <View style={styles.linksList}>
                <Text>Links</Text>
                {links.map((link, index) => (
                  <View key={index} style={styles.linkItem}>
                    <Text style={styles.linkText}>{link.title}</Text>
                    <Text style={styles.linkText}>{link.link}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setLinks(prevLinks => {
                          const newLinks = [...prevLinks];
                          newLinks.splice(index, 1);
                          return newLinks;
                        });
                      }}>
                      <Ionicons name="trash" size={20} color={'red'} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.linkContainer}>
              <CustomInput
                placeholder="Link Title"
                style={{flex: 1, marginRight: 10}}
                value={linkTitle}
                onChangeText={setLinkTitle}
              />
              <CustomInput
                placeholder="Link URL"
                style={{flex: 1, marginLeft: 10}}
                value={linkUrl}
                onChangeText={setLinkUrl}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  addLink(linkTitle, linkUrl);
                }}>
                <Ionicons name="add-circle" size={30} color={COLOR_PRIMARY} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* About Sub-Screen */}
        <View style={[styles.subScreenContainer, {width: screenWidth}]}>
          <Text style={styles.screenTitle}>About</Text>
          <CustomInput
            placeholder="Enter about yourself 100-150 words"
            value={about}
            onChangeText={setAbout}
            style={[styles.input, {minHeight: 150, maxHeight: 150}]}
            multiline={true}
          />
        </View>

        {/* Skills Sub-Screen */}
        <View style={[styles.subScreenContainer, {width: screenWidth}]}>
          <Text style={styles.screenTitle}>Skills</Text>
          <ScrollView contentContainerStyle={styles.subScreenContent}>
            {skills.length > 0 && (
              <View style={styles.skillsList}>
                {skills.map((skill, index) => (
                  <View key={index} style={styles.skillItem}>
                    <Text style={styles.skillText}>{skill}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSkills(prevSkills => {
                          const newSkills = [...prevSkills];
                          newSkills.splice(index, 1);
                          return newSkills;
                        });
                      }}>
                      <Ionicons name="trash" size={20} color={'red'} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.skillInputContainer}>
              <CustomInput
                placeholder="Enter Skill Name"
                value={skillName}
                onChangeText={setSkillName}
                style={{flex: 1, marginRight: 10}}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (skillName.trim()) {
                    setSkills(prevSkills => [...prevSkills, skillName.trim()]);
                    setSkillName('');
                  }
                }}>
                <Ionicons name="add-circle" size={30} color={COLOR_PRIMARY} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Projects Sub-Screen */}
        <View style={[styles.subScreenContainer, {width: screenWidth}]}>
          <Text style={styles.screenTitle}>Projects</Text>
          <ScrollView contentContainerStyle={{flex: 1}}>
            {projects &&
              projects.length > 0 &&
              projects.map((project, index) => (
                <View style={styles.projectCard} key={index}>
                  <View>
                    <Text>{project.projectName}</Text>
                    <Text>
                      {project.from} - {project.to}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setProjects(prevProjects => {
                        const newProjects = [...prevProjects];
                        newProjects.splice(index, 1);
                        return newProjects;
                      })
                    }>
                    <Ionicons name="trash" color={'red'} size={20} />
                  </TouchableOpacity>
                </View>
              ))}
            <CustomButton
              style={{backgroundColor: COLOR_PRIMARY}}
              onPress={() => setIsProjectModalVisible(true)}
              title={'Add Project'}
            />
          </ScrollView>
        </View>

        {/* Experience Sub-Screen */}
        <View style={[styles.subScreenContainer, {width: screenWidth}]}>
          <Text style={styles.screenTitle}>Experience</Text>
          <ScrollView contentContainerStyle={{flex: 1}}>
            {experience &&
              experience.length > 0 &&
              experience.map((exp, index) => (
                <View style={styles.projectCard} key={index}>
                  <View>
                    <Text>{exp.position}</Text>
                    <Text>{exp.companyName}</Text>
                    <Text>
                      {exp.from} - {exp.to}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setExperience(prevExperience => {
                        const newExperience = [...prevExperience];
                        newExperience.splice(index, 1);
                        return newExperience;
                      })
                    }>
                    <Ionicons name="trash" color={'red'} size={20} />
                  </TouchableOpacity>
                </View>
              ))}
            <CustomButton
              style={{backgroundColor: COLOR_PRIMARY}}
              onPress={() => setIsExperienceModalVisible(true)}
              title={'Add Experience'}
            />
          </ScrollView>
        </View>

        {/* Education Sub-Screen */}
        <View style={[styles.subScreenContainer, {width: screenWidth}]}>
          <Text style={styles.screenTitle}>Education</Text>
          <ScrollView contentContainerStyle={{flex: 1}}>
            {education &&
              education.length > 0 &&
              education.map((edu, index) => (
                <View style={styles.projectCard} key={index}>
                  <View>
                    <Text>{edu.degree}</Text>
                    <Text>{edu.university}</Text>
                    <Text>
                      {edu.from} - {edu.to}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setEducation(prevEducation => {
                        const newEducation = [...prevEducation];
                        newEducation.splice(index, 1);
                        return newEducation;
                      })
                    }>
                    <Ionicons name="trash" color={'red'} size={20} />
                  </TouchableOpacity>
                </View>
              ))}
            <CustomButton
              style={{backgroundColor: COLOR_PRIMARY}}
              onPress={() => setIsEducationModalVisible(true)}
              title="Add Education "
            />
          </ScrollView>
        </View>

        {/* Confim subscreen */}
        <View
          style={[
            styles.subScreenContainer,
            {
              width: screenWidth,
              justifyContent: 'center',
            },
          ]}>
          <CustomButton
            title={loading ? 'Generating Resume...' : 'Generate Resume'}
            onPress={generateResume}
            icon={'sparkles'}
            disabled={loading}
            style={{marginHorizontal: 30}}
          />
        </View>
      </ScrollView>

      {/* Floating Left Button */}
      {currentIndex > 0 && (
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => scrollToIndex(currentIndex - 1)}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Floating Right Button */}
      {currentIndex < subScreens.length - 1 && (
        <TouchableOpacity
          style={styles.rightButton}
          onPress={() => scrollToIndex(currentIndex + 1)}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal for Adding Projects */}
      <Modal
        visible={isProjectModalVisible}
        animationType="slide"
        transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsProjectModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  keyboardShouldPersistTaps="handled">
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 20,
                    }}>
                    <TouchableOpacity
                      style={{position: 'absolute', zIndex: 1}}
                      onPress={() => {
                        setIsProjectModalVisible(false);
                      }}>
                      <Ionicons name="arrow-back-circle" size={30} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, {flex: 1}]}>
                      Add Project
                    </Text>
                  </View>
                  <CustomInput
                    placeholder="Project Name"
                    value={projectName}
                    onChangeText={setProjectName}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="Start Date (MM/YYYY)"
                    value={projectFrom}
                    onChangeText={setProjectFrom}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="End Date (MM/YYYY)"
                    value={projectTo}
                    onChangeText={setProjectTo}
                    style={styles.input}
                  />
                  <View style={styles.descriptionContainer}>
                    <CustomInput
                      placeholder="Add a description line"
                      value={projectDescriptionLine}
                      onChangeText={setProjectDescriptionLine}
                      style={{flex: 1, marginRight: 10}}
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        if (projectDescriptionLine.trim()) {
                          setProjectDescriptionLines(prevLines => [
                            ...prevLines,
                            projectDescriptionLine.trim(),
                          ]);
                          setProjectDescriptionLine('');
                        }
                      }}>
                      <Ionicons
                        name="add-circle"
                        size={30}
                        color={COLOR_PRIMARY}
                      />
                    </TouchableOpacity>
                  </View>
                  {projectDescriptionLines.length > 0 && (
                    <View style={styles.descriptionLinesList}>
                      {projectDescriptionLines.map((line, index) => (
                        <View key={index} style={styles.descriptionLineItem}>
                          <Text style={styles.descriptionLineText}>{line}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              setProjectDescriptionLines(prevLines => {
                                const newLines = [...prevLines];
                                newLines.splice(index, 1);
                                return newLines;
                              });
                            }}>
                            <Ionicons name="trash" size={20} color={'red'} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                  <CustomButton
                    style={{backgroundColor: COLOR_PRIMARY, marginBottom: 10}}
                    onPress={addProject}
                    title={'Add Project'}
                  />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal for Adding Experience */}
      <Modal
        visible={isExperienceModalVisible}
        animationType="slide"
        transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsExperienceModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  keyboardShouldPersistTaps="handled">
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 20,
                    }}>
                    <TouchableOpacity
                      style={{position: 'absolute', zIndex: 1}}
                      onPress={() => {
                        setIsExperienceModalVisible(false);
                      }}>
                      <Ionicons name="arrow-back-circle" size={30} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, {flex: 1}]}>
                      Add Experience
                    </Text>
                  </View>
                  <CustomInput
                    placeholder="Enter Position"
                    value={position}
                    onChangeText={setPosition}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="Company Name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="Location"
                    value={experienceLocation}
                    onChangeText={setExperienceLocation}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="Start Date (MM/YYYY)"
                    value={experienceFrom}
                    onChangeText={setExperienceFrom}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="End Date (MM/YYYY)"
                    value={experienceTo}
                    onChangeText={setExperienceTo}
                    style={styles.input}
                  />

                  <View style={styles.descriptionContainer}>
                    <CustomInput
                      placeholder="Add a description line"
                      value={experienceDescriptionLine}
                      onChangeText={setExperienceDescriptionLine}
                      style={{flex: 1, marginRight: 10}}
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        if (experienceDescriptionLine.trim()) {
                          setExperienceDescriptionLines(prevLines => [
                            ...prevLines,
                            experienceDescriptionLine.trim(),
                          ]);
                          setExperienceDescriptionLine('');
                        }
                      }}>
                      <Ionicons
                        name="add-circle"
                        size={30}
                        color={COLOR_PRIMARY}
                      />
                    </TouchableOpacity>
                  </View>
                  {experienceDescriptionLines.length > 0 && (
                    <View style={styles.descriptionLinesList}>
                      {experienceDescriptionLines.map((line, index) => (
                        <View key={index} style={styles.descriptionLineItem}>
                          <Text style={styles.descriptionLineText}>{line}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              setExperienceDescriptionLines(prevLines => {
                                const newLines = [...prevLines];
                                newLines.splice(index, 1);
                                return newLines;
                              });
                            }}>
                            <Ionicons name="trash" size={20} color={'red'} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                  <CustomButton
                    style={{backgroundColor: COLOR_PRIMARY, marginBottom: 10}}
                    onPress={addExperience}
                    title={'Add Experience'}
                  />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal for Adding Education */}
      <Modal
        visible={isEducationModalVisible}
        animationType="slide"
        transparent={true}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsEducationModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  keyboardShouldPersistTaps="handled">
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 20,
                    }}>
                    <TouchableOpacity
                      style={{position: 'absolute', zIndex: 1}}
                      onPress={() => {
                        setIsEducationModalVisible(false);
                      }}>
                      <Ionicons name="arrow-back-circle" size={30} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, {flex: 1}]}>
                      Add Education
                    </Text>
                  </View>
                  <CustomInput
                    placeholder="Enter Degree"
                    value={degree}
                    onChangeText={setDegree}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="University Name"
                    value={university}
                    onChangeText={setUniversity}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="Location"
                    value={educationLocation}
                    onChangeText={setEducationLocation}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="Start Date (MM/YYYY)"
                    value={educationFrom}
                    onChangeText={setEducationFrom}
                    style={styles.input}
                  />
                  <CustomInput
                    placeholder="End Date (MM/YYYY)"
                    value={educationTo}
                    onChangeText={setEducationTo}
                    style={styles.input}
                  />

                  <CustomButton
                    style={{backgroundColor: COLOR_PRIMARY, marginBottom: 10}}
                    onPress={addEducation}
                    title={'Add Education'}
                  />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subScreenContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subScreenContent: {
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: TEXT_PRIMARY,
  },
  input: {
    marginBottom: 15,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    marginLeft: 10,
  },
  linksList: {
    marginBottom: 20,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  linkText: {
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  leftButton: {
    position: 'absolute',
    left: 10,
    bottom: 20,
    backgroundColor: COLOR_PRIMARY,
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  rightButton: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    backgroundColor: COLOR_PRIMARY,
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  skillsList: {
    marginBottom: 20,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  skillText: {
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  skillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addProjectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: TEXT_PRIMARY,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  descriptionLinesList: {
    marginBottom: 20,
  },
  descriptionLineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  descriptionLineText: {
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  cancelButton: {
    backgroundColor: COLOR_TERTIARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
