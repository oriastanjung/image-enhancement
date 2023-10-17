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

function performHistogramEqualization(matrixGrayscalePixel, L, baris, kolom, imageData) {
  console.log("matrix >> ", matrixGrayscalePixel);
  const hitungKdanRk = () => {
    let data = [];
    for (let k = 0; k <= L - 1; k++) {
      data[k] = k / (L - 1);
    }
    return data;
  };

  const handleHitungNk = () => {
    const dataKdanNk = Array(L).fill(0); // Inisialisasi array dengan nilai nol
    for (let i = 0; i < matrixGrayscalePixel.length; i++) {
      for (let j = 0; j < matrixGrayscalePixel[i].length; j++) {
        for (let k = 0; k <= L - 1; k++) {
          if (matrixGrayscalePixel[i][j] === k) {
            dataKdanNk[k]++;
          }
        }
      }
    }
    return dataKdanNk;
  };

  const kdanRk = hitungKdanRk();
  const nk = handleHitungNk();
  // Hitung PDF, SK, TR, dan PS
  const totalPixels = baris * kolom;

  const pdf = nk.map((n) => n / totalPixels);

  let sk = 0;

  const cdf = pdf.map((p) => {
    sk += p;
    return sk;
  });

  const ps = nk.map((n) => Math.round((n / totalPixels) * 100) / 100); // Bulatkan menjadi 2 desimal

  const pendekatanR = () => {
    const data = [];
    for (let k = 0; k < cdf.length; k++) {
      const selisihTerdekat = cariSelisihTerdekat(cdf[k], kdanRk);
      data[k] = selisihTerdekat;
    }
    return data;
  };

  const NpendekatanR = () => {
    const pendekatanRData = pendekatanR();
    const data = Array(L).fill(0);

    for (let k = 0; k <= L - 1; k++) {
      for (let i = 0; i < pendekatanRData.length; i++) {
        if (pendekatanRData[i] === kdanRk[k]) {
          data[k] += nk[i];
        }
      }
    }

    return data;
  };

  const hitungPssk = () => {
    const NpendekatanRData = NpendekatanR();
    const data = Array(L).fill(0);

    for (let k = 0; k <= L - 1; k++) {
      data[k] = NpendekatanRData[k] / totalPixels;
    }

    return data;
  };

  const tableImg1 = {
    kdanRk,
    nk,
    pdf,
    sk: cdf, // Distribusi kumulatif // cdf
    cdf, // cdf
    pendekatanR: pendekatanR(),
    ndariPendekatanR: NpendekatanR(), // Pixel equalization
    pssk: hitungPssk(),
  };

  const roundedTableImg1 = {
    kolom: kolom,
    baris: baris,
    matrixIntensitas: matrixGrayscalePixel,
    kdanRk: tableImg1.kdanRk.map((val) => Math.round(val * 100) / 100),
    nk: tableImg1.nk.map((val) => Math.round(val * 100) / 100),
    pdf: tableImg1.pdf.map((val) => Math.round(val * 100) / 100),
    sk: tableImg1.sk.map((val) => Math.round(val * 100) / 100),
    cdf: tableImg1.cdf.map((val) => Math.round(val * 100) / 100),
    pendekatanR: tableImg1.pendekatanR.map(
      (val) => Math.round(val * 100) / 100
    ),
    ndariPendekatanR: tableImg1.ndariPendekatanR.map(
      (val) => Math.round(val * 100) / 100
    ),
    pssk: tableImg1.pssk.map((val) => Math.round(val * 100) / 100),
  };
  console.log(roundedTableImg1);
  return roundedTableImg1;
}

export { performHistogramEqualization };
