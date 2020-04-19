# JWT
Ejercicio sobre JWT
## Detalles
El ejercicio cosnta sobre la creación de usuarios que tienen la siguiente estructura:<br />
```json
    "username" :"david2",
    "password" :"password",
    "rol":"admin" // Los posibles valores contemplados son: "admin", "supervisor" y "trabajador"
```
Para la creación de estos elementos el path es: http://localhost:3000/signin<br />
Para el login de estos elementos el path es: http://localhost:3000/login<br />
          Este último devolverá el token necesario para la autenticación posterior.<br />
Para mostrar la información que cada uno puede ver se hace a través del path: http://localhost:3000<br />
Para editar el rol de un usuario se necesita:<br />
#### 1.    Tener el rol de admin<br />
#### 2.    La siguiente estructura:<br />
 ```json
      "username" :"david2",   // En el que se pone el usuario al que se quiere cambiar el rol
      "rolNuevo":"trabajador" // En el que se pone el usuario nuevo
 ```

#### 3.   Se hace a través del path: http://localhost:3000/edit<br />
## Pruebas Postman<br />
Adicional a la información anterior hay una colección de pruebas de postman llamado "JWT.postman_collection" en el que se muestra los parámetros y datos necesarios para el correcto funcionamiento del sistema. 
