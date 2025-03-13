import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
//import MapView from 'react-native-maps';
import { useState } from 'react';
import { collection, addDoc, GeoPoint } from 'firebase/firestore';
import db from './firebase';
import { useCollection} from 'react-firebase-hooks/firestore';
import MapView, { Marker } from 'react-native-maps';


export default function App() {
  //Nu bruges useState ikke, da den kun gemmer lokalt, og vi nu gemmer i firebase.
  const [markerLocation, setMarkerLocation] = useState(null)
  const [values, loading, error] = useCollection(collection(db, 'markers'))
  //looper igennem documenterne en af gangen.
  const data = values?.docs.map((doc) => ({...doc.data(), id:doc.id}))

  const region={
    latitude: 55.7,
    longitude: 12.6,
    latitudeDelta:0.3,
    longitudeDelta:0.3
  }

  async function handleLongPress (event) {
    console.log("pressed long ")
    const { coordinate } = event.nativeEvent
    // sætter en lokal marker med usestate. Gemt i vores computer.
    //setMarkerLocation(coordinate)

    try {
      await addDoc(collection(db, 'markers'), {
        location: new GeoPoint(coordinate.latitude, coordinate.longitude)
      })
    } catch (error) {
      console.log("error uploading marker", error)
      
    }
  }

  return (
    <View style={styles.container}>

      <MapView 
      initialRegion={region}
      onLongPress={handleLongPress}
      style={{flex:1, width: '100%', heigh: '100%' }}
      >
        { data && data.map((marker) => (          
          <Marker 
            key={marker.id}
            coordinate={{latitude: marker.location.latitude,
              longitude: marker.location.longitude
            }}
            title='Smukt sted'
            description='Billig færge'
          />))

        }
        
      </MapView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
