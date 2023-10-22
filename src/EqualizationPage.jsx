import React, { useRef, useState } from "react";
import HistogramChart from "./HistogramChart";
import { performHistogramEqualization } from "./histogramEqualization";
import { performHistogramSpecification } from "./histogramSpecification";
import Navbar from "./Navbar";
import Footer from "./Footer";

const EqualizationPage = () => {
  const [roundedTableImg1, setRoundedTableImg1] = useState({});
  const [imgInput, setImgInput] = useState("");
  const canvasRef1 = useRef(null);
  const canvasRefOutput = useRef(null);

  const handleImageUpload1 = (event) => {
    const { files } = event.target;
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setImgInput(imageUrl);

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      const canvas = canvasRef1.current;
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const grayscaleMatrix = [];

      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg =
          (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) /
          3;
        grayscaleMatrix.push(avg);
      }

      const equalizationData = performHistogramEqualization(
        grayscaleMatrix,
        256,
        image.height,
        image.width
      );
      setRoundedTableImg1(equalizationData);

      const canvasOutput = canvasRefOutput.current;
      canvasOutput.width = image.width;
      canvasOutput.height = image.height;
      const outputCtx = canvasOutput.getContext("2d");

      // Create ImageData object for the grayscale image
      const grayscaleData = new ImageData(
        new Uint8ClampedArray([
          ...grayscaleMatrix,
          ...Array(
            4 * image.width * image.height - grayscaleMatrix.length
          ).fill(0),
        ]),
        image.width,
        image.height
      );

      // Draw the grayscale image on the canvas
      outputCtx.putImageData(grayscaleData, 0, 0);
    };
  };

  return (
    <>
      <Navbar />
      <div className="p-5 flex justify-center">
        <h1 className="font-bold text-center  text-lg md:text-xl">
          IMAGE ENHANCEMENT - HISTOGRAM EQUALIZATION
        </h1>
      </div>
      <div className="flex p-10">
        <div className="mb-16 w-full bg-white px-6 py-4 rounded-xl border">
          <div>
            <input className="font-thin" type="file" accept="image/*" onChange={handleImageUpload1} />
            <canvas ref={canvasRef1} style={{ display: "none" }} />
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-center pt-10 font-semibold">Image Input : </p>
            <div className="overflow-scroll max-h-[50vh]">
              {imgInput && <img src={imgInput} alt="Input" />}
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-5">
            <h2 className="font-light py-10">Data Before Image Source Histogram Equalization : </h2>
            <HistogramChart
              data={roundedTableImg1.nk} // Use cdf data for the chart
              label="Frequency"
              color="green"
            />
            <p className="font-thin py-10">
              baris : {roundedTableImg1?.baris} | kolom :{" "}
              {roundedTableImg1?.kolom}
            </p>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-5">
            <h2 className="font-light" >Data After Image Source Histogram Equalization : </h2>
            <HistogramChart
              data={roundedTableImg1.skDanNewNk} // Use cdf data for the chart
              label="Frequency"
              color="green"
            />
            <p className="font-thin py-10">
              baris : {roundedTableImg1?.baris} | kolom :{" "}
              {roundedTableImg1?.kolom}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EqualizationPage;
