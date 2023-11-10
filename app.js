const axios = require('axios');
const express = require('express');
const QRCode = require('qrcode');

const port = 3000;
const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/:uuid', async (req, res) => {
  const uuid = req.params.uuid ? req.params.uuid : '';

  const user = await fetchUserData(uuid);

  const descName = user.descName;
  const descDepartment = user.descDepartment;
  try {
    const options = {
      scale: 15,
      color: {
        dark: '#722B87',  // Cor dos blocos do QR Code
        light: '#0000'    // Cor de fundo transparente
      }
    };

    const qrCodeUrl = await QRCode.toDataURL(uuid, options);
    res.render('index', { uuid, descName , descDepartment, qrCodeUrl});
  } catch (error) {
    console.error(error)
  }
});

app.get('/', (req, res) => {

  res.render('scanner');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

async function requestToken() {;
  const data = {
    email: "admin@gmail.com",
    password: "admin123"
  };

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios.post('https://confraappapi.onrender.com/root/confra/auth/v1/authenticate', data, config);
    return response.data.access_token;
  } catch (error) {
    Console.error('Erro ao obter Token:', error);
  }
}

async function fetchUserData(idUser) {
  const url = 'https://confraappapi.onrender.com/root/confra/api/v1/user/'+idUser;
  const token = await requestToken();

  try {
      const response = await axios.get(url, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      return response.data;
  } catch (error) {
      console.error("Erro na requisição:", error);
  }
}