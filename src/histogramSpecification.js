function cariSelisihTerdekat(target, arr) {
  // Inisialisasi variabel untuk menyimpan selisih terkecil dan angka yang bersesuaian
  let selisihTerdekat = Math.abs(target - arr[0]);
  let angkaTerdekat = arr[0];

  // Iterasi melalui seluruh elemen array
  for (let i = 1; i < arr.length; i++) {
    const selisih = Math.abs(target - arr[i]);

    // Jika selisih saat ini lebih kecil dari selisih terdekat yang ada, atau selisih sama tetapi angka lebih baru
    if (
      selisih < selisihTerdekat ||
      (selisih === selisihTerdekat && arr[i] > angkaTerdekat)
    ) {
      selisihTerdekat = selisih;
      angkaTerdekat = arr[i];
    }
  }

  return angkaTerdekat;
}

function createMappingFunction(inputCDF, targetCDF) {
    const mappingFunction = new Array(256).fill(0);
    for (let i = 0; i < 256; i++) {
      const inputCDFValue = inputCDF[i];
      let closestTargetCDFValue = 1;
      for (let j = 0; j < 256; j++) {
        if (Math.abs(targetCDF[j] - inputCDFValue) < closestTargetCDFValue) {
          closestTargetCDFValue = Math.abs(targetCDF[j] - inputCDFValue);
          mappingFunction[i] = j;
        }
      }
    }
    return mappingFunction;
  }



function performHistogramSpecification(sourceImage, targetImage) {
  const inputCDF = sourceImage?.cdf
  const targetCDF = targetImage?.cdf

  const mappingFunction = createMappingFunction(inputCDF, targetCDF);

  
}

export { performHistogramSpecification };
