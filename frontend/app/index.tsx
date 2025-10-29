import SplashScreen from "@/src/screens/splash";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {

    const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  if (IsLoading) {
    return <SplashScreen />;
  }

  return <Redirect href="/auth/login" />;

}

