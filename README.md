¿Qué es Pampito Thermal Printer?

Pampito Thermal Printer es una APIRest que nos permite conectar nuestros sistemas con impresoras compartidas de Windows. Creado en NodeJS con la colaboración de Electron, nos permite tener una aplicación sencilla que se encargue de entregar la información la impresora deisgnada.

Para comenzar, debe tomarse a consideración los siguientes puntos:<br>
<ul>
    <li>
La impresora debe estar compartida, disponible y con permisos de escritura en el equipo donde se ejecuta el servicio.
    </li>
    <li>
        La API está prepara para recibir una solicitud POST a la ruta "http://localhost:5000", un objeto JSON con los datos "impresora" con el nombre compartido de la impresora, "Hostname" con la IP o Nombre del equipo al que está conectada y "comandos" que es un array de objetos que debe contener a su vez tres propiedades cada uno:
        <ul>
            <li>"tipo": es un string que debe tener uno de los valores aceptados "alinieacion", "tamano", "texto", "negrita", "corte", "beep", "reset" o "imagen".</li>
            <li>"valor": con el valor que le asignaremos a ese comando (ejemplo, si enviamos "alineacion", deberiamos enviar 0, 1 o 2 para alinear a la izquierda, centro o derecha respectivamente.</li>
            <li>"max": solo aplicable al comando "imagen" para indicar el ancho de la misma.</li>
        </ul>
    </li>
    
</ul>



Probalo, es mas fácil y útil de lo que parece.
