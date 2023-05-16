const imageUpload = document.getElementById('image-upload');
const canvas = document.getElementById('canvas');
const leftText = document.getElementById('left-text');
const rightText = document.getElementById('right-text');
const saveButton = document.getElementById('save-button');
const clearButton = document.getElementById('clear-button');

// Función para obtener la fecha actual en formato yyyy-mm-dd
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Función para guardar los valores predeterminados en el almacenamiento local
function saveDefaultValues() {
  localStorage.setItem('defaultLeftText', leftText.value);
  localStorage.setItem('defaultRightText', rightText.value);
}

// Función para restaurar los valores predeterminados desde el almacenamiento local
function restoreDefaultValues() {
  const defaultLeftText = localStorage.getItem('defaultLeftText');
  const defaultRightText = localStorage.getItem('defaultRightText');
  
  leftText.value = defaultLeftText || getCurrentDate();
  rightText.value = defaultRightText || getCurrentDate();
}


// Función para limpiar los campos de entrada
function clearFields() {
  // Limpiar el campo de entrada de archivo
  imageUpload.value = '';

  // Restaurar los valores predeterminados en el campo de entrada de fecha izquierda
  leftText.value = '';

  // Restaurar los valores predeterminados en el campo de entrada de fecha derecha
  rightText.value = getCurrentDate();
}

// Asociar el evento click del botón "Limpiar" a la función clearFields
clearButton.addEventListener('click', clearFields);

// Restaurar los valores predeterminados al cargar la página
window.addEventListener('load', restoreDefaultValues);

// Guardar los valores predeterminados cuando se modifiquen los campos de entrada
leftText.addEventListener('change', saveDefaultValues);
rightText.addEventListener('change', saveDefaultValues);

imageUpload.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      ctx.font = '15px Arial';
      
      // Texto izquierdo
      ctx.fillStyle = 'red';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`Fecha de recepción: ${leftText.value}`, 10, img.height - 10);
      
      // Texto derecho
      ctx.textAlign = 'right';
      ctx.fillText(`Fecha de carga: ${rightText.value}`, img.width - 10, img.height - 10);
      
      saveButton.disabled = false;
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
}

saveButton.addEventListener('click', saveImage);

function saveImage() {
  const link = document.createElement('a');
  
  // Obtener las fechas actualizadas de los campos de entrada
  const leftDate = leftText.value;
  const rightDate = rightText.value;

  // Establecer las fechas actualizadas en la imagen
  const fechaActualizada = new Date();
  fechaActualizada.setDate(leftDate.slice(-2));
  fechaActualizada.setMonth(leftDate.slice(5, 7) - 1);
  fechaActualizada.setFullYear(leftDate.slice(0, 4));
  
  const fechaFormateada = fechaActualizada.toISOString().slice(0, 10);

  const canvasCopy = document.createElement('canvas');
  canvasCopy.width = canvas.width;
  canvasCopy.height = canvas.height;
  const ctxCopy = canvasCopy.getContext('2d');
  ctxCopy.drawImage(canvas, 0, 0);
  ctxCopy.font = '15px Arial';
  
  ctxCopy.fillStyle = 'red';
  ctxCopy.textBaseline = 'bottom';
  ctxCopy.fillText(`Fecha de recepción: ${leftDate}`, 10, canvas.height - 10);
  
  ctxCopy.textAlign = 'right';
  ctxCopy.fillText(`Fecha de carga: ${rightDate}`, canvas.width - 10, canvas.height - 10);
  
  link.href = canvasCopy.toDataURL('image/png');
  link.download = 'imagen_con_sello.png';
  link.click();
}

