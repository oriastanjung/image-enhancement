function performHistogramEqualization(
  matrixGrayscalePixel,
  L,
  baris,
  kolom,
  imageData
) {
  // console.log("matrix >> ", matrixGrayscalePixel);
  const hitungKdanRk = () => {
    let data = [];
    for (let k = 0; k <= L - 1; k++) {
      data[k] = k / (L - 1);
    }
    return data;
  };
  const kdanRk = hitungKdanRk();

  const handleHitungNk = () => {
    const dataKdanNk = Array(L).fill(0); // Inisialisasi array dengan nilai nol
    for (let i = 0; i < matrixGrayscalePixel.length; i++) {
      dataKdanNk[matrixGrayscalePixel[i]]++;
    }
    return dataKdanNk;
  };

  const nk = handleHitungNk();
  // // Hitung PDF, SK, TR, dan PS
  const totalPixels = baris * kolom;

  const pdf = nk.map((n) => n / totalPixels);

  let sk = 0;

  const cdf = pdf.map((p) => {
    sk += p;
    return sk;
  });

  
  const transformedPixelValues = cdf.map((cdfValue) =>
    Math.round((L - 1) * cdfValue)
  ); // rumus s = T(r) = Round(L-1)*CDF(k)

  // Create a new nk array based on the intensity values in matrixEqualization

  const KdanSk = Array(L).fill(0); // k = 0 smpai k = L-1 atau 255
  // sk = T(rk) = L-1*CDF(k)
  const hitungKdanSk = () => {
    for (let k = 0; k < L; k++) {
      KdanSk[k] = Math.round((L - 1) * cdf[k]);
    }
  };

  hitungKdanSk();

  const tableImg1 = {
    kdanRk,
    nk,
    pdf,
    sk: KdanSk, // Distribusi kumulatif // cdf
    cdf, // cdf
    matrixEqualization: transformedPixelValues, 
  };
  const skDanNewNk = Array(L).fill(0); // Inisialisasi array dengan 256 elemen, semua bernilai 0

  for (let k = 0; k < L; k++) {
    const skValue = tableImg1.sk[k]; // Nilai sk pada indeks k
    const nkValue = tableImg1.nk[k]; // Nilai nk pada indeks k
    skDanNewNk[skValue] += nkValue; // Tambahkan nk ke indeks yang sesuai dengan sk
  }

  const roundedTableImg1 = {
    kolom: kolom,
    baris: baris,
    matrixIntensitas: matrixGrayscalePixel,
    kdanRk: tableImg1.kdanRk.map((val) => Math.round(val * 100) / 100),
    nk: tableImg1.nk.map((val) => Math.round(val * 100) / 100),
    pdf: tableImg1.pdf.map((val) => Math.round(val * 100) / 100),
    sk: tableImg1.sk.map((val) => Math.round(val * 100) / 100),
    cdf: tableImg1.cdf.map((val) => Math.round(val * 100) / 100),
    matrixEqualization: tableImg1.matrixEqualization.map(
      (val) => Math.round(val * 100) / 100
    ),
    skDanNewNk : skDanNewNk
  };

  return roundedTableImg1;
}

export { performHistogramEqualization };
