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
  FlexBox,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  Switch
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/menu.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/settings.js";
import "@ui5/webcomponents-icons/dist/database.js";

export default function App() {
  // --- Estados originales ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Estados añadidos del menú ---
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [dbConnection, setDbConnection] = useState("MongoDB");
  const [dbPost, setDbPost] = useState("MongoDB");

  // 🆕 Estados para el formulario del modal
  const [sociedad, setSociedad] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [idValor, setIdValor] = useState("");
  const [infoAdicional, setInfoAdicional] = useState("");

  // --- Cambio de conexión ---
  const handleSwitchChange = () => {
    setDbConnection(dbConnection === "MongoDB" ? "Azure" : "MongoDB");
  };
  const CambioDbPost = () => {
    setDbPost(dbPost === "MongoDB" ? "Azure" : "MongoDB");
  };

  // 🔹 Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `http://localhost:4004/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`,
          {}
        );

        const records =
          res.data?.data?.[0]?.dataRes?.map((item) => ({
            sociedad: item.IDSOCIEDAD,
            sucursal: item.IDCEDI,
            etiqueta: item.IDETIQUETA,
            valor: item.IDVALOR,
            idgroup: item.IDGRUPOET,
            idg: item.ID,
            info: item.INFOAD,
            fecha: item.FECHAREG,
            hora: item.HORAREG,
            estado: item.ACTIVO ? "Activo" : "Inactivo",
          })) || [];

        setData(records);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dbConnection]);

  const columns = [
    { Header: "Sociedad", accessor: "sociedad" },
    { Header: "Sucursal (CEDIS)", accessor: "sucursal" },
    { Header: "Etiqueta", accessor: "etiqueta" },
    { Header: "Valor", accessor: "valor" },
    { Header: "IDGRUPOET", accessor: "idgroup" },
    { Header: "ID", accessor: "idg" },
    { Header: "Informacion", accessor: "info" },
    { Header: "Fecha", accessor: "fecha" },
    { Header: "Hora", accessor: "hora" },
    { Header: "Estado", accessor: "estado" },
  ];

  const handleCrearClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleGuardar = async () => {
    try {
      // 🆕 Ahora usa los valores que el usuario seleccionó
      const nuevoRegistro = {
        IDSOCIEDAD: sociedad,
        IDCEDI: sucursal,
        IDETIQUETA: etiqueta,
        IDVALOR: idValor,
        INFOAD: infoAdicional,
        ACTIVO: true,
      };

      const url = `http://localhost:4004/api/security/gruposet/crud?ProcessType=Create&DBServer=${dbPost}`;

      console.log("📤 Enviando POST a:", url);
      console.log("📦 Datos:", nuevoRegistro);

      const res = await axios.post(url, nuevoRegistro);

      if (res.data.success) {
        alert(`✅ Registro creado correctamente en ${dbPost}`);

        // 🆕 Recargar los datos después de crear
        const resFetch = await axios.post(
          `http://localhost:4004/api/security/gruposet/crud?ProcessType=GetAll&DBServer=${dbConnection}`,
          {}
        );
        const records =
          resFetch.data?.data?.[0]?.dataRes?.map((item) => ({
            sociedad: item.IDSOCIEDAD,
            sucursal: item.IDCEDI,
            etiqueta: item.IDETIQUETA,
            valor: item.IDVALOR,
            idgroup: item.IDGRUPOET,
            idg: item.ID,
            info: item.INFOAD,
            fecha: item.FECHAREG,
            hora: item.HORAREG,
            estado: item.ACTIVO ? "Activo" : "Inactivo",
          })) || [];
        setData(records);
      } else {
        alert(`⚠️ Error al crear el registro en ${dbPost}`);
      }

      setIsModalOpen(false);

      // 🆕 Limpiar el formulario
      setSociedad("");
      setSucursal("");
      setEtiqueta("");
      setIdValor("");
      setInfoAdicional("");

    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert("Error al guardar el registro: " + error.message);
    }
  };

  console.log("Registros cargados:", data.length, data);

  return (
    <>
      {/* 🔹 ShellBar con menú hamburguesa */}
      <ShellBar
        primaryTitle="CINNALOVERS"
        startButton={
          <Button
            icon="menu"
            design="Transparent"
            onClick={() => setIsNavOpen(!isNavOpen)}
          />
        }
        showNotifications
        showCoPilot
        showProductSwitch
      />

      {/* 🔹 Menú lateral (SideNavigation) */}
      {isNavOpen && (
        <SideNavigation
          style={{
            width: "250px",
            height: "100vh",
            position: "fixed",
            top: "45px",
            left: 0,
            backgroundColor: "#f7f7f7",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <SideNavigationItem icon="home" text="Inicio" />
          <SideNavigationItem
            icon="database"
            text="Grupos de SKU"
            selected
          />
          <SideNavigationItem
            icon="settings"
            text="Configuración"
            onClick={() => setShowConfig(true)}
          />
        </SideNavigation>
      )}

      {/* 🔹 Contenido original sin modificar */}
      <div
        className="container-principal"
        style={{
          marginLeft: isNavOpen ? "260px" : "0",
          transition: "margin-left 0.3s ease",
        }}
      >
        <h2 className="titulo">Grupos y subgrupos de SKU</h2>

        <div className="barra-controles">
          <Button className="btn-crear" icon="add" onClick={handleCrearClick}>
            Crear
          </Button>
          <Button className="btn-editar" icon="edit">
            Editar
          </Button>
          <Button className="btn-eliminar" icon="delete">
            Eliminar
          </Button>
          <Button className="btn-desactivar" icon="decline">
            Desactivar
          </Button>
          <Button className="btn-activar" icon="accept">
            Activar
          </Button>
          <div className="search-bar">
            <Input
              placeholder="Buscar..."
              icon="search"
              className="search-input"
            />
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
                height: "auto",
                backgroundColor: "#1e1e1e",
                color: "white",
                borderRadius: "8px",
                maxHeight: "600px",
                overflowY: "auto",
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
              <ComboBox
                className="modal-combobox"
                onChange={(e) => setSociedad(e.detail.item.text)}
              >
                <ComboBoxItem text="S001" />
                <ComboBoxItem text="S002" />
                <ComboBoxItem text="S003" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Sucursal (CEDIS)</Label>
              <ComboBox
                className="modal-combobox"
                onChange={(e) => setSucursal(e.detail.item.text)}
              >
                <ComboBoxItem text="CDMX" />
                <ComboBoxItem text="Guadalajara" />
                <ComboBoxItem text="Monterrey" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Etiqueta</Label>
              <ComboBox
                className="modal-combobox"
                onChange={(e) => setEtiqueta(e.detail.item.text)}
              >
                <ComboBoxItem text="Filtro1" />
                <ComboBoxItem text="Filtro2" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>IDValor</Label>
              <ComboBox
                className="modal-combobox"
                onChange={(e) => setIdValor(e.detail.item.text)}
              >
                <ComboBoxItem text="idValor_01" />
                <ComboBoxItem text="idValor_02" />
                <ComboBoxItem text="idValor_03" />
              </ComboBox>
            </div>

            <div className="switch_etiqueta">
              <Label>{dbPost}</Label>
              <Switch
                textOn="Cosmos "
                textOff="MongoDB"
                checked={dbPost === "Azure Cosmos"}
                onChange={CambioDbPost}
              />
            </div>
          </FlexBox>

          <div className="modal-textarea-container">
            <Label>Información adicional</Label>
            <TextArea
              placeholder="Escriba información adicional..."
              className="modal-textarea"
              onChange={(e) => setInfoAdicional(e.detail.value)}
            />
          </div>
        </div>
      </Dialog>

      {/* 🔹 Ventana de configuración (nueva) */}
      {showConfig && (
        <Dialog
          headerText="Configuración"
          open={showConfig}
          onAfterClose={() => setShowConfig(false)}
          footer={
            <Button design="Emphasized" onClick={() => setShowConfig(false)}>
              Cerrar
            </Button>
          }
        >
          <FlexBox direction="Column" style={{ padding: "1rem" }}>
            <Label>Conexión a base de datos</Label>
            <FlexBox alignItems="Center" justifyContent="SpaceBetween">
              <Label>{dbConnection}</Label>
              <Switch
                textOn="Cosmos"
                textOff="MongoDB"
                checked={dbConnection === "Azure Cosmos"}
                onChange={handleSwitchChange}
              />
            </FlexBox>
          </FlexBox>
        </Dialog>
      )}
    </>
  );
}
