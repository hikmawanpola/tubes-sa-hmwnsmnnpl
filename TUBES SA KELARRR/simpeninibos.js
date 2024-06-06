let networkDevices = [];
let fileSizes = [];
let algorithm = '';

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('continueBtn').addEventListener('click', continueToSimulation);
});

function login() {
  const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked').value;
  initializeSimulation(selectedAlgorithm);
}

function initializeSimulation(selectedAlgorithm) {
  algorithm = selectedAlgorithm;
  document.getElementById('login').classList.add('hidden');
  document.getElementById('configureNetwork').classList.remove('hidden');
}

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

function displayNetworkDevices() {
  let devicesOutput = '<h3>Network Devices:</h3>';
  devicesOutput += '<ul>';
  for (let i = 0; i < networkDevices.length; i++) {
    devicesOutput += `<li>${networkDevices[i].name} - ${networkDevices[i].bandwidth} Mbps</li>`;
  }
  devicesOutput += '</ul>';
  document.getElementById('networkDevicesOutput').innerHTML = devicesOutput;
}

function continueToSimulation() {
  document.getElementById('configureNetwork').classList.add('hidden');
  document.getElementById('simulation').classList.remove('hidden');
}

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
    document.getElementById('runSimulationBtn').classList.remove('hidden');
  }
}

function displayFileSizes() {
  let fileSizesOutput = '<h3>File Sizes:</h3>';
  fileSizesOutput += '<ul>';
  for (let i = 0; i < fileSizes.length; i++) {
    fileSizesOutput += `<li>${fileSizes[i]} MB</li>`;
  }
  fileSizesOutput += '</ul>';
  document.getElementById('fileSizesOutput').innerHTML = fileSizesOutput;
}

function calculateTransferSpeed(bandwidth, size) {
  // Convert fileSize from MB to Megabits for accurate calculation (1 MB = 8 Megabits)
  return (size * 8) / bandwidth;
}

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

function runMergeSort(arr, size) {
  if (arr.length < 2) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(runMergeSort(left, size), runMergeSort(right, size), size);
}

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

function runSimulation() {
  let resultOutput = '';

  fileSizes.forEach(size => {
    if (algorithm === 'bruteforce') {
      const bruteForceResult = findMinTransferSpeedBruteForce(size);
      resultOutput += `Brute Force Exhaustive Search for file size ${size} MB:<br>
      Minimum Transfer Speed: ${bruteForceResult.device} - ${bruteForceResult.transferSpeed.toFixed(2)} seconds<br>
      Sorted Devices by Data Input: <ul>`;
      networkDevices.forEach(device => {
        resultOutput += `<li>${device.name} - ${calculateTransferSpeed(device.bandwidth, size).toFixed(2)} seconds</li>`;
      });
      resultOutput += '</ul><br>';
    } else if (algorithm === 'divideAndConquer') {
      const sortedDevices = runMergeSort(networkDevices, size);
      const mergeSortResult = findMinTransferSpeedMergeSort(sortedDevices, size);
      resultOutput += `Divide and Conquer (Merge Sort) Algorithm for file size ${size} MB:<br>
      Minimum Transfer Speed: ${mergeSortResult.device} - ${mergeSortResult.transferSpeed.toFixed(2)} seconds<br>
      Sorted Devices by Transfer Speed (Ascending): <ul>`;
      sortedDevices.forEach(device => {
        resultOutput += `<li>${device.name} - ${calculateTransferSpeed(device.bandwidth, size).toFixed(2)} seconds</li>`;
      });
      resultOutput += '</ul><br>';
    }
  });

  document.getElementById('resultOutput').innerHTML = `<h2>Simulation Results</h2><div>${resultOutput}</div>`;
  document.getElementById('simulation').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
}

document.getElementById('addDeviceBtn').addEventListener('click', addNetworkDevice);
document.getElementById('continueBtn').addEventListener('click', continueToSimulation);
