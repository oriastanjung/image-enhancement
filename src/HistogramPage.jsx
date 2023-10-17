import React, { useEffect, useRef, useState } from "react";
import HistogramChart from "./HistogramChart";
import { performHistogramEqualization } from "./histogramEqualization";
import NonZeroTable from "./NoZeroTable";

const HistogramPage = () => {
  const [roundedTableImg1, setRoundedTableImg1] = useState([[]]);
  const [roundedTableImg2, setRoundedTableImg2] = useState([[]]);
  const [imgInput, setImgInput] = useState("");
  const [imgSpecification, setImgSpecification] = useState("");
  // Membuat referensi ke elemen <canvas> menggunakan useRef hook
  const canvasRef1 = useRef(null);
  // Membuat referensi ke elemen <canvas> menggunakan useRef hook
  const canvasRef2 = useRef(null);

  // Fungsi yang dipanggil ketika pengguna memilih file gambar
  const handleImageUpload1 = (event) => {
    const { files } = event.target;
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setImgInput(imageUrl);
    // Mengambil referensi elemen <canvas> dari canvasRef
    const canvas = canvasRef1.current;
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
      // Membuat matriks untuk menyimpan nilai intensitas grayscale dalam bentuk matriks 2D
      const grayscaleMatrix = [[]];
      let row = 0;

      // Loop melalui data piksel
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Menghitung rata-rata nilai merah, hijau, dan biru dari piksel, kemudian membulatkannya
        const avg = Math.round(
          (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) /
            3
        );

        // Memasukkan nilai intensitas grayscale ke dalam grayscaleMatrix
        grayscaleMatrix[row].push(avg);

        // Check if we have reached the end of a row
        if (grayscaleMatrix[row].length === image.width) {
          // Create a new row in the matrix
          row++;
          grayscaleMatrix.push([]);
        }
      }

      // Remove the last empty row (if any)
      if (grayscaleMatrix[grayscaleMatrix.length - 1].length === 0) {
        grayscaleMatrix.pop();
      }


      const equalizationData = performHistogramEqualization(
        grayscaleMatrix,
        256,
        image.height,
        image.width
      );
      setRoundedTableImg1(equalizationData);
    };
  };

  // Fungsi yang dipanggil ketika pengguna memilih file gambar
  const handleImageUpload2 = (event) => {
    const { files } = event.target;
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setImgSpecification(imageUrl);
    // Mengambil referensi elemen <canvas> dari canvasRef
    const canvas = canvasRef2.current;
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
      // Membuat matriks untuk menyimpan nilai intensitas grayscale dalam bentuk matriks 2D
      const grayscaleMatrix = [[]];
      let row = 0;

      // Loop melalui data piksel
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Menghitung rata-rata nilai merah, hijau, dan biru dari piksel, kemudian membulatkannya
        const avg = Math.round(
          (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) /
            3
        );

        // Memasukkan nilai intensitas grayscale ke dalam grayscaleMatrix
        grayscaleMatrix[row].push(avg);

        // Check if we have reached the end of a row
        if (grayscaleMatrix[row].length === image.width) {
          // Create a new row in the matrix
          row++;
          grayscaleMatrix.push([]);
        }
      }

      // Remove the last empty row (if any)
      if (grayscaleMatrix[grayscaleMatrix.length - 1].length === 0) {
        grayscaleMatrix.pop();
      }

      const equalizationData = performHistogramEqualization(
        grayscaleMatrix,
        256,
        image.height,
        image.width
      );
      setRoundedTableImg2(equalizationData);
    };
  };

  return (
    <>
      <div className="p-5 flex justify-center">
        <h1 className="font-bold text-xl">IMAGE ENHANCEMENT - HISTOGRAM SPECIFICATIONS</h1>
      </div>
      <div className="mb-16">
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload1} />
          <canvas ref={canvasRef1} style={{ display: "none" }} />
        </div>
        <div className="flex flex-col items-center gap-5">
          <p className="text-center">Image Input</p>
          <div>{imgInput && <img src={imgInput} />}</div>
        </div>
        <div className="lg:w-1/2 flex flex-col gap-5">
          <h2>Matrix After Image Histogram Equalization</h2>
          <HistogramChart
            data={roundedTableImg1.ndariPendekatanR}
            label="Frequency"
            color="green"
          />
          <p>baris : {roundedTableImg1?.baris} | kolom : {roundedTableImg1?.kolom}</p>
          <NonZeroTable data={roundedTableImg1.ndariPendekatanR} />
        </div>
      </div>
      <hr />
      <div className="mt-16">
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload2} />
          <canvas ref={canvasRef2} style={{ display: "none" }} />
        </div>
        <div className="flex flex-col items-center gap-5">
          <p className="text-center">Image Specification</p>
          {imgSpecification && <img src={imgSpecification} />}
        </div>
        <div className="lg:w-1/2 flex flex-col gap-5">
          <h2>Matrix After Image Histogram Equalization</h2>
          <HistogramChart
            data={roundedTableImg2.pssk}
            label="Frequency"
            color="green"
          />
        </div>
      </div>
    </>
  );
};

export default HistogramPage;
