import SplashScreen from "@/src/screens/splash";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";

export default function Index() {
    const [IsLoading, setIsLoading] = useState(true);


  useEffect(() => {
  StatusBar.setHidden(true);
  },[]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); 

    return () => clearTimeout(timer); 
  }, []);

  if (IsLoading) {
    return <SplashScreen />;
  }

  return <Redirect href="/auth/login" />;

}

