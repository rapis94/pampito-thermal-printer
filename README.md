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
