import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {TEXT_SECONDARY, TEXT_TERTIARY} from '../colors';

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  multiline,
  style,
  onContentSizeChange,
}) {
  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: 'white',
          color: 'black',
        },
        style,
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || ''}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={TEXT_SECONDARY}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      onContentSizeChange={onContentSizeChange}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: TEXT_TERTIARY,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
});
