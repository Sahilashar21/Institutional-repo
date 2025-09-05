import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Link as MuiLink,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { resourceFields } from "../config/resourceFieldConfig";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const courseOptions = ["bcom", "bscit", "bvoc sd", "bms"];
const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
const statusOptions = ["available", "in shelf", "demolished"];

const ResourceViewer = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fields = resourceFields[type] || [];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/resources/${type}`);
        const allResources = res.data.resources || [];

        setResources(allResources);
        setFilteredResources(allResources);

        // Initialize filter values
        const initialFilters = {};
        fields.forEach((field) => {
          initialFilters[field.name] = { value: "" };
        });

        setFilters(initialFilters);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to fetch resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [type]);

  const handleFilterChange = (fieldName, selectedValue) => {
    const updatedFilters = {
      ...filters,
      [fieldName]: { value: selectedValue },
    };

    setFilters(updatedFilters);

    const filtered = resources.filter((res) =>
      Object.entries(updatedFilters).every(([field, data]) =>
        data.value ? String(res[field]).toLowerCase().includes(String(data.value).toLowerCase()) : true
      )
    );

    setFilteredResources(filtered);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom mt={4}>
        Viewing: {type?.replace("-", " ").toUpperCase()}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Filters UI */}
      {!loading && !error && (
        <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
          {fields.map((field) => {
            const value = filters[field.name]?.value || "";

            // Dropdown fields
            if (["course", "semester", "status"].includes(field.name)) {
              const options =
                field.name === "course"
                  ? courseOptions
                  : field.name === "semester"
                  ? semesterOptions
                  : statusOptions;

              return (
                <FormControl key={field.name} size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={value}
                    label={field.label}
                    onChange={(e) => handleFilterChange(field.name, e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {options.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            }

            // Text input filters
            return (
              <FormControl key={field.name} size="small" sx={{ minWidth: 160 }}>
                <InputLabel shrink>{field.label}</InputLabel>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFilterChange(field.name, e.target.value)}
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "100%",
                  }}
                />
              </FormControl>
            );
          })}
        </Box>
      )}

      {!loading && !error && filteredResources.length === 0 && (
        <Typography mt={3}>No resources match the selected filters.</Typography>
      )}

      <Grid container spacing={2} mt={2}>
        {filteredResources.map((res) => (
          <Grid item xs={12} sm={6} md={4} key={res._id}>
            <Card
              variant="outlined"
              onClick={() => navigate(`/resources/${type}/${res._id}`)}
              sx={{
                cursor: "pointer",
                "&:hover": { boxShadow: 3, backgroundColor: "#f9f9f9" },
              }}
            >
              <CardContent>
                {fields.map((field) => {
                  const value = res[field.name];

                  if (field.name === "status") {
                    return (
                      <Chip
                        key={field.name}
                        label={value}
                        color={
                          value === "available"
                            ? "success"
                            : value === "in shelf"
                            ? "warning"
                            : value === "demolished"
                            ? "error"
                            : "default"
                        }
                        sx={{ mb: 1 }}
                      />
                    );
                  }

                  if (field.name === "link" && value) {
                    return (
                      <Typography key={field.name} variant="body2">
                        <strong>{field.label}:</strong>{" "}
                        <MuiLink
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open
                        </MuiLink>
                      </Typography>
                    );
                  }

                  return (
                    <Typography key={field.name} variant="body2">
                      <strong>{field.label}:</strong> {value || "N/A"}
                    </Typography>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResourceViewer;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Chip,
//   Link as MuiLink,
//   Grid,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import { resourceFields } from "../config/resourceFieldConfig";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// const ResourceViewer = () => {
//   const { type } = useParams();
//   const navigate = useNavigate();
//   const [resources, setResources] = useState([]);
//   const [filteredResources, setFilteredResources] = useState([]);
//   const [filters, setFilters] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fields = resourceFields[type] || [];

//   useEffect(() => {
//     const fetchResources = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/api/resources/${type}`);
//         const allResources = res.data.resources || [];

