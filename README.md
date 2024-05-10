# TareApp-TFG

- Pasos para ejecutar:
    - 1) Ejecutar "npm install"
    - 2) Abrir XAMPP:
        - Activar Apache y MySQL y darle a "Admin" de MySQL
        - Ir a phpMyAdmin y copiar import.sql
    - 3) Ejecutar "node app.js"
    - 4) Abrir el navegador e ir a "localhost:3000"
    - 5) En caso de tener que reiniciar:
        - En el navegador pulsar F12 (o click derecho + Inspeccionar)
        - En el apartado de Aplicación:
            - En el serviceworker darle a Unregister
            - En datos de cache desplegar y click derecho + delete a static-v1

## CONVENIOS CÓDIGO

- En HTML, los IDs comienzan siempre por el tipo de elemento (div, button, img...) → <elem>-... 
- Idioma 
    - Tablas y atributos BBDD: [EN] 
    - Variables y funciones JS: [EN] 
    - IDs y clases HTML: [EN] 
    - Texto de la página web: [ES] 
    - Rutas GET y POST: [ES] 
    - Comentarios: [ES] 
- Notación 
    - Ficheros de cliente: snake_case 
    - Ficheros de servidor: UpperCamelCase (excepto app, utils, errorHandler y connection) 
    - Variables y funciones JS: lowerCamelCase 
    - IDs y clases HTML: kebab-case 
- Al definir el estilo de un selector en CSS el orden de los atributos es: 
    1. Display – display, flex-direction, align-items... 
    2. Margin & Padding 
    3. Size – width, height, font-size... 
    4. Border – border, border-radius... 
    5. Color – background-color, color... 
    6. Otros 
- En HTML, al indicar las clases que tiene un elemento, primero se ponen las clases propias creadas 
por nosotros, luego se sigue el orden del punto anterior 
- Orden de las etiquetas HTML: 
1.  id 
2. Otros 
    - input: name – type – hidden - placeholder – value – min – max 
    - img: src – alt – width – height 
    - a: href 
3.  class 
4. Variables data 
