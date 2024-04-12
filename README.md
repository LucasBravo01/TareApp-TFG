# TareApp-TFG

- Pasos para ejecutar:
    - 1) Ejecutar "npm install"
    - 2) Abrir XAMPP:
        - Activar Apache y MySQL
        - Ir a phpMyAdmin y copiar import.sql
    - 3) Ejecutar "node app.js"
    - 4) Abrir el navegador e ir a "localhost:3000"
    - 5) En caso de tener que reiniciar:
        - En el navegador pulsar F12 (o click derecho + Inspeccionar)
        - En el apartado de Aplicación:
            - En el serviceworker darle a Unregister
            - En datos de cache desplegar y click derecho + delete a static-v1
