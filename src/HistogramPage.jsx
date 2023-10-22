import React, { useEffect, useRef, useState } from "react";
import HistogramChart from "./HistogramChart";
import { performHistogramEqualization } from "./histogramEqualization";
import { performHistogramSpecification } from "./histogramSpecification";
import Navbar from "./Navbar";
import Footer from "./Footer";
const HistogramPage = () => {
  const [roundedTableImg1, setRoundedTableImg1] = useState({});
  const [roundedTableImg2, setRoundedTableImg2] = useState({});
  const [imgInput, setImgInput] = useState("");
  const [imgSpecification, setImgSpecification] = useState("");
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const [outputImageTable, setOutputImageTable] = useState();

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
    };
  };

  const handleImageUpload2 = (event) => {
    const { files } = event.target;
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setImgSpecification(imageUrl);

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
      setRoundedTableImg2(equalizationData);
    };
  };

  useEffect(() => {
    if (
      roundedTableImg1?.matrixEqualization &&
      roundedTableImg2?.matrixEqualization
    ) {
      setOutputImageTable(
        performHistogramSpecification(roundedTableImg1, roundedTableImg2, 256)
      );
    }
  }, [roundedTableImg1, roundedTableImg2]);

  return (
    <>
      <Navbar />
      <div className="p-5 flex justify-center">
        <h1 className="font-bold text-xl">
          IMAGE ENHANCEMENT - HISTOGRAM SPECIFICATIONS
        </h1>
      </div>
      <div className="flex flex-col p-10">
        <div className="mb-16 w-full bg-white px-6 py-4 rounded-xl border">
          <div>
            <input className="font-thin" type="file" accept="image/*" onChange={handleImageUpload1} />
            <canvas ref={canvasRef1} style={{ display: "none" }} />
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-left pt-10 font-semibold">Image Input : </p>
            <div className=" overflow-scroll max-h-[50vh]">
              {imgInput && <img src={imgInput} alt="Input" />}
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col gap-5">
            <h2 className="pt-10 font-light">
              Data After Image Histogram Equalization :
            </h2>
            <HistogramChart
              data={roundedTableImg1.skDanNewNk} // Use cdf data for the chart
              label="Frequency"
              color="green"
            />
            <p className="font-light">
              Baris : {roundedTableImg1?.baris} | Kolom :{" "}
              {roundedTableImg1?.kolom}
            </p>
          </div>
        </div>
        <hr className="py-10" />
        <div className="mb-16  w-full bg-white px-6 py-4 rounded-xl border">
          <div>
            <input className="font-thin" type="file" accept="image/*" onChange={handleImageUpload2} />
            <canvas ref={canvasRef2} style={{ display: "none" }} />
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-left pt-10">Image References : </p>
            <div className=" overflow-scroll max-h-[50vh]">
              {imgSpecification && (
                <img src={imgSpecification} alt="Specification" />
              )}
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col gap-5">
            <h2 className="pt-10 font-light">
              Data After Image Histogram Equalization :{" "}
            </h2>
            <HistogramChart
              data={roundedTableImg2?.skDanNewNk} // Use cdf data for the chart
              label="Frequency"
              color="blue"
            />
            <p className="font-light">
              Baris : {roundedTableImg2?.baris} | Kolom :{" "}
              {roundedTableImg2?.kolom}
            </p>
          </div>
        </div>
      </div>
      <div className="px-10">
        <div className="flex justify-start w-full bg-white px-6 py-4 rounded-xl border ">
          {outputImageTable ? (
            <div className="lg:w-1/2 flex flex-col gap-5">
              <h2 className="font-semibold">Histogram Specification :</h2>
              <HistogramChart
                data={outputImageTable}
                label="Frequency"
                color="blue"
              />
            </div>
          ) : (
            <p className="font-semibold italic text-center w-full">Input the Source Image and The Reference Image First</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistogramPage;
