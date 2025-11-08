// src/ventanas/App.jsx
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

const API_URL = "http://localhost:4004/api/security/gruposet/crud";
const DB_SERVER = "mongodb";
const LOGGED_USER = "LDPeraltaP";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const [form, setForm] = useState({
    sociedad: "",
    cedis: "",
    grupoEtiqueta: "",
    etiqueta: "",
    valor: "",
    estado: "Activo",
    info: "",
    id: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        API_URL,
        {},
        { params: { ProcessType: "GetAll", DBServer: DB_SERVER, LoggedUser: LOGGED_USER } }
      );

      const records =
        res?.data?.data?.[0]?.dataRes?.map((item) => ({
          sociedad: item.IDSOCIEDAD,
          sucursal: item.IDCEDI,
          etiqueta: item.IDETIQUETA,
          valor: item.IDVALOR,
          estado: item.ACTIVO ? "Activo" : "Inactivo",
          grupoEtiqueta: item.IDGRUPOET,
          id: item.ID,
          info: item.INFOAD || "",
          borrado: !!item.BORRADO
        })) || [];

      // No ocultamos por BORRADO; DeleteHard sí lo elimina y ya no viene
      setData(records);
    } catch (e) {
      console.error("GetAll error:", e?.response?.data || e.message);
      alert("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { Header: "Sociedad", accessor: "sociedad" },
    { Header: "Sucursal (CEDIS)", accessor: "sucursal" },
    { Header: "Etiqueta", accessor: "etiqueta" },
    { Header: "Valor", accessor: "valor" },
    { Header: "Estado", accessor: "estado" }
  ];

  const handleEditarClick = () => {
    if (!selectedRow) { alert("Selecciona una fila primero"); return; }
    setForm({
      sociedad: String(selectedRow.sociedad ?? ""),
      cedis: String(selectedRow.sucursal ?? ""),
      grupoEtiqueta: String(selectedRow.grupoEtiqueta ?? selectedRow.etiqueta ?? ""),
      etiqueta: String(selectedRow.etiqueta ?? ""),
      valor: String(selectedRow.valor ?? ""),
      estado: selectedRow.estado === true ? "Activo"
            : selectedRow.estado === false ? "Inactivo"
            : (selectedRow.estado || "Activo"),
      info: String(selectedRow.info ?? ""),
      id: String(selectedRow.id ?? "")
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const setActivo = async (value) => {
    if (!selectedRow) { alert("Selecciona una fila primero"); return; }
    try {
      const payload = {
        IDSOCIEDAD: Number(selectedRow.sociedad),
        IDCEDI: Number(selectedRow.sucursal),
        IDETIQUETA: selectedRow.etiqueta,
        IDVALOR: selectedRow.valor,
        IDGRUPOET: selectedRow.grupoEtiqueta,
        ID: selectedRow.id,
        data: { ACTIVO: !!value }
      };
      await axios.post(
        API_URL,
        payload,
        { params: { ProcessType: "UpdateOne", DBServer: DB_SERVER, LoggedUser: LOGGED_USER } }
      );
      await fetchData();
    } catch (err) {
      console.error("setActivo error:", err?.response?.data || err.message);
      alert("No se pudo cambiar el estado.");
    }
  };

  const handleEliminarFisico = async () => {
    if (!selectedRow) { alert("Selecciona una fila primero"); return; }
    if (!confirm("¿Eliminar definitivamente este registro?")) return;
    try {
      const payload = {
        IDSOCIEDAD: Number(selectedRow.sociedad),
        IDCEDI: Number(selectedRow.sucursal),
        IDETIQUETA: selectedRow.etiqueta,
        IDVALOR: selectedRow.valor,
        IDGRUPOET: selectedRow.grupoEtiqueta,
        ID: selectedRow.id
      };
      await axios.post(
        API_URL,
        payload,
        { params: { ProcessType: "DeleteHard", DBServer: DB_SERVER, LoggedUser: LOGGED_USER } }
      );
      setSelectedRow(null);
      await fetchData();
    } catch (err) {
      console.error("DeleteHard error:", err?.response?.data || err.message);
      alert("No se pudo eliminar definitivamente.");
    }
  };

  //aqui inicia el post
  const handleGuardar = async () => {
    try {
      const payload = {
        IDSOCIEDAD: Number(form.sociedad),
        IDCEDI: Number(form.cedis),
        IDETIQUETA: form.etiqueta,
        IDVALOR: form.valor,
        IDGRUPOET: form.grupoEtiqueta,
        ID: form.id || selectedRow?.id || "",
        data: {
          INFOAD: form.info || "",
          ACTIVO: form.estado === "Activo"
        }
      };
      await axios.post(
        API_URL,
        payload,
        { params: { ProcessType: "UpdateOne", DBServer: DB_SERVER, LoggedUser: LOGGED_USER } }
      );
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("UpdateOne error:", err?.response?.data || err.message);
      alert("No se pudo actualizar.");
    }
  };

  return (
    <>
      <ShellBar primaryTitle="CINNALOVERS" />
      <div className="container-principal">
        <h2 className="titulo">Grupos y subgrupos de SKU</h2>

        <div className="barra-controles">
          <Button className="btn-crear" icon="add" disabled>Crear</Button>
          <Button className="btn-editar" icon="edit" onClick={handleEditarClick}>Editar</Button>
          <Button className="btn-eliminar" icon="delete" onClick={handleEliminarFisico}>Eliminar</Button>
          <Button className="btn-desactivar" icon="decline" onClick={() => setActivo(false)}>Desactivar</Button>
          <Button className="btn-activar" icon="accept" onClick={() => setActivo(true)}>Activar</Button>
          <div className="search-bar">
            <Input placeholder="Buscar..." icon="search" className="search-input" />
          </div>
        </div>

        <div className="tabla-fondo" style={{ cursor: "pointer" }}>
          {loading ? (
            <p className="loading-msg">Cargando datos...</p>
          ) : (
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
              onRowClick={(ev) => {
                const r = ev?.row?.original ?? ev?.detail?.row?.original ?? null;
                if (r) setSelectedRow(r);
              }}
              // sombrear fila inactiva
              getRowProps={(row) => {
                const inactive = row?.original?.estado === "Inactivo";
                return {
                  style: inactive
                    ? { background: "#2a2a2a", opacity: 0.75 }
                    : {}
                };
              }}
            />
          )}
        </div>
      </div>

      <Dialog
        open={isModalOpen}
        onAfterClose={handleCloseModal}
        headerText="Agregar/Editar SKU"
        footer={
          <Bar
            endContent={
              <>
                <Button design="Transparent" onClick={handleCloseModal}>Cancelar</Button>
                <Button design="Emphasized" icon="add" onClick={handleGuardar}>Guardar</Button>
              </>
            }
          />
        }
        className="modal-sku"
      >
        <div className="modal-content">
          <FlexBox direction="Row" wrap="Wrap" className="modal-form-fields">
            <div className="modal-field">
              <Label required>Sociedad</Label>
              <ComboBox
                className="modal-combobox"
                value={form.sociedad}
                onChange={(e) => setForm(f => ({ ...f, sociedad: e.detail?.value ?? "" }))}
              >
                <ComboBoxItem text="1005" />
                <ComboBoxItem text="114" />
                <ComboBoxItem text="1555" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Sucursal (CEDIS)</Label>
              <ComboBox
                className="modal-combobox"
                value={form.cedis}
                onChange={(e) => setForm(f => ({ ...f, cedis: e.detail?.value ?? "" }))}
              >
                <ComboBoxItem text="1006" />
                <ComboBoxItem text="113" />
                <ComboBoxItem text="1005" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Grupo Etiqueta</Label>
              <ComboBox
                className="modal-combobox modal-combobox-wide"
                value={form.grupoEtiqueta}
                onChange={(e) => setForm(f => ({ ...f, grupoEtiqueta: e.detail?.value ?? "" }))}
              >
                <ComboBoxItem text="ZLABELS_1" />
                <ComboBoxItem text="ZLABELS_2" />
                <ComboBoxItem text="ZLABELS_3" />
                <ComboBoxItem text="idGruposEtiquetasPau" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Etiqueta</Label>
              <ComboBox
                className="modal-combobox"
                value={form.etiqueta}
                onChange={(e) => setForm(f => ({ ...f, etiqueta: e.detail?.value ?? "" }))}
              >
                <ComboBoxItem text="ETIQUETA JESUS" />
                <ComboBoxItem text="ETIQUETA JESUS3" />
                <ComboBoxItem text="IdGruposConteoSku" />
                <ComboBoxItem text="IDAzureJ" />
              </ComboBox>
            </div>

            <div className="modal-field">
              <Label required>Valor</Label>
              <Input
                className="modal-combobox"
                value={form.valor}
                onInput={(e) => setForm(f => ({ ...f, valor: e.target?.value ?? "" }))}
                placeholder="Valor..."
              />
            </div>

            <div className="modal-field">
              <Label required>Estado</Label>
              <ComboBox
                className="modal-combobox"
                value={form.estado}
                onChange={(e) => setForm(f => ({ ...f, estado: e.detail?.value ?? "" }))}
              >
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
              value={form.info}
              onInput={(e) => setForm(f => ({ ...f, info: e.target?.value ?? "" }))}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}