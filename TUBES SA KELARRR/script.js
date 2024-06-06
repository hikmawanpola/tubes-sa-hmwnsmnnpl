// Array untuk menyimpan perangkat jaringan dan ukuran file
let networkDevices = [];
let fileSizes = [];

// Variabel untuk menyimpan algoritma yang dipilih
let algorithm = '';

// Event listener untuk menunggu konten HTML dimuat sepenuhnya sebelum menjalankan fungsi
document.addEventListener('DOMContentLoaded', (event) => {
  // Event listeners ditambahkan setelah algoritma dipilih dan elemen-elemen dimunculkan
});

// Fungsi untuk mengambil algoritma yang dipilih dan menginisialisasi simulasi
function login() {
  const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
  initializeSimulation(selectedAlgorithm);
}

// Fungsi untuk menginisialisasi simulasi dengan algoritma yang dipilih
function initializeSimulation(selectedAlgorithm) {
  algorithm = selectedAlgorithm;
  document.getElementById('login').classList.add('hidden');
  document.getElementById('configureNetwork').classList.remove('hidden');
}

// Fungsi untuk menambahkan perangkat jaringan ke dalam array
function addNetworkDevice() {
  const deviceName = document.getElementById('deviceName').value;
  const bandwidth = parseFloat(document.getElementById('bandwidth').value);
  
  if (deviceName && !isNaN(bandwidth)) {
    networkDevices.push({ name: deviceName, bandwidth: bandwidth });
    displayNetworkDevices();

    document.getElementById('deviceName').value = '';
    document.getElementById('bandwidth').value = '';
  } else {
    alert('Please enter valid device name and bandwidth.');
  }

  if (networkDevices.length > 0) {
    document.getElementById('continueBtn').classList.remove('hidden');
  }
}

// Fungsi untuk menampilkan daftar perangkat jaringan
function displayNetworkDevices() {
  let devicesOutput = '<h3>Network Devices:</h3>';
  devicesOutput += '<ul>';
  for (let i = 0; i < networkDevices.length; i++) {
    devicesOutput += `<li>${networkDevices[i].name} - ${networkDevices[i].bandwidth} Mbps</li>`;
  }
  devicesOutput += '</ul>';
  document.getElementById('networkDevicesOutput').innerHTML = devicesOutput;
}

// Fungsi untuk lanjut ke simulasi setelah konfigurasi jaringan selesai
function continueToSimulation() {
  document.getElementById('configureNetwork').classList.add('hidden');
  document.getElementById('simulation').classList.remove('hidden');
}

// Fungsi untuk menambahkan ukuran file ke dalam array
function addFileSize() {
  const fileSize = parseFloat(document.getElementById('fileSize').value);

  if (!isNaN(fileSize)) {
    fileSizes.push(fileSize);
    displayFileSizes();

    document.getElementById('fileSize').value = '';
  } else {
    alert('Please enter a valid file size.');
  }

  if (fileSizes.length > 0) {
    if (algorithm === 'bruteforce') {
      document.getElementById('runBruteForceSimulationBtn').classList.remove('hidden');
    } else if (algorithm === 'divideAndConquer') {
      document.getElementById('runMergeSortSimulationBtn').classList.remove('hidden');
    }
  }
}

// Fungsi untuk menjalankan simulasi
function runSimulation() {
  // Jika tidak ada perangkat jaringan, beri pesan dan hentikan fungsi
  if (networkDevices.length === 0) {
    alert('Please add at least one network device.');
    return;
  }

  // Menampilkan pesan bahwa simulasi sedang berjalan
  document.getElementById('resultOutput').innerHTML = '<h2>Simulation Running...</h2>';

  if (algorithm === 'bruteforce') {
    rungenerateBruteForceTable();
   // runBruteForceSimulation();
  } else if (algorithm === 'divideAndConquer') {
    runMergeSortSimulation();
  }
}

// Fungsi untuk menjalankan simulasi brute force
function runBruteForceSimulation() {
  let resultOutput = '';

  fileSizes.forEach(size => {
     const bruteForceResult = findMinTransferSpeedBruteForce(size);
      resultOutput += `Brute Force Exhaustive Search for file size ${size} MB:<br>
      Minimum Transfer Speed: ${bruteForceResult.device} - ${bruteForceResult.transferSpeed.toFixed(2)} seconds<br>
      Sorted Devices by Data Input: <ul>`;
      networkDevices.forEach(device => {
        resultOutput += `<li>${device.name} - ${calculateTransferSpeed(device.bandwidth, size).toFixed(2)} seconds</li>`;
      });
      resultOutput += '</ul><br>';
  });
  


  document.getElementById('resultOutput').innerHTML = `<h2>Simulation Results</h2><div>${resultOutput}</div>`;
  document.getElementById('simulation').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
}

