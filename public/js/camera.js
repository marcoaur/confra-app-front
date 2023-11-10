document.addEventListener('DOMContentLoaded', async () => {

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  let lastScannedTime = 0;
  const scanInterval = 200; // 200 ms entre as análises
  const e = document.getElementById("meuCard");
  const es = document.getElementsByClassName("content-card");
  const button = document.getElementById("Liberar");

  function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(function (stream) {
        video.srcObject = stream;
        requestAnimationFrame(scanQRCode);
      })
      .catch(function (error) {
        console.error("Erro ao acessar a câmera do dispositivo", error);
      });
  }

  function scanQRCode() {
    const now = Date.now();
    if (video.readyState === video.HAVE_ENOUGH_DATA && (now - lastScannedTime > scanInterval)) {
      lastScannedTime = now;
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        turnCardVisible();
      }
    }
    requestAnimationFrame(scanQRCode);
  }

  startVideo();

  function turnCardVisible() {
    e.classList.replace("card-rodape", "card-centro");

    for (let index = 0; index < es.length; index++) {
      const element = es[index];
      element.classList.replace("oculto", "visivel");
    }
  }

  function turnCardInvisible() {
    e.classList.replace("card-centro", "card-rodape");

    for (let index = 0; index < es.length; index++) {
      const e1 = es[index];
      e1.classList.replace("visivel", "oculto");
    }
  }

  button.addEventListener("click", turnCardInvisible);

});