# Apps folder

Cada ZIP en la raíz debe extraerse dentro de `apps/` y consolidarse en una app Next.js. Ejemplos:

- rdm-digital-nodo-cero-main.zip -> apps/rdm-hub/
- real-del-monte-digital-main.zip -> apps/public-portal/

Instrucciones rápidas:
1. unzip <archivo>.zip -d apps/<nombre>
2. actualizar package.json y añadir script `dev` / `build`
3. ajustar imports si es necesario
4. ejecutar `pnpm install` en la raíz
