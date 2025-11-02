import React, { useEffect, useState } from "react";
import "./css/App.css";
import "./css/Modal.css";
import axios from "axios";
import {
  ShellBar,
  Button,
  Input,
  AnalyticalTable,
  Dialog,
  Bar,
  Label,
  ComboBox,
  ComboBoxItem,
  TextArea,
  FlexBox
} from "@ui5/webcomponents-react";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "http://localhost:4004/api/security/gruposet/crud?ProcessType=GetAll&DBServer=azure",
          {}
        );

        // 🔹 Filtrar solo los campos útiles del backend
        const records =
          res.data?.data?.[0]?.dataRes?.map((item) => ({
            sociedad: item.IDSOCIEDAD,
            sucursal: item.IDCEDI,
            etiqueta: item.IDETIQUETA,
            valor: item.IDVALOR,
            estado: item.ACTIVO ? "Activo" : "Inactivo"
          })) || [];

        setData(records);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

const columns = [
    { 
      Header: "Sociedad", 
      accessor: "sociedad",
      headerStyle: { backgroundColor: '#2c3e50', color: '#ffffff' }
    },
    { 
      Header: "Sucursal (CEDIS)", 
      accessor: "sucursal",
      headerStyle: { backgroundColor: '#2c3e50', color: '#ffffff' }
    },
    { 
      Header: "Etiqueta", 
      accessor: "etiqueta",
      headerStyle: { backgroundColor: '#2c3e50', color: '#ffffff' }
    },
    { 
      Header: "Valor", 
      accessor: "valor",
      headerStyle: { backgroundColor: '#2c3e50', color: '#ffffff' }
    },
    { 
      Header: "Estado", 
      accessor: "estado",
      headerStyle: { backgroundColor: '#2c3e50', color: '#ffffff' }
    }
  ];

  const handleCrearClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleGuardar = () => {
    console.log("Guardando...");
    setIsModalOpen(false);
  };

  return (
    <>
      <ShellBar primaryTitle="CINNALOVERS" />
      <div className="container-principal">
        <h2 className="titulo">Grupos y subgrupos de SKU</h2>

        <div className="barra-controles">
          <Button className="btn-crear" icon="add" onClick={handleCrearClick}>Crear</Button>
          <Button className="btn-editar" icon="edit">Editar</Button>
          <Button className="btn-eliminar" icon="delete">Eliminar</Button>
          <Button className="btn-desactivar" icon="decline">Desactivar</Button>
          <Button className="btn-activar" icon="accept">Activar</Button>
          <div className="search-bar">
            <Input placeholder="Buscar..." icon="search" className="search-input" />
          </div>
        </div>

        <div className="tabla-fondo">
          {loading ? (
            <p className="loading-msg">Cargando datos...</p>
          ) : data.length > 0 ? (
            <AnalyticalTable
              data={data}
              columns={columns}
              className="ui5-table-root"
              style={{
                width: "100%",
                backgroundColor: "#1e1e1e",
                color: "white",
                borderRadius: "8px"
              }}
            />
          ) : (
            <p className="no-data-msg">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onAfterClose={handleCloseModal}
        headerText="Agregar/Editar SKU"
        footer={
          <Bar
            endContent={
              <>
                <Button design="Transparent" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button
                  design="Emphasized"
                  icon="add"
                  onClick={handleGuardar}
                  className="btn-guardar-modal"
                >
                  Guardar
                </Button>
              </>
            }
          />
        }
        className="modal-sku"
      >
        <div className="modal-content">
          <FlexBox
            direction="Row"
            justifyContent="Start"
            wrap="Wrap"
            className="modal-form-fields"
          >
            <div className="modal-field">
              <Label required>Sociedad</Label>
              <ComboBox className="modal-combobox">
                <ComboBoxItem text="S001" />
                <ComboBoxItem text="S002" />
                <ComboBoxItem text="S003" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Sucursal (CEDIS)</Label>
              <ComboBox className="modal-combobox">
                <ComboBoxItem text="CDMX" />
                <ComboBoxItem text="Guadalajara" />
                <ComboBoxItem text="Monterrey" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Grupo Etiqueta</Label>
              <ComboBox className="modal-combobox modal-combobox-wide">
                <ComboBoxItem text="ZLABELS_1" />
                <ComboBoxItem text="ZLABELS_2" />
                <ComboBoxItem text="ZLABELS_3" />
                <ComboBoxItem text="ZLABELS_4" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Etiqueta</Label>
              <ComboBox className="modal-combobox">
                <ComboBoxItem text="Filtro1" />
                <ComboBoxItem text="Filtro2" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Valor</Label>
              <ComboBox className="modal-combobox">
                <ComboBoxItem text="Activo" />
                <ComboBoxItem text="Inactivo" />
              </ComboBox>
            </div>
          </FlexBox>

          <div className="modal-textarea-container">
            <Label>Información adicional</Label>
            <TextArea
              placeholder="Escriba información adicional..."
              className="modal-textarea"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
