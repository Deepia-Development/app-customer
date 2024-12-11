import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.customer.app',
  appName: 'app-customer',
  webDir: 'dist/app-customer',
};

export default config;

//Remove-Item -Path "android" -Recurse -Force

//# Construir el proyecto web
// ng build

// # Agregar Android de nuevo
// npx cap add android

// # Sincronizar los cambios
// npx cap sync android

// # Copiar los archivos web
// npx cap copy android

// # Abrir en Android Studio
// npx cap open android
