const analyzeLeaf = async () => {

  if (!image) {
    alert("Please upload an image first");
    return;
  }

  const formData = new FormData();
  formData.append("file", image);

  try {

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error("Error:", error);
  }
};