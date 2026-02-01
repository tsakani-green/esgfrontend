import React, { useEffect, useState } from 'react'
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, FormControlLabel, Alert, CircularProgress } from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { aiAnalyticsService } from '../../services/aiAnalytics'

export default function AITemplatesManager({ portfolioId = 'bertha-house' }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchTemplates = async (pid = portfolioId) => {
    setLoading(true)
    setError(null)
    try {
      const t = await aiAnalyticsService.getTemplates(pid)
      setTemplates(t || [])
    } catch (err) {
      console.error('Failed to load templates', err)
      setError('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [portfolioId])

  const openCreate = () => {
    setEditing({ key: `new_${Date.now()}`, name: '', prompt: '', is_public: true })
    setEditOpen(true)
  }

  const openEdit = (tpl) => {
    setEditing({ ...tpl })
    setEditOpen(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      await aiAnalyticsService.saveTemplate(portfolioId, editing)
      await fetchTemplates()
      setEditOpen(false)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (key) => {
    if (!confirm(`Delete template '${key}'?`)) return
    try {
      await aiAnalyticsService.deleteTemplate(portfolioId, key)
      await fetchTemplates()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to delete template')
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">AI Prompt Templates</Typography>
        <Button size="small" startIcon={<Add />} onClick={openCreate}>New template</Button>
      </Box>

      {error && <Alert severity="warning" sx={{ mb: 1 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CircularProgress size={16} /> <Typography variant="body2">Loading templates…</Typography></Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Prompt (preview)</TableCell>
                <TableCell>Public</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.key}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{t.key}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell sx={{ maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.prompt}</TableCell>
                  <TableCell>
                    <FormControlLabel control={<Switch checked={!!t.is_public} disabled />} label={t.is_public ? 'Public' : 'Private'} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(t)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => remove(t.key)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow><TableCell colSpan={5}><Typography variant="body2" color="text.secondary">No templates found for this portfolio.</Typography></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing?.key?.startsWith('new_') ? 'Create template' : 'Edit template'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mt: 1 }}>
            <TextField label="Key (slug)" size="small" fullWidth value={editing?.key || ''} onChange={(e) => setEditing(s => ({ ...s, key: e.target.value }))} />
            <TextField label="Name" size="small" fullWidth value={editing?.name || ''} onChange={(e) => setEditing(s => ({ ...s, name: e.target.value }))} />
            <TextField label="Prompt" size="small" fullWidth multiline minRows={4} value={editing?.prompt || ''} onChange={(e) => setEditing(s => ({ ...s, prompt: e.target.value }))} />
            <FormControlLabel control={<Switch checked={!!editing?.is_public} onChange={(e) => setEditing(s => ({ ...s, is_public: e.target.checked }))} />} label="Public (visible to clients)" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
