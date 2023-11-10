document.addEventListener('DOMContentLoaded', (event) => {
    let wakeLock = null;
  
    async function requestWakeLock() {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Wake Lock ativo!');
        
        wakeLock.addEventListener('release', () => {
          console.log('Wake Lock foi liberado!');
        });
      } catch (err) {
        console.error(`Falha ao ativar o Wake Lock: ${err.message}`);
      }
    }
  
    if ('wakeLock' in navigator) {
      requestWakeLock();
  
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          requestWakeLock();
        } else if (wakeLock !== null) {
          wakeLock.release();
          wakeLock = null;
        }
      });
    } else {
        console.log('não tem suporte ao WakeLock');
    }
  });


  function iniciarContador(dataFutura) {
    function atualizarContador() {
      const agora = new Date();
      const diferenca = dataFutura - agora;
  
      if (diferenca <= 0) {
        document.getElementById('contador').innerHTML = 'O tempo acabou!';
        clearInterval(intervalo);
        return;
      }
  
      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
  
      document.getElementById('dias').textContent = dias.toString().padStart(2, '0');
      document.getElementById('horas').textContent = horas.toString().padStart(2, '0');
      document.getElementById('minutos').textContent = minutos.toString().padStart(2, '0');
      document.getElementById('segundos').textContent = segundos.toString().padStart(2, '0');
    }
  
    const intervalo = setInterval(atualizarContador, 1000);
    atualizarContador(); // Chama a função imediatamente para evitar atraso inicial de 1 segundo
  }
  
  // Defina a data e hora futuras aqui (ano, mês - 1, dia, hora, minuto, segundo)
  const dataFutura = new Date(2023, 10, 10, 20, 0, 0);
  iniciarContador(dataFutura);