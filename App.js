import { StatusBar } from 'expo-status-bar';
import React,{ useEffect, useState} from 'react';
import { ScrollView, SafeAreaView, StyleSheet, Text, View , Image} from 'react-native';
import * as Location from "expo-location"

const API = "446cf994797e4762dc7a06ad89c84ffc"

export default function App() {

  const[errorMessage, setErrorMessage] = useState(null)
  const[latitude, setLatitude] = useState()
  const[longitude, setlongitude] = useState()
  const[weatherData, setWeatherData] = useState(null)

  useEffect(() =>{
    loadData()
  }, [])


  const dayConverter = (day) =>{
      var i = new Date(day * 1000)
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = i.getFullYear();
      var month = months[i.getMonth()];
      var date = i.getDate();
      var time = date + ' ' + month + ' ' + year ;
    return time;
  }
  async function loadData(){
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if(status !== "granted"){
        setErrorMessage("Access to location is needed to run this application.")
        return
      }
       
      const location = await Location.getCurrentPositionAsync()
      const {latitude, longitude} = location.coords
      setLatitude(location.coords.latitude)
      setlongitude(location.coords.longitude)
      
      const weatherURL= `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts,minutely,hourly,current&units=metric&appid=${API}`
      const response = await fetch(weatherURL)
      const jsonResult = await response.json()

      if (response.ok){
        setWeatherData(jsonResult)
        
      }else{
        setErrorMessage(jsonResult.message)
      }
    } catch (error) {
      setErrorMessage(error.message)
    }

    
    }
    
    if(weatherData) {
      const{ daily} = weatherData
      let id = 0;
      return (
        <ScrollView>{
        
        daily.map( day => 
        <View style={styles.box} key={id++}>
          
          <Text>{dayConverter(day.dt)}</Text>
          <Text>Temperature: {day.temp.day}C</Text>
          <Text>Feels like: {day.feels_like.day}</Text>
          <Text>Forecast: {day.weather[0].description}</Text>
          <Image source={{uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}} style={{width: 50, height: 50}}  />
          
        </View>
       
        )}
        </ScrollView>
      )} else{
        return (
          <View style={styles.container}>
            <Text>{errorMessage}</Text>
            <StatusBar style="auto" />
          </View>
        )}
        }
        
       
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    margin : 2,
    borderStyle :"solid",
    borderWidth: 1
  }
});
