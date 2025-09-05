

import React from "react";
import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";

const ResourceCard = ({ title, description, onClick }) => {
  return (
    <Card
      sx={{
        width: 250,
        borderRadius: 3,
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-5px)",
        },
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ResourceCard;

// import React from "react";
// import { Card, CardContent, Typography, CardActionArea } from "@mui/material";

// const ResourceCard = ({ title, description, onClick }) => {
//   return (
//     <Card sx={{ maxWidth: 300, m: 2, boxShadow: 3 }}>
//       <CardActionArea onClick={onClick}>
//         <CardContent>
//           <Typography variant="h6" component="div">
//             {title}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {description}
//           </Typography>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   );
// };

// export default ResourceCard;
