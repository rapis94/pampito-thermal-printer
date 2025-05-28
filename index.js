// escpos-winshare.js
const os = require("os");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { exec } = require("child_process");
const sharp = require("sharp");
const iconv = require("iconv-lite");
const historial = [];

function registrarImpresion(impresora, hostname) {
  const registro = {
    fecha: new Date().toLocaleString(),
    impresora,
    hostname
  };
  historial.push(registro);
  fs.writeFileSync("historial.json", JSON.stringify(historial, null, 2));

  console.log("📝 Registro:", registro);
}

if (fs.existsSync("historial.json")) {
  const guardado = JSON.parse(fs.readFileSync("historial.json"));
  historial.push(...guardado);
}

const configPath = "config.json";

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({ server: "" }, null, 2));
}

const app = express();
const port = 5000;
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.get("/api/config", (req, res) => {
  const config = JSON.parse(fs.readFileSync(configPath));
  res.json(config);
});

app.post("/api/config", (req, res) => {
  const { server, publico } = req.body;
  if (!server && !publico) {
    return res.status(400).json({ success: false, error: "Campo 'server' requerido" });
  }

  fs.writeFileSync(configPath, JSON.stringify({ server, publico }, null, 2));
  res.json({ success: true });
});

async function convertirImagenDesdeBase64(base64Data, max = 256) {
  const matches = base64Data.match(/^data:image\/(png|jpeg);base64,(.+)$/);
  if (!matches) throw new Error("Formato base64 inválido");

  const buffer = Buffer.from(matches[2], "base64");

  const MAX_WIDTH = max;
  const image = sharp(buffer)
    .resize({ width: MAX_WIDTH })
    .grayscale()
    .threshold(128);
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const bytesPerLine = Math.ceil(width / 8);

  const header = Buffer.from([
    0x1D, 0x76, 0x30, 0x00,
    bytesPerLine & 0xff,
    (bytesPerLine >> 8) & 0xff,
    height & 0xff,
    (height >> 8) & 0xff
  ]);

  const imageBytes = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < bytesPerLine; x++) {
      let byte = 0;
      for (let bit = 0; bit < 8; bit++) {
        const pixelX = x * 8 + bit;
        if (pixelX >= width) continue;
        const i = y * width + pixelX;

        const pixel = data[i]; // ya es 1 canal
        const isBlack = pixel === 0;
        if (isBlack) byte |= (1 << (7 - bit));
      }
      imageBytes.push(byte);
    }
  }

  return Buffer.concat([header, Buffer.from(imageBytes)]);
}


async function traducirComandos(comandos) {
  const buffers = [];

  for (const { tipo, valor, max } of comandos) {
    switch (tipo) {
      case "alineacion":
        buffers.push(Buffer.from([0x1B, 0x61, valor]));
        break;

      case "tamano":
        buffers.push(Buffer.from([0x1B, 0x21, valor]));
        break;

      case "texto":
        buffers.push(Buffer.from(iconv.encode(valor + "\n", "CP858")));
        break;

      case "negrita":
        buffers.push(Buffer.from([0x1B, 0x45, valor ? 1 : 0]));
        break;

      case "corte":
        buffers.push(Buffer.from([0x1D, 0x56, 0x00]));
        break;

      case "beep":
        const veces = Math.min(9, Math.max(1, valor.veces || 1));
        const duracion = Math.min(9, Math.max(1, valor.duracion || 1));
        buffers.push(Buffer.from([0x1B, 0x42, veces, duracion]));
        break;
      case "reset":
        buffers.push(Buffer.from([0x1B, 0x40]));
        break;
      case "imagen":
        const imgBuffer = await convertirImagenDesdeBase64(valor, max);
        buffers.push(imgBuffer);
        break;

      default:
        console.warn("⚠️ Comando no reconocido:", tipo);
    }
  }
  buffers.push(Buffer.from([0x1B, 0x40]));
  return Buffer.concat(buffers);
}

// 🖨 POST /api/Primer – Imprime usando copy /B
app.post("/api/Primer", async (req, res) => {
  const { Impresora, Hostname, comandos } = req.body;

  if (!Impresora || !Hostname || !Array.isArray(comandos)) {
    return res.status(400).json({
      success: false,
      error: "Faltan datos requeridos (Impresora, Hostname o comandos inválidos)"
    });
  }

  try {
    const contenido = await traducirComandos(comandos);
    const nombreArchivo = `print_${crypto.randomBytes(6).toString("hex")}.bin`;
    const rutaArchivo = path.join(os.tmpdir(), nombreArchivo);
    const rutaImpresora = `\\\\${Hostname}\\${Impresora}`;

    fs.writeFileSync(rutaArchivo, contenido);

    const comando = `cmd.exe /c copy /B "${rutaArchivo}" "${rutaImpresora}"`;

    exec(comando, (error, stdout, stderr) => {
      fs.unlinkSync(rutaArchivo); // limpiamos
      if (error) {
        console.error("❌ Error al imprimir:", error);
        return res.status(500).json({ success: false, error: stderr || error.message });
      }

      console.log("✅ Impresión enviada a", rutaImpresora);
      res.json({ success: true });
      registrarImpresion(Impresora, Hostname);

    });
  } catch (err) {
    console.error("❌ Error general:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/historial", (req, res) => {
  res.json(historial);
});

app.listen(port, () => {
  console.log(`🖨️ Servidor de impresión escuchando en http://localhost:${port}`);
});
