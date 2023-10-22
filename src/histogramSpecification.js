function performHistogramSpecification(sourceImage, targetImage, L) {
  const data1 = sourceImage?.sk; // k=> 0 , sk = 1 | 
  const data2 = targetImage?.skDanNewNk; // sn=> 0 , frekuensi = 109 | 
  const result = data1.map((sk, i) => (data2[sk]));

  return result;
}

export { performHistogramSpecification };
