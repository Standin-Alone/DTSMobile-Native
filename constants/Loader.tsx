import React from 'react';
import Spinner from 'react-native-spinkit';
import {StyleSheet,  View} from 'react-native';
const loader = (props)=>(<View style={styles.loading}>
<Spinner
  isVisible={props.isVisible}
  size={props.size}
  type={'Wave'}
  color={props.color}
/>
</View>
)

export default {loader};


const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
      },
});