//         setResources(allResources);
//         setFilteredResources(allResources);

//         // Initialize filters with unique values
//         const initialFilters = {};
//         fields.forEach((field) => {
//           const values = [...new Set(allResources.map((r) => r[field.name]).filter(Boolean))];
//           initialFilters[field.name] = { value: "", options: values };
//         });

//         setFilters(initialFilters);
//       } catch (err) {
//         console.error("API error:", err);
//         setError("Failed to fetch resources.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResources();
//   }, [type]);

//   const handleFilterChange = (fieldName, selectedValue) => {
//     const updatedFilters = {
//       ...filters,
//       [fieldName]: { ...filters[fieldName], value: selectedValue },
//     };

//     setFilters(updatedFilters);

//     const filtered = resources.filter((res) =>
//       Object.entries(updatedFilters).every(([field, data]) =>
//         data.value ? res[field] === data.value : true
//       )
//     );

//     setFilteredResources(filtered);
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom mt={4}>
//         Viewing: {type?.replace("-", " ").toUpperCase()}
//       </Typography>

//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}

//       {/* Filters */}
//       {!loading && !error && (
//         <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
//           {Object.entries(filters).map(([fieldName, { value, options }]) => (
//             options.length > 1 && (
//               <FormControl key={fieldName} size="small" sx={{ minWidth: 160 }}>
//                 <InputLabel>{fieldName}</InputLabel>
//                 <Select
//                   value={value}
//                   label={fieldName}
//                   onChange={(e) => handleFilterChange(fieldName, e.target.value)}
//                 >
//                   <MenuItem value="">All</MenuItem>
//                   {options.map((opt) => (
//                     <MenuItem key={opt} value={opt}>
//                       {opt}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             )
//           ))}
//         </Box>
//       )}

//       {!loading && !error && filteredResources.length === 0 && (
//         <Typography mt={3}>No resources match the selected filters.</Typography>
//       )}

//       <Grid container spacing={2} mt={2}>
//         {filteredResources.map((res) => (
//           <Grid item xs={12} sm={6} md={4} key={res._id}>
//             <Card
//               variant="outlined"
//               onClick={() => navigate(`/resources/${type}/${res._id}`)}
//               sx={{
//                 cursor: "pointer",
//                 "&:hover": { boxShadow: 3, backgroundColor: "#f9f9f9" },
//               }}
//             >
//               <CardContent>
//                 {fields.map((field) => {
//                   const value = res[field.name];

//                   if (field.name === "status") {
//                     return (
//                       <Chip
//                         key={field.name}
//                         label={value}
//                         color={
//                           value === "available"
//                             ? "success"
//                             : value === "in shelf"
//                             ? "warning"
//                             : value === "demolished"
//                             ? "error"
//                             : "default"
//                         }
//                         sx={{ mb: 1 }}
//                       />
//                     );
//                   }

//                   if (field.name === "link" && value) {
//                     return (
//                       <Typography key={field.name} variant="body2">
//                         <strong>{field.label}:</strong>{" "}
//                         <MuiLink
//                           href={value}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           Open
//                         </MuiLink>
//                       </Typography>
//                     );
//                   }

//                   return (
//                     <Typography key={field.name} variant="body2">
//                       <strong>{field.label}:</strong> {value || "N/A"}
//                     </Typography>
//                   );
//                 })}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default ResourceViewer;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Chip,
//   Link as MuiLink,
//   Grid,
// } from "@mui/material";
// import { resourceFields } from "../config/resourceFieldConfig";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// const ResourceViewer = () => {
//   const { type } = useParams();
//   const navigate = useNavigate();
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fields = resourceFields[type] || [];