function rungenerateBruteForceTable() {
  // Generate tabel brute force exhaustive search
  generateBruteForceTable();
}

// Fungsi untuk menjalankan simulasi merge sort
function runMergeSortSimulation() {
  let resultOutput = '';

  fileSizes.forEach(size => {
    // Visualize the merge sort process and sort devices
    const sortedDevices = runMergeSort(networkDevices, size);
    const mergeSortResult = findMinTransferSpeedMergeSort(sortedDevices, size);

    resultOutput += `Divide and Conquer (Merge Sort) Algorithm for file size ${size} MB:<br>
    Minimum Transfer Speed: ${mergeSortResult.device} - ${mergeSortResult.transferSpeed.toFixed(2)} seconds<br>
    Sorted Devices by Transfer Speed (Ascending): <ul>`;
    
    sortedDevices.forEach(device => {
      resultOutput += `<li>${device.name} - ${calculateTransferSpeed(device.bandwidth, size).toFixed(2)} seconds</li>`;
    });
    resultOutput += '</ul><br>';
  });

  document.getElementById('resultOutput').innerHTML = `<h2>Simulation Results</h2><div>${resultOutput}</div>`;
  document.getElementById('simulation').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
}

// Fungsi untuk menampilkan daftar ukuran file
function displayFileSizes() {
  let fileSizesOutput = '<h3>File Sizes:</h3>';
  fileSizesOutput += '<ul>';
  for (let i = 0; i < fileSizes.length; i++) {
    fileSizesOutput += `<li>${fileSizes[i]} MB</li>`;
  }
  fileSizesOutput += '</ul>';
  document.getElementById('fileSizesOutput').innerHTML = fileSizesOutput;
}

// Fungsi untuk menghitung kecepatan transfer
function calculateTransferSpeed(bandwidth, size) {
  // Convert fileSize from MB to Megabits for accurate calculation (1 MB = 8 Megabits)
  return (size * 8) / bandwidth;
}

// Fungsi untuk mencari perangkat dengan transfer speed minimum menggunakan brute force
function findMinTransferSpeedBruteForce(size) {
  let minTransferSpeed = Infinity;
  let minDevice = '';
  for (let i = 0; i < networkDevices.length; i++) {
    const device = networkDevices[i];
    const transferSpeed = calculateTransferSpeed(device.bandwidth, size);
    if (transferSpeed < minTransferSpeed) {
      minTransferSpeed = transferSpeed;
      minDevice = device.name;
    }
  }
  return { device: minDevice, transferSpeed: minTransferSpeed };
}

// Fungsi untuk menjalankan merge sort pada perangkat jaringan berdasarkan kecepatan transfer
function runMergeSort(arr, size) {
  const logElementId = 'mergeSortOutput';
  document.getElementById(logElementId).innerHTML = ''; // Clear previous log
  visualizeMergeSort(arr, size, logElementId);
  return mergeSort(arr, size);
}

// Fungsi untuk mengurutkan menggunakan merge sort dan menampilkan prosesnya
function mergeSort(arr, size) {
  if (arr.length < 2) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left, size), mergeSort(right, size), size);
}

