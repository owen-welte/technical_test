import React, { useState } from 'react';
import { StatusCodes } from 'http-status-codes';
import { toast } from "react-toastify";

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.warn("Merci de sélectionner un fichier JSON");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (response.status === StatusCodes.OK || response.status === StatusCodes.CREATED) {
        const data = await response.json();
        toast.success(data.message || "Fichier uploadé avec succès");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.error || "Erreur lors de l'upload du fichier");
      }
    } catch (error) {
      toast.error("Problème de connexion au serveur");
    }
  };

  const handleDeleteCalendar = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/delete-calendar/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (response.ok) {
            toast.success(data.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            toast.error(data.error);
        }
    } catch (error) {
        toast.error("Problème de connexion au serveur");
    }
};

<button className="button is-danger ml-3" onClick={handleDeleteCalendar}>
    Supprimer Emploi du Temps
</button>


  return (
    <div className="file-upload-container">
      <label className="button is-light">
        Choisir un fichier
        <input type="file" accept=".json" onChange={handleFileChange} hidden />
      </label>

      {file && <span className="ml-2">{file.name}</span>}

      <button className="button is-primary ml-3" onClick={handleFileUpload}>
        Upload
      </button>

      <button className="button is-danger ml-3" onClick={handleDeleteCalendar}>
        Supprimer
      </button>
    </div>
  );
}

export default FileUpload;
