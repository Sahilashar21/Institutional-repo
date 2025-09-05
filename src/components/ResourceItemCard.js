// components/ResourceItemCard.js
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Link as MuiLink,
  Box,
} from "@mui/material";

const ResourceItemCard = ({ resource, fields }) => {
  return (
    <Card
      sx={{
        width: 300,
        borderRadius: 4,
        p: 2,
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent>
        <Stack spacing={1.2}>
          {fields.map((field) => {
            const value = resource[field.name];

            if (field.name === "status") {
              return (
                <Box key={field.name}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ color: "#555" }}
                  >
                    {field.label}:
                  </Typography>
                  <Chip
                    label={value}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      bgcolor:
                        value === "available"
                          ? "#4caf50"
                          : value === "in shelf"
                          ? "#ff9800"
                          : value === "demolished"
                          ? "#f44336"
                          : "#9e9e9e",
                      color: "#fff",
                    }}
                  />
                </Box>
              );
            }

            if (field.name === "link") {
              return (
                <Typography key={field.name} variant="body2">
                  <strong>{field.label}:</strong>{" "}
                  <MuiLink
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: "#1976d2", fontWeight: "500" }}
                  >
                    Open
                  </MuiLink>
                </Typography>
              );
            }

            return (
              <Typography
                key={field.name}
                variant="body2"
                sx={{ color: "#444" }}
              >
                <strong>{field.label}:</strong> {value || "N/A"}
              </Typography>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResourceItemCard;
