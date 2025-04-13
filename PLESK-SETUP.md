# Configuración de Node.js en Plesk

Este documento explica cómo configurar correctamente tu aplicación Node.js para que se ejecute automáticamente en Plesk.

## Problema

Cuando se habilita Node.js en Plesk, la aplicación no se inicia automáticamente con la configuración predeterminada.

## Solución

Hemos creado un archivo de inicio personalizado (`plesk-start.js`) que garantiza que la aplicación se inicie correctamente con PM2 para una gestión adecuada de procesos.

## Pasos para configurar Plesk

1. Accede al panel de control de Plesk.

2. Ve a la sección de dominios y selecciona tu dominio (`wabutton.nexodigital.ai`).

3. Haz clic en "Node.js" en el menú lateral.

4. Configura los siguientes parámetros:
   - **Node.js Version**: 20.18.3 (o la versión que prefieras)
   - **Package Manager**: npm
   - **Document Root**: /wabutton.nexodigital.ai
   - **Application Mode**: production
   - **Application URL**: http://wabutton.nexodigital.ai
   - **Application Root**: /wabutton.nexodigital.ai
   - **Application Startup File**: plesk-start.js (¡IMPORTANTE! Cambia de server.js a plesk-start.js)

5. En la sección "Custom environment variables", agrega las siguientes variables:
   - `MONGODB_URI`: mongodb+srv://koodemx:MZWy6cQ9F0Ev1f75@cluster0.2xngxy9.mongodb.net/wabutton?retryWrites=true&w=majority&appName=Cluster0
   - `JWT_SECRET`: ea2f760487e8b0c9708553117a8eff9bb2ccb39c245d0daebd6193aaa2b70973
   - `NODE_ENV`: production
   - `PORT`: 3000

6. Haz clic en "Enable Node.js" o "Apply" para guardar la configuración.

## Cómo funciona

El archivo `plesk-start.js` realiza las siguientes acciones:

1. Detecta la configuración de Plesk y ajusta las variables de entorno según sea necesario.
2. Verifica si PM2 está instalado y lo instala si es necesario.
3. Inicia la aplicación utilizando PM2 con el archivo `ecosystem.config.js` en modo daemon (en segundo plano).
4. Si PM2 falla por alguna razón, tiene un mecanismo de respaldo para iniciar la aplicación directamente con Node.js.
5. Registra todo el proceso en un archivo de registro (`plesk-startup.log`) para facilitar la depuración.

> **Nota importante**: PM2 se ejecuta en modo daemon (en segundo plano), lo que permite que Plesk gestione correctamente el proceso. Esto evita el error "stop Exit on target PM2 exit" que puede ocurrir cuando PM2 se ejecuta en modo no-daemon.

## Solución de problemas

Si la aplicación no se inicia correctamente después de seguir estos pasos:

1. Verifica los registros en el archivo `plesk-startup.log` en el directorio raíz de la aplicación.
2. Asegúrate de que todas las dependencias estén instaladas correctamente ejecutando `npm install` en el directorio de la aplicación.
3. Verifica que las variables de entorno estén configuradas correctamente en Plesk.
4. Asegúrate de que el usuario de Plesk tenga permisos para ejecutar PM2 y Node.js.
5. Utiliza el endpoint de salud para verificar el estado de la aplicación: `http://wabutton.nexodigital.ai/health`

### Endpoint de salud

La aplicación incluye un endpoint de salud que puede ser utilizado para verificar el estado de la aplicación:

```
GET /health
```

Este endpoint devuelve información sobre el estado de la aplicación en formato JSON:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2023-04-09T23:15:00.000Z",
  "mongodb": "connected",
  "plesk": {
    "port": "3000",
    "documentRoot": "/wabutton.nexodigital.ai"
  }
}
```

Puedes utilizar este endpoint para verificar:
- Si la aplicación está en ejecución
- Si la conexión a MongoDB está establecida
- Si la configuración de Plesk está correctamente detectada

## Notas adicionales

- El archivo `plesk-start.js` está diseñado para ser robusto y manejar diferentes escenarios, incluyendo la instalación automática de PM2 si no está disponible.
- La aplicación se iniciará con PM2 para una mejor gestión de procesos, reinicio automático y registro.
- Si PM2 falla por alguna razón, la aplicación se iniciará directamente con Node.js como respaldo.

## Scripts adicionales

### Script de reinicio

Se ha incluido un script de reinicio (`plesk-restart.sh`) que puede ser utilizado para reiniciar la aplicación manualmente si es necesario:

1. Conéctate al servidor a través de SSH o FTP.
2. Navega al directorio de la aplicación: `/wabutton.nexodigital.ai`
3. Ejecuta el script de reinicio:
   ```bash
   ./plesk-restart.sh
   ```

Este script detectará automáticamente si PM2 está instalado (global o localmente) y reiniciará la aplicación utilizando PM2. Si PM2 no está disponible, reiniciará la aplicación directamente con Node.js.

### Scripts de prueba y monitoreo

Se han incluido varios scripts para verificar y monitorear la configuración de Plesk:

1. **Prueba del entorno de Plesk** (`test-plesk-env.js`):
   ```bash
   npm run test-plesk
   ```
   Este script simula el entorno de Plesk para probar que la aplicación funciona correctamente con las variables de entorno de Plesk antes de habilitar Node.js en Plesk.

2. **Prueba de acceso web** (`test-plesk-web.js`):
   ```bash
   npm run test-web
   ```
   o
   ```bash
   node test-plesk-web.js http://wabutton.nexodigital.ai
   ```
   Este script verifica que la aplicación es accesible desde la web haciendo una solicitud HTTP a la URL de la aplicación. Es útil para confirmar que la configuración de Plesk está funcionando correctamente y que la aplicación es accesible desde Internet.

3. **Monitoreo continuo** (`monitor.js`):
   ```bash
   npm run monitor
   ```
   o
   ```bash
   node monitor.js http://wabutton.nexodigital.ai 5
   ```
   Este script monitorea periódicamente la salud de la aplicación haciendo solicitudes al endpoint de salud. Registra cualquier problema en un archivo de registro (`monitor.log`) y en la consola. El segundo parámetro es el intervalo de verificación en minutos (por defecto es 5 minutos).

   Para ejecutar el script de monitoreo como un proceso en segundo plano con PM2:
   ```bash
   npm run logs:dir  # Crea el directorio de logs si no existe
   npm run monitor:pm2
   ```
   
   O manualmente:
   ```bash
   mkdir -p logs
   pm2 start ecosystem-monitor.config.js
   ```

   Para configurar el script de monitoreo como una tarea cron que se ejecute cada hora:
   ```bash
   crontab -e
   ```
   Luego agrega la siguiente línea:
   ```
   0 * * * * cd /wabutton.nexodigital.ai && /usr/bin/node monitor.js http://wabutton.nexodigital.ai 60 >> /var/log/wabutton-monitor.log 2>&1
   ```
