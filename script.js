//Getting the cod. without empty spaces
const barCode = document.getElementById("barCode");
const results = document.getElementById("results");
const copied = document.getElementById("copied");

function generator() {
  if (barCode.value) {
    let newCode = barCode.value;
    newCode = newCode.replaceAll(" ", "");
    results.textContent = newCode;
    results.style = "color:white";
    barCode.value = "";
  }
}

function clearR() {
  console.log("d");
  results.textContent = "";
  copied.textContent = "";
}

//coping the cod. information
function copy() {
  const textCod = results.textContent;
  navigator.clipboard.writeText(textCod);
  copied.textContent = "copiado";
}

//Creating a CSV file by uploading a .xml file
document
  .getElementById("processButton")
  .addEventListener("click", function processFiles() {
    const fileInput = document.getElementById("xmlInput");
    const files = fileInput.files;
    let i = 0;

    if (files.length === 0) {
      alert("Selecione pelo menos um arquivo XML.");
      return;
    }

    // Array to stock all the data
    const allData = [];

    // Processing each file
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const xmlText = event.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Extrating all the information necessary from XML file
        const notas = xmlDoc.getElementsByTagName("NFe");
        Array.from(notas).forEach((nota) => {
          const infNFe = xmlDoc.getElementsByTagName("infNFe")[0];
          let chaveAcesso = infNFe.getAttribute("Id").replace("NFe", "");
          chaveAcesso = chaveAcesso + "'";
          const codClient = document.getElementById("cod").value;
          let nf = nota.getElementsByTagName("cNF")[0]?.textContent;
          let valor = nota.getElementsByTagName("vNF")[0]?.textContent;
          let peso = nota.getElementsByTagName("pesoB")[0]?.textContent;

          let nameD = "";
          let CNPJ = "";
          let serie = nota.getElementsByTagName("serie")[0]?.textContent;
          let subSerie = "";
          let emissao = nota.getElementsByTagName("dEmi")[0]?.textContent;
          let vSeguro = valor;
          let qVol = nota.getElementsByTagName("qVol")[0].textContent;
          let desc = "DIVERSOS";
          let pCub = "";
          i += 1;

          // adding the data to the array
          allData.push({
            nota: i,
            codClient,
            nameD,
            CNPJ,
            nf,
            serie,
            subSerie,
            emissao,
            valor,
            vSeguro,
            peso,
            qVol,
            desc,
            pCub,
            chaveAcesso,
          });
        });

        // Avaliating if the looping have finished to create the csv file
        if (index === files.length - 1) {
          saveDataToCSV(allData);
        }
      };

      reader.readAsText(file);
    });
  });

//Extracting the information to file .csv
function saveDataToCSV(data) {
  const csv = Papa.unparse(data, {
    header: true, // Including a head to the file
  });

  // Creating the file e automatic downloading it
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dados_processados.csv";
  link.click();
}