//   useEffect(() => {
//     const fetchResources = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/api/resources/${type}`);
//         setResources(res.data.resources || []);
//       } catch (err) {
//         console.error("API error:", err);
//         setError("Failed to fetch resources.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResources();
//   }, [type]);

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom mt={4}>
//         Viewing: {type?.replace("-", " ").toUpperCase()}
//       </Typography>

//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}

//       {!loading && !error && resources.length === 0 && (
//         <Typography>No resources found.</Typography>
//       )}

//       <Grid container spacing={2} mt={2}>
//         {resources.map((res) => (
//           <Grid item xs={12} sm={6} md={4} key={res._id}>
//             <Card
//               variant="outlined"
//               onClick={() => navigate(`/resources/${type}/${res._id}`)}
//               sx={{
//                 cursor: "pointer",
//                 "&:hover": { boxShadow: 3, backgroundColor: "#f9f9f9" },
//               }}
//             >
//               <CardContent>
//                 {fields.map((field) => {
//                   const value = res[field.name];

//                   if (field.name === "status") {
//                     return (
//                       <Chip
//                         key={field.name}
//                         label={value}
//                         color={
//                           value === "available"
//                             ? "success"
//                             : value === "in shelf"
//                             ? "warning"
//                             : value === "demolished"
//                             ? "error"
//                             : "default"
//                         }
//                         sx={{ mb: 1 }}
//                       />
//                     );
//                   }

//                   if (field.name === "link" && value) {
//                     return (
//                       <Typography key={field.name} variant="body2">
//                         <strong>{field.label}:</strong>{" "}
//                         <MuiLink
//                           href={value}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           onClick={(e) => e.stopPropagation()} // Prevent card click navigation
//                         >
//                           Open
//                         </MuiLink>
//                       </Typography>
//                     );
//                   }

//                   return (
//                     <Typography key={field.name} variant="body2">
//                       <strong>{field.label}:</strong> {value || "N/A"}
//                     </Typography>
//                   );
//                 })}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default ResourceViewer;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Chip,
//   Link as MuiLink,
//   Grid,
// } from "@mui/material";
// import { resourceFields } from "../config/resourceFieldConfig";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// const ResourceViewer = () => {
//   const { type } = useParams();
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fields = resourceFields[type] || [];

//   useEffect(() => {
//     const fetchResources = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/api/resources/${type}`);
//         setResources(res.data.resources || []);
//       } catch (err) {
//         console.error("API error:", err);
//         setError("Failed to fetch resources.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResources();
//   }, [type]);

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom mt={4}>
//         Viewing: {type?.replace("-", " ").toUpperCase()}
//       </Typography>

//       {loading && <CircularProgress />}
//       {error && <Alert severity="error">{error}</Alert>}

//       {!loading && !error && resources.length === 0 && (
//         <Typography>No resources found.</Typography>
//       )}

//       <Grid container spacing={2} mt={2}>
//         {resources.map((res, idx) => (
//           <Grid item xs={12} sm={6} md={4} key={idx}>
//             <Card variant="outlined">
//               <CardContent>
//                 {fields.map((field) => {
//                   const value = res[field.name];
//                   if (field.name === "status") {
//                     return (
//                       <Chip
//                         key={field.name}
//                         label={value}
//                         color={
//                           value === "available"
//                             ? "success"
//                             : value === "in shelf"
//                             ? "warning"
//                             : value === "demolished"
//                             ? "error"
//                             : "default"
//                         }
//                         sx={{ mb: 1 }}
//                       />
//                     );
//                   }

//                   if (field.name === "link" && value) {
//                     return (
//                       <Typography key={field.name} variant="body2">
//                         <strong>{field.label}:</strong>{" "}
//                         <MuiLink href={value} target="_blank" rel="noopener">
//                           Open
//                         </MuiLink>
//                       </Typography>
//                     );
//                   }

//                   return (
//                     <Typography key={field.name} variant="body2">
//                       <strong>{field.label}:</strong> {value || "N/A"}
//                     </Typography>
//                   );
//                 })}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default ResourceViewer;

