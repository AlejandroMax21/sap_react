import React, { useState } from "react";
import "./css/App.css";
import "./css/Modal.css";
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

  const data = [
    { sociedad: "A001", sucursal: "CDIS-01", etiqueta: "SKU-01", estado: "Activo" },
    { sociedad: "A002", sucursal: "CDIS-02", etiqueta: "SKU-02", estado: "Inactivo" },
    { sociedad: "A003", sucursal: "CDIS-03", etiqueta: "SKU-03", estado: "Activo" }
  ];

  const columns = [
    { Header: "Sociedad", accessor: "sociedad" },
    { Header: "Sucursal (CEDIS)", accessor: "sucursal" },
    { Header: "Etiqueta", accessor: "etiqueta" },
    { Header: "Estado", accessor: "estado" }
  ];

  const handleCrearClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGuardar = () => {
    // Aquí puedes agregar la lógica para guardar
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
            <Input
              placeholder="Hinted search text"
              icon="search"
              className="search-input"
            />
          </div>
        </div>

        <div className="tabla-fondo">
          <AnalyticalTable
            data={data}
            columns={columns}
            style={{
              width: "100%",
              backgroundColor: "#1e1e1e",
              color: "white",
              borderRadius: "8px"
            }}
          />
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
            {/* Sociedad */}
            <div className="modal-field">
              <Label required>Sociedad</Label>
              <ComboBox className="modal-combobox">
                <ComboBoxItem text="S001" />
                <ComboBoxItem text="S002" />
                <ComboBoxItem text="S003" />
              </ComboBox>
            </div>

            {/* Sucursal */}
            <div className="modal-field">
              <Label required>Sucursal (CEDIS)</Label>
              <ComboBox className="modal-combobox">
                <ComboBoxItem text="CDMX" />
                <ComboBoxItem text="Guadalajara" />
                <ComboBoxItem text="Monterrey" />
              </ComboBox>
            </div>

            {/* Grupo Etiqueta */}
            <div className="modal-field">
              <Label required>Grupo Etiqueta</Label>
              <ComboBox className="modal-combobox modal-combobox-wide">
                <ComboBoxItem text="ZLABELS_1" />
                <ComboBoxItem text="ZLABELS_2" />
                <ComboBoxItem text="ZLABELS_3" />
                <ComboBoxItem text="ZLABELS_4" />
              </ComboBox>
            </div>

            {/* Etiqueta */}
            <div className="modal-field">
              <Label required>Etiqueta</Label>
              <ComboBox className="modal-combobox">
                <ComboBoxItem text="Filtro1" />
                <ComboBoxItem text="Filtro2" />
              </ComboBox>
            </div>

            {/* Valor */}
            <div className="modal-field">
              <Label required>Valor</Label>
              <ComboBox className="modal-combobox">
                <ComboBoxItem text="Activo" />
                <ComboBoxItem text="Inactivo" />
              </ComboBox>
            </div>
          </FlexBox>

          {/* Información adicional */}
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