import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ResourceCard from "./ResourceCard";

// Sample resource data with semester info
const resourceData = [
  { title: "Question Papers", description: "Access previous year exam question papers.", semester: 1 },
  { title: "Research Papers", description: "Read faculty and student research contributions.", semester: 5 },
  { title: "Study Materials", description: "Course-wise important study content.", semester: 3 },
  { title: "Lecture Notes", description: "Well-prepared lecture notes by faculty.", semester: 2 },
  { title: "Useful Links", description: "Curated links for projects, learning, and more.", semester: 6 },
  { title: "Syllabus", description: "Course-wise academic syllabus and curriculum.", semester: 1 },
  { title: "YouTube Videos", description: "Educational video lectures and playlists.", semester: 4 },
  { title: "Internship Info", description: "Details about internship opportunities and guides.", semester: 6 },
  { title: "Project Ideas", description: "Innovative final-year project ideas and resources.", semester: 7 },
  { title: "E-Books", description: "Free access to reference books and e-books.", semester: 2 },
  { title: "Lab Manuals", description: "Experiment procedures and lab notes.", semester: 3 },
  { title: "Assignments", description: "Course assignments and sample submissions.", semester: 4 },
  { title: "Notices", description: "Official circulars and notices from departments.", semester: 1 },
  { title: "Results", description: "Semester and internal examination results.", semester: 2 },
  { title: "Timetable", description: "Department-wise academic timetable.", semester: 3 },
  { title: "Seminar PPTs", description: "Seminar presentations from students/faculty.", semester: 7 },
  { title: "Conference Papers", description: "Published papers in academic conferences.", semester: 8 },
  { title: "Placement Prep", description: "Resources for placement and aptitude prep.", semester: 7 },
  { title: "Coding Practice", description: "Problem-solving and coding test practice.", semester: 5 },
  { title: "Scholarships", description: "Scholarship programs and application links.", semester: 6 },
];