// // import React, { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import {
// //   Container,
// //   Typography,
// //   CircularProgress,
// //   Alert,
// //   Grid,
// //   Card,
// //   CardContent,
// //   Chip,
// //   Button,
// // } from '@mui/material';

// // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// // const ResourceViewer = () => {
// //   const { type } = useParams();
// //   const [resources, setResources] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     const fetchResources = async () => {
// //       try {
// //         const res = await axios.get(`${BACKEND_URL}/api/resources/${type}`);
// //         setResources(res.data.resources || []);
// //       } catch (err) {
// //         console.error('API error:', err);
// //         setError('Failed to fetch resources.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchResources();
// //   }, [type]);

// //   const renderStatusChip = (status) => {
// //     let color = 'default';
// //     if (status === 'available') color = 'success';
// //     else if (status === 'inshelf') color = 'warning';
// //     else if (status === 'demolished') color = 'error';

// //     return <Chip label={status} color={color} sx={{ mt: 1 }} />;
// //   };

// //   return (
// //     <Container>
// //       <Typography variant="h4" gutterBottom mt={3}>
// //         Viewing: {type?.replace('-', ' ').toUpperCase()}
// //       </Typography>

// //       {loading && <CircularProgress />}

// //       {error && <Alert severity="error">{error}</Alert>}

// //       {!loading && !error && (
// //         <Grid container spacing={2}>
// //           {resources.length === 0 ? (
// //             <Typography>No resources found.</Typography>
// //           ) : (
// //             resources.map((res) => (
// //               <Grid item xs={12} sm={6} md={4} key={res._id}>
// //                 <Card sx={{ backgroundColor: '#f5f5f5' }}>
// //                   <CardContent>
// //                     <Typography variant="h6">{res.subject} ({res.course})</Typography>
// //                     <Typography>Year: {res.year}</Typography>
// //                     <Typography>Semester: {res.semester}</Typography>
// //                     <Typography>Accession No: {res.accessionNumber}</Typography>
                    
// //                     {renderStatusChip(res.status)}

// //                     <div style={{ marginTop: '1rem' }}>
// //                       <Button
// //                         variant="outlined"
// //                         color="primary"
// //                         href={res.link}
// //                         target="_blank"
// //                       >
// //                         Open Link
// //                       </Button>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </Grid>
// //             ))
// //           )}
// //         </Grid>
// //       )}
// //     </Container>
// //   );
// // };

// // export default ResourceViewer;


// // import React, { useEffect, useState } from 'react';
// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import { Container, Typography, CircularProgress, Alert } from '@mui/material';

// // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// // const ResourceViewer = () => {
// //   const { type } = useParams();
// //   const [resources, setResources] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     console.log("Fetching resources for type:", type);
// //     const fetchResources = async () => {
// //       try {
// //         const res = await axios.get(`${BACKEND_URL}/api/resources/${type}`);
// //         console.log("Fetched data:", res.data);
// //         setResources(res.data);
// //       } catch (err) {
// //         console.error("API error:", err);
// //         setError('Failed to fetch resources.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchResources();
// //   }, [type]);

// //   return (
// //     <Container>
// //       <Typography variant="h4" gutterBottom mt={3}>
// //         Viewing: {type?.replace('-', ' ').toUpperCase()}
// //       </Typography>

// //       {loading && <CircularProgress />}

// //       {error && <Alert severity="error">{error}</Alert>}

// //       {!loading && !error && (
// //         <div>
// //           {resources.length === 0 ? (
// //             <Typography>No resources found.</Typography>
// //           ) : (
// //             resources.map((res, index) => (
// //               <pre key={index} style={{ backgroundColor: '#eee', padding: '1rem', marginBottom: '1rem' }}>
// //                 {JSON.stringify(res, null, 2)}
// //               </pre>
// //             ))
// //           )}
// //         </div>
// //       )}
// //     </Container>
// //   );
// // };

// // export default ResourceViewer;
