<a href="#pampito-esp">Español</a>

<h2>What is Pampito Thermal Printer?</h2>
Pampito Thermal Printer is a REST API that allows you to connect your systems to Windows shared thermal printers. Built with Node.js and Electron, it provides a simple application that handles sending print commands to the designated printer.
<br>
<h4>Key Requirements:</h4>
The printer must be shared, available, and have write permissions on the machine where the service is running.
<br>
The API is designed to handle POST requests to http://localhost:5000. Each request must include a JSON object with the following structure:

<h4>JSON Structure:</h4>
<pre>
{
  "impresora": "SharedPrinterName",
  "Hostname": "ComputerNameOrIP",
  "comandos": [
    {
      "tipo": "CommandType",
      "valor": "CommandValue",
      "max": "OptionalMaxWidthForImages"
    }
  ]
}
</pre>
<h4>JSON Fields:</h4>
<ul>
    <li>impresora: The shared name of the target printer.</li>
    <li>Hostname: The IP address or hostname of the computer where the printer is connected.</li>
    <li>comandos: An array of command objects. Each object must include:
    <ul>
        <li>
            tipo: A string indicating the type of command. Accepted values are: "alineacion", "tamano", "texto", "negrita", "corte", "beep", "reset", or "imagen".
        </li>
        <li>valor: The value associated with the command. For example, if the type is "alineacion", the value should be 0, 1, or 2 for left, center, or right alignment, respectively.</li>
        <li>max: (Optional) Only used with the "imagen" command to specify the maximum width of the image.</li>
    </ul>
    </li>
    
</ul>

<h3>Try it out — it's easier and more useful than you think!</h3>





<h2 id="pampito-esp">¿Qué es Pampito Thermal Printer?</h2>
Pampito Thermal Printer es una API REST que permite conectar tus sistemas con impresoras térmicas compartidas en Windows. Desarrollada con Node.js y Electron, proporciona una aplicación sencilla que se encarga de enviar los comandos de impresión a la impresora designada.
<br>
<h4>Requisitos clave:</h4>
La impresora debe estar compartida, disponible y tener permisos de escritura en la máquina donde se ejecuta el servicio.
<br>
La API está diseñada para manejar solicitudes POST a http://localhost:5000. Cada solicitud debe incluir un objeto JSON con la siguiente estructura:

<h4>Estructura JSON:</h4>
<pre>
{
  "impresora": "NombreCompartidoDeLaImpresora",
  "Hostname": "NombreDelEquipoOIP",
  "comandos": [
    {
      "tipo": "TipoDeComando",
      "valor": "ValorDelComando",
      "max": "AnchoMáximoOpcionalParaImágenes"
    }
  ]
}
</pre>
<h4>Campos JSON:</h4>
<ul>
    <li>impresora: El nombre compartido de la impresora de destino.</li>
    <li>Hostname: La dirección IP o el nombre del equipo donde la impresora está conectada.</li>
    <li>comandos: Un array de objetos de comando. Cada objeto debe incluir:
    <ul>
        <li>
            tipo: Una cadena que indica el tipo de comando. Los valores aceptados son: "alineacion", "tamano", "texto", "negrita", "corte", "beep", "reset" o "imagen".
        </li>
        <li>valor: El valor asociado al comando. Por ejemplo, si el tipo es "alineacion", el valor debe ser 0, 1 o 2 para alinear a la izquierda, al centro o a la derecha, respectivamente.</li>
        <li>max: (Opcional) Solo se utiliza con el comando "imagen" para especificar el ancho máximo de la imagen.</li>
    </ul>
    </li>
</ul>

<h3>¡Probalo, es más fácil y útil de lo que parece!</h3>

