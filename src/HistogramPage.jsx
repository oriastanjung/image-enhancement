import React, { useRef, useState } from "react";
import HistogramChart from "./HistogramChart";
import { performHistogramEqualization } from "./histogramEqualization";

const HistogramPage = () => {
  const [roundedTableImg1, setRoundedTableImg1] = useState({});
  const [roundedTableImg2, setRoundedTableImg2] = useState({});
  const [imgInput, setImgInput] = useState("");
  const [imgSpecification, setImgSpecification] = useState("");
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);

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

  return (
    <>
      <div className="p-5 flex justify-center">
        <h1 className="font-bold text-xl">
          IMAGE ENHANCEMENT - HISTOGRAM SPECIFICATIONS
        </h1>
      </div>
      <div className="flex p-10">
        <div className="mb-16 w-full">
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload1} />
            <canvas ref={canvasRef1} style={{ display: "none" }} />
          </div>
          <div className="flex flex-col items-center gap-5">
            <p className="text-center">Image Input</p>
            <div className=" overflow-scroll max-h-[50vh]">
              {imgInput && <img src={imgInput} alt="Input" />}
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-5">
            <h2>Matrix After Image Histogram Equalization</h2>
            <HistogramChart
              data={roundedTableImg1.matrixEqualization} // Use cdf data for the chart
              label="Frequency"
              color="green"
            />
            <p>
              baris : {roundedTableImg1?.baris} | kolom :{" "}
              {roundedTableImg1?.kolom}
            </p>
          </div>
        </div>

        <div className="mb-16 w-full">
          <div>
            <input type="file" accept="image/*" onChange={handleImageUpload2} />
            <canvas ref={canvasRef2} style={{ display: "none" }} />
          </div>
          <div className="flex flex-col items-center gap-5">
            <p className="text-center">Image Specification</p>
            <div className=" overflow-scroll max-h-[50vh]">
              {imgSpecification && (
                <img src={imgSpecification} alt="Specification" />
              )}
            </div>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-5">
            <h2>Matrix After Image Histogram Equalization</h2>
            <HistogramChart
              data={roundedTableImg2.matrixEqualization} // Use cdf data for the chart
              label="Frequency"
              color="blue"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HistogramPage;