// Fungsi untuk menggabungkan dua array yang telah diurutkan
function merge(left, right, size) {
  let result = [];
  while (left.length && right.length) {
    if (calculateTransferSpeed(left[0].bandwidth, size) <= calculateTransferSpeed(right[0].bandwidth, size)) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return result.concat(left, right);
}

// Fungsi untuk mencari perangkat dengan transfer speed minimum menggunakan merge sort
function findMinTransferSpeedMergeSort(sortedDevices, size) {
  let minTransferSpeed = Infinity;
  let minDevice = '';
  for (let i = 0; i < sortedDevices.length; i++) {
    const device = sortedDevices[i];
    const transferSpeed = calculateTransferSpeed(device.bandwidth, size);
    if (transferSpeed < minTransferSpeed) {
      minTransferSpeed = transferSpeed;
      minDevice = device.name;
    }
  }
  return { device: minDevice, transferSpeed: minTransferSpeed };
}

// Fungsi untuk menghasilkan tabel brute force exhaustive search
function generateBruteForceTable() {
  // Get all permutations of the networkDevices array (people)
  const permutations = getPermutations(networkDevices.map(device => device.name));

  // Create table header dynamically based on the number of file sizes
  let tableHTML = '<h3>Brute Force Exhaustive Search Results:</h3>';
  tableHTML += '<table border="1">';
  tableHTML += '<tr>';

  // Adding headers for each file size
  fileSizes.forEach((_, index) => {
    tableHTML += `<th>File Size ${index + 1}</th>`;
  });

  tableHTML += '<th>Total Transfer Speed (Seconds)</th>';
  tableHTML += '</tr>';

  // Variable to store the minimum total transfer speed
  let minTotalTransferSpeed = Infinity;
  let minAssignment = '';

  // Iterate through each permutation
  permutations.forEach(assignment => {
    let totalTransferSpeed = 0;
    tableHTML += '<tr>';

    // Calculate total transfer speed and display each job
    assignment.forEach((worker, index) => {
      const device = networkDevices.find(dev => dev.name === worker);
      const transferSpeed = calculateTransferSpeed(device.bandwidth, fileSizes[index]);
      totalTransferSpeed += transferSpeed;
      tableHTML += `<td>${worker} (${transferSpeed.toFixed(2)}s)</td>`;
    });

    tableHTML += `<td>${totalTransferSpeed.toFixed(2)}</td>`;
    tableHTML += '</tr>';

    // Update the minimum total transfer speed and assignment
    if (totalTransferSpeed < minTotalTransferSpeed) {
      minTotalTransferSpeed = totalTransferSpeed;
      minAssignment = assignment;
    }
  });

  tableHTML += '</table>';

  // Add conclusion below the table
  tableHTML += `<p style="color: red; font-weight: bold;">Therefore, the minimum total transfer speed is ${minTotalTransferSpeed.toFixed(2)} and is achieved with the combination of `;
  minAssignment.forEach((worker, index) => {
    if (index !== 0) tableHTML += ' + ';
    tableHTML += `${worker}`;
  });
  tableHTML += `.</p>`;

  document.getElementById('resultOutput').innerHTML = tableHTML;
  document.getElementById('simulation').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
}


// Fungsi untuk mendapatkan semua permutasi dari sebuah array
function getPermutations(arr) {
  const result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const current = arr.slice();
        const next = current.splice(i, 1);
        permute(current.slice(), m.concat(next));
      }
    }
  };

  permute(arr);

  return result;
}

// Fungsi untuk menjalankan visualisasi merge sort
function visualizeMergeSort(arr, size, elementId) {
  const mergeSortVisual = (array, startIndex, endIndex, depth = 0) => {
    if (startIndex < endIndex) {
      const middleIndex = Math.floor((startIndex + endIndex) / 2);
      displaySplit(array.slice(startIndex, endIndex + 1),size, depth, elementId, 'Splitting');
      mergeSortVisual(array, startIndex, middleIndex, depth + 1);
      mergeSortVisual(array, middleIndex + 1, endIndex, depth + 1);
      mergeVisual(array, startIndex, middleIndex, endIndex, depth, size);
    } else {
      displaySplit(array.slice(startIndex, endIndex + 1),size, depth, elementId, 'Base Case');
    }
  };

  const mergeVisual = (array, startIndex, middleIndex, endIndex, depth, size) => {
    const leftArray = array.slice(startIndex, middleIndex + 1);
    const rightArray = array.slice(middleIndex + 1, endIndex + 1);

    let i = 0, j = 0, k = startIndex;
    while (i < leftArray.length && j < rightArray.length) {
      if (calculateTransferSpeed(leftArray[i].bandwidth, size) <= calculateTransferSpeed(rightArray[j].bandwidth, size)) {
        array[k] = leftArray[i];
        i++;
      } else {
        array[k] = rightArray[j];
        j++;
      }
      k++;
    }

    while (i < leftArray.length) {
      array[k] = leftArray[i];
      i++;
      k++;
    }

    while (j < rightArray.length) {
      array[k] = rightArray[j];
      j++;
      k++;
    }

    displayMerge(array.slice(startIndex, endIndex + 1), size, depth, elementId);
  };

  const displaySplit = (array, size, depth, elementId, action) => {
    const displayElement = document.getElementById(elementId);
    const splitPart = array.map(device => `${calculateTransferSpeed(device.bandwidth, size).toFixed(2)}s`).join(", ");
    const content = `<p style="margin-left: ${depth * 20}px;"> ${action} [${splitPart}]</p>`;
    displayElement.innerHTML += content;
  };

  const displayMerge = (array, size, depth, elementId) => {
    const displayElement = document.getElementById(elementId);
    const mergePart = array.map(device => `${calculateTransferSpeed(device.bandwidth, size).toFixed(2)}s`).join(", ");
    const content = `<p style="margin-left: ${depth * 20}px;"> Merging -> [${mergePart}]</p>`;
    displayElement.innerHTML += content;
  };

  const arrayCopy = [...arr];
  document.getElementById(elementId).innerHTML = `<h3>Merge Sort Process:</h3>`;
  mergeSortVisual(arrayCopy, 0, arrayCopy.length - 1);
}
