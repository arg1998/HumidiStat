import React from 'react';
import { View, Text, StyleSheet, Linking, Dimensions } from 'react-native';
import Dialog, {
  DialogContent,
  SlideAnimation
} from 'react-native-popup-dialog';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width: WIDTH } = Dimensions.get('window');
const URL = 'https://dribbble.com/shots/6315218-IoT-Humidity-App-Slider';
const GITHUB = 'https://github.com/arg1998/HumidiStat';
const TELEGRAM = 'https://t.me/ARG_1998';

const openURL = url => {
  Linking.openURL(url);
};

const InfoDialog = props => {
  const { visible, onClose } = props;
  return (
    <Dialog
      visible={visible}
      width={0.8}
      // height={0.6}
      animationDuration={400}
      dialogAnimation={new SlideAnimation({ slideFrom: 'right' })}
      overlayBackgroundColor={'#000'}
      overlayOpacity={0.5}
      onTouchOutside={onClose}
      rounded={false}
      dialogStyle={{
        borderRadius: WIDTH * 0.05,
        padding: 0,
        borderColor: '#1d7ade',
        borderWidth: 2,
        backgroundColor: '#38006e'
      }}
    >
      <DialogContent style={styles.container}>
        <Text style={styles.text}>
          This is the implementation of{' '}
          <Text style={{ color: '#cc0' }}>HumidiStat</Text> design by{' '}
          <Text onPress={() => openURL(URL)} style={styles.url}>
            @ElijahBozniak
          </Text>{' '}
          using React Native and ReAnimated API
        </Text>
        <View style={styles.followMe}>
          <Text style={styles.contact}>Contact Me</Text>
          <View style={styles.media}>
            <Icon onPress={() => openURL(GITHUB)} name={'github'} size={32} />
            <Icon
              onPress={() => openURL(TELEGRAM)}
              name={'telegram'}
              size={32}
              color={'#0fa0ff'}
            />
          </View>
        </View>
      </DialogContent>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: 20,
    width: '100%',
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 14,
    fontFamily: 'Avenir Roman',
    color: '#fff'
  },
  url: {
    color: '#80c5f2',
    textDecorationLine: 'underline'
  },
  followMe: {
    width: '100%',
    padding: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contact: {
    fontFamily: 'GothamMedium',
    fontSize: 16,
    color: '#eee'
  },
  media: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  }
});

export default InfoDialog;
