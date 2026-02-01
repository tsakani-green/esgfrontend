import React, { useMemo, useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Chip, Divider } from '@mui/material';
import { Notifications, Warning, Info, CheckCircle } from '@mui/icons-material';

const priorityMeta = {
  high: { label: 'High', color: 'warning', icon: <Warning fontSize="small" /> },
  medium: { label: 'Medium', color: 'info', icon: <Info fontSize="small" /> },
  low: { label: 'Low', color: 'success', icon: <CheckCircle fontSize="small" /> },
};

export default function AlertsMenu({ notifications = [], iconButtonSx = {} }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const count = notifications.length;

  const items = useMemo(() => {
    return (notifications || []).slice(0, 8);
  }, [notifications]);

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={iconButtonSx}>
        <Badge badgeContent={count} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { width: 360, maxWidth: '92vw' } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={800}>Alerts</Typography>
          <Typography variant="caption" color="text.secondary">
            Latest notifications & compliance reminders
          </Typography>
        </Box>
        <Divider />

        {items.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No alerts right now
            </Typography>
          </MenuItem>
        ) : (
          items.map((n) => {
            const meta = priorityMeta[n.priority] || priorityMeta.medium;
            return (
              <MenuItem key={n.id} sx={{ alignItems: 'flex-start', py: 1.25 }}>
                <Box sx={{ display: 'flex', gap: 1.25, width: '100%' }}>
                  <Chip
                    size="small"
                    icon={meta.icon}
                    label={meta.label}
                    color={meta.color}
                    variant="outlined"
                    sx={{ mt: 0.25 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {n.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Priority: {meta.label}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            );
          })
        )}

        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Typography variant="body2" fontWeight={700}>
            View all alerts
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
