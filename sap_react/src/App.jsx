import React from "react";
import {
  ShellBar,
  Button,
  Input,
  AnalyticalTable
} from "@ui5/webcomponents-react";

export default function App() {
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

  return (
    <>
      <ShellBar primaryTitle="CINNALOVERS" />

      <div
        style={{
          padding: "2rem",
          backgroundColor: "#121212",
          color: "white",
          minHeight: "100vh"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "0.5rem"
          }}
        >
          <Button design="Positive" icon="add">Crear</Button>
          <Button design="Emphasized" icon="edit">Editar</Button>
          <Button design="Negative" icon="delete">Eliminar</Button>
          <Button design="Attention" icon="decline">Desactivar</Button>
          <Button design="Success" icon="accept">Activar</Button>
          <Input
            placeholder="Hinted search text"
            icon="search"
            style={{ marginLeft: "auto", width: "300px" }}
          />
        </div>

        <AnalyticalTable
          data={data}
          columns={columns}
          style={{ width: "100%", backgroundColor: "white" }}
        />
      </div>
    </>
  );
}
