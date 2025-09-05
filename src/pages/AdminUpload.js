import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  MenuItem,
  Select,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const courseOptions = ["bcom", "bscit", "bvoc sd", "bms"];
const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
const statusOptions = ["Available", "In Shelf", "Demolished"];

const formFieldsMap = {
  "question-papers": [
    { name: "year", label: "Year" },
    { name: "course", label: "Course", type: "dropdown", options: courseOptions },
    { name: "semester", label: "Semester", type: "dropdown", options: semesterOptions },
    { name: "subject", label: "Subject" },
    { name: "link", label: "Link (Optional)" },
    { name: "status", label: "Status", type: "dropdown", options: statusOptions },
  ],
  "research-papers": [
    { name: "title", label: "Title" },
    { name: "author", label: "Author" },
    { name: "abstract", label: "Abstract" },
    { name: "link", label: "PDF Link" },
    { name: "status", label: "Status", type: "dropdown", options: statusOptions },
  ],
  syllabus: [
    { name: "course", label: "Course", type: "dropdown", options: courseOptions },
    { name: "semester", label: "Semester", type: "dropdown", options: semesterOptions },
    { name: "link", label: "Syllabus Link (or type status)" },
  ],
};

const SCOPES = "https://www.googleapis.com/auth/drive";

const AdminUpload = () => {
  const [resourceType, setResourceType] = useState("");
  const [formData, setFormData] = useState({});
  const [accessionNumber, setAccessionNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [tokenClient, setTokenClient] = useState(null);
  const [gisInitialized, setGisInitialized] = useState(false);
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const fetchAccessionNumber = async (selectedType) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/accession/${selectedType}/next-accession`);
      setAccessionNumber(res.data.accessionNumber);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to fetch accession number");
      setAccessionNumber("");
    }
  };

  const handleTypeChange = async (event) => {
    const selectedType = event.target.value;
    setResourceType(selectedType);
    setFormData({});
    setSuccessMessage("");
    setErrorMessage("");
    await fetchAccessionNumber(selectedType);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resourceType) return setErrorMessage("Please select a resource type!");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BACKEND_URL}/api/admin/resources/${resourceType}`,
        { ...formData, accessionNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(`✅ Uploaded successfully with Accession No: ${res.data.accessionNumber || accessionNumber}`);
      setFormData({});
      await fetchAccessionNumber(resourceType);
      setErrorMessage("");
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMessage("Upload failed");
    }
  };

  useEffect(() => {
    const gisScript = document.createElement("script");
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.async = true;
    gisScript.onload = () => setGisInitialized(true);
    document.body.appendChild(gisScript);

    const pickerScript = document.createElement("script");
    pickerScript.src = "https://apis.google.com/js/api.js";
    pickerScript.async = true;
    pickerScript.onload = () => {
      window.gapi.load("picker", () => setPickerApiLoaded(true));
    };
    document.body.appendChild(pickerScript);
  }, []);

  useEffect(() => {
    if (gisInitialized && !tokenClient && GOOGLE_CLIENT_ID) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            console.error("Token error", tokenResponse);
            setErrorMessage("Failed to get access token.");
            return;
          }
          setAccessToken(tokenResponse.access_token);
          createPicker(tokenResponse.access_token);
        },
      });
      setTokenClient(client);
    }
  }, [gisInitialized, tokenClient]);

  const createPicker = async (token) => {
    if (!pickerApiLoaded || !token) {
      setErrorMessage("Google Picker API or token not ready");
      return;
    }

    try {
      const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false)
        .setMimeTypes(
          "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
        );

      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(token)
        .setDeveloperKey(GOOGLE_API_KEY)
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    } catch (err) {
      console.error("createPicker error:", err);
      setErrorMessage("Failed to open Google Picker.");
    }
  };

  // <-- Updated pickerCallback with gapi.client.load("drive", "v3") fix -->
  const pickerCallback = async (data) => {
    if (data.action !== window.google.picker.Action.PICKED) return;

    const doc = data.docs[0];
    const fileId = doc.id;

    try {
      // Load Drive API client before using it
      await window.gapi.client.load("drive", "v3");

      // Set permission to "anyone with the link"
      await window.gapi.client.drive.permissions.create({
        fileId,
        resource: { role: "reader", type: "anyone" },
      });
    } catch (permErr) {
      console.warn("Permission set warning:", permErr);
    }

    try {
      // Get file details including webViewLink
      const fileRes = await window.gapi.client.drive.files.get({
        fileId,
        fields: "id,name,mimeType,webViewLink",
      });
      const webViewLink = fileRes.result.webViewLink || `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

      setFormData((prev) => ({
        ...prev,
        link: webViewLink,
        title: prev.title || doc.name,
      }));

      setSuccessMessage("Link fetched from Google Drive and filled into the form.");
      setErrorMessage("");
    } catch (err) {
      console.error("pickerCallback error:", err);
      setErrorMessage("Failed to fetch file link from Google Drive.");
    }
  };

  const openGooglePicker = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!tokenClient) {
      setErrorMessage("Google token client not initialized yet. Try again.");
      return;
    }
    if (accessToken) {
      createPicker(accessToken);
    } else {
      tokenClient.requestAccessToken();
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom mt={4}>
        Upload Resource
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Resource Type</InputLabel>
        <Select value={resourceType} onChange={handleTypeChange} label="Type">
          {Object.keys(formFieldsMap).map((type) => (
            <MenuItem key={type} value={type}>
              {type.replace("-", " ").toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {resourceType && (
        <Box component="form" onSubmit={handleSubmit} mt={2}>
          {accessionNumber && (
            <TextField
              label="Accession Number"
              value={accessionNumber}
              name="accessionNumber"
              fullWidth
              margin="normal"
              disabled
            />
          )}

          {/* Google Drive Picker Button */}
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={openGooglePicker}
          >
            Pick / Upload to Google Drive
          </Button>

          {/* Show the link field (auto-filled after picker) */}
          <TextField
            label="Link"
            name="link"
            fullWidth
            margin="normal"
            value={formData.link || ""}
            onChange={handleChange}
            helperText="This will be auto-filled after picking a Drive file. You can also paste a link manually."
          />

          {/* render other fields */}
          {formFieldsMap[resourceType].map((field) =>
            field.name === "link" ? null : field.type === "dropdown" ? (
              <FormControl fullWidth margin="normal" key={field.name}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name] || ""}
                  label={field.label}
                  onChange={handleChange}
                  required
                >
                  {field.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                fullWidth
                margin="normal"
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.name !== "link"}
              />
            )
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Save Resource
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default AdminUpload;