const ResourcesSection = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  const formatPath = (title) => title.toLowerCase().replace(/\s+/g, "-");

  const filteredData = resourceData.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSemester =
      !semesterFilter || res.semester === parseInt(semesterFilter);

    return matchesSearch && matchesSemester;
  });

  return (
    <Box sx={{ p: 4 }} id="resources">
      <Typography variant="h4" gutterBottom>
        📚 Resources
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          label="Semester"
          select
          variant="outlined"
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <MenuItem key={sem} value={sem}>
              Semester {sem}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={2}>
        {filteredData.length > 0 ? (
          filteredData.map((res, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ResourceCard
                title={res.title}
                description={res.description}
                onClick={() => navigate(`/resources/${formatPath(res.title)}`)}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2, ml: 1 }}>
            No matching resources found.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ResourcesSection;


// import React, { useState } from "react";

// // import React from "react";
// import { Box, Typography, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import ResourceCard from "./ResourceCard";



// const resourceData = [
//   { title: "Question Papers", description: "Access previous year exam question papers." },
//   { title: "Research Papers", description: "Read faculty and student research contributions." },
//   { title: "Study Materials", description: "Course-wise important study content." },
//   { title: "Lecture Notes", description: "Well-prepared lecture notes by faculty." },
//   { title: "Useful Links", description: "Curated links for projects, learning, and more." },
//   { title: "Syllabus", description: "Course-wise academic syllabus and curriculum." },
//    { title: "YouTube Videos", description: "Educational video lectures and playlists." },
//    { title: "Internship Info", description: "Details about internship opportunities and guides." },
//    { title: "Project Ideas", description: "Innovative final-year project ideas and resources." },
//    { title: "E-Books", description: "Free access to reference books and e-books." },
//    { title: "Lab Manuals", description: "Experiment procedures and lab notes." },
//    { title: "Assignments", description: "Course assignments and sample submissions." },
//    { title: "Notices", description: "Official circulars and notices from departments." },
//    { title: "Results", description: "Semester and internal examination results." },
//    { title: "Timetable", description: "Department-wise academic timetable." },
//    { title: "Seminar PPTs", description: "Seminar presentations from students/faculty." },
//    { title: "Conference Papers", description: "Published papers in academic conferences." },
//    { title: "Placement Prep", description: "Resources for placement and aptitude prep." },
//    { title: "Coding Practice", description: "Problem-solving and coding test practice." },
//    { title: "Scholarships", description: "Scholarship programs and application links." },
//   // ... (other resources)
// ];

// const ResourcesSection = () => {
//   const navigate = useNavigate();

//   const formatPath = (title) => title.toLowerCase().replace(/\s+/g, "-");

//   return (
//     <Box sx={{ p: 4 }} id="resources">
//       <Typography variant="h4" gutterBottom>
//         📚 Resources
//       </Typography>
//       <Grid container spacing={2}>
//         {resourceData.map((res, index) => (
//           <Grid item key={index}>
//             <ResourceCard
//               title={res.title}
//               description={res.description}
//               onClick={() => navigate(`/resources/${formatPath(res.title)}`)}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default ResourcesSection;


// import React from "react";
// import { Box, Typography, Grid } from "@mui/material";
// import ResourceCard from "./ResourceCard";

// const resourceData = [
//   { title: "Question Papers", description: "Access previous year exam question papers." },
//   { title: "Research Papers", description: "Read faculty and student research contributions." },
//   { title: "Study Materials", description: "Course-wise important study content." },
//   { title: "Lecture Notes", description: "Well-prepared lecture notes by faculty." },
//   { title: "Useful Links", description: "Curated links for projects, learning, and more." },
//   { title: "Syllabus", description: "Course-wise academic syllabus and curriculum." },
//   { title: "YouTube Videos", description: "Educational video lectures and playlists." },
//   { title: "Internship Info", description: "Details about internship opportunities and guides." },
//   { title: "Project Ideas", description: "Innovative final-year project ideas and resources." },
//   { title: "E-Books", description: "Free access to reference books and e-books." },
//   { title: "Lab Manuals", description: "Experiment procedures and lab notes." },
//   { title: "Assignments", description: "Course assignments and sample submissions." },
//   { title: "Notices", description: "Official circulars and notices from departments." },
//   { title: "Results", description: "Semester and internal examination results." },
//   { title: "Timetable", description: "Department-wise academic timetable." },
//   { title: "Seminar PPTs", description: "Seminar presentations from students/faculty." },
//   { title: "Conference Papers", description: "Published papers in academic conferences." },
//   { title: "Placement Prep", description: "Resources for placement and aptitude prep." },
//   { title: "Coding Practice", description: "Problem-solving and coding test practice." },
//   { title: "Scholarships", description: "Scholarship programs and application links." },
// ];

// // const resourceData = [
// //   {
// //     title: "Question Papers",
// //     description: "Access previous year exam question papers."
// //   },
// //   {
// //     title: "Research Papers",
// //     description: "Read faculty and student research contributions."
// //   },
// //   {
// //     title: "Study Materials",
// //     description: "Course-wise important study content."
// //   },
// //   {
// //     title: "Lecture Notes",
// //     description: "Well-prepared lecture notes by faculty."
// //   },
// //   {
// //     title: "Useful Links",
// //     description: "Curated links for projects, learning, and more."
// //   }
// // ];

// const ResourcesSection = () => {
//   return (
//     <Box sx={{ p: 4 }} id="resources">
//       <Typography variant="h4" gutterBottom>
//         📚 Resources
//       </Typography>
//       <Grid container spacing={2}>
//         {resourceData.map((res, index) => (
//           <Grid item key={index}>
//             <ResourceCard
//               title={res.title}
//               description={res.description}
//               onClick={() => alert(`Clicked on: ${res.title}`)} // placeholder
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default ResourcesSection;
