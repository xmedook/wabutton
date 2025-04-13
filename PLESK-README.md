# Configuración Rápida de Node.js en Plesk

## Pasos Clave

1. **Cambiar el archivo de inicio**: Usar `plesk-start.js` en lugar de `server.js` (importante para evitar el error "stop Exit on target PM2 exit")
2. **Configurar variables de entorno**:
   - `MONGODB_URI`: mongodb+srv://koodemx:MZWy6cQ9F0Ev1f75@cluster0.2xngxy9.mongodb.net/wabutton?retryWrites=true&w=majority&appName=Cluster0
   - `JWT_SECRET`: ea2f760487e8b0c9708553117a8eff9bb2ccb39c245d0daebd6193aaa2b70973
   - `NODE_ENV`: production
   - `PORT`: 3000
3. **Habilitar Node.js** en Plesk

## Verificación

1. Verificar el entorno de Plesk: `npm run test-plesk`
2. Verificar acceso web: `npm run test-web`
3. Verificar estado: `http://wabutton.nexodigital.ai/health`

## Monitoreo

1. Iniciar monitoreo: `npm run monitor:pm2`
2. Ver logs: `pm2 logs wabutton-monitor`

## Reinicio Manual

Si necesitas reiniciar la aplicación: `./plesk-restart.sh`

---

Para instrucciones detalladas, consulta [PLESK-SETUP.md](PLESK-SETUP.md)
