import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CustomButton({
  children,
  onPress,
  style,
  title,
  icon,
  disabled,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      disabled={disabled}>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={'#fff'}
          style={{marginRight: 10}}
        />
      )}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#bc02fa',
    flexDirection: 'row',
  },
  title: {
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
