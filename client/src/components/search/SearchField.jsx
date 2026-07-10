import { motion } from "framer-motion";
import { Box, Stack, Typography } from "@mui/material";

export default function SearchField({ field, label, value, icon, activeField, onActivate, children }) {
  const active = activeField === field;
  const dimmed = Boolean(activeField) && !active;

  return (
    <Box
      component={motion.div}
      layout
      onClick={onActivate}
      sx={{
        flex: 1,
        minWidth: 0,
        borderRight: { sm: "1px solid #e5e7eb" },
        borderBottom: { xs: "1px solid #e5e7eb", sm: "none" },
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Box
        component={motion.div}
        animate={{
          backgroundColor: active ? "#ffffff" : dimmed ? "#f8fafc" : "#ffffff",
        }}
        transition={{ duration: 0.2 }}
        sx={{ px: 2.5, py: 1.35 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            component={motion.div}
            animate={{ color: active ? "#fe424d" : "#475569" }}
            transition={{ duration: 0.2 }}
            sx={{ display: "flex" }}
          >
            {icon}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box
              component={motion.div}
              animate={{ color: active ? "#fe424d" : "#64748b" }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 4,
              }}
            >
              {label}
            </Box>
            {children || (
              <Typography noWrap color={value ? "text.primary" : "text.secondary"} sx={{ fontSize: 15 }}>
                {value}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
