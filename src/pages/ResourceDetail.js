import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box,
} from "@mui/material";
import { resourceFields } from "../config/resourceFieldConfig";
import ResourceItemCard from "../components/ResourceItemCard"; // using this!

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const ResourceDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fields = resourceFields[type] || [];

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/resources/${type}/${id}`);
        setResource(res.data.resource || {});
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch resource details.");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [type, id]);

  if (loading) {
    return (
      <Container sx={{ mt: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {type.replace("-", " ").toUpperCase()} Details
      </Typography>

      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        ← Back
      </Button>

      <Box display="flex" justifyContent="center">
        <ResourceItemCard resource={resource} fields={fields} />
      </Box>
    </Container>
  );
};

export default ResourceDetail;


// import React, { useEffect, useState } from "react";
// import { Grid } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Button,
//   Chip,
//   Stack,
//   Box,
//   Link as MuiLink,
// } from "@mui/material";
// import { resourceFields } from "../config/resourceFieldConfig";
// import ResourceItemCard from "../components/ResourceItemCard";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// const ResourceDetail = () => {
//   const { type, id } = useParams();
//   const navigate = useNavigate();
//   const [resource, setResource] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fields = resourceFields[type] || [];

//   useEffect(() => {
//     const fetchResource = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/api/resources/${type}/${id}`);
//         setResource(res.data.resource || {});
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Failed to fetch resource details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResource();
//   }, [type, id]);

//   if (loading) {
//     return (
//       <Container sx={{ mt: 5 }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container sx={{ mt: 5 }}>
//         <Alert severity="error">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         {type.replace("-", " ").toUpperCase()} Details
//       </Typography>

//       <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
//         ← Back
//       </Button>

//       <Card variant="outlined">
//         <CardContent>
//           <Stack spacing={2}>
//             {fields.map((field) => {
//               const value = resource[field.name];

//               // Status chip
//               if (field.name === "status") {
//                 return (
//                   <Box key={field.name}>
//                     <Typography variant="body2" fontWeight="bold">
//                       {field.label}:
//                     </Typography>
//                     <Chip
//                       label={value}
//                       color={
//                         value === "available"
//                           ? "success"
//                           : value === "in shelf"
//                           ? "warning"
//                           : value === "demolished"
//                           ? "error"
//                           : "default"
//                       }
//                     />
//                   </Box>
//                 );
//               }

//               // Clickable link
//               if (field.name === "link") {
//                 return (
//                   <Typography key={field.name} variant="body2">
//                     <strong>{field.label}:</strong>{" "}
//                     <MuiLink href={value} target="_blank" rel="noopener noreferrer">
//                       {value}
//                     </MuiLink>
//                   </Typography>
//                 );
//               }

//               // Default field
//               return (
//                 <Typography key={field.name} variant="body2">
//                   <strong>{field.label}:</strong> {value || "N/A"}
//                 </Typography>
//               );
//             })}
//           </Stack>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default ResourceDetail;

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
//   Button,
//   Chip,
// } from "@mui/material";
// import { resourceFields } from "../config/resourceFieldConfig";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// const ResourceDetail = () => {
//   const { type, id } = useParams();
//   const navigate = useNavigate();
//   const [resource, setResource] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fields = resourceFields[type] || [];

//   useEffect(() => {
//     const fetchResource = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/api/resources/${type}/${id}`);
//         setResource(res.data.resource || {});
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Failed to fetch resource details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResource();
//   }, [type, id]);

//   if (loading) return <CircularProgress />;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Container>
//       <Typography variant="h4" mt={3} gutterBottom>
//         {type.replace("-", " ").toUpperCase()} Details
//       </Typography>

//       <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
//         ← Back
//       </Button>

//       <Card variant="outlined">
//         <CardContent>
//           {fields.map((field) => {
//             const value = resource[field.name];

//             if (field.name === "status") {
//               return (
//                 <Chip
//                   key={field.name}
//                   label={value}
//                   color={
//                     value === "available"
//                       ? "success"
//                       : value === "in shelf"
//                       ? "warning"
//                       : value === "demolished"
//                       ? "error"
//                       : "default"
//                   }
//                   sx={{ mb: 2 }}
//                 />
//               );
//             }

//             return (
//               <Typography key={field.name} variant="body2" sx={{ mb: 1 }}>
//                 <strong>{field.label}:</strong> {value || "N/A"}
//               </Typography>
//             );
//           })}
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default ResourceDetail;
