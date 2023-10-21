import { useEffect, useRef, useState } from "react";
import HistogramChart from "./HistogramChart";
import NonZeroTable from "./NoZeroTable";

function EqualizationPage() {
  const [intensitasL, setIntensitasL] = useState(255); // L=256-1
  const [nilaiRk, setNilaiRk] = useState([]);
  const [histogramData, setHistogramData] = useState([]);

  const [dataInput, setDataInput] = useState({
    matrixIntensitas: [],
    n: 0,
    kolom: 0,
    baris: 0,
  });

  // Membuat referensi ke elemen <canvas> menggunakan useRef hook
  const canvasRef = useRef(null);

  const outputCanvasRef = useRef(null);

  // Fungsi yang dipanggil ketika pengguna memilih file gambar
  const handleImageUpload = (event) => {
    // Mengambil referensi elemen <canvas> dari canvasRef
    const canvas = canvasRef.current;
    // Mengambil konteks 2D untuk menggambar di atas canvas
    const ctx = canvas.getContext("2d");

    // Membuat objek gambar baru
    const image = new Image();
    // Mengatur sumber gambar menggunakan URL objek blob yang dihasilkan dari file gambar yang dipilih
    image.src = URL.createObjectURL(event.target.files[0]);

    // Ketika gambar selesai dimuat
    image.onload = () => {
      // Mengatur ukuran elemen <canvas> sesuai dengan ukuran gambar
      canvas.width = image.width;
      canvas.height = image.height;
      // Menggambar gambar di atas canvas
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Mengambil data piksel dari canvas pada area gambar
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      // Membuat array kosong untuk menyimpan nilai intensitas grayscale
      const grayscaleMatrix = [];

      // Loop melalui data piksel
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Menghitung rata-rata nilai merah, hijau, dan biru dari piksel, kemudian membulatkannya
        const avg = Math.round(
          (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) /
            3
        );
        // Memasukkan nilai intensitas grayscale ke dalam grayscaleMatrix
        grayscaleMatrix.push(avg);
      }

      // Menghitung histogram equalization dan memanggil callback dengan nilai intensitas grayscale yang telah diubah
      const equalizedValues = calculateHistogramEqualization(grayscaleMatrix);
      const martixBeforeEqualization = matrixPDF(grayscaleMatrix);
      setDataInput({
        baris: image.height,
        kolom: image.width,
        matrixIntensitas: grayscaleMatrix,
        martixBeforeEqualization: martixBeforeEqualization,
        matrixEqualization: equalizedValues,
      });
      console.log("matriks grayscale >> ", dataInput);
    };
  };

  // PDF
  const matrixPDF = (grayscaleMatrix) => {
    const histogram = new Array(256).fill(0);

    // PDF
    // Menghitung histogram (jumlah kemunculan setiap nilai intensitas) hitung nk
    grayscaleMatrix.forEach((pixel, i) => {
      histogram[pixel]++;
    });
    return histogram;
  };

  // Fungsi untuk menghitung histogram equalization dari matriks intensitas grayscale
  const calculateHistogramEqualization = (grayscaleMatrix) => {
    const histogram = new Array(256).fill(0);
    // PDF
    // Menghitung histogram (jumlah kemunculan setiap nilai intensitas)
    grayscaleMatrix.forEach((pixel) => {
      histogram[pixel]++;
    });

    // Menghitung histogram kumulatif
    const cumulativeHistogram = [];
    let cumulativeSum = 0;
    histogram.forEach((count) => {
      cumulativeSum += count;
      cumulativeHistogram.push(cumulativeSum);
    });

    // Menghitung nilai intensitas grayscale yang diubah menggunakan histogram equalization
    const equalizedValues = cumulativeHistogram.map((sum) =>
      Math.round((sum * 255) / grayscaleMatrix.length)
    );

    return equalizedValues;
  };

  // Fungsi untuk menggambar gambar setelah equalisasi ke elemen canvas baru
  const drawEqualizedImage = () => {
    const outputCanvas = outputCanvasRef.current;
    const outputCtx = outputCanvas.getContext("2d");

    // Setel ukuran elemen canvas sesuai dengan gambar
    outputCanvas.width = dataInput.kolom;
    outputCanvas.height = dataInput.baris;

    // Buat data gambar baru berdasarkan matriks intensitas setelah equalisasi
    const imageData = outputCtx.createImageData(
      dataInput.kolom,
      dataInput.baris
    );
    for (let i = 0; i < dataInput.matrixEqualization.length; i++) {
      const pixelValue =
        dataInput.matrixEqualization[dataInput.matrixEqualization[i]];
      imageData.data[i * 4] = pixelValue; // R (merah)
      imageData.data[i * 4 + 1] = pixelValue; // G (hijau)
      imageData.data[i * 4 + 2] = pixelValue; // B (biru)
      imageData.data[i * 4 + 3] = 255; // A (alpha, 255 untuk opasitas penuh)
    }

    // Gambarkan data gambar ke elemen canvas baru
    outputCtx.putImageData(imageData, 0, 0);
  };
  // Panggil fungsi drawEqualizedImage setelah dataInput.matrixEqualization berubah
  useEffect(() => {
    if (
      dataInput.matrixEqualization &&
      dataInput.matrixEqualization.length > 0
    ) {
      drawEqualizedImage();
    }
  }, [dataInput.matrixEqualization]);

  useEffect(() => {
    const initializeNilaiRk = () => {
      let dataRk = [];
      for (let k = 0; k <= intensitasL; k++) {
        dataRk[k] = k / intensitasL;
      }
      setNilaiRk(dataRk);
    };
    initializeNilaiRk();
  }, []);

  return (
    <>
      {/* // 1 */}
      <div className="container mx-auto mt-10">
        <div>
          <h1 className="text-center font-bold text-xl">
            Histogram Equalization dengan L=256 {"(RGB)"}
          </h1>
        </div>
        <div className="flex flex-row items-start gap-10">
          <div className="flex flex-col w-1/2">
            <div className="mt-10">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
            {/* <NonZeroTable data={dataInput.martixBeforeEqualization} /> */}
            {/* {dataInput && console.table(dataInput)} */}
            {/* Menampilkan grafik hasil histogram equalization */}
            <div>
              <h2>Matrix Before Image Histogram</h2>
              <HistogramChart
                data={dataInput.martixBeforeEqualization}
                label="Frequency"
                color="green"
              />
            </div>
            <div>
              <h2>Matrix After Image Histogram</h2>
              <HistogramChart
                data={dataInput.matrixEqualization}
                label="Frequency"
                color="green"
              />
            </div>
          </div>
          {/* <div className="mt-16">
            <h2>Equalized Image 1</h2>
            <canvas ref={outputCanvasRef} />
          </div> */}
        </div>
      </div>
     
    </>
  );
}

export default EqualizationPage;
